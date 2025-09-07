

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            refreshToken?: string;
            deviceId?: string;
            context: {
                ip: string;
                userAgent: string;
            };
        }
    }
}

// Важно: экспорт нужен для работы модульной системы
export {};