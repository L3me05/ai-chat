import express from "express";
import cors from "cors";
import {agent} from "./agent.js"

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
   res.send('Hello world');
});

app.post('/generate', async (req, res) => {
    const {query, thread_id} = req.body;
    console.log(query);

    // Invio della richiesta
    try {
        const result = await agent.invoke({
            messages: [{
                role: 'user',
                content: query,
            }],
        }, {
            configurable: {thread_id: thread_id}
        });

        console.log('\n🧠 Risposta finale:');
        console.log(result.messages.at(-1)?.content);

        res.status(200).json({ content: result.messages.at(-1).content });
    } catch (error) {
        console.error('❌ Errore durante l\'esecuzione dell\'agente:', error);
        res.status(400).json({ error: 'Errore durante l\'elaborazione della richiesta' });
    }


})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});