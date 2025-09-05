

export type SessionDbType = {
    userId: string;
    deviceId: string;
    ip: string;
    deviceTitle: string | undefined;
    issuedAt: Date;
    expiresAt: Date;
    lastActiveDate: Date;
}