import {Collection} from "mongodb";
import {TokenDbTypes} from "../../../db/token-type";
import {RequestLogDbType} from "../../../db/requestDbType";
import {SessionDbType} from "../../../db/session-type";


export async function ensureTTLIndex(collections: {
    //tokenCollection: Collection<TokenDbTypes>;
    requestLogsCollection?: Collection<RequestLogDbType>;
    sessionsCollection?: Collection<SessionDbType>;
    // сунуть сюда другие коллекции если надо
}) {
    // // TTL для токенов
    // await collections.tokenCollection.createIndex(
    //     { revokedAt: 1 },
    //     { expireAfterSeconds: 60 * 60 * 24 * 30 } // 30 дней
    // );


    // TTL для requestLogs — чистим логи через 1 минуту
    if (collections.requestLogsCollection) {
        await collections.requestLogsCollection.createIndex(
            { date: 1 },
            { expireAfterSeconds: 60 }
        );
    }

    // TTL для sessions — чисти сразу
    if (collections.sessionsCollection) {
        await collections.sessionsCollection.createIndex(
            { expiresAt: 1 },
            { expireAfterSeconds: 0 } // удаляется сразу после истечения
        );
    }

    console.log('✅ TTLIndex успешно настроены');
}