# Khelverse 🏆

## Bridging Gaps in India's Athlete Management System

**Problem:** Fragmented athlete management in India leads to inefficient performance tracking, limited coach-athlete interaction, gaps in injury rehabilitation, and uncertain career prospects. Khelverse offers a comprehensive solution.

## ✨ Flagship Features

Khelverse is an AI-powered platform leveraging Google technologies to empower athletes:

* **🤖Khelbott (AI Sports Assistant):**  Instant answers and 24/7 guidance, including specialized support for para-athletes, powered by **Google's Gemini API**.
* **🏋️Live Trainer (AI Pose Estimation):**  Real-time exercise guidance, rep counting, and form correction using **MediaPipe** and **OpenCV**, deployed via **Gradio**.
* **🗓️AI-Generated Training Plans:**  Personalized training plans tailored to your needs, reviewed and revised by your coach, and seamlessly integrated into your daily targets list.
* **📞1-1 Session:**  Personalized virtual coaching via **Google Meet** integration for tailored guidance.
* **📈Career & Retirement Planning:**  Intelligent career advice and comprehensive retirement plan support, powered by **Google's Gemini API**.
* **🤝Smart Coach-Athlete Management:**  Connect with coaches by sending connection requests and utilizing in-app messaging.
* **🏆Tournament & Event Dashboard:**  Easy event management for coaches and athlete registration, with integrated reminders.
* **💊🥗Injury & Dietary Support:**  AI-based recovery programs and diet plans with remote coach monitoring.

## 🚀 Technologies Used

Khelverse is built on a robust stack, heavily utilizing **Google** services:

* **AI/ML & Backend:** **Firebase**, **TensorFlow**, **Gemini API**, **Flask**, **OpenCV**, **MediaPipe**, **Node.js**, **Python**, **Gradio**.
* **Cloud & Deployment:** **Google Cloud Platform (GCP)**, **Vercel**.
* **Frontend:** **ShadCN UI**, **Next.js**, **JavaScript**.

## ⚙️ Quick Start Guide

1.  **Fork & Clone:**
    ```sh
    git clone [https://github.com/YOUR_USERNAME/Khelverse.git](https://github.com/YOUR_USERNAME/Khelverse.git)
    ```
2.  **Frontend Setup:**
    ```sh
    cd frontend && npm install && npm run dev
    # configure Firebase .env
    ```
3.  **AI Model Setup:**
    ```sh
    cd raw_models/fitness-trainer-pose-estimation-master
    python -m venv venv
    source venv/bin/activate  # On Mac/Linux
    venv\Scripts\activate     # On Windows
    pip install -r requirements.txt
    python app.py
    ```

## 📜 Contribution & License

We welcome contributions! Follow our guide on creating branches, committing (Conventional Commits), and raising Pull Requests. This project is under the **MIT License**.

## 🌟 Support

💡 Found an issue? Raise an [Issue](https://github.com/BlessedAmrita/Khelverse/issues).  
💖 Love this project? Give us a ⭐ on GitHub!   -->

**Khelverse: Fostering a stronger, more connected, and successful athletic community.**