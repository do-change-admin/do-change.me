# Code conventions

## Документация в коде (многострочные комменты в формате TSDoc)

1. Документация **должна** начинаться с большой буквы.
2. Документация **должна** заканчиваться точкой.
3. Документацию **желательно** писать на английском языке.

## Backend

1. Если вы выбрасываете в методе исключение, **обязательно** добавить в документации к нему слово `Unsafe`.

# Available Run Options

## Run DB in Docker + Next Locally

**Steps:**

1. Start Database:

```bash
docker-compose --profile db up -d
```

2. Start Next:

```bash
npm run dev
```

3. There are:

-   localhost:3000 - next
-   http://localhost:8081/ - pgadmin

## Run Full Application in Docker (Next + DB)

**Steps:**

1. Start DB + Next:

```bash
docker-compose --profile db --profile app up -d
```

2. There are:

-   localhost:3000 - next
-   http://localhost:8081/ - pgadmin

# PgAdmin

-   URL: http://localhost:8081
-   Login credentials:

```bash
Email: admin@example.com
Password: admin123

```

-   Database connection credentials:

```bash
Host: db
Username: postgres
Password: postgres
Connection string: postgresql://postgres:postgres@localhost:5432/mydb

```
