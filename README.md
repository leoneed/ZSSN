# ZSSN - Zombie Survival Social Network

## 🛠 Backend Setup (Django & PostgreSQL)

### 1️⃣ Install Dependencies

First, install **Python 3.11+** and **PostgreSQL** if not already installed.


```sh
# Navigate to the backend folder
cd api-service

# Create a virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2️⃣ Configure Database

Ensure PostgreSQL is running and add .env in the api-service/ directory

⚠️ **Replace the values below with your actual database credentials!**


```
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=zssn
DB_USER=zomby
DB_PASSWORD=very_secure_password
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Then, apply migrations:

```
python manage.py migrate
```

### 3️⃣ Create Superuser (Optional)

```sh
python manage.py createsuperuser
```

### 4️⃣ Run the Server

```sh
python manage.py runserver
```
The API will be available at **http://localhost:8000/api**

---

## 🖥 Frontend Setup (React + Ant Design)

### 1️⃣ Install Dependencies

Ensure **Node.js 18+** is installed.

```sh
# Navigate to frontend folder in new console tab
cd client

# Install dependencies
npm install
```

### 2️⃣ Set Up Environment Variables

Create a `.env` file in the `client/` directory:

```ini
REACT_APP_API_URL=http://localhost:8000/api
```

### 3️⃣ Run the Frontend
```sh
npm start
```
The frontend will be available at **http://localhost:3000**

---

## 🧪 Running Tests

### Backend (Django Tests)

```sh
cd api-service
python manage.py test
```

### Frontend (Jest & React Testing Library)

```sh
cd client
npm test
```

---

## 📖 API Documentation
Once the server is running, visit **http://localhost:8000/api/docs** for interactive API documentation.