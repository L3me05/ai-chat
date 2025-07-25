import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from "@langchain/langgraph";
import { vectorStore, addDataToVectorStore, initializeVectorStore } from "./embeddings.js";
import { existsSync } from 'fs';
import path from "path";

// Verifica del file PDF
const pdfPath = path.resolve('C:\\Users\\dimar\\ReactProject\\ai-chat\\server\\data\\Seconda_guerra_modiale.pdf');

// Aggiungi un controllo esplicito per il file
if (!existsSync(pdfPath)) {
    console.error(`❌ File PDF non trovato: ${pdfPath}`);
    console.error('Assicurati di aver inserito il file PDF nella cartella ./data/');
    process.exit(1);
}

try {
    // Inizializza il vector store PRIMA di elaborare il PDF
    await initializeVectorStore();

    const wasProcessed = await addDataToVectorStore(pdfPath);
    if (wasProcessed) {
        console.log('✅ PDF caricato con successo nel vector store');
    } else {
        console.log('✅ PDF già presente nel vector store');
    }
} catch (error) {
    console.error('❌ Errore durante l\'inizializzazione o caricamento del PDF:', error);
    process.exit(1);
}

const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
});

// Strumento di recupero
const retrieveTool = tool(async ({query}) => {
    try {
        // Assicurati che vectorStore sia definito
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

export const agent = createReactAgent({
    llm,
    tools: [retrieveTool],
    checkpointer,
});

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