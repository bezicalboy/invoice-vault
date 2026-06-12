# Invoice Vault

Modern full-stack invoice management platform built with React, TypeScript, Hono, tRPC, and Prisma.

Invoice Vault helps freelancers, agencies, and small businesses manage invoices, clients, and billing workflows through a fast and modern web application.

---

## 🎥 Demo

https://github.com/user-attachments/assets/850b16ee-4fe8-46dc-949d-d28c527c6963

---

## ✨ Features

### Invoice Management

- Create invoices
- View invoice details
- Track invoice status
- Organize invoice records

### Client Management

- Manage client information
- Link invoices to clients
- Centralized customer database

### Authentication

- User registration
- Secure login
- JWT-based authentication
- Protected routes

### Dashboard

- Invoice overview
- Client overview
- Business insights
- Analytics visualization

### Cloud Storage

- AWS S3 integration
- Secure file uploads
- Scalable storage architecture

### Developer Experience

- End-to-end TypeScript
- Type-safe APIs with tRPC
- Schema validation with Zod
- Fast development workflow using Vite

---

## 🛠 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router v7
- React Query
- Tailwind CSS
- Radix UI
- Recharts

### Backend

- Hono
- tRPC
- Prisma ORM

### Database

- PostgreSQL / MySQL (Prisma Compatible)

### Authentication

- JOSE (JWT)
- bcryptjs

### Cloud Services

- AWS S3

---

## 🏗 Architecture

```text
React Client
     │
     ▼
    tRPC
     │
     ▼
 Hono Server
     │
 ┌───┴────┐
 ▼        ▼
Prisma   AWS S3
 ▼
Database
