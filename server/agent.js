import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from "@langchain/langgraph";
import { vectorStore, addDataToVectorStore, initializeVectorStore } from "./embeddings.js";
import { readdirSync } from 'fs';
import path from 'path';
import chokidar from 'chokidar';

// Variabili globali
let agent = null;
let isInitialized = false;
const DATA_DIR = path.resolve('./data');


const initializeAgent = async () => {
    if (isInitialized) {
        console.log('✅ Agente già inizializzato');
        return agent;
    }

    console.log('🚀 Inizializzo l\'agente...');

    // Inizializzo db
    await initializeVectorStore();

    const watcher = chokidar.watch(path.resolve('./data'), {
        ignoreInitial: true,
        depth:0,
    });

    watcher.on('add', async filePath => {
        console.log(`📥 Nuovo PDF in data/: ${filePath}`);
        try {
            await addDataToVectorStore(filePath);
        } catch (err) {
            console.error(`❌ Non ho potuto embeddare ${filePath}: ${err.message}`);
        }
    });

    //Carico pdf direttamente da cartella data senza specificare nome
    const files = readdirSync(DATA_DIR);
    for(const filename of files) {
        const filePath = path.join(DATA_DIR, filename);
        try {
            console.log(`Trovato in data/: ${filename}. Provo a embeddare`);
            const processed = await addDataToVectorStore(filePath);
            if (processed) {
                console.log(`✅ PDF ${filename} caricato con successo nel vector store`);
            } else {
                console.log(`✅ PDF ${filename} già presente nel vector store`);
            }
        } catch (err) {
            console.warn(`⚠️ Errore su ${filename}: ${err.message}`);
        }
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