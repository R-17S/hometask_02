

declare global {
    namespace Express {
        interface Request {
            userId: string | null;
        }
    }
}

// Важно: экспорт нужен для работы модульной системы
export {};