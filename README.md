
# Online Quiz Application

**Deployed Link:** https://quizappsidd.onrender.com/ (Under development Till:6-10-2025 11.30PM after that anyone can use the link)
   deployed using render  free version so at initial it takes 2 to 5 seconds - wake up time)
---

## 1. Project Description

This is a full-stack **Online Quiz Application** where users can register, log in, and take quizzes. Users can see their scores immediately after submission, challenge friends to take the same quiz, and submit feedback.  
Admins have a separate login to manage users and quizzes (*TBD*).

**Tech Stack:**  
- **Frontend:** React, HTML, CSS, JS, Vite  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** JWT with secure HttpOnly cookies  

---

## 2. How This App Addresses the Dev Challenge

**Project Goal:** A full-stack application where users can take a quiz and see their score.

### Backend:  
- MongoDB stores quizzes, users, feedback, and quiz results.  
- Questions stored with text, options, and correct answers.
- Endpoints implemented. 

### Frontend:  
- Start page allows the user to begin a quiz.  
- Displays **one question at a time** with "Next" and "Previous" buttons.  
- "next" button on the final question sends all answers to the backend.  
- Result page displays the user's score and correct answers and selected answers.  

### Evaluation Criteria Addressed:  
- Full end-to-end functionality implemented.  
- State management on frontend tracks user answers correctly.  
- API design supports smooth quiz flow.  
- Quiz flow is complete from start to finish (**self-quiz section**).  

---

## 3. Additional Features

### Challenge Friend  
**How it works:**  
1. User `U1` logs in and selects "Challenge Friend".  
2. `U1` creates a challenge by selecting a quiz, start time, and end time.  
3. A challenge link is generated which `U1` shares with `U2`.  
4. Both users complete the quiz within the challenge period.  
5. After the end time, results are displayed showing scores and completion status.  

### User-Related Features  
- Login / Logout  
- Register  
- User Profile  

### Other Features  
- Ratings / Feedback submission  
- Admin login for managing users and quizzes (TBD)  

---

## 4. Assumptions / Design Choices
- Users must register/login to take a quiz.  
- JWT authentication with HttpOnly cookies ensures secure sessions.  
- Correct answers are stored in DB but never exposed in question fetch.  
- Frontend shows **one question at a time** with "Next" / "Previous" navigation.  
- "next" button at last question sends all answers at once for scoring.  
- Challenge friend and feedback submission are additional features.  

---

## 5. Local Setup Guide

### Prerequisites  
- Node.js >= 18.x  
- MongoDB Atlas account (or local MongoDB)  

### Steps  

1. Clone the repository:  
```bash
git clone https://github.com/siddhesh0045/QuizApp
cd QuizApp
````

2. **Backend Setup**

   
```bash
cd QUIZBackend
npm install
cp .env.example .env  # update environment variables as needed
# Example .env
# JWT_SECRET=<your-secret>
# JWT_REFRESH_SECRET=<your-refresh-secret>
# MONGO_URI=<your-mongodb-uri>
# NODE_ENV=development/ production
# PORT=5000
 node ./server.js           # starts backend on localhost
```

3. **Frontend Setup**

```bash
cd ../QUIZFrontend
npm install
npm run dev            # starts frontend on localhost
```
## ⚙️ Local Setup Notes

Before running locally, make sure to:

- In **`server.js`**, comment out the deployed CORS link and **uncomment the localhost CORS link**.
- In **`frontend/src/utils/api.js`**, change the deployed API base URL to `http://localhost:5000`.

- In case any issue that can occures is likely due to the tokens generation ( for dev in authcontroller you can checkout token related code)
4. Open `http://localhost:5173` in your browser to access the application.


