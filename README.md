# Vanlife Game

Эта версия игры отделена от WordPress и может запускаться как отдельная страница. Она также включает заготовку для интеграции с Telegram Bot API.

## Запуск

```bash
npm install
node server.js
```

Сервер отдаёт `index.html` по адресу `/game` и обрабатывает входящие веб-хуки Telegram на `/webhook`.

## Telegram

Для работы запросов к Bot API установите переменную окружения `TELEGRAM_BOT_TOKEN`. Функции для установки счёта и получения таблицы лидеров находятся в `js/telegram.js`.

Игру можно открыть в iframe либо в Telegram Game Center, передав идентификатор пользователя через параметр `id` или используя `Telegram Web Apps`.

