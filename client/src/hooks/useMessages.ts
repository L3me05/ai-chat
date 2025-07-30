// hooks/useMessages.ts
import { useState, useEffect } from 'react';
import type { ApiService } from '../core/services/apiService';
import type {Message} from "../model/Message.ts";

export const useMessages = (threadId: string, apiService: ApiService) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        apiService.getMessages(threadId)
            .then(setMessages)
            .catch(console.error);
    }, [threadId, apiService]);

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    const resetMessages = () => {
        setMessages([]);
    };

    return {
        messages,
        isLoading,
        setIsLoading,
        addMessage,
        resetMessages
    };
};