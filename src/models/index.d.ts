// src/types/index.d.ts
import { ObjectId } from 'mongodb';

declare global {
    namespace Express {
        interface Request {
            userId: string | null;
        }
    }
}

// Важно: экспорт нужен для работы модульной системы
export {};