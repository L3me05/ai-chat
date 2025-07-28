import ChatHeader from "./components/ChatHeader.tsx";
import MessageList from "./components/MessageList.tsx";
import MessageInput from "./components/MessageInput.tsx";
import {useEffect, useState} from "react";
import axios from 'axios';

interface Message {
    id:number;
    text:string;
    isUser: boolean;
}

function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState<number>(Date.now());

    useEffect(()=> {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        const messagesEndRef = document.getElementById("messagesEnd");
        messagesEndRef?.scrollIntoView({ behavior: 'smooth'});
    }

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
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
        setThreadId(Date.now());
    }

    return (
        <>
            <div className="flex flex-col sm:px-4 h-screen max-w-5xl mx-auto px-2">
                <ChatHeader resetChat={resetChat} />
                <MessageList messages={messages} isLoading={isLoading} />
                <MessageInput inputText={inputText} setInputText={setInputText} sendMessage={sendMessage} isLoading={isLoading}/>
            </div>
        </>
    );
}

export default ChatPage;