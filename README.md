# Leanly — Fitness Web-App

**Leanly** — это современное full-stack веб-приложение для комплексного отслеживания тренировок, детального контроля питания (КБЖУ) и глубокой аналитики прогресса. Создано для тех, кто хочет автоматизировать свой путь к спортивным целям и избавиться от рутины при ведении дневников активности.

---

## 🌐 Полезные ссылки

* **Live Demo:** [https://leanly-mu.vercel.app/](https://leanly-mu.vercel.app/)
* **Репозиторий бэкенда:** [LeanlyBackend]([https://github.com/nekoryn/LeanlyBack)

---

## 🛠️ Технологический Стек (Tech Stack)

### Frontend
* **Core:** Vue.js 3 (Composition API), TypeScript
* **State Management:** Pinia
* **Styles & UI:** Tailwind CSS, Vue-Toastification (уведомления)
* **Analytics:** Chart.js (динамические интерактивные графики)

### Backend & Database
* **Runtime:** Node.js, Express
* **Architecture:** Многослойная архитектура (Layered Architecture: Routes - Controllers - Services)
* **Validation:** Zod (строгая валидация входящих DTO/данных)
* **Database:** MySQL

### DevOps & Infrastructure
* **Frontend Hosting:** Vercel (CI/CD из ветки `main`)
* **Backend Server:** Выделенный сервер (Ubuntu VPS)
* **Process Management:** PM2 (обеспечение отказоустойчивости 24/7 и автозапуск)
* **Web Server:** Nginx в режиме Reverse Proxy
* **Security:** SSL-сертификаты **Let's Encrypt** (автоматический выпуск и обновление через Certbot), полная изоляция базы данных (`bind-address: 127.0.0.1`)

---

## 📸 Обзор Функционала и Интерфейса

<details>
<summary><b>📊 1. Дэшборд</b></summary>

Центральный хаб пользователя, агрегирующий всю ключевую информацию за текущий день.

| Компонент | Визуализация | Описание |
| :--- | :--- | :--- |
| **Прогресс-бары** | ![Прогресс](/screenshots/progressBars.png) | Наглядные трекеры выполнения дневных норм калорий, воды и активности. |
| **Контроль веса** | ![Обновление веса](/screenshots/dashbordWeight.png) | Форма для быстрого замера веса с мини-графиком текущего тренда. |
| **Итоги дня** | ![Итоги дня](/screenshots/dashbordStats.png) | Логирование шагов, сожженных калорий и выпитой воды.  |

</details>

<details>
<summary><b>🥗 2. Дневник питания</b></summary>

Модуль для детального учета съеденного с разбивкой по макронутриентам.

| Компонент | Визуализация | Описание |
| :--- | :--- | :--- |
| **Добавление блюда** | ![Форма дневника](/screenshots/mealsDiaryAdd.png) | Форма с валидацией для распределения приемов пищи (Завтрак, Обед, Ужин, Перекус). |
| **Сетка рациона** | ![Дневник питания](/screenshots/mealsDiary.png) | Детальный список приемов пищи с автоматическим подсчетом белков, жиров и углеводов. |

</details>

<details>
<summary><b>📈 3. Аналитика и Персонализация</b></summary>

Разделы для отслеживания долгосрочного прогресса и кастомизации интерфейса под пользователя.

| Раздел | Визуализация | Описание |
| :--- | :--- | :--- |
| **Профиль** | ![Профиль](/screenshots/profile.png) | Персональная карточка пользователя с его текущими показателями. |
| **График веса** | ![График веса](/screenshots/weightGraph.png) | Динамический график изменения массы тела для отслеживания прогресса на дистанции. |
| **График шагов** | ![график шагов](/screenshots/stepsGraph.png) | Динамический график суммы шагов по дням. |
| **Настройки** | ![настройки](/screenshots/profileSettings.png) | Настройки профиля. |
| **Темизация** | ![настройки отображения](/screenshots/appearanceSettings.png) | Поддержка темной и светлой тем. |

**Пример интерфейса в светлой теме:**
![Светлая тема](/screenshots/lightTheme.png)

</details>

---

## 🗄️ Архитектура и Структура БД (MySQL)

- Таблица users:
- - uid (PRIMARY KEY) (INT 11) (A_I)
- - nickname (UNIQE) (VARCHAR 100)
- - email (UNIQE) (VARCHAR 100)
- - password (VARCHAR 255)
- - userWeight (DECIMAL 5,2)
- - userHeight (DECIMAL 5,2)
- - userAge (INT 11)
- - gender (ENUM ('male', 'female'))
- - activity (ENUM ('passive', 'low', 'medium', 'high', 'ultra'))
- - goal (ENUM ('fit', 'weightMaintenance', 'bodyBuild'))
- - goalWeight (DECIMAL 5,2)
- - createdAt (TIMESTAMP) (current_timestamp())
- - updatedAt (TIMESTAMP) (ON UPDATE CURRENT_TIMESTAMP()) (current_timestamp())
- - userStartWeight (DECIMAL 5,2)
- Таблица weight_history:
- - wid (PRIMARY KEY) (INT 11) (A_I)
- - user_id (FOREGIN KEY) (INT 11)
- - weight (DECIMAL 5,2)
- - created_at (TIMESTAMP) (current_timestamp())
- таблица meals:
- - mid (PRIMARY KEY) (INT 11) (A_I)
- - user_id (FOREGIN KEY) (INT 11)
- - meal_type (ENUM ('breakfast', 'snack', 'lunch', 'dinner'))
- - meal_name (VARCHAR 255)
- - calories (INT 11)
- - proteins (DECIMAL 5,2)
- - fats (DECIMAL 5,2)
- - carbs (DECIMAL 5,2)
- - created_at (TIMESTAMP) (current_timestamp())
- - selected_date (DATE)
- таблица daily_stats:
- - did (PRIMARY KEY) (INT 11) (A_I)
- - user_id (FOREGIN KEY) (INT 11)
- - summary_date (FOREGIN KEY) (DATE)
- - steps (INT 11)
- - burned_calories (INT 11)
- - water_ml (INT 11)
- - created_at (TIMESTAMP) (current_timestamp())

## 🚀 Локальный запуск

Для локального развертывания проекта вам понадобятся установленные npm, Node.js и СУБД MySQL.

### 1. Подготовка переменных окружения (.env)

В корневой папке репозитория фронтенда (`Leanly`) создайте файл `.env`:

`VITE_API_BASE_URL=http://localhost:3000/api`

В корневой папке репозитория бэкенда (`LeanlyBACKEND`) создайте файл `.env`:

- `JWT_SECRET=your_super_secret_jwt_key_here`

- `DB_HOST=localhost`

- `DB_USER=your_mysql_user`

- `APP_USER_PASSWORD=your_mysql_password`

- `DB_NAME=dbName`

### 2. Клонирование и запуск

Выполните следующие команды в терминале для развертывания проекта:

- Клонирование репозиториев:
    `git clone git@github.com:zularx/Leanly.git`
    `git clone git@github.com:zularx/LeanlyBACKEND.git`
- Запуск FRONTEND:
    `cd Leanly`
    `npm install`
    `npm run dev`
- Запуск BACKEND:
    `cd LeanlyBACKEND`
    `npm install`
    `node server.js`

После успешного выполнения команд фронтенд будет доступен по адресу `http://localhost:5173`, а локальный бэкенд развернется на `http://localhost:3000`.
