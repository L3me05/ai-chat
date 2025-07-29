import axios from 'axios';
import { tool } from '@langchain/core/tools';
import {z} from "zod";

class WebSearchTool {
    constructor(apiKey) {
        this.apiKey= apiKey;
        this.tool= tool(async ({ query }) => {
            console.log('🌐 WebSearchTool: Ricerca richiesta per query:', query);
            return await this.searchWeb(query);
        }, {
            name: 'web_search',
            description: 'Cerca informazioni aggiornate su internet quando la query dell\'utente richiede informazioni non disponibili nel knowledge base locale',
            schema: z.object({
                query: z.string().min(1, 'La query non può essere vuota'),
            }),
        })
    }

    async searchWeb(query) {
        // const searchUrl = `https://api.tavily.com/v1/search?query=${query}&apiKey=${this.apiKey}`;
        const searchUrl = `https://api.tavily.com/search`;

        try {
            const response = await axios.post(searchUrl, {
                api_key: this.apiKey,
                query: query,
                search_depth: "basic",
                include_answer: false,
                include_images: false,
                include_raw_content: false,
                max_results: 3
            });
            const results = response.data.results;

            if (!results || results.length === 0) {
                console.log('❌ Nessun risultato trovato');
                return 'Nessun risultato trovato per la tua ricerca.';
            }

            // Restituisci i primi 3 risultati per brevità
            console.log(`✅ Trovati ${results.length} risultati, restituisco i primi 3`);
            return results.slice(0, 3).map(result =>
                `${result.title}\n${result.snippet}\nURL: ${result.link}`
            ).join('\n\n');
        } catch (error) {
            console.error('Errore nella ricerca web:', error);
            return 'Si è verificato un errore durante la ricerca web.';
        }
    }
}

export default WebSearchTool;