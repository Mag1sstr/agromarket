# React + Vite

## Тестирование

- `npm test` — компонентные тесты Vitest и Testing Library, включая моки API.
- `npm run coverage` — запуск тестов с отчётом покрытия.
- `npm run e2e` — E2E-тесты Playwright на локальном приложении.
- `PRODUCTION_URL=https://ваш-сайт.vercel.app npm run e2e:prod` — E2E-тесты на продакшене. В GitHub Actions запуск ежедневный и вручную; добавьте переменную `PRODUCTION_URL` в Actions Variables.

## Лабораторная работа 10

- 15 компонентных тестов: карточка товара, форма входа, каталог с мокированным API и JWT-заголовок.
- Найдены и исправлены ошибки: каталог не обрабатывал HTTP-ошибки, карточка ожидала другое имя callback, поля входа не имели связанных label, HTTP 401 не блокировал успешный вход.
- Покрытие строк: 64%. Хуже всего покрыта `AddProductForm` (32% строк), потому что тесты её сценариев ещё не добавлены.
- Компонентные тесты: 1,35 секунды; локальные E2E с API-моком: 2,3 секунды (примерно в 1,7 раза медленнее). E2E на production не запускались: URL production-сайта не указан.
- В первом trace было видно, что карточки не появились, пока экран оставался в состоянии загрузки; другой упавший селектор находил два поля «Имя». Исправления: мок API для локального прогона и уникальные селекторы полей.
- E2E не запускаются на каждый PR, потому что проверяют текущую production-версию, которая ещё не содержит код PR.
- Локальные E2E работают с мокированным API и пользователей не создают. Число тестовых покупателей в production не проверялось; настроенный production-прогон будет создавать уникального пользователя при каждом успешном запуске.
- ИИ использовался для реализации и проверки настроек тестирования.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
