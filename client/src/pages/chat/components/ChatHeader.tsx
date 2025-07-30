import * as React from "react";
import {FaArrowRotateLeft} from "react-icons/fa6";
import {CiMenuBurger} from "react-icons/ci";


interface ChatHeaderProps{
    resetChat: () => void;
    changeSidebar: () => void;
    sidebar: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ resetChat, changeSidebar, sidebar } ) => {
    return (
        <>
            <header className="flex gap-4 items-center px-4 border-b border-border pb-2">
                {!sidebar && (
                    <CiMenuBurger
                        color="white"
                        size="40"
                        className="hover:bg-neutral-600 p-2 rounded-md cursor-pointer transition-colors duration-200"
                        onClick={changeSidebar}
                    />
                )}
                <h1 className="text-xl font-medium">AI Chat</h1>
                <button
                    className="flex items-center ml-auto gap-2 bg-none border border-border text-text px-2 py-3 rounded-sm cursor-pointer text-sm transition-colors duration-200 hover:bg-[255, 255, 255, 0.05]"
                    onClick={resetChat}
                >
                    <FaArrowRotateLeft color="white" size="20" />
                    New Chat
                </button>
            </header>
        </>
    );
}

export default ChatHeader;