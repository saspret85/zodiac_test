# TaskFlow - Minimal Task Management System

TaskFlow is a production-ready, minimal task management application built with a modern stack. It features a high-performance backend with **ElysiaJS**, a reactive frontend with **React**, and uses **Prisma** for database orchestration and **Redis** for caching and rate limiting.

## 🚀 Tech Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS v4, React Query, Lucide Icons.
- **Backend**: ElysiaJS, Bun, Prisma ORM, PostgreSQL.
- **Infrastructure**: Redis (Caching & Rate Limiting), Docker, Nginx.

## 🛠 Prerequisites

Ensure you have the following installed on your system:
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🔌 Port Usage

To avoid conflicts with existing services on your machine, please ensure the following ports are available:

| Service | Host Port | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | `5173` | `80` | Web Interface (Nginx) |
| **Backend** | `3001` | `3000` | API Server (ElysiaJS) |
| **PostgreSQL** | `5433` | `5432` | Database Storage |
| **Redis** | `6380` | `6379` | Caching & Rate Limit |

## ⚡ Quick Start (Docker Setup)

Follow these steps to run the entire application from scratch:

1. **Clone the repository** (or navigate to the project folder).
2. **Remove any existing volumes** (if you want a completely fresh start):
   ```bash
   docker compose down -v
   ```
3. **Build and start the containers**:
   ```bash
   docker compose up --build
   ```

Docker will automatically:
- Spin up a **PostgreSQL 16** database and a **Redis 7** instance.
- Build the **Backend**, install dependencies via Bun, and perform **Auto-Migrations** to set up database tables.
- Build the **Frontend** and serve it via **Nginx**.

## 🔗 Access Links

Once the containers are running, you can access the services at:

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **API Documentation (Swagger)**: [http://localhost:3001/swagger](http://localhost:3001/swagger)
- **Backend Health Check**: [http://localhost:3001/api/tasks](http://localhost:3001/api/tasks)

## 📖 API Documentation

The project includes an interactive **Swagger UI** for testing endpoints.
- **GET /api/tasks**: Fetch tasks with pagination and filters (status, priority).
- **POST /api/tasks**: Create a new task (includes validation and 201 response).
- **PATCH /api/tasks/:id**: Update task details or status.
- **DELETE /api/tasks/:id**: Remove a task.

*Note: Rate limiting is applied (1 request per second per endpoint per IP) managed via Redis.*

## 🧪 Testing Instructions

To run unit tests for the backend (outside Docker, requires Bun):

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the tests:
   ```bash
   bunx vitest run
   ```

To run tests in watch mode:
   ```bash
   bunx vitest
   ```

## 📁 Project Structure

- `backend/`: ElysiaJS server, Prisma schema, and logic.
- `frontend/`: React application and Tailwind styles.
- `docker-compose.yml`: Orchestration for all services.
