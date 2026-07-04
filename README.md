# Car Match

Implementation of take-home assignment 2: external catalog filter subscriptions and notifications for new internal catalog vehicles.

## Stack

- Laravel 13
- React + TypeScript + Inertia.js
- PostgreSQL
- Docker Compose

## Run

```bash
docker compose up --build
```

Open http://autoplace.127.0.0.1.sslip.io:8080.

Services:

- `app`: Laravel HTTP server
- `queue`: background worker for subscription matching
- `scheduler`: Laravel scheduler; adds one demo catalog vehicle every minute
- `vite`: frontend dev server
- `postgres`: database
- `caddy`: local reverse proxy for `autoplace.127.0.0.1.sslip.io` and `admin.autoplace.127.0.0.1.sslip.io`

The app runs migrations and seeds demo data on startup.

Database connection from the host machine:

```text
Host: 127.0.0.1
Port: 5433
Database: cars
User: cars
Password: secret
```

## Admin Panel

Filament admin panel:

```text
http://admin.autoplace.127.0.0.1.sslip.io:8080

The admin root redirects to `/admin`.
```

Seeded demo credentials:

```text
Email: admin@example.com
Password: password
```

Admin sections:

- dashboard with catalog/subscription/notification stats,
- catalog vehicles with create/edit and manual subscription processing,
- filter subscriptions,
- generated notifications.

## Demo Flow

The public frontend currently keeps only the main AutoPlace page. The catalog,
subscription, and notification workflow is demonstrated through Filament, API,
Artisan commands, and tests.

1. Open `/admin`.
2. Inspect or create filter subscriptions. Example: `make_id=1`, `model_id=1`, `max_price=30000`, `fuel_type=gasoline`, `year_from=2020`.
3. Add or import a matching catalog vehicle. Example: Toyota Camry, `make_id=1`, `model_id=1`, price `26000`, fuel `gasoline`, year `2021`.
4. Open generated notifications in the Filament admin panel.

You can also emulate the internal system event through the API:

```bash
curl -X POST http://autoplace.127.0.0.1.sslip.io:8080/api/internal/catalog-vehicles \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "source_reference": "api-camry-001",
    "make_id": 1,
    "model_id": 1,
    "price": 26000,
    "mileage": 42000,
    "power": 203,
    "fuel_type": "gasoline",
    "year": 2021
  }'
```

The API returns `202 Accepted`; matching runs in the queue worker.

For a manual demo event from CLI:

```bash
php artisan demo:add-catalog-vehicle
```

Inside Docker:

```bash
docker compose exec app php artisan demo:add-catalog-vehicle
```

The same command is scheduled every minute by the `scheduler` service. In a real Linux cron setup the equivalent entry would be:

```cron
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

## Tests

Local:

```bash
php artisan test
```

Docker:

```bash
docker compose exec app php artisan test
```

Covered scenarios:

- filter matching across fixed combinations,
- non-matching vehicles do not notify,
- repeated processing of the same vehicle does not create duplicate notifications,
- HTTP vehicle event validation and processing.

## Domain Notes

- `catalog_vehicles` belongs to the internal system.
- `filter_subscriptions` and `notifications` belong to the external system.
- `VehicleFilterMatcher` contains filter matching only.
- `ProcessVehicleSubscriptions` is the background delivery workflow.
- Notification idempotency is enforced by the unique index on `subscription_id`, `vehicle_id`, and `type`.

## MVP Direction

The broader AutoPlace MVP direction is documented in [docs/mvp.md](docs/mvp.md).
