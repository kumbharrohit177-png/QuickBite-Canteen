# QuickBite - Smart Canteen Pre-Ordering System 🍔

QuickBite is a modern, efficient, and user-friendly web application designed to streamline the food ordering process in canteens. It allows students and staff to pre-order meals, track order status in real-time, and make secure online payments, reducing wait times and improving the overall dining experience.

## ✨ Features

- **User Authentication**: Secure Sign Up and Login with JWT and Google OAuth integration.
- **Menu Browsing**: Visually appealing menu with categories, search, and detailed item views.
- **Smart Cart**: Add items, manage quantities, and view real-time price breakdowns.
- **Pre-Ordering**: Schedule orders for specific time slots to skip the queue.
- **Secure Payments**: Integrated Razorpay payment gateway for hassle-free transactions.
- **Order Tracking**: Real-time updates on order status (Pending, Cooking, Ready, Completed).
- **Refunds & Policies**: Clear refund policies and automated cancellation handling.
- **System Notifications**: Real-time toast notifications for all major actions (Login, Order, Payment).
- **Admin Dashboard**: Comprehensive dashboard for canteen staff to manage orders, update menu items, and track sales.
- **Responsive Design**: Fully optimized for meaningful experiences on desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

This project is built using the **MERN Stack** with modern tooling:

### Frontend
- **Generic**: [React.js](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/) (v7)
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Compass/Atlas) with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & Google Auth Library
- **Payments**: Razorpay Node.js SDK

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) account.
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/quickbite.git
    cd quickbite
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add the following:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    CLIENT_URL=http://localhost:5173
    ```
    Start the server:
    ```bash
    npm run dev
    ```
    
    Seed the database with initial menu items (Optional but recommended):
    ```bash
    node seed.js
    ```

3.  **Setup Frontend**
    Open a new terminal and navigate to the client directory:
    ```bash
    cd ../client
    npm install
    ```
    Create a `.env` file in the `client` directory and add:
    ```env
    VITE_API_URL=http://localhost:5000/api
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```
    Start the client:
    ```bash
    npm run dev
    ```

4.  **Access the App**
    Open your browser and verify the app is running at `http://localhost:5173`.

## 📂 Project Structure

```
QuickBite/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/            # API service calls
│   │   ├── assets/         # Images and global styles
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, Cart)
│   │   ├── pages/          # Application pages (Home, Menu, Cart, etc.)
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── .env                # Environment variables
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Backend Node.js Application
│   ├── middleware/         # Auth and error handling middleware
│   ├── models/             # Mongoose database models
│   ├── routes/             # API routes (Auth, Menu, Orders)
│   ├── .env                # Environment variables
│   ├── index.js            # Server entry point
│   └── seed.js             # Database seeder script
│
└── README.md               # Project Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Developed with ❤️ by [Rohit Kumbhar]
