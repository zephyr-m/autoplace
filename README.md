# AutoPlace

Проект про подписки на фильтры каталога авто.

Пользователь выбирает фильтр на сайте, создаёт подписку, а когда во внутреннем каталоге появляется подходящая машина, система создаёт уведомление.

## Запуск

```bash
docker compose up --build
```

Тесты: `docker compose exec app php artisan test`

Сайт: `http://autoplace.127.0.0.1.sslip.io:8080`

Админка:
`http://admin.autoplace.127.0.0.1.sslip.io:8080/admin`
Логин: `admin@example.com`
Пароль: `password`

Homepage с быстрыми ссылками: `http://homepage.127.0.0.1.sslip.io:8080`

Dozzle с логами контейнеров: `http://dozzle.127.0.0.1.sslip.io:8080`

База для DBeaver:
Host: `127.0.0.1`
Port: `5433`
Database: `cars`
User: `cars`
Password: `secret`

Создать демо-машины:

```bash
docker compose exec app php artisan demo:add-catalog-vehicle --count=25
```

То же самое можно сделать в админке кнопкой `Сгенерировать`.

## Стек

Бэк: Laravel, Filament, Lighthouse GraphQL, PostgreSQL.

Фронт: React, TypeScript, Inertia.js, shadcn/ui.

Инфра: Docker Compose, Caddy, queue worker, scheduler, Vite, Homepage, Dozzle.
