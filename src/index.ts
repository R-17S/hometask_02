// Импортируем Express
import {app} from "./app";
import {SETTINGS} from "./settings";
import {runDb} from "./db/mongoDB";

const startApp = async () => {
    const res = await runDb(SETTINGS.MONGO_URL)
    if(!res) process.exit(1);

    app.set('trust proxy', true);
    app.listen(SETTINGS.PORT, () => {
        console.log(`Server started on port ${SETTINGS.PORT}`)
    });
};
startApp();
