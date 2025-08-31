import {Collection} from "mongodb";
import {TokenDbTypes} from "../../../db/token-type";


export async function ensureTTLIndex(collections: {
    tokenCollection: Collection<TokenDbTypes>;
    // сунуть сюда другие коллекции если надо
}) {
    // TTL для токенов
    await collections.tokenCollection.createIndex(
        { revokedAt: 1 },
        { expireAfterSeconds: 60 * 60 * 24 * 30 } // 30 дней
    );

    console.log('✅ TTLIndex успешно настроены');
}