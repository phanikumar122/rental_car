# 🚀 Royal Car Travels: The Ultimate Deployment Bible
### A Beginner's Guide to Putting Your Car Rental Business Online

Congratulations! You have a powerful car rental application ready to go. This document is written for someone who has **zero technical knowledge**. We will move your project from your computer to the "Cloud" (the internet) so your customers can start booking cars from anywhere in the world.

---

## 1. 📌 Introduction

### What is this project?
This is a **Full-Stack Web Application**. 
- **The "Face" (Frontend):** This is what your customers see—the beautiful website where they browse cars and book them.
- **The "Brain" (Backend):** This is the invisible part that handles security, emails, and calculations.
- **The "Memory" (Database):** This stores all your car details, customer info, and booking history.

### What does "Deploying Online" mean?
Right now, the website only works on your computer. "Deploying" means moving the code to a professional computer (a Server) that stays on 24/7 so anyone with a link can visit it.

---

## 2. 🧰 Things You Need Before Starting

You don't need to pay for anything yet! We will use the **Free Tiers** of professional services.

### A. Accounts to Create
1.  **GitHub Account:** [github.com](https://github.com) (This is where we store your code online).
2.  **Railway Account:** [railway.app](https://railway.app) (This will host your "Brain" and your "Memory/Database").
3.  **Netlify Account:** [netlify.com](https://netlify.com) (This will host your "Face/Website").
4.  **Supabase Account:** [supabase.com](https://supabase.com) (This will store your car photos for free).

### B. Software to Install
1.  **Git:** [git-scm.com](https://git-scm.com/downloads)
    *   *How to install:* Download the "Windows" version, click "Next" on everything, and "Finish."
2.  **Node.js:** [nodejs.org](https://nodejs.org)
    *   *How to install:* Download the "LTS" (Recommended) version. Click "Next" until it's done.

---

## 3. 📂 Project Overview

Your project is split into two main folders:

1.  **`frontend` (The Face):** 
    *   Built with React. 
    *   It's fast, modern, and looks great on mobile phones.
2.  **`backend` (The Brain):** 
    *   Built with Node.js and Express.
    *   It talks to the database and sends emails.
3.  **`ONLINE_DEPLOY.md`:** 
    *   (This file!) Your master instruction manual.

---

## 4. 🔑 Environment Variables Setup

Think of an `.env` file as a **Secret Keyring**. It tells your app the passwords and links it needs to work. **Never share these keys with anyone.**

### For the Backend (`backend/.env`)
You will need to gather these values during the deployment steps:

| Variable | What is it? | Where to get it? |
| :--- | :--- | :--- |
| `DATABASE_URL` | The link to your MySQL database. | From Railway (after Step 6C). |
| `JWT_SECRET` | A long, random password for security. | Type any random 32+ characters. |
| `FRONTEND_URL` | Your website's final address. | From Netlify (after Step 6A). |
| `SMTP_USER` | Your email address (e.g., Gmail). | Your Gmail address. |
| `SMTP_PASS` | A special "App Password." | Your Google Account settings. |
| `ADMIN_EMAIL` | Where alerts should be sent. | Your own email address. |

### For the Storage (`backend/.env` - Supabase)
| Variable | What is it? | Where to get it? |
| :--- | :--- | :--- |
| `R2_ENDPOINT` | The Supabase S3 link. | From Supabase Project Settings. |
| `R2_ACCESS_KEY_ID` | Your storage username. | From Supabase API keys. |
| `R2_SECRET_ACCESS_KEY` | Your storage password. | From Supabase API keys. |
| `R2_BUCKET_NAME` | Folder name for images. | You create this in Supabase. |

---

## 5. 🌐 Choosing Hosting Platforms

We chose these specifically because they have the best **Free Tiers** for beginners:

1.  **Railway (Backend + Database):** Extremely easy to set up. It creates the MySQL database for you in one click.
2.  **Netlify (Frontend):** The gold standard for React apps. It's fast and gives you a free SSL certificate (the green padlock 🔒).
3.  **Supabase (Storage):** The best free alternative to Cloudflare R2. It gives you plenty of space for car photos.

---

## 6. 🚀 Step-by-Step Deployment

### Part A: Uploading to GitHub
Before we go to the web, we need to put your code on GitHub.

1.  Open your project folder.
2.  Right-click and select "Open in Terminal" or "Git Bash."
3.  Type these commands one by one:
    ```bash
    git init
    git add .
    git commit -m "Ready for launch"
    ```
4.  Go to [GitHub](https://github.com), create a new "Private Repository" named `royal-car-travels`.
5.  Follow the instructions on GitHub to "Push an existing repository."

---

### Part B: Database Setup (The Memory)
1.  Log in to **Railway.app**.
2.  Click **+ New Project** -> **Provision MySQL**.
3.  Wait 1 minute. You now have a database!
4.  Click on the "MySQL" box, go to **Variables**, and copy the `MYSQL_URL`. **This is your `DATABASE_URL`.**

---

### Part C: Backend Deployment (The Brain)
1.  On Railway, click **+ New** -> **GitHub Repo**.
2.  Select your `royal-car-travels` repo.
3.  Go to **Settings** and change the "Root Directory" to `backend`.
4.  Go to **Variables** and click "Bulk Import." Paste your `.env` values there.
5.  Wait for the green checkmark. Railway will give you a link (e.g., `brain-production.up.railway.app`). **COPY THIS LINK.**

---

### Part D: Frontend Deployment (The Face)
1.  Log in to **Netlify.com**.
2.  Click **Add new site** -> **Import an existing project**.
3.  Connect your GitHub and select `royal-car-travels`.
4.  **Crucial Settings:**
    *   **Base directory:** `frontend`
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
5.  Click **Environment Variables** and add:
    *   `VITE_API_URL`: (Paste your Railway link here).
6.  Click **Deploy site**.

---

### Part E: Image Storage Setup (Supabase)
1.  In Supabase, create a new Project.
2.  Go to **Storage** -> **Create New Bucket** -> Name it `cars`. Make it **Public**.
3.  Go to **Project Settings** -> **API**. 
4.  Gather your Endpoint, Access Key, and Secret Key.
5.  Add these to your Railway Variables (see Step 4).

---

## 7. 🔗 Connecting Everything Together

This is where beginners usually get stuck. You must tell the "Face" where the "Brain" is, and vice versa.

1.  **On Railway (Backend):** Go to Variables. Update `FRONTEND_URL` with your Netlify link.
2.  **On Netlify (Frontend):** Go to Site Configuration -> Environment Variables. Update `VITE_API_URL` with your Railway link.
3.  **Redeploy:** Both services will automatically restart and find each other.

---

## 8. ✅ Final Testing

1.  Visit your Netlify link.
2.  **Test 1:** Try to register a new user. If it works, your Database is connected!
3.  **Test 2:** Log in as Admin and try to upload a car image. If the photo appears, Supabase is connected!
4.  **Test 3:** Book a car. Check your email for an alert. If it arrives, SMTP is connected!

---

## 9. 🛠️ Troubleshooting Guide

### "Failed to load dashboard data"
*   **Cause:** The backend isn't talking to the database.
*   **Fix:** Check your `DATABASE_URL` in Railway. Make sure it starts with `mysql://`.

### "Broken Image Icon"
*   **Cause:** Storage keys are wrong.
*   **Fix:** Go to Supabase, check your "Bucket Name." Ensure it matches `R2_BUCKET_NAME`.

### "CORS Error" in browser
*   **Cause:** The backend doesn't trust the frontend.
*   **Fix:** Ensure your `FRONTEND_URL` in Railway exactly matches your Netlify URL (including `https://`).

---

## 10. 🔄 Updating the Project Later

Whenever you want to change something (like the price of a car or a color on the site):
1.  Make the change on your computer.
2.  Open your terminal and type:
    ```bash
    git add .
    git commit -m "Updated colors"
    git push origin main
    ```
3.  **Magic:** Railway and Netlify will see the update and redeploy your site automatically in 2 minutes!

---

## ✨ Pro Tip for the Owner
Once your site is live, go to Netlify -> **Domain Settings**. You can buy a professional name like `www.sunshinetravels.com` for about $12/year. It makes your business look 10x more professional!

**You are now officially a Web Deployment Master! 🏆**
