import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { existsSync } from "fs";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

// Dichiara vectorStore come variabile globale
export let vectorStore = null;

const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-large',
});

const initializeVectorStorage = async () => {
    try {
        // Verifica che DB_URL sia definito
        if (!process.env.DB_URL) {
            throw new Error('Variabile DB_URL non definita nel file .env');
        }

        vectorStore = await PGVectorStore.initialize(embeddings, {
            postgresConnectionOptions: {
                connectionString: process.env.DB_URL,
            },
            tableName: 'documents',
            columns: {
                idColumnName: 'id',
                vectorColumnName: 'vector',
                contentColumnName: 'content',
                metadataColumnName: 'metadata',
            },
            distanceStrategy: 'cosine',
        });
        
        console.log('Vector store inizializzato con successo');
        return vectorStore;
    } catch (err) {
        console.error('Errore durante l\'inizializzazione del vector store', err);
        throw err;
    }
};

export const addDataToVectorStore = async (pdfPath) => {
    if (!existsSync(pdfPath)) {
        throw new Error(`File PDF non trovato: ${pdfPath}`);
    }

    try {
        // Inizializza il vector store se non è già stato fatto
        if (!vectorStore) {
            console.log('Inizializzo il vectorStore');
            await initializeVectorStorage();
        }

        // Verifica che vectorStore sia stato correttamente inizializzato
        if (!vectorStore) {
            throw new Error('Impossibile inizializzare il vector store');
        }

        // load del pdf
        const loader = new PDFLoader(pdfPath);
        const docs = await loader.load();

        // split into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const chunks = await splitter.splitDocuments(docs);

        // Embed the chunks
        await vectorStore.addDocuments(chunks);
        console.log(`✅ Documento elaborato con successo: ${chunks.length} chunks creati`);
    } catch (error) {
        console.error('❌ Errore durante l\'elaborazione del documento:', error);
        throw error;
    }
}