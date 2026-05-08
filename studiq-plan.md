---
name: Study Planner MVP
overview: สร้างเว็บแอป Study Planner แบบใช้คนเดียว (ไม่ต้องล็อกอิน) ด้วย React + Go (Gin) โดยมี Todo รายวัน/รายเดือน, วางแผนการเรียน, Focus Timer และ Dashboard สถิติการเรียนใน MVP แรก
todos:
  - id: init-structure
    content: ตั้งค่าโครงสร้างโปรเจกต์ React + Gin + PostgreSQL พร้อมค่าเริ่มต้น dev environment
    status: completed
  - id: build-task-module
    content: พัฒนา Task module ครบ CRUD + filter รายวัน/รายเดือน ทั้ง backend และ frontend
    status: completed
  - id: build-study-plan-module
    content: พัฒนา Study Plan module ครบ CRUD และหน้าแสดงเป้าหมายการเรียน
    status: completed
  - id: build-focus-module
    content: พัฒนา Focus timer บน frontend และบันทึก focus_sessions ผ่าน API
    status: completed
  - id: build-dashboard
    content: ทำ endpoint summary และหน้า Dashboard สรุปสถิติหลักของผู้ใช้
    status: completed
  - id: stabilize-docs-tests
    content: เพิ่ม validation, test สำคัญ, seed data และเอกสารการรันใน README
    status: completed
isProject: false
---

# แผนพัฒนา Study Planner MVP (React + Gin)

## เป้าหมาย MVP

- รองรับ 4 ฟีเจอร์หลัก: Todo รายวัน/รายเดือน, Study Planner, Focus Timer, Dashboard สรุปผล
- ใช้งานแบบ single-user local-first (ยังไม่ต้องมีระบบล็อกอิน)
- แยก frontend/backend ชัดเจน เพื่อเพิ่ม auth และ deploy จริงได้ง่ายในเฟสถัดไป

## สถาปัตยกรรมที่แนะนำ

- Frontend: React + TypeScript + Vite
- Backend: Go + Gin + GORM
- Database: PostgreSQL (ฐานหลักตั้งแต่ MVP)
- API: RESTful JSON

```mermaid
flowchart LR
  user[User] --> web[ReactWebApp]
  web --> api[GinAPI]
  api --> db[(PostgreSQLDB)]
```



## โครงสร้างโปรเจกต์

- Frontend: `[/Users/pparnfaa/Coding/studiq/frontend](/Users/pparnfaa/Coding/study-planner/frontend)`
- Backend: `[/Users/pparnfaa/Coding/studiq/backend](/Users/pparnfaa/Coding/study-planner/backend)`
- API Contract/Docs: `[/Users/pparnfaa/Coding/studiq/docs/api.md](/Users/pparnfaa/Coding/study-planner/docs/api.md)`

## ออกแบบโดเมนข้อมูล (MVP)

- `tasks`
  - title, description, dueDate, periodType(daily|monthly), priority, status(todo|in_progress|done), estimatedMinutes
- `study_plans`
  - subject, goal, startDate, targetDate, weeklyTargetMinutes, note
- `focus_sessions`
  - startTime, endTime, durationMinutes, taskId(optional), subject(optional), mode(focus|break)

## PostgreSQL DDL เบื้องต้น

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  due_date DATE,
  period_type VARCHAR(10) NOT NULL CHECK (period_type IN ('daily', 'monthly')),
  priority SMALLINT NOT NULL DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
  status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  estimated_minutes INTEGER NOT NULL DEFAULT 0 CHECK (estimated_minutes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_plans (
  id BIGSERIAL PRIMARY KEY,
  subject VARCHAR(150) NOT NULL,
  goal TEXT NOT NULL,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  weekly_target_minutes INTEGER NOT NULL DEFAULT 0 CHECK (weekly_target_minutes >= 0),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT REFERENCES tasks(id) ON DELETE SET NULL,
  subject VARCHAR(150),
  mode VARCHAR(10) NOT NULL CHECK (mode IN ('focus', 'break')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status_period ON tasks(status, period_type);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_start_time ON focus_sessions(start_time);
```

- หมายเหตุ: ใช้ `TIMESTAMPTZ` เพื่อรองรับ timezone ถูกต้อง และให้ backend เก็บเป็น UTC

## API ที่ควรมีในเฟสแรก

- Tasks
  - `GET /tasks` (filter: periodType, status, month)
  - `POST /tasks`
  - `PATCH /tasks/:id`
  - `DELETE /tasks/:id`
- Study Plans
  - `GET /study-plans`
  - `POST /study-plans`
  - `PATCH /study-plans/:id`
  - `DELETE /study-plans/:id`
- Focus Sessions
  - `GET /focus-sessions` (filter by date range)
  - `POST /focus-sessions` (บันทึก session หลังจบ)
- Dashboard
  - `GET /dashboard/summary` (เช่น เวลารวมวันนี้, งานเสร็จแล้ว, streak)

## วิธีรันผ่าน Docker Compose

- เพิ่มไฟล์ `[/Users/pparnfaa/Coding/studiq/docker-compose.yml](/Users/pparnfaa/Coding/study-planner/docker-compose.yml)`
- service ที่ต้องมีใน MVP:
  - `postgres`: ใช้ image `postgres:16-alpine`, map port `5432:5432`, mount volume ถาวร
  - `backend`: build จาก `backend`, รับ `DATABASE_URL`, รัน Gin server ที่ `8080`
  - `frontend`: build จาก `frontend`, expose `5173` (หรือ `80` ถ้า serve static)
- ตัวแปรหลัก:
  - `POSTGRES_DB=study_planner`
  - `POSTGRES_USER=study_user`
  - `POSTGRES_PASSWORD=study_pass`
  - `DATABASE_URL=postgres://study_user:study_pass@postgres:5432/study_planner?sslmode=disable`
- คำสั่งใช้งาน:
  - `docker compose up -d --build`
  - `docker compose logs -f backend`
  - `docker compose down` (หยุด)
  - `docker compose down -v` (ลบ volume เฉพาะตอนต้องการ reset db)

## แผนการทำงานเป็นเฟส

1. Setup โครงสร้างโปรเจกต์และ baseline
  - สร้าง monorepo แบบง่าย (frontend/backend/docs)
  - ตั้งค่า CORS, env, logging, error handler
  - ตั้งค่า PostgreSQL connection + migration tooling (dev/prod config)
2. พัฒนา Todo รายวัน/รายเดือน
  - DB schema + migration
  - CRUD API + หน้า UI รายการงาน + filter รายวัน/รายเดือน
3. พัฒนา Study Planner
  - CRUD Study Plan
  - UI สำหรับเป้าหมายการเรียนและ timeline
4. พัฒนา Focus Mode Timer
  - Timer ในฝั่ง frontend (start/pause/reset/end)
  - ตอน end ให้ยิง API บันทึก `focus_sessions`
5. พัฒนา Dashboard
  - API summary aggregation
  - การ์ดสถิติรายวัน/รายสัปดาห์ + กราฟพื้นฐาน
6. คุณภาพและพร้อมใช้งาน
  - Validation, test สำคัญ, seed data, README, run scripts

## แนวทาง UI หน้า MVP

- หน้า 1: Today (งานวันนี้ + ปุ่มเริ่มโฟกัส)
- หน้า 2: Monthly Tasks (มุมมองงานรายเดือน)
- หน้า 3: Study Planner (เป้าหมายรายวิชา)
- หน้า 4: Focus (timer เต็มจอ + history)
- หน้า 5: Dashboard (สถิติรวม)

## Non-functional ที่ควรใส่ตั้งแต่แรก

- ใช้ UTC ใน backend และแปลง timezone ฝั่ง frontend
- Input validation ทุก endpoint
- แยก service/repository layer ใน backend เพื่อรองรับการขยาย
- ใช้ typed API client ใน frontend ลด error จาก schema mismatch

## Strategy Migration (golang-migrate) สำหรับ dev/prod

- เครื่องมือ: `golang-migrate` + SQL migration files แบบ versioned
- โครงสร้างไฟล์:
  - `[/Users/pparnfaa/Coding/studiq/backend/migrations](/Users/pparnfaa/Coding/study-planner/backend/migrations)`
  - ตัวอย่าง: `000001_init_schema.up.sql`, `000001_init_schema.down.sql`
- แนวทาง dev:
  - ทุกครั้งที่เปลี่ยน schema ให้สร้าง migration ใหม่ (ไม่แก้ไฟล์เก่า)
  - รัน `migrate up` ตอน start backend (หรือผ่าน make target)
  - local ใช้ `sslmode=disable`
- แนวทาง prod:
  - รัน migration เป็น step แยกก่อน deploy app ใหม่ (CI/CD job)
  - ใช้ least-privilege DB user สำหรับ runtime app; migration user แยกสิทธิ์
  - เปิด `sslmode=require` และจัดการ secret ผ่าน environment/secret manager
- แนวทาง rollback:
  - ทุก migration ต้องมี `down` script
  - รองรับ `migrate down 1` เมื่อ deploy แล้วพบ issue
- ลำดับใน pipeline:
  1. Build backend image
  2. รัน migration job (`migrate up`)
  3. Deploy backend
  4. Smoke test endpoint สำคัญ (`/healthz`, `/dashboard/summary`)

## Definition of Done (MVP)

- ผู้ใช้สร้าง/แก้ไข/ลบ งานรายวัน-รายเดือนได้
- ผู้ใช้สร้างแผนการเรียนได้และติดตามเป้าหมายได้
- ผู้ใช้จับเวลาอ่านหนังสือและบันทึก session ได้
- Dashboard แสดงสถิติจากข้อมูลจริงในระบบได้
- รันได้ด้วยคำสั่งเดียวต่อฝั่ง (`frontend` และ `backend`) พร้อมคู่มือใน README

## แผนต่อยอดหลัง MVP

- เพิ่ม authentication (email/password หรือ Google)
- เพิ่ม notifications
- sync ข้ามอุปกรณ์และ deploy cloud
- เพิ่ม analytics เชิงลึก เช่น subject productivity trend

