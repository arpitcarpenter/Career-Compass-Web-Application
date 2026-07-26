# 🧩 Career Compass - AI-Powered Smart Job Portal System

> Empowering careers through connections — where candidate talent seamlessly meets recruiter opportunity through Intelligent Machine Learning Pipelines.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)
![Python ML Microservice](https://img.shields.io/badge/ML Core-Python%20%2F%20Flask-green?style=for-the-badge&logo=python)
![Scikit-Learn](https://img.shields.io/badge/Algorithm-TF--IDF%20%26%20Cosine%20Similarity-orange?style=for-the-badge&logo=scikit-learn)
![JWT Auth](https://img.shields.io/badge/Security-JWT%20Protected-red?style=for-the-badge)

---

## 📌 Project Overview

**Career Compass** is a full-stack, enterprise-grade recruitment platform designed to revolutionize candidate screening and job matching. Built on a hybrid architecture combining the **MERN Stack** for real-time web operations and an **asynchronous Python ML microservice** for Natural Language Processing (NLP), the system dynamically computes candidate-job compatibility scores based on candidate resumes and active job postings.

---

## 🔥 Key Features

### 🎓 For Job Seekers (Students)
- **Role-Based Authentication:** Secure JWT-based registration, login, and protected routes.
- **Interactive Job Feed:** Search, filter by location/salary, and browse active job listings.
- **Resume Upload Integration:** Upload resumes seamlessly via Multer & Cloudinary cloud storage.
- **🤖 AI-Powered Job Matcher:** Real-time percentage compatibility score (`% Match`) generated using NLP text vectorization against target job descriptions.
- **Application Tracker:** Dynamic dashboard tracking application statuses (*Applied, Under Review, Shortlisted, Rejected*).

### 💼 For Recruiters / Admins
- **Company Management:** Create and update company profiles with logos and domain metadata.
- **Job Posting Module:** Create, edit, and archive job descriptions, skill requirements, and salary metrics.
- **Applicant Pipeline Tracking:** Review candidate profiles, download Cloudinary-hosted resumes, and update recruitment pipeline statuses.

### 🛡️ Public / Guest User Flow
- **High-Converting Landing Page:** Explore public job cards and platform metrics without authorization leakage.
- **Route Interception Guards:** Protected internal endpoints gracefully bounce unauthorized guests to the login gateway.

---

## 🛠️ Tech Stack Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React.js, Tailwind CSS, Redux Toolkit, React Router DOM, Lucide Icons, Sonner Toasts |
| **Backend REST API** | Node.js, Express.js, MongoDB, Mongoose ODM, JWT, Cookie-Parser |
| **ML Microservice Core** | Python, Flask, Scikit-Learn, Pandas, NumPy |
| **NLP Algorithms** | TF-IDF Vectorizer (Term Frequency-Inverse Document Frequency), Cosine Similarity Matrix |
| **Cloud Storage** | Cloudinary API, Multer Storage Engine |
| **Version Control** | Git, GitHub Desktop |

---

## ⚙️ System Architecture & ML Workflow

1. **Document Ingestion:** Candidate uploads digital resume -> Backend parses text corpus into MongoDB user model profile.
2. **Asynchronous Microservice Request:** Node.js backend triggers an internal HTTP POST request to the local/hosted Flask Python server at port `5000`.
3. **Vector Matrix Construction:** Flask engine processes student resume text alongside target job descriptions, building TF-IDF term-frequency matrices.
4. **Cosine Similarity Calculation:** Computes the dot product of normalized vectors to derive precision compatibility percentages (`0% - 100%`).
5. **Real-time Pipeline Synchronization:** Computed scores are dynamically attached to API responses and rendered on the React.js client interface.

---

## 📁 Repository Directory Structure

```text
career-compass/
├── frontend/                 # React.js Single Page Application
│   ├── src/
│   │   ├── components/      # UI Views (Home, Jobs, Profile, Admin)
│   │   ├── redux/           # Global Store Slices (Auth, Job, Company)
│   │   └── hooks/           # Custom Axios Fetch Data Hooks
│   └── package.json
│
├── backend/                  # Node.js / Express REST API Server
│   ├── controllers/          # Business logic handlers
│   ├── models/               # MongoDB Mongoose Schemas (User, Job, Company)
│   ├── routes/               # Secured API Endpoints
│   ├── middlewares/          # JWT Auth Guard & Multer Storage
│   └── server.js
│
├── ml_service/               # Python Flask NLP Engine
│   ├── app.py                # Flask Vectorization API Endpoints
│   └── requirements.txt      # Python dependencies
│
├── .gitignore
└── README.md