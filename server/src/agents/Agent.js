import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { RetrieveTool } from "../tools/RetrieveTool.js";
import { initializeVectorStore } from "../models/VectorStore.js";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import WebSearchTool from "../tools/WebSearchTool.js";
import EmailTool from "../tools/EmailTool.js";

class AgentManager {
    constructor(apiKey, searchApiKey) {
        this.apiKey = apiKey;
        this.searchApiKey = searchApiKey;
        this.agent = null;
        this.isInitialized = false;
    }

    async initializeAgent() {
        if (this.isInitialized) {
            console.log('✅ Agente già inizializzato');
            return this.agent;
        }

        console.log('🚀 Inizializzo l\'agente...');

        // Inizializzazione del vector store
        try {
            await initializeVectorStore();
            console.log('✅ Vector store inizializzato');
        } catch (error) {
            console.error('❌ Errore nell\'inizializzazione del vector store:', error);
            throw error;
        }

        // Crea il modello LLM
        const llm = new ChatOpenAI({
            modelName: 'gpt-3.5-turbo',
            temperature: 0,
            apiKey: this.apiKey,
        });

        // Inizializzo gli strumenti
        const retrieveTool = new RetrieveTool();
        const webSearchTool = new WebSearchTool(this.searchApiKey);
        const emailTool = new EmailTool({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        });

        // Configura il MemorySaver
        const checkpointer = new MemorySaver();

        // Crea l'agente passando lo strumento corretto
        this.agent = createReactAgent({
            llm,
            tools: [retrieveTool.tool, webSearchTool.tool, emailTool.tool],
            checkpointer,
        });

        this.isInitialized = true;
        console.log('✅ Agente inizializzato con successo!');
        return this.agent;
    }
}

export default AgentManager;