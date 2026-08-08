# 🚗 Royal Travels - Beginner's Guide to Running the Project

Welcome! This guide is written specifically for beginners. We will walk through setting up and running the Royal Travels Rental Car platform on your computer, step-by-step. 

---

## 🛠 What You Need Before You Start

Before we do anything, make sure you have these three programs installed on your computer. If you don't have them, click the links to download and install them first:

1.  **Node.js (v18 or higher)** - This is the engine that runs our code. [Download Node.js here](https://nodejs.org/) (Choose the "LTS" version).
2.  **MySQL** - This is the database where we store all our information (cars, users, bookings). [Download MySQL here](https://dev.mysql.com/downloads/installer/). *When installing, remember the root password you set!*
3.  **A Code Editor** - We highly recommend [VS Code](https://code.visualstudio.com/). It's where you will open the project folders.

---

## 📂 Understanding the Project

When you open this project in VS Code, you will see it is split into two main folders:
*   `backend/`: The "Brain". It connects to the database, checks passwords, and handles all the logic.
*   `frontend/`: The "Body". This is the actual website interface that you see in your web browser.

You will need to start **both** the backend and the frontend for the website to work.

---

## 🚀 Step 1: Setting up the Backend (The Database & Logic)

Let's get the brain working first.

1.  **Open your terminal in VS Code:** Go to the top menu, click `Terminal` -> `New Terminal`.
2.  **Go to the backend folder:** Type this command and press Enter:
    ```bash
    cd backend
    ```
3.  **Install the code libraries:** Type this and press Enter (this might take a minute):
    ```bash
    npm install
    ```
4.  **Connect to your Database:**
    *   Look for a file named `.env.example` in the `backend/` folder.
    *   Right-click it, select "Rename", and change its name to exactly `.env` (with the dot at the start).
    *   Open this `.env` file. You will see a line that looks like `DATABASE_URL=...`.
    *   Change the `YOUR_PASSWORD` part to the password you created when you installed MySQL. 
        *(Example: `mysql://root:password123@localhost:3306/rentalcar`)*
5.  **Create the Database Tables:** Type this command and press Enter. This tells MySQL to create the tables for Cars, Users, etc.
    ```bash
    npx prisma db push
    ```
6.  **Start the Backend Server:** Type this and press Enter:
    ```bash
    npm run dev
    ```
    *🎉 If you see `✅ Server running on http://localhost:5000`, great job! Leave this terminal open and running.*

---

## 🎨 Step 2: Setting up the Frontend (The Website)

Now let's get the actual website running.

1.  **Open a NEW terminal tab:** Next to the `+` icon in your terminal panel, click it to open a second terminal. (Do not close the first one!)
2.  **Go to the frontend folder:** Type this and press Enter:
    ```bash
    cd frontend
    ```
3.  **Install the code libraries:** Type this and press Enter:
    ```bash
    npm install
    ```
4.  **Connect the Frontend to the Backend:**
    *   Create a brand new file inside the `frontend/` folder and name it `.env`.
    *   Open it and paste this exact line inside:
        ```env
        VITE_API_URL=http://localhost:5000
        ```
5.  **Start the Website:** Type this and press Enter:
    ```bash
    npm run dev
    ```
    *🎉 You should see a link like `http://localhost:5173`. Hold `Ctrl` (or `Cmd` on Mac) and click that link. Your website should now open in your browser!*

---

## 👑 Step 3: How to Become an Admin

Right now, you are a normal user. To manage cars and bookings, you need Admin powers.

1.  On the running website, click **Sign Up** and create a new account.
2.  Go back to your VS Code terminal. Open a 3rd terminal tab.
3.  Make sure you are in the backend folder (`cd backend`).
4.  Type this command to open the database viewer:
    ```bash
    npx prisma studio
    ```
5.  This will open a new browser tab. Click on the **User** table.
6.  Find the account you just created. Double-click the cell under the `role` column.
7.  Change it from `USER` to `ADMIN` and click "Save 1 Change" at the top.
8.  Go back to your rental car website and refresh the page. You will now see the **Dashboard** link in the navigation bar!

---

## 📱 Optional: Setting up Notifications (Email & Push)

The app is designed to send Emails and Push Notifications (FCM) when someone books a car. 

*If you are just testing, you don't need to do this.* The app will safely pretend to send them and log them in the backend terminal instead.

If you *do* want real notifications, here is how to get your API keys:

1. **For Emails (Gmail App Password):**
   * Go to your Google Account Settings -> Security -> 2-Step Verification.
   * Scroll down to "App passwords" and create a new one (name it "Rental Car App").
   * Open `backend/.env` and paste your Gmail address into `SMTP_USER` and the 16-character App Password into `SMTP_PASS`.

2. **For Push Notifications (Firebase Cloud Messaging):**
   * Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
   * **Backend:** Go to Project Settings -> Service Accounts. Click "Generate new private key".
   * Open `backend/.env` and fill in `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` using the info from the JSON file you just downloaded.
   * **Frontend:** Go to Project Settings -> General. Register a "Web App" to get your config (API Key, App ID, etc.).
   * Open `frontend/.env` and fill in the `VITE_FIREBASE_*` variables.
   * You also need a **VAPID Key** from Cloud Messaging -> Web Configuration.

3. **Direct WhatsApp & Calls:**
   * You don't need any API keys for this! The website uses simple links to open WhatsApp or your phone dialer.
   * To chat: `<a href="https://wa.me/919876543210">Chat on WhatsApp</a>`
   * To call: `<a href="tel:+919876543210">Call Admin</a>`
   * You can change the phone number in both `.env` files.

4. **Restart your servers:** 
   * Stop both your backend and frontend terminals (`Ctrl+C`), then run `npm run dev` again in both for the new keys to take effect.

---

## 🖼 Step 4: Setting up Image Storage (Local Storage)

By default, you can paste image links from the internet. However, we have also enabled **Local Storage**, which allows you to upload images directly from your computer for **FREE** (no credit card or cloud setup required).

1.  **Check your directory:** Make sure the folder `backend/public/uploads` exists on your computer. (The system should have created this for you automatically).
2.  **Upload via Admin:**
    *   Go to the **Admin Dashboard** -> **Cars**.
    *   Click "Add Car".
    *   Click the **"Click to upload"** button.
    *   Select any image from your PC. 
3.  **Automatic Link:** The system will automatically upload the file and generate a local link (e.g., `http://localhost:5000/uploads/filename.jpg`) for you.

*Note: Since images are stored on your computer, if you delete the files in the `uploads` folder, they will disappear from the website.*

---

## 💡 Quick Troubleshooting

*   **Database Error / "Cannot connect to database":** Make sure MySQL is installed and running on your computer. Double check that your password in the `backend/.env` file is 100% correct.
*   **"Port already in use":** You might have started the server twice. Close all your VS code terminal tabs using the trash can icon, then start from Step 1.
*   **A page isn't loading or is blank:** Right-click the website in your browser, click "Inspect", and go to the "Console" tab. Any red errors there will usually tell you exactly what went wrong.

Happy Coding! 🏎💨
