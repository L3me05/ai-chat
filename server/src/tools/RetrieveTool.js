import { tool } from '@langchain/core/tools';
import {initializeVectorStore, vectorStore} from "../models/VectorStore.js";
import { z } from 'zod';

class RetrieveTool {
    constructor() {
        this.tool = tool(async ({query}) => {
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
    }
}

export { RetrieveTool };