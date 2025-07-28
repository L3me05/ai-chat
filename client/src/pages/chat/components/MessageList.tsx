import * as React from "react";
import Message from "./Message.tsx";
import LoadingIndicator from "./LoadingIndicator.tsx";

interface Message {
    id: number;
    text: string;
    isUser: boolean;
}

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
    return (
        <>
            <div className="flex flex-1 flex-col gap-4 py-4 ">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-secondary p-8" >
                        <p>Start your conversation with the AI</p>
                    </div>
                ) : (
                    messages.map((mess) => <Message key={mess.id} message={mess} />)
                )}
                {isLoading && <LoadingIndicator />}
                <div id="messagesEnd" />
            </div>
        </>
    );
};

export default MessageList;