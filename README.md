# Invoice Vault

A modern full-stack invoicing platform built with React, TypeScript, Hono, tRPC, Prisma, and PostgreSQL.

Invoice Vault helps freelancers, agencies, and small businesses manage clients, create professional invoices, track payment statuses, and organize billing information from a centralized dashboard.

---

## 🎥 Demo

https://github.com/user-attachments/assets/850b16ee-4fe8-46dc-949d-d28c527c6963

---

## ✨ Features

### 🔐 Authentication & Security

- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control

### 🏢 Company Management

- Company profile customization
- Business contact information
- Tax ID support
- Custom invoice branding
- Multi-currency support

### 👥 Client Management

- Create and manage clients
- Store billing information
- Company and contact details
- Client invoice history

### 📄 Invoice Management

- Create invoices
- Edit invoice details
- Manage invoice line items
- Automatic subtotal calculation
- Tax calculation support
- Due date management

### 📊 Invoice Status Tracking

- Draft
- Sent
- Paid
- Overdue
- Cancelled

### 📈 Dashboard & Analytics

- Invoice overview
- Client overview
- Business statistics
- Visual reporting

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

- PostgreSQL

### Validation & Security

- Zod
- JOSE (JWT)
- bcryptjs

---

## 🏗 Architecture

```text
React Client
     │
     ▼
 React Query
     │
     ▼
    tRPC
     │
     ▼
 Hono Backend
     │
     ▼
   Prisma
     │
     ▼
 PostgreSQL
```

---

## 📂 Project Structure

```text
src
├── components/
│   ├── ui/
│   ├── AppLayout.tsx
│   └── AuthLayout.tsx
│
├── hooks/
│   ├── useAuth.ts
│   └── use-mobile.ts
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Clients.tsx
│   ├── Invoices.tsx
│   ├── InvoiceDetail.tsx
│   ├── NewInvoice.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   └── Home.tsx
│
├── providers/
│   └── trpc.tsx
│
├── lib/
├── App.tsx
└── main.tsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- npm

### Clone Repository

```bash
git clone https://github.com/bezicalboy/invoice-vault.git
cd invoice-vault
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/invoicevault"

JWT_SECRET="your-secret-key"
```

### Generate Prisma Client

```bash
npm run db:generate
```

### Run Database Migration

```bash
npm run db:migrate
```

or

```bash
npm run db:push
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 📦 Production Build

Build the application:

```bash
npm run build
```

Run production server:

```bash
npm run start
```

---

## 🗄 Database Schema

Core entities:

- User
- CompanyProfile
- Client
- Invoice
- InvoiceItem

Relationships:

```text
User
├── CompanyProfile
├── Clients
└── Invoices

Client
└── Invoices

Invoice
└── InvoiceItems
```

Invoice statuses:

- Draft
- Sent
- Paid
- Overdue
- Cancelled

---

## 📜 Available Scripts

| Command | Description |
|----------|-------------|
| npm run dev | Start development server |
| npm run build | Build application |
| npm run start | Run production build |
| npm run lint | Run ESLint |
| npm run test | Run tests |
| npm run check | TypeScript type checking |
| npm run format | Format project files |
| npm run db:generate | Generate Prisma client |
| npm run db:migrate | Run migrations |
| npm run db:push | Push schema to database |

---

## 📸 Screenshots

Add screenshots here after deployment.

```md
![Dashboard](docs/dashboard.png)
![Invoices](docs/invoices.png)
![Clients](docs/clients.png)
```

---

## 🔮 Roadmap

- PDF invoice export
- Email invoice delivery
- Invoice templates
- Recurring invoices
- Payment gateway integration
- Multi-tenant organizations

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you find this project useful, please consider giving it a star on GitHub.

---

## 👨‍💻 Author

**Bezical**

GitHub: https://github.com/bezicalboy
