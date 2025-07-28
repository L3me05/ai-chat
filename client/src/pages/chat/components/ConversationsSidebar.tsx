import React from 'react';
import type {Conversation} from "../../../model/Converation.ts";


interface Props {
    list: Conversation[];
    onSelect: (id:string) => void;
    activeId: string;
}


const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Data non disponibile';
        }
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Data non disponibile';
    }
};


const ConversationsSidebar: React.FC<Props> = ({list, onSelect, activeId}) => (
    <aside className=" border-r overflow-y-auto flex flex-col h-full">
        <h2 className="p-2 font-semibold text-center text-xl">Chat passate</h2>
        <div
            className="pt-8"
        >
            {list.map(conv => (
                <div
                    key={conv.thread_id}
                    onClick={() => onSelect(conv.thread_id)}
                    className={`p-2 cursor-pointer hover:bg-user-message ${conv.thread_id === activeId ? 'bg-ai-message' : ''}`}
                >
                    {formatDate(conv.created_at)}
                </div>
            ))}
        </div>
    </aside>

);

export default ConversationsSidebar;