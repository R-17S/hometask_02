// Импортируем Express
import {app} from "./app";
import {SETTINGS} from "./settings";


// Запускаем сервер
app.listen(SETTINGS.PORT, () => {
    console.log(`Сервер запущен на http://localhost:${SETTINGS.PORT}`);
});