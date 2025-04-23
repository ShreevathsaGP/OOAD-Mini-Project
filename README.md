# OOAD Mini Project

## Project Overview

This project is a **Railway Ticketing System** developed as part of the Object-Oriented Analysis and Design (OOAD) course. It provides functionalities for passengers, ticket collectors, and administrators to manage train bookings, tickets, and train schedules.

### Features

- **Passenger**: Book tickets, view booking history, and manage bookings.
- **Ticket Collector**: Validate tickets and update ticket statuses.
- **Administrator**: Add new trains, view train statistics, and manage train schedules.

---

## Prerequisites

To run this project, ensure you have the following installed:

1. **Java Development Kit (JDK)** (version 17 or higher)
2. **Node.js** (version 16 or higher)
3. **MongoDB** (running on `localhost:27017`)
4. **Maven** (for backend build and dependency management)

---

## Project Structure

The project is divided into two main parts:

1. **Backend**: A Spring Boot application located in the `miniproject` directory.
2. **Frontend**: A React application located in the `frontend` directory.

---

## How to Run the Project

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd OOAD/mini_project
```

### Step 2: Set Up the Backend

1. Navigate to the backend directory:

   ```bash
   cd miniproject
   ```

2. Install dependencies and build the project:

   ```bash
   ./mvnw clean install
   ```

3. Start the backend server:

   ```bash
   ./mvnw spring-boot:run
   ```

   The backend server will start on `http://localhost:8080`.

4. Ensure MongoDB is running on `localhost:27017`. The database name is configured as `ooad_mp` in `application.properties`.

---

### Step 3: Set Up the Frontend

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will be available on `http://localhost:5173`.

---

## Usage

1. Open the frontend in your browser at `http://localhost:5173`.
2. Register as a user and log in.
3. Based on your role (Passenger, Collector, or Admin), you will have access to specific functionalities.

---

## Report

The detailed project report, including the design, architecture, and implementation details, is available in the project directory. Please refer to the report for a comprehensive understanding of the system.

---

## Team Members

- **PES1UG22CS568**
- **PES1UG22CS571**
- **PES1UG22CS582**
- **PES1UG23CS837**

---

## License

This project is licensed under the MIT License.
