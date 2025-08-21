

declare global {
    namespace Express {
        interface Request {
            userId: string | null;
            refreshToken?: string;
        }
    }
}

// Важно: экспорт нужен для работы модульной системы
export {};