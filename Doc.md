# Документация API для TeleBot Constructor

## 1. Обзор и общие принципы

API спроектирован по принципам REST. Все запросы и ответы используют формат JSON. Для всех эндпоинтов, кроме регистрации и входа, требуется аутентификация по токену.

-   **Base URL:** `/api/v1/`
-   **Аутентификация:** JWT (JSON Web Token), передаваемый в заголовке `Authorization: Bearer <token>`.
-   **Формат данных:** `application/json`.
-   **Обработка ошибок:** Ошибки возвращаются с соответствующим HTTP-статусом и JSON-объектом в теле:
    ```json
    {
      "error": "Сообщение об ошибке"
    }
    ```

---

## 2. Модели данных (Data Models)

Здесь описаны основные сущности, используемые в API.

#### **User**
Представляет пользователя системы.
```json
{
  "id": "string", // Уникальный идентификатор (UUID)
  "email": "string"
}
```

#### **Bot**
Представляет Telegram-бота, созданного пользователем.
```json
{
  "id": "string",
  "name": "string",
  "telegramToken": "string", // Токен должен храниться в зашифрованном виде
  "ownerId": "string", // ID пользователя-владельца
  "createdAt": "string" // ISO 8601 Date
}
```

#### **FlowData**
Структура данных для хранения сценария (графа) бота.
```json
{
  "nodes": [ /* массив объектов Node (формат React Flow) */ ],
  "edges": [ /* массив объектов Edge (формат React Flow) */ ]
}
```

#### **StatisticsData**
Данные для страницы статистики.
```json
{
  "overall": {
    "totalUsers": "number",
    "totalMessages": "number",
    "avgConversion": "number",
    "activeBots": "number"
  },
  "bots": [
    {
      "id": "string",
      "name": "string",
      "users": "number",
      "messages": "number",
      "conversionRate": "number",
      "messageActivity": ["number"] // Массив из 7 чисел (активность за последнюю неделю)
    }
  ]
}
```

#### **Collaborator**
Представляет пользователя, имеющего доступ к боту.
```json
{
    "id": "string", // User ID
    "email": "string",
    "role": "editor" | "viewer"
}
```

---

## 3. Аутентификация (`/auth`)

#### `POST /auth/register`
Регистрация нового пользователя.
-   **Тело запроса:**
    ```json
    {
      "email": "user@example.com",
      "password": "strongpassword123"
    }
    ```
-   **Успешный ответ (201 Created):**
    ```json
    {
      "user": { "id": "user_uuid", "email": "user@example.com" },
      "token": "your_jwt_token"
    }
    ```
-   **Ошибки:**
    -   `400 Bad Request`: Некорректные данные (например, невалидный email или короткий пароль).
    -   `409 Conflict`: Пользователь с таким email уже существует.

#### `POST /auth/login`
Вход пользователя в систему.
-   **Тело запроса:**
    ```json
    {
      "email": "user@example.com",
      "password": "strongpassword123"
    }
    ```
-   **Успешный ответ (200 OK):**
    ```json
    {
      "user": { "id": "user_uuid", "email": "user@example.com" },
      "token": "your_jwt_token"
    }
    ```
-   **Ошибки:**
    -   `401 Unauthorized`: Неверный email или пароль.

---

## 4. Управление ботами (`/bots`)

*Все эндпоинты в этом разделе требуют аутентификации.*

#### `GET /bots`
Получение списка всех ботов, принадлежащих текущему пользователю.
-   **Успешный ответ (200 OK):** Массив объектов `Bot`.

#### `GET /bots/:botId`
Получение информации о конкретном боте.
-   **Успешный ответ (200 OK):** Объект `Bot`.
-   **Ошибки:**
    -   `403 Forbidden`: Бот не принадлежит текущему пользователю или у пользователя нет прав на просмотр.
    -   `404 Not Found`: Бот с таким ID не найден.

#### `POST /bots`
Создание нового бота.
-   **Тело запроса:**
    ```json
    {
      "name": "My New Bot",
      "telegramToken": "12345:ABC-DEF12345",
      "initialFlow": { /* опционально, объект FlowData */ }
    }
    ```
-   **Логика:**
    -   При создании бота также должна создаваться связанная с ним запись для хранения `FlowData`. Если `initialFlow` не предоставлен, создается стандартная схема (один блок "Старт").
    -   Токен Telegram должен быть верифицирован (проверка через `getMe` API Telegram).
-   **Успешный ответ (201 Created):** Новый созданный объект `Bot`.

#### `PUT /bots/:botId`
Обновление данных бота (например, имени или токена).
-   **Тело запроса:**
    ```json
    {
      "name": "Updated Bot Name",
      "telegramToken": "54321:FED-CBA54321"
    }
    ```
-   **Успешный ответ (200 OK):** Обновленный объект `Bot`.
-   **Ошибки:** `403 Forbidden`, `404 Not Found`.

#### `DELETE /bots/:botId`
Удаление бота и всех связанных с ним данных (сценарий, статистика).
-   **Успешный ответ (204 No Content)`.
-   **Ошибки:** `403 Forbidden`, `404 Not Found`.

---

## 5. Управление сценариями (`/bots/:botId/flow`)

*Требуется аутентификация.*

#### `GET /bots/:botId/flow`
Получение текущего сценария для указанного бота.
-   **Успешный ответ (200 OK):** Объект `FlowData`.
-   **Ошибки:** `403 Forbidden`, `404 Not Found`.

#### `PUT /bots/:botId/flow`
Сохранение (полная перезапись) сценария для бота.
-   **Тело запроса:** Объект `FlowData`.
-   **Успешный ответ (200 OK):**
    ```json
    {
        "message": "Flow saved successfully"
    }
    ```
-   **Ошибки:** `400 Bad Request` (невалидная структура `FlowData`), `403 Forbidden`, `404 Not Found`.

---

## 6. Статистика (`/statistics`)

*Требуется аутентификация.*

#### `GET /statistics`
Получение сводной статистики по всем ботам пользователя.
-   **Успешный ответ (200 OK):** Объект `StatisticsData`.

---

## 7. Совместная работа (`/bots/:botId/collaborators`)

*Требуется аутентификация. Доступно только владельцу бота.*

#### `GET /bots/:botId/collaborators`
Получение списка пользователей, имеющих доступ к боту.
-   **Успешный ответ (200 OK):** Массив объектов `Collaborator`.

#### `POST /bots/:botId/collaborators`
Приглашение нового пользователя для совместной работы.
-   **Тело запроса:**
    ```json
    {
        "email": "teammate@example.com",
        "role": "editor" // "editor" или "viewer"
    }
    ```
-   **Успешный ответ (201 Created):** Новый объект `Collaborator`.
-   **Ошибки:** `404 Not Found` (пользователь с таким email не найден в системе), `409 Conflict` (пользователь уже является соавтором).

#### `PUT /bots/:botId/collaborators/:userId`
Изменение роли существующего соавтора.
-   **Тело запроса:**
    ```json
    {
        "role": "viewer"
    }
    ```
-   **Успешный ответ (200 OK):** Обновленный объект `Collaborator`.

#### `DELETE /bots/:botId/collaborators/:userId`
Удаление соавтора из проекта.
-   **Успешный ответ (204 No Content)`.

---

## 8. Публикация и управление Webhook

Для того чтобы бот работал в Telegram, его токен необходимо связать с URL-адресом вашего бэкенда (Webhook), который будет обрабатывать входящие сообщения.

#### `POST /bots/:botId/deploy`
Устанавливает Webhook для бота на стороне Telegram.
-   **Логика:**
    1.  Бэкенд генерирует уникальный URL для этого бота, например, `https://your-backend.com/webhook/<botId>`.
    2.  Отправляет запрос к Telegram API `setWebhook` с этим URL.
    3.  Сохраняет статус бота как "активный".
-   **Успешный ответ (200 OK):**
    ```json
    {
        "message": "Bot deployed successfully"
    }
    ```
-   **Ошибки:** `500 Internal Server Error` (если Telegram API вернул ошибку).

#### `POST /bots/:botId/undeploy`
Удаляет Webhook для бота, останавливая его работу.
-   **Логика:** Отправляет запрос к Telegram API `deleteWebhook`.
-   **Успешный ответ (200 OK):**
    ```json
    {
        "message": "Bot undeployed successfully"
    }
    ```

#### `POST /webhook/:botId`
**Публичный эндпоинт**, на который Telegram будет отправлять обновления.
-   **Логика:**
    1.  Принимает входящие данные от Telegram.
    2.  Находит бота по `botId`.
    3.  Загружает его `FlowData`.
    4.  Запускает исполнитель сценария (flow runner) для обработки сообщения пользователя.
    5.  Отправляет ответы обратно через Telegram API.
-   Этот эндпоинт является ядром "живого" бота и требует сложной логики для управления состоянием диалогов.
