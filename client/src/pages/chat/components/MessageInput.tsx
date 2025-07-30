import * as React from "react";

interface MessageInputProps {
    inputText: string;
    setInputText: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: (messageText: string) => void;
    isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ inputText, setInputText, sendMessage, isLoading }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputText);
        }
    }

    return (
        <>
            <div className="flex gap-2 py-4 border-t flex-wrap border-border">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Type your message...'
                    disabled={isLoading}
                    rows={1}
                    className="flex-7/8 py-3 px-1"
                />
                <button
                    className='flex items-center justify-center bg-primary text-black border-none rounded-lg w-12 h-12 cursor-pointer transition hover:opacity-90 disabled:bg-disabled disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => sendMessage(inputText)}
                    disabled={inputText.trim() === '' || isLoading}
                >
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z' fill='currentColor' />
                    </svg>
                </button>
            </div>
        </>
    );
}

export default MessageInput;