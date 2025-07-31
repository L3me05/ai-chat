// hooks/useConversations.ts
import { useState, useEffect } from 'react';
import type { Conversation } from '../model/Converation';
import type { AuthApiService } from '../core/services/authApiService.ts';

export const useConversations = (apiService: AuthApiService) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [threadId, setThreadId] = useState<string>(Date.now().toString());

    useEffect(() => {
        apiService.getConversations()
            .then(setConversations)
            .catch(console.error);
    }, [apiService]);

    const handleSelectThread = (id: string) => {
        setThreadId(id);
    };

    const deleteSelectThread = async (idToDelete: string) => {
        try {
            await apiService.deleteConversation(idToDelete);
            console.log('Eliminazione avvenuta con successo');

            setConversations(prev =>
                prev.filter(conv => conv.thread_id !== idToDelete)
            );

            if (idToDelete === threadId) {
                resetThread();
            }
        } catch (err) {
            console.error('❌ Errore eliminando la conversazione:', err);
        }
    };

    const addNewConversation = async (newThreadId: string) => {
        const exist = conversations.some(conv => conv.thread_id === newThreadId);
        if (!exist) {
            try {
                const newConv = await apiService.getConversation(newThreadId);
                setConversations(current => [newConv, ...current]);
            } catch (error) {
                console.error('Errore aggiungendo nuova conversazione:', error);
            }
        }
    };

    const resetThread = () => {
        const newThreadId = Date.now().toString();
        setThreadId(newThreadId);
    };

    return {
        conversations,
        threadId,
        handleSelectThread,
        deleteSelectThread,
        addNewConversation,
        resetThread
    };
};