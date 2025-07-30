import React from 'react';
import type {Conversation} from "../model/Converation.ts";
import {FaTrash} from "react-icons/fa";
import { CiMenuFries} from "react-icons/ci";


interface Props {
    list: Conversation[];
    onSelect: (id:string) => void;
    activeId: string;
    onDelete: (id:string) => void;
    changeSidebar: () => void;
}


// const formatDate = (dateString: string): string => {
//     try {
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) {
//             return 'Data non disponibile';
//         }
//         return date.toLocaleDateString('it-IT', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     } catch {
//         return 'Data non disponibile';
//     }
// };


const ConversationsSidebar: React.FC<Props> = ({list, onSelect, activeId, onDelete, changeSidebar}) => (
    <aside className=" border-r overflow-y-auto flex flex-col h-full">
        <div className="flex items-center justify-between w-full">
            <h2 className="p-2 text-center text-xl font-medium flex-grow text-center">Chat passate</h2>
            <CiMenuFries
                color="white"
                size="40"
                className="hover:bg-neutral-600 p-2 rounded-md cursor-pointer transition-colors duration-200 md:mr-5 mr-2"
                onClick={changeSidebar}
            />
        </div>

        <div
            className="pt-8"
        >
            {list.map(conv => (
                <div
                    key={conv.thread_id}
                    onClick={() => onSelect(conv.thread_id)}
                    className={`p-2 cursor-pointer hover:bg-user-message ${conv.thread_id === activeId ? 'bg-ai-message' : ''}`}
                >
                    <div
                        className=" flex justify-between md:mx-5 overflow-x-hidden mr-2"
                    >
                        {conv.title}
                        {/*{formatDate(conv.created_at)}*/}
                        <FaTrash color="white" size="20" onClick={() =>onDelete(conv.thread_id)} />
                    </div>
                </div>
            ))}
        </div>
    </aside>

);

export default ConversationsSidebar;