// carico variabili di ambiente
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import { getAgent } from "./agent.js";



const port = process.env.PORT || 3000;

// Verifica che le variabili d'ambiente siano caricate
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY non trovata nel file .env');
    console.error('Assicurati di aver creato il file server/.env con le tue chiavi API');
    process.exit(1);
}

if (!process.env.DB_URL) {
    console.error('❌ DB_URL non trovata nel file .env');
    console.error('Assicurati di aver configurato la connessione al database PostgreSQL');
    process.exit(1);
}

console.log('✅ Variabili d\'ambiente caricate correttamente');
console.log(`✅ Database URL configurato: ${process.env.DB_URL.split('@')[1]}`);

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
   res.send('🚀 AI Chat Server is running!');
});

app.post('/generate', async (req, res) => {
    const {query, thread_id} = req.body;
    
    if (!query) {
        return res.status(400).json({ error: 'Query è richiesta' });
    }

    console.log(`📝 Query ricevuta: ${query}`);

    try {
        console.log('🔄 Ottengo l\'agente...');
        const agent = await getAgent();
        
        console.log('💭 Elaboro la richiesta...');
        const result = await agent.invoke({
            messages: [{
                role: 'user',
                content: query,
            }],
        }, {
            configurable: {thread_id: thread_id || 'default'}
        });

        const response = result.messages.at(-1)?.content;
        console.log('✅ Risposta generata con successo');

        res.status(200).json({ content: response });
    } catch (error) {
        console.error('❌ Errore durante l\'esecuzione:', error);
        res.status(500).json({ 
            error: 'Errore durante l\'elaborazione della richiesta',
            details: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`🌐 Server in ascolto sulla porta ${port}`);
    console.log(`📍 Disponibile su: http://localhost:${port}`);
});