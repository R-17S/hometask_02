

declare global {
    namespace Express {
        interface Request {
            userId: string | null;
            refreshToken?: string;
            context: {
                ip: string;
                userAgent: string;
            };
        }
    }
}

// Важно: экспорт нужен для работы модульной системы
export {};