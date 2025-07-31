// src/pages/chat/ChatPage.tsx
import { useState, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthApiService } from '../../core/services/authApiService';
import { useConversations } from '../../hooks/useConversations';
import { useMessages } from '../../hooks/useMessages';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import ConversationsSidebar from './components/ConversationsSidebar';

export default function ChatPage() {
    const [inputText, setInputText] = useState('');
    const [sidebar, setSidebar] = useState(true);

    // 1) Prendi la funzione Auth0 per ottenere il token
    const { getAccessTokenSilently } = useAuth0();
    // 2) Url della tua API (con fallback in locale)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    // 3) Memoizza l’istanza di AuthApiService passando anche getAccessTokenSilently
    const apiService = useMemo(
        () => new AuthApiService(apiUrl, getAccessTokenSilently),
        [apiUrl, getAccessTokenSilently]
    );

    // Hook per gestire le conversazioni
    const {
        conversations,
        threadId,
        handleSelectThread,
        deleteSelectThread,
        addNewConversation,
        resetThread
    } = useConversations(apiService);

    // Hook per gestire i messaggi della conversazione corrente
    const {
        messages,
        isLoading,
        setIsLoading,
        addMessage,
        resetMessages
    } = useMessages(threadId, apiService);

    // Hook per inviare nuovi messaggi
    const { sendMessage } = useSendMessage(
        apiService,
        addMessage,
        setIsLoading,
        addNewConversation
    );

    // Scroll automatico in fondo alla chat
    useAutoScroll([messages]);

    // Handlers del form
    const handleSendMessage = async (messageText: string) => {
        await sendMessage(messageText, threadId);
        setInputText('');
    };

    const handleResetChat = () => {
        resetThread();
        resetMessages();
    };

    const handleSelectConversation = (id: string) => {
        handleSelectThread(id);
        setInputText('');
    };

    return (
        <div className="flex h-full mx-8 py-4 gap-4">
            {sidebar && (
                <div className="w-full md:flex-5/24 lg:flex-5/24 flex-shrink-0 md:relative absolute inset-0 z-10 md:z-auto">
                    <ConversationsSidebar
                        list={conversations}
                        onSelect={handleSelectConversation}
                        activeId={threadId}
                        onDelete={deleteSelectThread}
                        changeSidebar={() => setSidebar(false)}
                    />
                </div>
            )}

            <div className={`flex-19/24 flex flex-col ${sidebar ? 'hidden md:flex' : 'flex'}`}>
                <div className="shrink-0">
                    <ChatHeader
                        resetChat={handleResetChat}
                        changeSidebar={() => setSidebar(!sidebar)}
                        sidebar={sidebar}
                    />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
                    <MessageList messages={messages} isLoading={isLoading} />
                </div>
                <div className="shrink-0">
                    <MessageInput
                        inputText={inputText}
                        setInputText={setInputText}
                        sendMessage={handleSendMessage}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}
