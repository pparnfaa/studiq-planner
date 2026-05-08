# Studiq API (MVP)

Base URL: `http://localhost:8080/api/v1`

All success responses:

```json
{ "data": {} }
```

All error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "human readable message",
    "details": ["optional", "details"]
  }
}
```

## Tasks

- `GET /tasks?periodType=daily|monthly&status=todo|in_progress|done&month=YYYY-MM`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

Task payload fields:

- `title` (string, required)
- `description` (string, optional)
- `dueDate` (`YYYY-MM-DD`, optional)
- `periodType` (`daily` or `monthly`)
- `priority` (1..3)
- `status` (`todo`, `in_progress`, `done`)
- `estimatedMinutes` (>= 0)

## Study Plans

- `GET /study-plans`
- `POST /study-plans`
- `PATCH /study-plans/:id`
- `DELETE /study-plans/:id`

Study plan payload fields:

- `subject` (string, required)
- `goal` (string, required)
- `startDate` (`YYYY-MM-DD`)
- `targetDate` (`YYYY-MM-DD`, must be >= `startDate`)
- `weeklyTargetMinutes` (>= 0)
- `note` (string, optional)

## Focus Sessions

- `GET /focus-sessions?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- `POST /focus-sessions`

Focus session payload fields:

- `taskId` (number, optional)
- `subject` (string, optional)
- `mode` (`focus` or `break`)
- `startTime` (RFC3339 string)
- `endTime` (RFC3339 string, must be >= `startTime`)
- `durationMinutes` (>= 0, optional; server can derive it from times)

## Dashboard

- `GET /dashboard/summary`

Summary shape:

- `todayFocusMinutes`
- `tasksCompleted`
- `activePlans`
- `totalTasks`
- `focusSessionsLogged`
