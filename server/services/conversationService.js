import 'dotenv/config';
import { Pool} from "pg";

//Connessione al db
const pool = new Pool({
    connectionString: process.env.DB_URL,
});

//funzione per recuperare tutte le funzioni
export const getConversations = async () => {
    try {
        const result = await pool.query('SELECT * FROM conversations ORDER BY created_at DESC');
        return result.rows;
    } catch (err) {
        console.error('Errore nel recupero delle conversazioni: ', err);
        throw err;
    }
};

//funzione per recuperare i messaggi di una conversazione specifica
export const getMessages = async (thread_id) => {
    try {
        const result = await pool.query('SELECT * FROM messages WHERE thread_id =$1 ORDER BY created_at ASC', [thread_id]);
        return result.rows;
    } catch (err) {
        console.error('Errore nel recupero dei messaggi: ',err);
        throw err;
    }
};

//funzione per aggiungere una conversazione
export const addConversation = async (thread_id, title) => {
    try {
        const result = await pool.query('INSERT INTO conversations (thread_id, title) VALUES ($1, $2) RETURNING *', [thread_id, title]);
        return result.rows[0];
    } catch (err) {
        console.error('Errore nella creazione di una conversazione: ',err);
        throw err;
    }
};

//funzione per aggiungere un messaggio
export const addMessage = async (thread_id, content, isUser) => {
    try {
        const result = await pool.query(
            'INSERT INTO messages (thread_id, content, is_user) VALUES ($1, $2, $3) RETURNING *',
            [thread_id, content, isUser]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Errore nell\'aggiunta del messaggio: ',err);
        throw err;
    }
}

//verifica se thread_id già presente
export const getConversationByThreadId = async (thread_id) => {
    try {
        const result = await pool.query('SELECT * FROM conversations WHERE thread_id=$1', [thread_id]);
        return result.rows[0] || null;
    } catch (err) {
        console.error('Errore nella creazione di una conversazione: ',err);
        throw err;
    }
};


//elimina conversazione e messaggi
export const deleteConversationByThreadId = async (thread_id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // elimina la conversazione
        const res = await client.query('DELETE FROM conversations WHERE thread_id = $1 RETURNING id', [thread_id]);

        await client.query('COMMIT');
        return res.rows.length > 0;
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Errore in deleteConversationByThreadId:', err);
        throw err;
    } finally {
        client.release();
    }
}