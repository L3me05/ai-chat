import axios from "axios";
import type { AxiosInstance } from "axios";
import type {Conversation} from "../../model/Converation.ts";
import type {Message} from "../../model/Message.ts";

export class AuthApiService {
    private axiosInstance: AxiosInstance;


    constructor(apiUrl: string, getToken: () => Promise<string>) {
        this.axiosInstance = axios.create({
            baseURL: apiUrl,
        });

        this.axiosInstance.interceptors.request.use(async (config) => {
            const token = await getToken();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }

    async fetchProtectedData(): Promise<any> {
        const response = await this.axiosInstance.get('/protected');
        return response.data;
    }

    async fetchUserProfile(): Promise<any> {
        const response = await this.axiosInstance.get('/user/profile');
        return response.data;
    }


    async getConversations(): Promise<Conversation[]> {
        const response = await this.axiosInstance.get(`/conversations`);
        return response.data;
    }

    async getMessages(threadId: string): Promise<Message[]> {
        const response = await this.axiosInstance.get(`/conversations/${threadId}/messages`);
        return response.data.map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            isUser: msg.is_user,
        }));
    }

    async sendMessage(query: string, threadId: string): Promise<string> {
        const response = await this.axiosInstance.post(`/generate`, {
            query,
            threadId,
        });
        return response.data.content || response.data || 'Nessuna risposta ricevuta';
    }

    async getConversation(threadId: string): Promise<Conversation> {
        const response = await this.axiosInstance.get(`/conversations/${threadId}`);
        return {
            thread_id: threadId,
            created_at: response.data.created_at,
            title: response.data.title,
        };
    }

    async deleteConversation(threadId: string): Promise<void> {
        await this.axiosInstance.delete(`/conversations/${threadId}`);
    }
}

//Auth2, ppcte, ok2o
//come fare i permessi rollbase, attribute base, policed base, reback, acab, pbac

//ceracare fare automation

//che cose node a cosa serve e perchè esiste dino, yarn, bun top del top

