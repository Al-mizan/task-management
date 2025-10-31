# 🧠 Task Management API

A simple Express.js-based REST API for managing tasks — includes routes for listing all tasks, retrieving a single task by ID, and checking server health.

---

## 🚀 Setup & Run Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Al-mizan/task-management.git
cd task-management
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run the application

#### Development mode (with auto-reload)
```bash
npm run dev
```

#### Production mode
```bash
npm start
```

The server will start on `http://localhost:3000`

---

## 📋 API Endpoints

### 1. **Root Endpoint**
- **URL:** `/`
- **Method:** `GET`
- **Description:** Returns a welcome message confirming the API is running
- **Response:**
  ```
  Task Management API is running!
  ```

### 2. **Get All Tasks**
- **URL:** `/tasks`
- **Method:** `GET`
- **Description:** Retrieves a list of all tasks
- **Response Example:**
  ```json
  [
    {
      "id": 1,
      "title": "Learn Node.js",
      "completed": false,
      "priority": "high",
      "createdAt": "2025-11-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Build REST API",
      "completed": false,
      "priority": "high",
      "createdAt": "2025-11-01T00:00:00.000Z"
    }
  ]
  ```

### 3. **Get Task by ID**
- **URL:** `/tasks/:id`
- **Method:** `GET`
- **Description:** Retrieves a single task by its ID
- **URL Parameters:**
  - `id` (number) - The task ID
- **Success Response (200):**
  ```json
  {
    "id": 1,
    "title": "Learn Node.js",
    "completed": false,
    "priority": "high",
    "createdAt": "2025-11-01T00:00:00.000Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request` - Invalid ID format
    ```json
    { "error": "Invalid ID format" }
    ```
  - `404 Not Found` - Task not found
    ```json
    { "error": "Task not found" }
    ```

### 4. **Health Check**
- **URL:** `/health`
- **Method:** `GET`
- **Description:** Returns the health status and uptime of the server
- **Response Example:**
  ```json
  [
    {
      "status": "healthy",
      "uptime": 123.456
    }
  ]
  ```

---

## �� Dependencies

- **express** (^5.1.0) - Fast, unopinionated web framework for Node.js
- **nodemon** (^3.1.10) - Development utility that automatically restarts the server on file changes

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
