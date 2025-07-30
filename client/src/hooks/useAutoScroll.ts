import { useEffect } from 'react';

export const useAutoScroll = (dependency: any[]) => {
    useEffect(() => {
        const messagesEndRef = document.getElementById("messagesEnd");
        messagesEndRef?.scrollIntoView({ behavior: 'smooth' });
    }, dependency);
};