# Пользовательский Node.js Фреймворк - Приложение "Библиотека"

Это минималистичный веб-фреймворк для Node.js, аналогичный Express, реализующий Систему Управления Библиотекой (Вариант 5).

## Сущности

### Книга
Хранится в `data/books.json`.
Структура:
- `id`: number (Уникальный идентификатор)
- `title`: string (Название книги)
- `author`: string (Имя автора)
- `isAvailable`: boolean (Статус доступности)
- `publishedAt`: Date string (Дата публикации в формате ISO 8601)
- `tags`: Array<string> (Жанры или теги)

### Читатель
Хранится в `data/readers.json`.
Структура:
- `id`: number (Уникальный идентификатор)
- `name`: string (Имя читателя)
- `membershipActive`: boolean (Статус членства)
- `registeredAt`: Date string (Дата регистрации)
- `borrowedBooks`: Array<number> (ID заимствованных книг)

## Маршрутизация API

### Книги

#### `GET /books`
- **Описание**: Получить список всех книг.
- **Параметры запроса**: Нет.
- **Пример ответа (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isAvailable": true,
      "publishedAt": "1925-04-10T00:00:00.000Z",
      "tags": ["classic", "novel"]
    }
  ]
  ```

#### `GET /books/:id`
- **Описание**: Получить конкретную книгу по ее ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор книги.
- **Пример ответа (200 OK)**:
  ```json
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isAvailable": true,
    "publishedAt": "1925-04-10T00:00:00.000Z",
    "tags": ["classic", "novel"]
  }
  ```
- **Пример ответа (404 Not Found)**:
  ```json
  { "error": "Book not found" }
  ```

#### `POST /books`
- **Описание**: Создать новую книгу.
- **Тело запроса (application/json)**:
  ```json
  {
    "title": "Новая книга",
    "author": "Автор новой книги",
    "isAvailable": true,
    "publishedAt": "2023-01-01T00:00:00.000Z",
    "tags": ["фантастика", "приключения"]
  }
  ```
- **Пример ответа (201 Created)**:
  ```json
  {
    "id": 3,
    "title": "Новая книга",
    "author": "Автор новой книги",
    "isAvailable": true,
    "publishedAt": "2023-01-01T00:00:00.000Z",
    "tags": ["фантастика", "приключения"]
  }
  ```
- **Пример ответа (400 Bad Request)**:
  ```json
  { "error": "Invalid JSON" }
  ```

#### `PUT /books/:id`
- **Описание**: Полностью обновить существующую книгу по ее ID. Требуется передать все поля книги.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор книги.
- **Тело запроса (application/json)**:
  ```json
  {
    "title": "Обновленное название",
    "author": "Обновленный автор",
    "isAvailable": false,
    "publishedAt": "2024-05-15T00:00:00.000Z",
    "tags": ["триллер"]
  }
  ```
- **Пример ответа (200 OK)**:
  ```json
  {
    "id": 1,
    "title": "Обновленное название",
    "author": "Обновленный автор",
    "isAvailable": false,
    "publishedAt": "2024-05-15T00:00:00.000Z",
    "tags": ["триллер"]
  }
  ```
- **Пример ответа (404 Not Found)**:
  ```json
  { "error": "Book not found" }
  ```

#### `PATCH /books/:id`
- **Описание**: Частично обновить существующую книгу по ее ID. Передаются только те поля, которые нужно изменить.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор книги.
- **Тело запроса (application/json)**:
  ```json
  {
    "isAvailable": false
  }
  ```
- **Пример ответа (200 OK)**:
  ```json
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isAvailable": false,
    "publishedAt": "1925-04-10T00:00:00.000Z",
    "tags": ["classic", "novel"]
  }
  ```
- **Пример ответа (404 Not Found)**:
  ```json
  { "error": "Book not found" }
  ```

#### `DELETE /books/:id`
- **Описание**: Удалить книгу по ее ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор книги.
- **Пример ответа (200 OK)**:
  ```json
  { "message": "Book deleted" }
  ```
- **Пример ответа (404 Not Found)**:
  ```json
  { "error": "Book not found" }
  ```

### Читатели

#### `GET /readers`
- **Описание**: Получить список всех читателей.
- **Параметры запроса**: Нет.
- **Пример ответа (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Alice Smith",
      "membershipActive": true,
      "registeredAt": "2023-01-15T10:30:00.000Z",
      "borrowedBooks": [2]
    }
  ]
  ```

#### `GET /readers/:id`
- **Описание**: Получить конкретного читателя по его ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор читателя.
- **Пример ответа (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "Alice Smith",
    "membershipActive": true,
    "registeredAt": "2023-01-15T10:30:00.000Z",
    "borrowedBooks": [2]
  }
  ```
- **Пример ответа (404 Not Found)**:
  ```json
  { "error": "Reader not found" }
  ```

#### `POST /readers`
- **Описание**: Создать нового читателя.
- **Тело запроса (application/json)**:
  ```json
  {
    "name": "Новый читатель",
    "membershipActive": true,
    "registeredAt": "2024-01-01T12:00:00.000Z",
    "borrowedBooks": []
  }
  ```
- **Пример ответа (201 Created)**:
  ```json
  {
    "id": 3,
    "name": "Новый читатель",
    "membershipActive": true,
    "registeredAt": "2024-01-01T12:00:00.000Z",
    "borrowedBooks": []
  }
  ```
- **Пример ответа (400 Bad Request)**:
  ```json
  { "error": "Invalid JSON" }
  ```

#### `PUT /readers/:id`
- **Описание**: Полностью обновить существующего читателя по его ID. Требуется передать все поля читателя.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор читателя.
- **Тело запроса (application/json)**:
  ```json
  {
    "name": "Обновленное имя",
    "membershipActive": false,
    "registeredAt": "2023-02-01T10:00:00.000Z",
    "borrowedBooks": [1]
  }
  ```
- **Пример ответа (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "Обновленное имя",
    "membershipActive": false,
    "registeredAt": "2023-02-01T10:00:00.000Z",
    "borrowedBooks": [1]
  }
  ```
- **Пример ответа (404 Not Found)**:
  ```json
  { "error": "Reader not found" }
  ```

#### `PATCH /readers/:id`
- **Описание**: Частично обновить существующего читателя по его ID. Передаются только те поля, которые нужно изменить.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор читателя.
- **Тело запроса (application/json)**:
  ```json
  {
    "membershipActive": false
  }
  ```
- **Пример ответа (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "Alice Smith",
    "membershipActive": false,
    "registeredAt": "2023-01-15T10:30:00.000Z",
    "borrowedBooks": [2]
  }
  ```
- **Пример ответа (404 Not Found)**:
  ```json
  { "error": "Reader not found" }
  ```

#### `DELETE /readers/:id`
- **Описание**: Удалить читателя по его ID.
- **Параметры запроса**: 
  - `id`: number (в пути) - Уникальный идентификатор читателя.
- **Пример ответа (200 OK)**:
  ```json
  { "message": "Reader deleted" }
  ```
- **Пример ответа (404 Not Found)**:
  ```json
  { "error": "Reader not found" }
  ```

## Запуск приложения

1.  Убедитесь, что Node.js установлен.
2.  Установите зависимости (не требуются, так как используются нативные модули).
3.  Запустите сервер:
    ```bash
    node src/index.js
    ```
4.  Сервер прослушивает порт 5001.
