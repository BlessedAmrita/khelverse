# Khelverse 🏆

## Bridging Gaps in India's Athlete Management System

Fragmented athlete management in India leads to inefficient performance tracking, limited coach-athlete interaction, gaps in injury rehabilitation, and uncertain career prospects. Khelverse offers a comprehensive solution.

## ✨ Flagship Features

Khelverse is an AI-powered platform leveraging Google technologies to empower athletes:

* **🤖 Khelbott (AI Sports Assistant):** Instant answers and 24/7 guidance, including specialized support for para-athletes, powered by **Google's Gemini API**.
* **🏋️ Live Trainer (AI Pose Estimation):** Real-time exercise guidance, rep counting, and form correction using **MediaPipe** and **OpenCV**, deployed via **Gradio**.
* **🗓️ AI-Generated Training Plans:** Personalized training plans tailored to your needs, reviewed and revised by your coach, and seamlessly integrated into your daily targets list.
* **📞 1-1 Session:** Personalized virtual coaching via **Google Meet** integration for tailored guidance.
* **📈 Career & Retirement Planning:** Intelligent career advice and comprehensive retirement plan support, powered by **Google's Gemini API**.
* **🤝 Smart Coach-Athlete Management:** Connect with coaches by sending connection requests and utilizing in-app messaging.
* **🏆 Tournament & Event Dashboard:** Easy event management for coaches and athlete registration, with integrated reminders.
* **💊🥗 Injury & Dietary Support:** AI-based recovery programs and diet plans with remote coach monitoring.

## 🚀 Technologies Used

Khelverse is built on a robust stack, heavily utilizing **Google** services:

* **AI/ML & Backend:** **Firebase**, **TensorFlow**, **Gemini API**, **Flask**, **OpenCV**, **MediaPipe**, **Node.js**, **Python**, **Gradio**.
* **Cloud & Deployment:** **Google Cloud Platform (GCP)**, **Vercel**.
* **Frontend:** **ShadCN UI**, **Next.js**, **JavaScript**.

## ⚙️ Quick Start Guide
### 1️⃣ **Fork & Clone the Repository**

First, fork the repository, then clone your fork locally:
```sh
git clone https://github.com/YOUR_USERNAME/Khelverse.git
cd khelverse
```

### 2️⃣ **Set Up Git Branch**
Create a new branch for your work: 
```sh
git checkout -b feature-branch
```
## 📦 Frontend Setup (Next.js + Tailwind + ShadCN)
```sh
cd frontend
npm install
npm run dev
# Set up your Firebase credentials in .env file
```
### 🎯 AI Model Setup (Pose Estimation - Mediapipe + OpenCV) 
```sh
cd raw_models/fitness-trainer-pose-estimation-master
python -m venv venv
venv\Scripts\activate # On Windows
source venv/bin/activate # On Mac/Linux
pip install -r requirements.txt
python app.py
```
## 📜 Contribution Guide
- **Fork & Clone**: Follow the steps above.
- **Create a Branch**: Use `git checkout -b feature-name`.
- **Commit & Push**: Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- **Raise a Pull Request**: Explain your feature in the PR description.


## 🌟 Support
💡 Found an issue? Raise an [Issue](https://github.com/BlessedAmrita/Khelverse/issues).  
💖 Love this project? Give us a ⭐ on GitHub!   -->
### "Khelverse - Fostering a stronger, more connected, and successful athletic community."