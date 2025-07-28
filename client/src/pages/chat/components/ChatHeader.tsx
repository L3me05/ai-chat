import * as React from "react";


interface ChatHeaderProps{
    resetChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ resetChat } ) => {
    return (
        <>
            <header className="flex justify-between items-center px-4 border-b border-border py-2">
                <h1 className="text-xl font-medium">AI Chat</h1>
                <button
                    className="flex items-center gap-2 bg-none border border-border text-text px-2 py-3 rounded-sm cursor-pointer text-sm transition-colors duration-200 hover:bg-[255, 255, 255, 0.05]"
                    onClick={resetChat}
                >
                    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M8 3V1L4 5L8 9V7C10.21 7 12 8.79 12 11C12 13.21 10.21 15 8 15C5.79 15 4 13.21 4 11H2C2 14.31 4.69 17 8 17C11.31 17 14 14.31 14 11C14 7.69 11.31 5 8 5V3Z'
                            fill='currentColor'
                        />
                    </svg>
                    New Chat
                </button>
            </header>
        </>
    );
}

export default ChatHeader;