# Studiq Study Planner MVP

Practical MVP for a single-user study planner with:

- Task management (daily/monthly, CRUD, filters)
- Study plan management (CRUD)
- Focus timer with focus session logging
- Dashboard summary from real backend data

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS v4
- Backend: Go + Gin
- Storage (MVP): in-memory repository (no auth, no DB required)

## Run Backend

```bash
cd backend
go run ./cmd/server
```

Default backend URL: `http://localhost:8080`

Environment variables:

- `APP_PORT` (default: `8080`)
- `CORS_ORIGINS` (default: `http://localhost:5173`)

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

Optional env:

- `VITE_API_URL` (default: `http://localhost:8080`)

## API Docs

See `docs/api.md`.

## Verification Commands

- Backend format: `gofmt -w ./cmd/server/main.go`
- Backend tests: `go test ./...`
- Frontend build: `npm run build`

## Notes / MVP Constraints

- Data is reset when backend process restarts (in-memory storage).
- API shapes and route names follow the MVP plan to make DB migration straightforward later.
- No authentication in this phase.
