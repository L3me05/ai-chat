// services/apiService.ts
import axios from 'axios';
import type { Conversation } from '../model/Converation';
import type {Message} from "../model/Message.ts";

export class ApiService {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async getConversations(): Promise<Conversation[]> {
        const response = await axios.get(`${this.apiUrl}/conversations`);
        return response.data;
    }

    async getMessages(threadId: string): Promise<Message[]> {
        const response = await axios.get(`${this.apiUrl}/conversations/${threadId}/messages`);
        return response.data.map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            isUser: msg.is_user,
        }));
    }

    async sendMessage(query: string, threadId: string): Promise<string> {
        const response = await axios.post(`${this.apiUrl}/generate`, {
            query,
            threadId,
        });
        return response.data.content || response.data || 'Nessuna risposta ricevuta';
    }

    async getConversation(threadId: string): Promise<Conversation> {
        const response = await axios.get(`${this.apiUrl}/conversations/${threadId}`);
        return {
            thread_id: threadId,
            created_at: response.data.created_at,
            title: response.data.title,
        };
    }

    async deleteConversation(threadId: string): Promise<void> {
        await axios.delete(`${this.apiUrl}/conversations/${threadId}`);
    }
}