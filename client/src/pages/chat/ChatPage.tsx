import ChatHeader from "./components/ChatHeader.tsx";
import MessageList from "./components/MessageList.tsx";
import MessageInput from "./components/MessageInput.tsx";
import {useEffect, useState} from "react";
import axios from 'axios';
import ConversationsSidebar from "./components/ConversationsSidebar.tsx";
import type { Conversation } from "../../model/Converation.ts";

interface Message {
    id:number;
    text:string;
    isUser: boolean;
}


function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState<string>(Date.now().toString());
    const [conversations, setConversations] = useState<Conversation[]>([]);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        axios.get(`${apiUrl}/conversations`)
            .then(res => setConversations(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        axios.get(`${apiUrl}/conversations/${threadId}/messages`)
            .then(res => {
                console.log('Messaggi ricevuti', res.data)
                //formatto dati
                const mappedMessages = res.data.map((msg: any) => ({
                    id: msg.id,
                    text: msg.content,
                    isUser: msg.is_user,
                }))
                setMessages(mappedMessages);
            })
            .catch(console.error);
    }, [threadId]);

    useEffect(()=> {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        const messagesEndRef = document.getElementById("messagesEnd");
        messagesEndRef?.scrollIntoView({ behavior: 'smooth'});
    }

    const handleSelectThread = (id: string) => {
        console.log('cambio thread id dajeeee', id)
        setThreadId(id);
        setInputText('');
    };

    const sendMessage = async (messageText: string) => {
        if(messageText.trim() === '' || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: messageText.trim(),
            isUser: true,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {


            //utilizzando axios
            const response = await axios.post(
                `${apiUrl}/generate`,
                {
                    query: userMessage.text,
                    threadId: threadId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const aiMessage = {
                id: Date.now(),
                text: response.data.content || response.data || 'Nessuna risposta ricevuta',
                isUser: false,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                id: Date.now(),
                text: 'Sorry, there was an error processing your request.',
                isUser: false,
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const resetChat = () => {
        setMessages([]);
        setThreadId(Date.now().toString());
    }

    return (
        <>
            <div className="flex h-screen mx-8 py-4  gap-30">
                <div className="flex-3/12 h-full">
                    <ConversationsSidebar
                        list={conversations}
                        onSelect={handleSelectThread}
                        activeId={threadId}
                    />
                </div>
                <div className="flex-9/12 flex-col  h-full py-4">
                    <ChatHeader resetChat={resetChat} />
                    <MessageList messages={messages} isLoading={isLoading} />
                    <MessageInput inputText={inputText} setInputText={setInputText} sendMessage={sendMessage} isLoading={isLoading}/>
                </div>
            </div>
        </>
    );
}

export default ChatPage;