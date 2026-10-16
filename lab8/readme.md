# АгроМаркет API — Лабораторная работа (Тестирование и CI)

В данном проекте реализовано разделение серверной логики для тестирования, написаны интеграционные и unit-тесты с использованием **Vitest** и **Supertest**, а также настроена отдельная тестовая база данных.

---

## 🛠 Архитектура проекта

- **`app.js`** — содержит инициализацию Express-приложения, подключение middleware, роутов и обработчика ошибок. Экспортирует `app` без вызова `app.listen`, что позволяет тестировать приложение напрямую через Supertest.
- **`server.js`** — отвечает исключительно за загрузку переменных окружения, проверку `JWT_SECRET` и запуск сервера (`app.listen`).
- **`vitest.config.js`** — конфигурационный файл Vitest, загружающий переменные из `.env.test` и управляющий последовательным запуском тестов (`fileParallelism: false`).
- **`tests/`** — папка с автотестами и вспомогательными утилитами:
  - `globalSetup.js` — защитный механизм, проверяющий, что тесты запускаются строго на тестовой базе (`agromarket_test`), и выполняющий её инициализацию.
  - `setup.js` — закрывает пул соединений с базой после завершения тестов.
  - `helpers.js` — вспомогательные функции для генерации уникальных email (`uniqueEmail`) и получения токенов (`getUserToken`, `getAdminToken`).
  - `health.test.js`, `products.test.js`, `auth.test.js`, `access.test.js`, `middleware.test.js` — набор интеграционных и unit-тестов.

---

## 📋 Инструкция по настройке и запуску

### 1. Подготовка базы данных

Убедитесь, что ваш локальный сервер PostgreSQL запущен, и создайте отдельную тестовую базу данных:

```bash
createdb -U postgres agromarket_test
```
2. Настройка переменных окружения
Создайте в папке server/ файл .env.test (на основе вашего .env), указав в строке подключения имя пользователя, пароль и базу agromarket_test:

Фрагмент кода
DATABASE_URL=postgres://postgres:ТВОЙ_ПАРОЛЬ@localhost:5432/agromarket_test
NODE_ENV=test
JWT_SECRET=test-secret-only-for-local-tests
JWT_EXPIRES_IN=2h
ADMIN_EMAIL=admin@test.kz
ADMIN_PASSWORD=Admin12345
CORS_ORIGIN=http://localhost:5173
Защитный механизм конфигурации выдаст ошибку, если в названии базы данных не окажется слова test.

3. Инициализация таблиц в тестовой базе
Из каталога server/ выполните команду для создания структуры таблиц в тестовой БД:

Bash
psql -U postgres -d agromarket_test -f db/schema.sql
4. Установка зависимостей
Установите основные зависимости и инструменты для разработки (Vitest, Supertest):

Bash
npm install
npm install --save-dev vitest supertest @vitest/coverage-v8
5. Запуск тестов
Запуск всех тестов (один раз):

Bash
npm test
