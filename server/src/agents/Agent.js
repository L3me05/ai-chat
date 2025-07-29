import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { RetrieveTool } from "../tools/RetrieveTool.js";
import { initializeVectorStore } from "../models/VectorStore.js";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

class AgentManager {
    constructor(apiKey) {
        this.apiKey = apiKey;
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

        // Crea lo strumento di recupero
        const retrieveTool = new RetrieveTool();

        // Configura il MemorySaver
        const checkpointer = new MemorySaver();

        // Crea l'agente passando lo strumento corretto
        this.agent = createReactAgent({
            llm,
            tools: [retrieveTool.tool],
            checkpointer,
        });

        this.isInitialized = true;
        console.log('✅ Agente inizializzato con successo!');
        return this.agent;
    }
}

export default AgentManager;