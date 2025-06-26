# 📄 PDF Text Extractor

A fullstack web application that allows users to upload a PDF file, extract text content from each page on the backend, and display it cleanly on the frontend.

## 🚀 Project Overview

This project is built as part of a fullstack internship assignment. It demonstrates how to handle file uploads, perform server-side PDF processing, and send structured data back to a frontend for rendering.

---
## 🚀 Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [📦 Architecture](#architecture)  
- [🛠️ Setup & Installation](#setup--installation)  
- [🔌 API Documentation](#api-documentation)  
- [🧪 Testing](#testing)  
- [🚢 Deployment](#deployment)  
- [🤝 Contributing](#contributing)  
- [📄 License](#license)

---

## Overview

Studio helps users manage their creative assets and workflows, offering modules for project planning, asset tracking, task assignments, and real-time collaboration.

---

## Features

- 🔍 Project dashboard & analytics  
- 📁 Asset upload, versioning, and preview  
- 👥 User roles, permissions, and authentication  
- 🗓️ Task assignment & deadline tracking  
- 🔔 Notifications & real-time updates

---

## Architecture

Client (React) ←→ Backend API (Node.js / Express) ←→ MongoDB
↑
External Services
(e.g., AWS S3 for assets, Email notifications)



1. **Frontend** – React SPA with routing, user auth (JWT), state management (Redux/Context).  
2. **Backend** – REST API powered by Express; handles auth, business logic, and database interaction.  
3. **Database** – MongoDB storing users, projects, assets, and tasks.  
4. **Storage & Notifications** – Assets stored in AWS S3; notifications sent via Email service like SendGrid.

---

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- (Optional) AWS account for S3, SendGrid for email

### Steps

1. Clone repository
    ```bash
    git clone https://github.com/gottamvishnuvardhan/studio.git
    ```
2. Install dependencies
    ```bash
    cd studio/backend && npm install
    cd ../frontend && npm install
    ```
3. Create `.env` files:

    **backend/.env**
    ```
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/studio
    JWT_SECRET=your_jwt_secret
    AWS_ACCESS_KEY_ID=...
    AWS_SECRET_ACCESS_KEY=...
    S3_BUCKET_NAME=...
    SENDGRID_API_KEY=...
    ```

    **frontend/.env**
    ```
    REACT_APP_API_URL=http://localhost:5000/api
    ```

4. Start both modules:
    ```bash
    cd backend && npm run dev
    cd ../frontend && npm start
    ```
5. Visit `http://localhost:3000` in your browser.

---

## API Documentation

Base URL: `http://localhost:5000/api`


### Projects
- `GET /projects` – List all projects  
- `POST /projects` – Create new project  
- `GET /projects/:id` – Get one project  
- `PUT /projects/:id` – Update project  
- `DELETE /projects/:id` – Delete project  

### Assets
- `POST /projects/:id/assets` – Upload new asset  
  - Multipart form + description  
- `GET /projects/:id/assets/:assetId` – Download the asset  

### Tasks
- `GET /projects/:id/tasks` – View tasks  
- `POST /projects/:id/tasks` – Create a new task  
- `PUT /projects/:id/tasks/:taskId` – Update task  
- `DELETE /projects/:id/tasks/:taskId` – Delete task  

### Notifications
- Triggered automatically on events (uploads, task assignment)

---

## Testing

- **Backend**: run `npm test` (Jest + Supertest)  
- **Frontend**: run `npm test` (React Testing Library)  
- API tests under `backend/tests/`

---

## Deployment

- Backend can be deployed with **Heroku**, **AWS Elastic Beanstalk**, or **Docker**.  
- Frontend can be hosted via **Netlify**, **Vercel**, or **static S3 hosting**.  
- CI/CD pipelines highly recommended (e.g., GitHub Actions).

---

## Contributing

1. Fork repo & create a feature branch  
2. Commit with clear messages  
3. Submit a pull request for review  
4. See `CONTRIBUTING.md` for code etiquette

---

## License

This project is licensed under the **MIT License** © 2025 GOTTAM VISHNU VARDHAN.

---

## 🙏 Acknowledgements

- Thanks to contributors and open-source libraries powering Studio.

---

