// hooks/useSendMessage.ts

import type {Message} from "../model/Message.ts";
import type {AuthApiService} from "../core/services/authApiService.ts";

export const useSendMessage = (
    apiService: AuthApiService,
    addMessage: (message: Message) => void,
    setIsLoading: (loading: boolean) => void,
    onNewConversation: (threadId: string) => void
) => {
    const sendMessage = async (messageText: string, threadId: string) => {
        if (messageText.trim() === '') return;

        const userMessage: Message = {
            id: Date.now(),
            text: messageText.trim(),
            isUser: true,
        };

        addMessage(userMessage);
        setIsLoading(true);

        try {
            const aiResponse = await apiService.sendMessage(userMessage.text, threadId);

            const aiMessage: Message = {
                id: Date.now() + 1,
                text: aiResponse,
                isUser: false,
            };

            addMessage(aiMessage);
            onNewConversation(threadId);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: 'Sorry, there was an error processing your request.',
                isUser: false,
            };
            addMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { sendMessage };
};