// carico variabili di ambiente
import 'dotenv/config';

import express from "express";
import cors from "cors";
import AgentManager from "./src/agents/Agent.js";
import {
    addConversation, addMessage, deleteConversationByThreadId,
    getConversationByThreadId,
    getConversations,
    getMessages
} from "./src/services/ConversationService.js";

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

// Inizializza l'AgentManager globalmente
const agentManager = new AgentManager(process.env.OPENAI_API_KEY, process.env.TAVILY_API_KEY);

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('🚀 AI Chat Server is running!');
});

//endpoint per recuperare tutte le conversazioni
app.get('/conversations', async (req, res)=> {
    try {
        const conversations = await getConversations();
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero delle conversazioni'});
    }
})

//endpoint per il recupero dei messaggi di una conversazione
app.get('/conversations/:threadId/messages', async (req, res) => {
    const { threadId } = req.params;
    try {
        const messages = await getMessages(threadId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error: 'Errore nel recupero dei messaggi'});
    }
})

//endpoin recupero conversazione specifica
app.get('/conversations/:threadId', async (req, res) =>  {
    const { threadId } = req.params;
    try {
        const conversation = await getConversationByThreadId(threadId);
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({error: 'Errore nel recupero della conversazione'});
    }
})

app.post('/generate', async (req, res) => {
    let {query, threadId} = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query è richiesta' });
    }

    console.log(`📝 Query ricevuta: ${query}`);

    try {
        //controllo se conversazione già esistente
        let conv=null;
        if(threadId) conv= await getConversationByThreadId(threadId);

        //se non esiste la creo
        if (!conv) {
            // Genero il titolo di default
            let title = 'New chat';
            if (query && query.trim().length > 0) {
                title = query.substring(0, 30);

                if (query.length > 30) {
                    title += '...';
                }
            }

            threadId = threadId.toString() || Date.now().toString();
            conv = await addConversation(threadId, title);
        }

        //salvo il messaggio dell'utente
        await addMessage(threadId, query, true);

        //invoco l'agente e salvo la risposta
        console.log('🔄 Ottengo l\'agente...');
        const agent = await agentManager.initializeAgent();

        console.log('💭 Elaboro la richiesta...');
        const result = await agent.invoke({
            messages: [{
                role: 'user',
                content: query,
            }],
        }, {
            configurable: {thread_id: threadId || 'default'}
        });

        const response = result.messages.at(-1)?.content;
        console.log('✅ Risposta generata con successo');

        //salvo il messaggio AI
        await addMessage(threadId, response, false);

        //restituisco risposta AI
        res.status(200).json({ content: response });
    } catch (error) {
        console.error('❌ Errore durante l\'esecuzione:', error);
        res.status(500).json({
            error: 'Errore durante l\'elaborazione della richiesta',
            details: error.message
        });
    }
});

app.delete('/conversations/:threadId', async (req, res) => {
    const { threadId } = req.params;
    try {
        const deleted = await deleteConversationByThreadId(threadId);
        if(!deleted) return res.status(404).json({ error: 'Conversazione non trovata' });
        res.status(204).json({content: 'Eliminazione avvenuta con successo'});
    } catch {
        res.status(500).json({ error: 'Errore durante l\'eliminazione della conversazione' });
    }
})

app.listen(port, () => {
    console.log(`🌐 Server in ascolto sulla porta ${port}`);
    console.log(`📍 Disponibile su: http://localhost:${port}`);
});