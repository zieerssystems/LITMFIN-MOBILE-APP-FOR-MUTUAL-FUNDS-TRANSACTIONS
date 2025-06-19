
# LITMFin Mobile App 📱

This is the official **LITMFin Mobile App**, built using **React Native** and **Expo**. It enables users to view and invest in mutual fund schemes, perform SIP transactions, and manage investment portfolios.

---

## 📦 Features

- User Login
- View Mutual Fund Schemes
- Perform buy and SIP transactions
- View investments and current profit/loss

---

## 🛠️ Prerequisites

Make sure the following tools are installed:

### 1. Node.js (v18 or compatible)
https://nodejs.org/

### 2. Expo CLI (global)
```bash
npm install -g expo-cli
```

### 3. WAMP Server (for PHP & MySQL backend)
https://www.wampserver.com/en/

---

## 📲 Mobile App Setup

### 1. Clone the GitHub Repository
```bash
git clone https://github.com/zieerssystems/LITMFIN-MOBILE-APP-FOR-MUTUAL-FUNDS-TRANSACTIONS.git

cd litmfin-mobile-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Expo Development Server
```bash
npx expo start
```

Use the QR code shown in the terminal to open the app on your physical device using the **Expo Go** app (available on Play Store and App Store).

---

## 🖥️ Backend Setup (WAMP Server)

### 1. Download and install [WAMP](https://www.wampserver.com/)
Ensure Apache and MySQL services are running.

### 2. Place the API files

- Move the `api` folder from the GitHub project to your WAMP `www` directory (usually `C:/wamp64/www/`).
- Update your database connection in `web_config.php` and `database.php`.

### 3. Import the Database

- Open **phpMyAdmin** via WAMP (http://localhost/phpmyadmin).
- Create a database named `litmfin`.
- Import the SQL file (`litmfin.sql`) provided in the repository.

---

## 🔐 API Configuration

- Make sure your backend `api` endpoints are accessible via: `http://localhost/litmfin/api/...`
- Update your Expo app's API base URLs accordingly in the `constants.js` or `config.js` file.

---

## ✅ Done!

You can now log in, and test all the app functionalities.

---

## 🧑‍💻 Developer Notes

If you're contributing to the project:

- Follow proper commit messages.
- Use pull requests for major changes.
- Always test thoroughly before pushing.


---

Enjoy using LITMFin Mobile App! 🚀
