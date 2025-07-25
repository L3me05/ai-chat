import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import path from 'node:path';
import crypto from 'node:crypto';

export let vectorStore = null;

const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-large',
});

// Funzione per generare un hash del contenuto del file
const generateFileHash = (filePath) => {
    const fileBuffer = readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
};

// Funzione per gestire il tracking dei file già elaborati
const getProcessedFilesLog = () => {
    const logPath = path.resolve('./processed_files.json');
    try {
        return existsSync(logPath) 
            ? JSON.parse(readFileSync(logPath, 'utf-8')) 
            : {};
    } catch {
        return {};
    }
};

export const initializeVectorStore = async () => {
    if (vectorStore) return vectorStore;

    try {
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
    } catch (error) {
        console.error('Errore durante l\'inizializzazione del vector store:', error);
        throw error;
    }
};

export const addDataToVectorStore = async (pdfPath) => {
    if (!existsSync(pdfPath)) {
        throw new Error(`File PDF non trovato: ${pdfPath}`);
    }

    // Calcola l'hash del file
    const fileHash = generateFileHash(pdfPath);
    
    // Controlla se il file è già stato elaborato
    const processedFiles = getProcessedFilesLog();
    if (processedFiles[pdfPath] === fileHash) {
        console.log(`✅ Documento già presente nel database. Nessuna elaborazione necessaria.`);
        return false;
    }

    try {
        // Inizializza il vector store se non è già stato fatto
        if (!vectorStore) {
            await initializeVectorStore();
        }

        // Carica e processa il PDF
        const loader = new PDFLoader(pdfPath);
        const docs = await loader.load();

        // Suddividi in chunk
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const chunks = await splitter.splitDocuments(docs);

        // Aggiungi i documenti al vector store
        await vectorStore.addDocuments(chunks);
        
        // Aggiorna il log dei file elaborati
        const logPath = path.resolve('./processed_files.json');
        processedFiles[pdfPath] = fileHash;
        writeFileSync(logPath, JSON.stringify(processedFiles, null, 2));

        console.log(`✅ Documento elaborato con successo: ${chunks.length} chunks creati`);
        return true;
    } catch (error) {
        console.error('❌ Errore durante l\'elaborazione del documento:', error);
        throw error;
    }
}