# ORION (BatchBond)

### A Collaborative Platform for Batch Communication, Real-Time Messaging & Event Management

ORION (BatchBond) is a full-stack web application designed to simplify communication and collaboration within college batches and student communities. It provides real-time messaging, private conversations, group chats, event management, and administrative controls through a centralized platform.

Built using the MERN stack, microservices architecture, Docker, and Socket.IO, BatchBond enables users to communicate, share images, discover events, and stay connected with their batch community. The platform also implements an admin-controlled user approval system to maintain a secure and moderated environment.

---

## ✨ Features

### 💬 Real-Time Messaging

* **Personal Chat:** Communicate privately with individual users.
* **Group Messaging:** Create and participate in group conversations.
* **Real-Time Communication:** Exchange messages instantly using Socket.IO.
* **Image Sharing:** Share images in conversations with Cloudinary integration.
* **Private Conversations:** Support for private, user-to-user communication.

### 📅 Event Management & Broadcasting

* **Create Events:** Users can create events and share them with the community.
* **Event Broadcasting:** Notify users about newly created events.
* **Email Notifications:** Automatically send email notifications to users when an event is created.
* **In-App Events:** Display events within the application.
* **Event Reactions:** Allow users to react to events and engage with the community.

### 🔐 Authentication & Access Control

* **User Authentication:** Secure registration and login functionality.
* **Admin Approval System:** New login requests are sent to the administrator for approval before users can successfully log in.
* **Protected Routes:** Restrict access to authorized pages and resources.
* **Authentication Middleware:** Validate authentication and control access to protected backend endpoints.
* **Password Reset:** Allow users to reset their passwords.
* **Role-Based Access:** Separate administrative functionality from regular user functionality.

### 👤 User Profiles

* Individual user profiles.
* Access to user information within the application.
* Support for connecting and communicating with other members of the batch.

### 🛡️ Admin Dashboard & Moderation

* **User Approval:** Review and approve user login requests.
* **User Management:** Manage registered users through the admin dashboard.
* **User Blocking:** Block users who engage in inappropriate messaging or violate community rules.
* **Community Moderation:** Help maintain a safer and more controlled communication environment.

### 🐳 Scalable Architecture

* **Microservices Architecture:** Organize backend functionality into separate services.
* **Docker Integration:** Containerize application components for consistent development and deployment environments.
* **REST APIs:** Enable communication between the frontend and backend services.
* **Cloudinary Integration:** Handle image uploads and cloud-based image storage.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* REST APIs
* Authentication Middleware

### Database & Storage

* MongoDB
* Cloudinary

### Architecture & Deployment

* Microservices Architecture
* Docker
* MERN Stack

### Additional Functionality

* Email Notifications
* Password Reset
* Protected Routes
* Admin Dashboard
* User Approval and Moderation

---

## 🏗️ System Architecture

BatchBond uses a microservices-based backend architecture with a React frontend.

At a high level, the application follows this workflow:

1. **Frontend:** React and Tailwind CSS provide the user interface for messaging, events, profiles, and administration.
2. **Authentication:** Login and registration requests are processed by the backend, with administrator approval required before access is granted.
3. **Backend Services:** The microservices architecture separates backend responsibilities into independently organized services.
4. **Database:** MongoDB stores application data, including user and communication-related information.
5. **Real-Time Communication:** Socket.IO enables real-time messaging and event-related updates.
6. **Image Management:** Cloudinary handles image uploads and cloud storage.
7. **Email Notifications:** The application sends email notifications when users create events.
8. **Administration:** The admin dashboard supports user approval, user management, and moderation.

### High-Level Architecture

```text
                 ┌────────────────────────┐
                 │      React Frontend    │
                 │     Tailwind CSS       │
                 └────────────┬───────────┘
                              │
                 ┌────────────▼───────────┐
                 │   Authentication &     │
                 │    Protected Routes    │
                 └────────────┬───────────┘
                              │
                 ┌────────────▼───────────┐
                 │    Backend Services    │
                 │  Node.js + Express.js  │
                 │    Microservices       │
                 └──────┬─────┬─────┬─────┘
                        │     │     │
              ┌─────────▼┐ ┌──▼───┐ ┌▼──────────┐
              │ MongoDB  │ │Socket│ │Cloudinary │
              │          │ │ .IO  │ │           │
              └──────────┘ └──┬───┘ └───────────┘
                              │
                    Real-Time Messaging

                 ┌────────────────────────┐
                 │   Admin Dashboard      │
                 │ Approval & Moderation  │
                 └────────────────────────┘

                 ┌────────────────────────┐
                 │   Email Notifications  │
                 └────────────────────────┘
```

*Note: This diagram represents the high-level system design. The exact service boundaries and communication flow depend on the implemented backend architecture.*

---

## 🔄 User Authentication Workflow

BatchBond implements an administrator-controlled access approval process.

1. A user registers or submits a login request.
2. The backend validates the request.
3. The administrator receives the request for review.
4. The administrator approves or rejects access.
5. An approved user can successfully log in.
6. Protected routes and backend middleware restrict access to authorized users.
7. The administrator can block users who violate community guidelines.

This approval workflow adds an additional layer of administrative control to the platform.

---



## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites

Ensure that the following tools are installed:

* Node.js and npm
* Git
* Docker and Docker Compose, if supported by your project configuration
* MongoDB, either locally or through a hosted instance

You will also need the appropriate credentials for Cloudinary and your email service.

### 1. Clone the Repository

```bash
git clone https://github.com/Satyamxo/ORION-FRONTEND
git clone https://github.com/Satyamxo/ORION-BACKEND
```

### 2. Configure Environment Variables

Create the required `.env` files for the frontend and backend services.

Typical configuration variables may include:

```env
PORT=your_service_port
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_service_credential
```

These are illustrative variable names.


### 3. Install Dependencies

Install dependencies separately for each service and the frontend, using the package managers and commands defined in your repository.

For example:

```bash
npm install
```

Run this command from the relevant project directories containing their respective `package.json` files.

### 4. Start the Application

If your repository includes a working Docker Compose configuration, start the configured services with:

```bash
docker compose up --build
```

Otherwise, start the frontend and backend services using the scripts defined in their respective `package.json` files.

Refer to each service's configuration for the required ports and startup commands.

---

## 🔒 Security & Access Control

BatchBond incorporates several mechanisms to control access and support community moderation:

* Authentication middleware for protected backend routes.
* Protected frontend routes for restricted pages.
* Administrator-controlled user approval.
* Administrative user-blocking functionality.
* Environment-based configuration for sensitive credentials.
* Password-reset functionality.

The effectiveness of these controls depends on the server-side implementation and configuration of the deployed application.

---

## 🎯 Project Objective

The primary objective of ORION (BatchBond) is to bring batch communication, private messaging, group collaboration, and event management together in one platform.

By combining real-time communication with administrator-controlled access and Docker-based microservices, the project demonstrates the integration of modern full-stack development technologies into a collaborative web application.

---

## 👨‍💻 Author

**Satyam Gupta**

MSc Advanced Computer Science Student | Full-Stack Developer | AI/ML Enthusiast


