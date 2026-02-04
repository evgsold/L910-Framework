# Пользовательский Node.js Фреймворк - Приложение "Цирк"

Это минималистичный веб-фреймворк для Node.js, аналогичный Express, реализующий Систему Управления Цирком (Вариант 10).

## Сущности

### Артист (Artist)
Хранится в `data/artists.json`.
Структура:
- `id`: number (Уникальный идентификатор)
- `name`: string (Имя артиста)
- `actType`: string (Тип номера, например, "Клоун", "Акробат")
- `isFullTime`: boolean (Работает ли на полную ставку)
- `hiredAt`: Date string (Дата найма)
- `skills`: Array<string> (Навыки)

### Представление (Show)
Хранится в `data/shows.json`.
Структура:
- `id`: number (Уникальный идентификатор)
- `title`: string (Название представления)
- `durationMinutes`: number (Длительность в минутах)
- `isSoldOut`: boolean (Распроданы ли билеты)
- `premiereDate`: Date string (Дата премьеры)
- `performers`: Array<number> (ID участвующих артистов)

## Маршрутизация API

### Артисты

#### `GET /artists`
- **Описание**: Получить список всех артистов.
- **Параметры запроса**: Нет.
- **Пример ответа (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Oleg Popov",
      "actType": "Clown",
      "isFullTime": true,
      "hiredAt": "2020-05-10T00:00:00.000Z",
      "skills": ["juggling", "comedy"]
    }
  ]
  ```

#### `GET /artists/:id`
- **Описание**: Получить конкретного артиста по его ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор артиста.
- **Пример ответа (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "Oleg Popov",
    "actType": "Clown",
    "isFullTime": true,
    "hiredAt": "2020-05-10T00:00:00.000Z",
    "skills": ["juggling", "comedy"]
  }
  ```
- **Пример ответа (404 Not Found)**:
  ```json
  { "error": "Artist not found" }
  ```

#### `POST /artists`
- **Описание**: Создать нового артиста.
- **Тело запроса (application/json)**:
  ```json
  {
    "name": "New Artist",
    "actType": "Juggler",
    "isFullTime": false,
    "hiredAt": "2023-01-01T00:00:00.000Z",
    "skills": ["balls", "clubs"]
  }
  ```
- **Пример ответа (201 Created)**:
  ```json
  {
    "id": 3,
    "name": "New Artist",
    "actType": "Juggler",
    "isFullTime": false,
    "hiredAt": "2023-01-01T00:00:00.000Z",
    "skills": ["balls", "clubs"]
  }
  ```

#### `PUT /artists/:id`
- **Описание**: Полностью обновить существующего артиста по его ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор артиста.
- **Тело запроса (application/json)**:
  ```json
  {
    "name": "Updated Name",
    "actType": "Senior Juggler",
    "isFullTime": true,
    "hiredAt": "2023-01-01T00:00:00.000Z",
    "skills": ["fire juggling"]
  }
  ```
- **Пример ответа (200 OK)**:
  ```json
  {
    "id": 3,
    "name": "Updated Name",
    "actType": "Senior Juggler",
    "isFullTime": true,
    "hiredAt": "2023-01-01T00:00:00.000Z",
    "skills": ["fire juggling"]
  }
  ```

#### `PATCH /artists/:id`
- **Описание**: Частично обновить существующего артиста по его ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор артиста.
- **Тело запроса (application/json)**:
  ```json
  {
    "isFullTime": true
  }
  ```

#### `DELETE /artists/:id`
- **Описание**: Удалить артиста по его ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор артиста.
- **Пример ответа (200 OK)**:
  ```json
  { "message": "Artist deleted" }
  ```

### Представления (Shows)

#### `GET /shows`
- **Описание**: Получить список всех представлений.
- **Пример ответа (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "title": "Grand Premiere",
      "durationMinutes": 120,
      "isSoldOut": false,
      "premiereDate": "2023-01-20T18:00:00.000Z",
      "performers": [1, 2]
    }
  ]
  ```

#### `GET /shows/:id`
- **Описание**: Получить конкретное представление по его ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор представления.

#### `POST /shows`
- **Описание**: Создать новое представление.
- **Тело запроса (application/json)**:
  ```json
  {
    "title": "New Show",
    "durationMinutes": 90,
    "isSoldOut": false,
    "premiereDate": "2023-12-01T20:00:00.000Z",
    "performers": []
  }
  ```

#### `PUT /shows/:id`
- **Описание**: Полностью обновить существующее представление.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор представления.

#### `PATCH /shows/:id`
- **Описание**: Частично обновить существующее представление.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор представления.

#### `DELETE /shows/:id`
- **Описание**: Удалить представление по его ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор представления.

## Запуск приложения

1.  Убедитесь, что Node.js установлен.
2.  Установите зависимости (не требуются, так как используются нативные модули).
3.  Запустите сервер:
    ```bash
    node src/index.js
    ```
4.  Сервер прослушивает порт 5001.
