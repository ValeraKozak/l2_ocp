# Лабораторна робота 2

## Тема

Вебзастосунок для продажу велосипедів, побудований з використанням:

- `MVC`
- `Builder`
- `Facade`

Згідно із завданням, користувач може:

- зареєструватися на сайті
- пройти перевірку введених даних
- зберегти свої дані в базі даних
- отримати лист підтвердження реєстрації
- замовити як звичайний велосипед, так і електровелосипед

Також у методичці прямо вказано, що:

- для створення замовлення звичайного велосипеда і електровелосипеда має використовуватися один і той самий метод
- `Product` має бути базовим класом для обох типів велосипедів
- `Builder` має бути реалізований за схемою `Director -> Builder -> ConcreteBuilder -> Product`

---

## Що Робить Цей Проєкт

Цей проєкт є невеликим вебмагазином під назвою `VeloCity Store`.

У ньому є:

- форма реєстрації
- форма оформлення замовлення
- каталог велосипедів
- збереження користувачів і замовлень у `MongoDB`
- надсилання реального листа підтвердження через `SMTP`

Застосунок побудований на `Node.js`, `Express`, `EJS`, `MongoDB (Mongoose)` та `Nodemailer`.

---

## Чому Було Обрано MongoDB

Для цієї лабораторної роботи використано `MongoDB`, тому що:

- вона вже була встановлена і запущена на ПК
- вона дуже зручно інтегрується з `Node.js`
- її цілком достатньо для зберігання користувачів і замовлень у межах цього завдання
- вона дозволяє зосередитися на архітектурі та патернах, а не на складному SQL-налаштуванні

Підключення до бази даних налаштоване у [src/config/database.js](/e:/архітПЗ/l2/src/config/database.js:1).

---

## Технології

- `Node.js`
- `Express`
- `EJS`
- `MongoDB`
- `Mongoose`
- `Nodemailer`

---

## Структура Проєкту

```text
l2/
├── app.js
├── package.json
├── .env
├── public/
│   └── styles.css
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── HomeController.js
│   │   └── OrderController.js
│   ├── data/
│   │   ├── models/
│   │   │   ├── Order.js
│   │   │   └── User.js
│   │   └── repositories/
│   │       ├── OrderRepository.js
│   │       └── UserRepository.js
│   ├── domain/
│   │   ├── builders/
│   │   │   ├── BicycleBuilder.js
│   │   │   ├── BicycleDirector.js
│   │   │   ├── BuilderRegistry.js
│   │   │   ├── ElectricBicycleBuilder.js
│   │   │   └── StandardBicycleBuilder.js
│   │   └── products/
│   │       ├── Bicycle.js
│   │       ├── ElectricBicycle.js
│   │       └── Product.js
│   ├── facades/
│   │   ├── OrderFacade.js
│   │   └── RegistrationFacade.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── homeRoutes.js
│   │   └── orderRoutes.js
│   ├── services/
│   │   ├── EmailService.js
│   │   ├── ProductCatalogService.js
│   │   └── ValidationService.js
│   └── views/
│       └── index.ejs
└── README.md
```

---

## MVC У Цьому Проєкті

### Model

Шар `Model` відповідає за зберігання та отримання даних.

Файли:

- [src/data/models/User.js](/e:/архітПЗ/l2/src/data/models/User.js:1)
- [src/data/models/Order.js](/e:/архітПЗ/l2/src/data/models/Order.js:1)
- [src/data/repositories/UserRepository.js](/e:/архітПЗ/l2/src/data/repositories/UserRepository.js:1)
- [src/data/repositories/OrderRepository.js](/e:/архітПЗ/l2/src/data/repositories/OrderRepository.js:1)

Що зберігається:

- `User`: ПІБ, email, телефон, хеш пароля
- `Order`: ім'я клієнта, email, телефон, інформація про товар, ціна, тип велосипеда

### View

Шар `View` відповідає за відображення вебсторінки.

Файли:

- [src/views/index.ejs](/e:/архітПЗ/l2/src/views/index.ejs:1)
- [public/styles.css](/e:/архітПЗ/l2/public/styles.css:1)

Що містить представлення:

- форму реєстрації
- форму оформлення замовлення
- каталог велосипедів
- повідомлення про успіх або помилки
- останні реєстрації
- останні замовлення

### Controller

Шар `Controller` приймає запити, викликає бізнес-логіку та повертає відповідь.

Файли:

- [src/controllers/HomeController.js](/e:/архітПЗ/l2/src/controllers/HomeController.js:1)
- [src/controllers/AuthController.js](/e:/архітПЗ/l2/src/controllers/AuthController.js:1)
- [src/controllers/OrderController.js](/e:/архітПЗ/l2/src/controllers/OrderController.js:1)

Обов'язки:

- `HomeController` рендерить головну сторінку
- `AuthController` обробляє реєстрацію користувача
- `OrderController` обробляє замовлення велосипеда

### Routes

Файли:

- [src/routes/homeRoutes.js](/e:/архітПЗ/l2/src/routes/homeRoutes.js:1)
- [src/routes/authRoutes.js](/e:/архітПЗ/l2/src/routes/authRoutes.js:1)
- [src/routes/orderRoutes.js](/e:/архітПЗ/l2/src/routes/orderRoutes.js:1)

Використані маршрути:

- `GET /` — відобразити головну сторінку
- `POST /register` — зареєструвати користувача
- `POST /orders` — створити замовлення

---

## Патерн Facade У Цьому Проєкті

### Навіщо Було Використано Facade

У завданні є сценарії реєстрації та оформлення замовлення, які складаються з кількох кроків.
Щоб не розміщувати всю логіку всередині контролерів, було використано фасад, який приховує внутрішні деталі та надає один простий метод.

### RegistrationFacade

Файл:

- [src/facades/RegistrationFacade.js](/e:/архітПЗ/l2/src/facades/RegistrationFacade.js:1)

Цей фасад виконує повний сценарій реєстрації:

1. приймає дані користувача
2. нормалізує введення
3. валідує дані
4. перевіряє, чи не існує вже такий email
5. хешує пароль
6. зберігає користувача в базі даних
7. надсилає лист підтвердження
8. якщо надсилання листа не вдалося, видаляє користувача з бази даних

Чому це добре:

- контролер залишається невеликим
- сценарій реєстрації зосереджений в одному місці
- логіку легше пояснювати на захисті

### OrderFacade

Файл:

- [src/facades/OrderFacade.js](/e:/архітПЗ/l2/src/facades/OrderFacade.js:1)

Цей фасад виконує повний сценарій оформлення замовлення:

1. приймає дані з форми
2. нормалізує введення
3. валідує дані
4. перевіряє, чи зареєстрований користувач
5. знаходить вибраний велосипед у каталозі
6. створює продукт через `Director + Builder`
7. зберігає замовлення в базі даних

Чому це добре:

- логіка створення замовлення відокремлена від HTTP-рівня
- фасад координує кілька модулів в одному місці
- контролер викликає лише один метод

---

## Патерн Builder У Цьому Проєкті

### Чому Його Було Перероблено

Спочатку був лише один клас, схожий на builder.  
Після строгого порівняння з діаграмою в методичці структура була перероблена, щоб точніше відповідати вимогам.

### Структура Builder

Файли:

- [src/domain/builders/BicycleBuilder.js](/e:/архітПЗ/l2/src/domain/builders/BicycleBuilder.js:1)
- [src/domain/builders/BicycleDirector.js](/e:/архітПЗ/l2/src/domain/builders/BicycleDirector.js:1)
- [src/domain/builders/StandardBicycleBuilder.js](/e:/архітПЗ/l2/src/domain/builders/StandardBicycleBuilder.js:1)
- [src/domain/builders/ElectricBicycleBuilder.js](/e:/архітПЗ/l2/src/domain/builders/ElectricBicycleBuilder.js:1)
- [src/domain/products/Product.js](/e:/архітПЗ/l2/src/domain/products/Product.js:1)
- [src/domain/products/Bicycle.js](/e:/архітПЗ/l2/src/domain/products/Bicycle.js:1)
- [src/domain/products/ElectricBicycle.js](/e:/архітПЗ/l2/src/domain/products/ElectricBicycle.js:1)

### Ролі

#### Product

[src/domain/products/Product.js](/e:/архітПЗ/l2/src/domain/products/Product.js:1)

Це базовий клас, який прямо вимагається методичкою.

Він містить спільні властивості:

- тип (`kind`)
- модель
- бренд
- ціна
- матеріал рами
- розмір коліс
- колір
- електричні характеристики, якщо вони потрібні

#### Concrete Products

- [Bicycle.js](/e:/архітПЗ/l2/src/domain/products/Bicycle.js:1) — звичайний велосипед
- [ElectricBicycle.js](/e:/архітПЗ/l2/src/domain/products/ElectricBicycle.js:1) — електровелосипед

Обидва класи наслідуються від `Product`.

#### Abstract Builder

[src/domain/builders/BicycleBuilder.js](/e:/архітПЗ/l2/src/domain/builders/BicycleBuilder.js:1)

Визначає контракт:

- `reset()`
- `setBaseProperties()`
- `setElectricProperties()`
- `getProduct()`

#### ConcreteBuilder Для Звичайного Велосипеда

[src/domain/builders/StandardBicycleBuilder.js](/e:/архітПЗ/l2/src/domain/builders/StandardBicycleBuilder.js:1)

Створює звичайний велосипед.

#### ConcreteBuilder Для Електровелосипеда

[src/domain/builders/ElectricBicycleBuilder.js](/e:/архітПЗ/l2/src/domain/builders/ElectricBicycleBuilder.js:1)

Створює електровелосипед і заповнює додаткові електричні характеристики:

- потужність двигуна
- ємність батареї

#### Director

[src/domain/builders/BicycleDirector.js](/e:/архітПЗ/l2/src/domain/builders/BicycleDirector.js:1)

Цей клас створює продукт через один спільний метод:

- `construct(builder, selection)`

Цей момент важливо підкреслити на захисті:

Один і той самий метод `Director` використовується для створення:

- замовлення звичайного велосипеда
- замовлення електровелосипеда

Це прямо виконує вимогу з методички.

### Вибір Builder

Файл:

- [src/domain/builders/BuilderRegistry.js](/e:/архітПЗ/l2/src/domain/builders/BuilderRegistry.js:1)

Цей клас пов'язує тип велосипеда з потрібним concrete builder.

Це покращує розширюваність:

- якщо з'явиться новий тип велосипеда, можна додати новий builder
- `OrderFacade` не потрібно буде змінювати

---

## Принцип Open/Closed

У проєкті також частково продемонстровано `OCP`.

Найбільш помітне місце:

- [src/domain/builders/BuilderRegistry.js](/e:/архітПЗ/l2/src/domain/builders/BuilderRegistry.js:1)

Чому:

- нові типи builder можна додавати, розширюючи реєстр
- `Director` залишається без змін
- сімейство продуктів можна розширювати через нові підкласи `Product`

Це означає, що система побудови продуктів стала більш відкритою до розширення і більш закритою до модифікації, ніж у першій версії.

---

## Сценарій Реєстрації

Сценарій реєстрації, який вимагається методичкою, реалізований саме в такому порядку:

1. Користувач заповнює форму реєстрації на сторінці.
2. Контролер передає дані до `RegistrationFacade`.
3. `ValidationService` перевіряє дані.
4. `UserRepository` зберігає користувача в MongoDB.
5. `EmailService` надсилає лист підтвердження.

Важлива деталь реалізації:

- якщо надсилання листа не вдається, збережений користувач видаляється назад із бази даних

Це зроблено для того, щоб сценарій залишався логічно цілісним.

Файли, які беруть участь:

- [src/views/index.ejs](/e:/архітПЗ/l2/src/views/index.ejs:1)
- [src/controllers/AuthController.js](/e:/архітПЗ/l2/src/controllers/AuthController.js:1)
- [src/facades/RegistrationFacade.js](/e:/архітПЗ/l2/src/facades/RegistrationFacade.js:1)
- [src/services/ValidationService.js](/e:/архітПЗ/l2/src/services/ValidationService.js:1)
- [src/data/repositories/UserRepository.js](/e:/архітПЗ/l2/src/data/repositories/UserRepository.js:1)
- [src/services/EmailService.js](/e:/архітПЗ/l2/src/services/EmailService.js:1)

---

## Сценарій Створення Замовлення

Сценарій замовлення працює так:

1. Користувач вибирає велосипед на сторінці.
2. `OrderController` передає дані до `OrderFacade`.
3. `ValidationService` перевіряє дані замовлення.
4. Система перевіряє, чи користувач зареєстрований.
5. Інформація про товар береться з каталогу.
6. `BuilderRegistry` вибирає потрібний builder.
7. `BicycleDirector` викликає один спільний метод для побудови продукту.
8. Замовлення зберігається в MongoDB.

Файли, які беруть участь:

- [src/views/index.ejs](/e:/архітПЗ/l2/src/views/index.ejs:1)
- [src/controllers/OrderController.js](/e:/архітПЗ/l2/src/controllers/OrderController.js:1)
- [src/facades/OrderFacade.js](/e:/архітПЗ/l2/src/facades/OrderFacade.js:1)
- [src/services/ProductCatalogService.js](/e:/архітПЗ/l2/src/services/ProductCatalogService.js:1)
- [src/domain/builders/BuilderRegistry.js](/e:/архітПЗ/l2/src/domain/builders/BuilderRegistry.js:1)
- [src/domain/builders/BicycleDirector.js](/e:/архітПЗ/l2/src/domain/builders/BicycleDirector.js:1)

---

## Валідація

Валідація реалізована у:

- [src/services/ValidationService.js](/e:/архітПЗ/l2/src/services/ValidationService.js:1)

### Валідація Реєстрації

Перевіряється:

- ПІБ не порожній
- формат email коректний
- формат телефону коректний
- довжина пароля не менше 6 символів

### Валідація Замовлення

Перевіряється:

- ім'я клієнта не порожнє
- формат email коректний
- формат телефону коректний
- велосипед вибраний

---

## Робота З Базою Даних

### Модель User

Файл:

- [src/data/models/User.js](/e:/архітПЗ/l2/src/data/models/User.js:1)

Поля, які зберігаються:

- `fullName`
- `email`
- `phone`
- `password`

Примітка:

- пароль зберігається у вигляді хешу, а не відкритим текстом

### Модель Order

Файл:

- [src/data/models/Order.js](/e:/архітПЗ/l2/src/data/models/Order.js:1)

Поля, які зберігаються:

- дані клієнта
- тип велосипеда
- модель і бренд
- рама і розмір коліс
- колір
- ціна
- електричні характеристики, якщо вони є

### Репозиторії

Файли:

- [src/data/repositories/UserRepository.js](/e:/архітПЗ/l2/src/data/repositories/UserRepository.js:1)
- [src/data/repositories/OrderRepository.js](/e:/архітПЗ/l2/src/data/repositories/OrderRepository.js:1)

Репозиторії ізолюють операції з базою даних від логіки контролерів і фасадів.

---

## Надсилання Листів

Надсилання листів реалізоване у:

- [src/services/EmailService.js](/e:/архітПЗ/l2/src/services/EmailService.js:1)

Що робить цей сервіс:

- створює транспорт через `Nodemailer`
- надсилає лист підтвердження після успішної реєстрації
- підтримує реальне SMTP-надсилання
- має і `text`, і `html` версії листа

Якщо SMTP не налаштований, проєкт може зберігати прев'ю листів локально в `sent-emails/`.

У поточному налаштуванні використовується Gmail SMTP через `App Password`.

---

## Покращення Безпеки, Які Було Зроблено Під Час Розробки

У процесі доопрацювання було покращено кілька речей:

- пароль хешується перед збереженням
- пароль більше не повертається назад у HTML-форму
- реєстрація відкочується, якщо лист не вдалося відправити
- валідація замовлення перевіряє також телефон

Ці моменти корисно згадати на захисті, бо вони показують усвідомлені архітектурні рішення.

---

## Як Запустити Проєкт

### 1. Встановити залежності

```powershell
npm install
```

### 2. Налаштувати `.env`

Приклад:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/bicycle_store_lab2
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM=your_email@gmail.com
```

### 3. Запустити застосунок

```powershell
npm start
```

### 4. Відкрити в браузері

```text
http://localhost:3000
```

---

## Як Показувати Проєкт На Захисті

Рекомендована послідовність демонстрації:

1. Відкрити головну сторінку.
2. Показати форму реєстрації.
3. Зареєструвати нового користувача.
4. Показати, що валідація працює при неправильних даних.
5. Показати, що користувач з'являється в MongoDB або в блоці останніх реєстрацій.
6. Показати лист підтвердження в Gmail.
7. Вибрати велосипед і створити замовлення.
8. Показати, що можна замовити і звичайний, і електровелосипед.
9. Пояснити, що обидва варіанти створюються одним і тим самим методом `Director.construct(...)`.
10. Відкрити builder-класи і показати:
    - `Product`
    - `Bicycle`
    - `ElectricBicycle`
    - `BicycleBuilder`
    - `StandardBicycleBuilder`
    - `ElectricBicycleBuilder`
    - `BicycleDirector`

---

## Що Говорити Про Кожен Патерн

### MVC

`MVC` використано для розділення інтерфейсу, обробки запитів і логіки роботи з даними.
Це робить проєкт чистішим і зручнішим для підтримки.

### Facade

`Facade` використано для приховування багатокрокових сценаріїв за одним простим методом.
Особливо це корисно для:

- реєстрації
- створення замовлення

### Builder

`Builder` використано тому, що застосунок має створювати різні варіанти продукту за спільним процесом побудови.

Один і той самий метод `Director` створює:

- звичайний велосипед
- електровелосипед

