import {createReactAgent} from "@langchain/langgraph/prebuilt"
import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {MemoryVectorStore} from "langchain/vectorstores/memory";
import {tool} from '@langchain/core/tools';
import {z} from 'zod';

const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",     //gpt-4o
    temperature: 0,
})

// load del pdf
const loader = new PDFLoader("./data/Seconda_guerra_modiale.pdf");
const docs = await loader.load();

//split into chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const chunks = await  splitter.splitDocuments(docs);
console.log(chunks);

//Embed the chunks
const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-large',
})

const vectorStore = new MemoryVectorStore(embeddings);
await vectorStore.addDocuments(chunks);

//Retrieve the most relevant chunks
// const retriveDocs = await vectorStore.similaritySearch('l\' armistizio chiesto dalla francia', 1);
// console.log('--------------------------------------------------------------------');
// console.log(retriveDocs);

//retrieval tool
const retriveTool = tool(async ({query}) => {
    console.log('Retrieving docs for query: -------------------------------');
    console.log(query);
    const retriveDocs = await vectorStore.similaritySearch(query, 3);
    return retriveDocs
        .map((doc) => doc.pageContent)
        .join('\n');
}, {
    name:'retrieve',
    description:'Retrieve the most relevant chunks of text from a pdf file',
    schema: z.object({
        query: z.string(),
    }),
});


//create an agent
const agent = createReactAgent({llm, tools: [retriveTool,]});


//send a request and print the response
const result = await agent.invoke({
    messages:[{ role: 'user', content: 'Quali sono le cause principali della Seconda Guerra Mondiale?'}],
});
console.log('\n🧠 Risposta finale:');
console.log(result.messages.at(-1)?.content);