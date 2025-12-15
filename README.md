Markdown

# 🍬 Sweet Shop - Full Stack E-Commerce Application

A modern, full-stack e-commerce platform for purchasing sweets. This application features a robust backend with Role-Based Access Control (RBAC), local asset management, and a sleek, glassmorphism-inspired frontend interface.

## 🚀 Features

* **User Authentication:** Secure JWT-based login and registration with auto-login flow.
* **Role-Based Access Control (RBAC):**
    * **Admins:** Can create, edit, delete, and restock items. Manage product images locally.
    * **Customers:** Can browse products, manage a persistent shopping cart, and simulate checkout.
* **Inventory Management:** Real-time stock tracking. Items automatically show as "Sold Out" when stock is depleted.
* **Shopping Cart:** Global cart state management (Context API) with a slide-out drawer interface.
* **Modern UI:** Built with React, Tailwind CSS, and Framer Motion for smooth animations and glassmorphism effects.
* **Local Image Serving:** Backend configured to serve static image assets efficiently without external cloud dependencies.

## 🛠️ Tech Stack

### Backend
* **Runtime:** Node.js & Express
* **Language:** TypeScript
* **Database ORM:** Prisma
* **Database:** PostgreSQL
* **Authentication:** JSON Web Tokens (JWT) & BCrypt
* **Asset Management:** Express Static Files (Local)

### Frontend
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **State Management:** React Context API (Auth & Cart)
* **HTTP Client:** Axios

---

🧪 Test-Driven Development (TDD)
The backend uses: - Jest - Supertest

Red → Green → Refactor pattern followed in commit history.


## ⚙️ Local Setup Instructions

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v18 or higher)
* PostgreSQL installed locally

### 1. Clone the Repository
```bash
git clone <https://github.com/AryaPiyus/sweet-shop-kata>
cd sweet-shop-kata
2. Backend Setup
Navigate to the backend folder and install dependencies:

Bash

cd backend
npm install
Step 2a: Configure Environment Create a .env file in the backend directory:

Code snippet

PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/sweetshop"
JWT_SECRET="your_super_secret_key_here"
Step 2b: Setup Images

Create a folder structure inside backend: public/images.

Add your sweet images (e.g., gulab-jamun.png) into this folder.

Step 2c: Database Migration Run the migrations to create tables and apply the schema:

Bash

npx prisma migrate dev --name init
npm run dev
The backend runs on http://localhost:3000

3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:

Bash

cd ../frontend
npm install
Create a .env file in the frontend directory:

Code snippet

# Point to your local backend
VITE_API_URL="http://localhost:3000/api"
Start the React application:

Bash

npm run dev
The frontend runs on http://localhost:5173

📸 Screenshots
1. Landing Page & Catalogue
A clean, minimalistic grid view of all available sweets with real-time stock indicators.
<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/3188f4ef-802a-4f5c-876a-7b4e8a172637" />

2. Admin Dashboard
Admins have special controls to Restock, Edit, or Delete items directly from the card view.
<img width="1919" height="857" alt="image" src="https://github.com/user-attachments/assets/2512165f-ae74-497e-8a9a-98abd711b0bc" />

3. Registration Flow
Split-screen design with secure validation and role selection.
<img width="1919" height="867" alt="image" src="https://github.com/user-attachments/assets/4bc3e0cf-2f78-4916-a57d-e8fc8bbe58e2" />

4.🧪 Test Report
The backend test suite was executed using Jest + Supertest.
<img width="891" height="559" alt="image" src="https://github.com/user-attachments/assets/6740d74e-78ed-4443-b219-b374fb9e361d" />


🤖 My AI Usage
This project was built in collaboration with an AI assistant (Gemini) acting as a "Senior Engineer/Sparring Partner."
UI Styling - Wrote the Framer Motion code for the "Glassmorphism" cards and animations.
Set up Test -Wrote the first test and taught me how it's done and all about testing libraries .

Co-Author Credit:

Co-authored-by: Gemini gemini@google.com

