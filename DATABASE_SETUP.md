# Railway uchun Database Setup

## Muammo
Railway platformasida file system read-only bo'lgani uchun JSON fayllariga yozib bo'lmaydi.

## Yechim - PostgreSQL Database

### 1. Railway'da PostgreSQL qo'shish

1. Railway dashboard'ga kiring
2. Loyihangizni oching
3. "New" -> "Database" -> "Add PostgreSQL" tugmasini bosing
4. Database yaratilgandan keyin `DATABASE_URL` environment variable avtomatik qo'shiladi

### 2. Kerakli packagelarni o'rnatish

```bash
npm install pg
npm install --save-dev @types/pg
```

### 3. Database schema yaratish

Railway PostgreSQL'da query ishlatish uchun:
- Railway dashboard'da PostgreSQL serviceni oching
- "Data" tabini oching
- Quyidagi SQL query'ni run qiling:

```sql
-- Learning Articles table
CREATE TABLE IF NOT EXISTS learning_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT
);

-- Mini Projects table
CREATE TABLE IF NOT EXISTS mini_projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT
);

-- Programming Articles table
CREATE TABLE IF NOT EXISTS programming_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT
);

-- Teachers Articles table
CREATE TABLE IF NOT EXISTS teachers_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  UNIQUE(article_id, user_id)
);

-- Featured table
CREATE TABLE IF NOT EXISTS featured (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL,
  source TEXT NOT NULL
);
```

### 4. Mavjud ma'lumotlarni migrate qilish

JSON fayllaridagi ma'lumotlarni database'ga ko'chirish uchun migration script ishlatish kerak.

### 5. Deploy qilish

```bash
git add .
git commit -m "Add PostgreSQL support for Railway"
git push
```

Railway avtomatik deploy qiladi va DATABASE_URL environment variable'ni ishlatadi.
