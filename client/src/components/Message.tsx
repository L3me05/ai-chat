import * as React from "react";

interface MessageProps {
    message: {
        id: number;
        text: string;
        isUser: boolean;
    }
}

const Message: React.FC<MessageProps> = ({ message }) => {
    return (
        <>
            <div className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}>
                <div className="message-avatar">{message.isUser ? 'You' : 'AI'}</div>
                <div className="message-content">{message.text}</div>
            </div>
        </>
    );
}

export default Message;