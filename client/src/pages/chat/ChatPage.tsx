// pages/chat/ChatPage.tsx
import { useState, useMemo } from 'react';
import { ApiService } from '../../services/apiService';
import { useMessages } from '../../hooks/useMessages';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useConversations } from '../../hooks/useConversations';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import ChatHeader from '../../components/ChatHeader';
import MessageList from '../../components/MessageList';
import MessageInput from '../../components/MessageInput';
import ConversationsSidebar from '../../components/ConversationsSidebar';

function ChatPage() {
    const [inputText, setInputText] = useState('');
    const [sidebar, setSidebar] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const apiService = useMemo(() => new ApiService(apiUrl), [apiUrl]);

    const {
        conversations,
        threadId,
        handleSelectThread,
        deleteSelectThread,
        addNewConversation,
        resetThread
    } = useConversations(apiService);

    const { messages, isLoading, setIsLoading, addMessage, resetMessages } = useMessages(threadId, apiService);

    const { sendMessage } = useSendMessage(
        apiService,
        addMessage,
        setIsLoading,
        addNewConversation
    );

    useAutoScroll([messages]);

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
        <div className="flex h-screen mx-8 py-4 gap-4">
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

export default ChatPage;