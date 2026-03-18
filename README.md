# HRMS Lite - Frontend

A modern, responsive React application for the **Human Resource Management System (HRMS) Lite**. This frontend provides a clean interface for managing employees and tracking attendance, with a professional dashboard featuring real-time analytics and visualizations.

---

## Features

- **Dashboard**
  - Stat cards: Total Employees, Present Employees, Absent Employees
  - Today's Attendance pie chart
  - This Week's Attendance pie chart
  - Attendance Trend bar chart (last 7 days)
  - All Employees table

- **Employee Management**
  - Add new employees
  - View employee list with ID, name, email, department
  - Delete employees

- **Attendance Management**
  - Mark attendance (Present/Absent) for employees by date
  - View attendance records by employee
  - Filter and search attendance
  - Export and print attendance reports

---

## Prerequisites

- **Node.js** 16.x or higher
- **npm** 7.x or higher (comes with Node.js)
- A running **HRMS backend API** (see [Backend Setup](#backend-setup) below)

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/titu-codes/vercel-frontend.git
cd vercel-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL (optional for local development)

By default, the app connects to `http://127.0.0.1:8000` when running locally. To use a different backend:

Create a `.env` file in the frontend root:

```env
REACT_APP_API_BASE_URL=https://your-backend-url.up.railway.app
```

**Note:** Do not add a trailing slash to the URL.

### 4. Start the development server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

---

## Backend Setup

The frontend requires a running HRMS backend API. You have two options:

### Option A: Use the deployed backend (recommended for quick start)

The app is pre-configured to use the Railway backend in production. For local development, you can either:

- Run the backend locally (Option B), or
- Set `REACT_APP_API_BASE_URL` in `.env` to the deployed backend URL

### Option B: Run the backend locally

1. Navigate to the backend directory (in the parent HRMS project):

   ```bash
   cd ../backend
   ```

2. Create a virtual environment and install dependencies:

   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate

   pip install -r requirements.txt
   ```

3. Set environment variables (optional for local SQLite):

   ```env
   USE_SQLITE=true
   ```

4. Run the backend:

   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

5. The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000). API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Available Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm start`    | Runs the app in development mode     |
| `npm run build`| Builds the app for production        |
| `npm test`     | Runs the test suite                  |

---

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── shared/     # Shared components (StatCard, Modal, Badge, etc.)
│   │   ├── AttendanceForm.js
│   │   ├── AttendanceList.js
│   │   ├── EmployeeForm.js
│   │   └── EmployeeList.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── EmployeeManagement.js
│   │   └── AttendanceManagement.js
│   ├── services/
│   │   └── api.js      # API client and endpoints
│   ├── styles/
│   ├── App.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://127.0.0.1:8000` (dev) |
| `NODE_ENV` | `development` or `production` | Set by `npm start` / `npm run build` |

---

## Deployment (Vercel)

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) and import your repository.
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   - `REACT_APP_API_BASE_URL` = your Railway backend URL
5. Deploy.

---

## Tech Stack

- **React** 18
- **React Router** 6
- **Recharts** (charts and graphs)
- **Axios** (HTTP client)
- **React Icons**
- **date-fns** (date formatting)
- **React Toastify** (notifications)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure backend is running and CORS allows your origin |
| API connection failed | Check `REACT_APP_API_BASE_URL` and ensure backend is reachable |
| Blank dashboard | Verify backend is running; check browser console for errors |
| Attendance not updating | Refresh the page or navigate away and back to Dashboard |

---

## License

Private project.
