import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from "@langchain/langgraph";
import { vectorStore, addDataToVectorStore, initializeVectorStore } from "./embeddings.js";
import { existsSync } from 'fs';
import path from "path";

// Variabili globali
let agent = null;
let isInitialized = false;


const initializeAgent = async () => {
    if (isInitialized) {
        console.log('✅ Agente già inizializzato');
        return agent;
    }

    console.log('🚀 Inizializzo l\'agente...');

    // Verifica del file PDF
    const pdfPath = path.resolve('./data/Seconda_guerra_modiale.pdf');

    if (!existsSync(pdfPath)) {
        console.error(`❌ File PDF non trovato: ${pdfPath}`);
        console.error('Assicurati di aver inserito il file PDF nella cartella ./data/');
        throw new Error('File PDF non trovato');
    }

    try {
        // Ora le variabili d'ambiente sono disponibili!
        console.log('🔗 Connessione al database...');
        await initializeVectorStore();

        console.log('📄 Elaborazione PDF...');
        const wasProcessed = await addDataToVectorStore(pdfPath);
        if (wasProcessed) {
            console.log('✅ PDF caricato con successo nel vector store');
        } else {
            console.log('✅ PDF già presente nel vector store');
        }
    } catch (error) {
        console.error('❌ Errore durante l\'inizializzazione del PDF:', error);
        throw error;
    }

    // Crea il modello LLM
    const llm = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Strumento di recupero
    const retrieveTool = tool(async ({query}) => {
        try {
            if (!vectorStore) {
                await initializeVectorStore();
            }

            const retrieveDocs = await vectorStore.similaritySearch(query, 3);
            console.log(`📚 Trovati ${retrieveDocs.length} documenti pertinenti`);
            return retrieveDocs
                .map((doc) => doc.pageContent)
                .join('\n');
        } catch (error) {
            console.error('❌ Errore durante la ricerca:', error);
            throw error;
        }
    }, {
        name: 'retrieve',
        description: 'Recupera i frammenti di testo più rilevanti dal file PDF',
        schema: z.object({
            query: z.string().min(1, 'La query non può essere vuota'),
        }),
    });

    // Creazione dell'agente
    const checkpointer = new MemorySaver();

    agent = createReactAgent({
        llm,
        tools: [retrieveTool],
        checkpointer,
    });

    isInitialized = true;
    console.log('✅ Agente inizializzato con successo!');
    return agent;
};

// Esporto funzione che restituisce l'agente
export const getAgent = async () => {
    if (!agent) {
        await initializeAgent();
    }
    return agent;
};


// // Invio della richiesta
// try {
//     const result = await agent.invoke({
//         messages: [{
//             role: 'user',
//             content: 'Quali sono le cause principali della Seconda Guerra Mondiale?'
//         }],
//     }, {
//         configurable: { thread_id: 1 }
//     });
//
//     console.log('\n🧠 Risposta finale:');
//     console.log(result.messages.at(-1)?.content);
// } catch (error) {
//     console.error('❌ Errore durante l\'esecuzione dell\'agente:', error);
// }