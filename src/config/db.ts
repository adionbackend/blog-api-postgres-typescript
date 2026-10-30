import dotenv from "dotenv";
import { Pool, QueryResult, QueryResultRow } from "pg";

dotenv.config();

export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT) || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});


// Generic Query Helper Function
export const query = <T extends QueryResultRow = any>(
    query: string,
    params?: any[],
): Promise<QueryResult<T>> => {
    return pool.query(query, params);
};


export const initDB = async (): Promise<void> => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          author VARCHAR(100) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    `;

    try {
        await query(createTableQuery);
        console.log('Database tables verified / created successfully');
    } catch (error) {
        console.error('Error Initializing database: ', error)
        process.exit(1);
    }
}