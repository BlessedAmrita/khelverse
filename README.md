# Khelverse 🏆  

Khelverse is a **Next.js-based Athlete Management Platform** designed to help athletes, coaches, and sponsors track performance, training, diet, and injuries efficiently. It also integrates AI-based **pose estimation** for training analysis.

## 📌 Features  
- 🏋️ **Athlete Dashboards**: Track training, diet, and injuries  
- 🔄 **Real-time Coach-Athlete Connection**  
- 📊 **Performance Tracking** with **Mediapipe + OpenCV**  
- 🎨 **ShadCN UI Components**  
- 🌍 **Firebase Backend with Role-based Access**  
- 🏃 **Strava/Fitbit Integration (Planned)**  
- 🤖 **AI-powered Insights with Gemini API**  

---

## 🚀 Quick Start Guide  

### 1️⃣ **Fork & Clone the Repository**  
First, fork the repository, then clone your fork locally:  
```sh
git clone https://github.com/YOUR_USERNAME/Khelverse.git  
cd Khelverse
```
### 2️⃣ **Set Up Git Branch**
Create a new branch for your work:  

```sh
git checkout -b feature-branch  
## 📦 Frontend Setup (Next.js + Tailwind + ShadCN)  
```
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
venv\Scripts\activate  # On Windows  
source venv/bin/activate  # On Mac/Linux  
pip install -r requirements.txt  
python app.py
```
### 📜 Contribution Guide  

- **Fork & Clone**: Follow the steps above.  
- **Create a Branch**: Use `git checkout -b feature-name`.  
- **Commit & Push**: Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).  
- **Raise a Pull Request**: Explain your feature in the PR description.  

---

### 📜 License  

This project is licensed under the **MIT License**.  

---

### 🌟 Support  

💡 Found an issue? Raise an [Issue](https://github.com/YOUR_USERNAME/Khelverse/issues).  
💖 Love this project? Give us a ⭐ on GitHub!  
