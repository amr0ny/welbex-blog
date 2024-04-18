# welbex-blog
Этот репозиторий представляет full-stack приложение-блог, в которое входит frontend и backend части, для функционирования требуется деплой базы данных PostgreSQL, база данных Postgres.

## Stack
- Frontend написан с использованием фреймворка `create-react-app` – `NodeJs/React/React-Bootstrap`
– Backend написан с использованием `NodeJs/Express/Sequelize`
## Структура 

## Развертка приложения
Блог состоит из двух локальных серверов: один деплоится на порте 3010, другой - 3000.
Для развертки приложения требуется открыть териминал в корневой директории репозитория, а далее выполнить следующие команды.

-Деплой серверной части:
```bash
cd ./backend
npm start
```
Деплой клиента:
```bash
cd ./frontend
npm start
```
Для настройки подключения к базе данных отредактируйте файл: `./backend/config.js`
### Приложение состоит из трех страниц:
- Форма регистрации
- Форма авторизации
- Страницы блога

Для начала использования требуется зарегистрироваться на странице http://localhost:3000/register
Для повторной аунтентификации и входа используется страница http://localhost:3000/local

# Документация по эндпоинтам серверной части:

## POST-запросы
## Эндпоинт `/api/usersregister`

Этот эндпоинт отвечает за регистрацию нового пользователя в приложении-блоге.

### Методы

`POST`

### Параметры

От клиента ожидаются следующие параметры:

| Параметр | Описание |
|----------|-------------|
| `name` | Имя пользователя. |
| `email` | Email адрес пользователя. |
| `password` | Пароль пользователя. |

### Ответы

Эндпоинт отправляет ответ клиенту в формате JSON.

#### Успешный ответ

Если регистрация прошла успешно, эндпоинт вернет следующие данные:

| Параметр | Описание |
|----------|-------------|
| `token` | JWT токен, который клиент может использовать для авторизации в дальнейшем. |

#### Ошибка регистрации

Если при регистрации произошла ошибка (например, пользователь с таким email адресом уже существует), эндпоинт вернет следующую ошибку:

| Параметр | Описание |
|----------|-------------|
| `error` | Сообщение об ошибке. |


## Эндпоинт `/api/userslogin`

Этот эндпоинт отвечает за аутентификацию пользователя в приложении-блоге.

### Методы

`POST`

### Параметры

От клиента ожидаются следующие параметры:

| Параметр | Описание |
|----------|-------------|
| `email` | Email адрес пользователя. |
| `password` | Пароль пользователя. |

### Ответы

Эндпоинт отправляет ответ клиенту в формате JSON.

#### Успешный ответ

Если аутентификация прошла успешно, эндпоинт вернет следующие данные:

| Параметр | Описание |
|----------|-------------|
| `token` | JWT токен, который клиент может использовать для авторизации в дальнейшем. |

#### Ошибка аутентификации

Если введен неправильный пароль, эндпоинт вернет следующую ошибку:

| Параметр | Описание |
|----------|-------------|
| `error` | Сообщение об ошибке. |

## Эндпоинт `/api/createpost`

Создает новый пост в блоге.

### HTTP запрос

`POST /api/createpost`

### Параметры запроса

Параметры запроса отправляются в теле запроса в формате JSON.

| Параметр  | Тип    | Обязательный | Описание                                   |
| --------- | ------ | ------------ | ------------------------------------------ |
| `message` | String | Да           | Текст сообщения поста                      |

### Ответ

В случае успеха сервер вернет статус 200 и JSON объект со свойствами:

| Свойство | Тип    | Описание                                                                 |
| -------- | ------ | ------------------------------------------------------------------------|
| `message`| String | Сообщение о успешном создании поста.                                    |

Если пользователь не авторизован, сервер вернет статус 401 и JSON объект со свойствами:

| Свойство | Тип    | Описание                                                         |
| -------- | ------ | ---------------------------------------------------------------- |
| `message`| String | Сообщение об ошибке, указывающее на неавторизованного пользователя. |

Если в процессе создания поста произошла ошибка, сервер вернет статус 500 и JSON объект со свойствами:

| Свойство | Тип    | Описание                                                           |
| -------- | ------ | ------------------------------------------------------------------  |
| `message`| String | Сообщение об ошибке, указывающее на неудачу создания поста.       |

## Эндпоинт `/api/deletepost`
###Этот эндпоинт позволяет авторизованному пользователю удалить свой пост.

### Параметры запроса
| Параметр  | Тип    | Обязательный | Описание                                   |
| --------- | ------ | ------------ | ------------------------------------------ |
| `post_id` | UUID   | Да             | Идентификатор поста.                     |


## Эндпоинт `/api/editpost`

Этот эндпоинт позволяет авторизованному пользователю отредактировать свой пост.

### Параметры запроса

| Параметр | Тип    | Описание                         |
| -------- | ------ | -------------------------------- |
| `post_id`   | string | Идентификатор редактируемого поста |
| `message`   | string | Текст сообщения в посте            |

## GET-запросы
## Эндпоинт `/api/posts`

Данный эндпоинт возвращает список постов блога. 

### HTTP методы

`GET`

### Параметры запроса

- `limit` - количество постов, которое нужно вернуть (опционально)
- `offset` - смещение, начиная с которого нужно вернуть посты (опционально)

### Ответ

Возвращает объект JSON со следующими полями:

- `count` - общее количество постов в блоге
- `posts` - массив объектов постов, каждый из которых содержит следующие поля:
    - `post_id` - уникальный идентификатор поста
    - `name` - имя пользователя, создавшего пост
    - `message` - текст поста
    - `timestamp` - временная метка создания поста в формате `YYYY-MM-DD HH:MM:SS`

Если посты не найдены, вернется ошибка со статусом `404`.

## Midleware функции
- Установка заголовков для CORS
- JSON-парсинг тела запроса
- Валидация JWT-токена для эндпоинтов `/api/createpost`, `/api/deletepost/`, `/api/editpost/`
