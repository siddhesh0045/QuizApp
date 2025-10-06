
// src/routes/router.jsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import QuizTypeSelection from "./pages/QuizTypeSelection";
import SelfQuizEntry from "./pages/SelfQuizEntry";
import QuizPage from "./pages/QuizPage";
import QuizResultPage from "./pages/QuizResultPage";
import ChallengeCreatePage from "./pages/ChallengeCreatePage";
import ChallengeQuizPage from "./pages/ChallengeQuizPage";
import ChallengeResultPage from "./pages/ChallengeResultPage";
import AboutUsPage from "./pages/AboutUsPage";
import AdminPage from "./pages/AdminPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
       { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
       { path: "/aboutUs", element: <AboutUsPage /> },
       { path: "/admin", element: <AdminPage /> },
        { path: "/quizTypeSelection", element:     <ProtectedRoute>
      <QuizTypeSelection />
    </ProtectedRoute>
 },
 { path: "/selfQuizEntry", element: <ProtectedRoute><SelfQuizEntry /></ProtectedRoute> },
 { path: "/quiz/self/:id", element: <ProtectedRoute><QuizPage /></ProtectedRoute> },
{ path: "/quiz/result/:id", element: <ProtectedRoute><QuizResultPage /></ProtectedRoute> },
{ path: "/quiz/challenge/create", element:<ProtectedRoute><ChallengeCreatePage /></ProtectedRoute>},
{ path: "/quiz/challenge/:link" ,element:<ProtectedRoute><ChallengeQuizPage /></ProtectedRoute>},
{ path: "/quiz/challenge/:link/result", element:<ProtectedRoute><ChallengeResultPage /></ProtectedRoute>},

    ],
  },
]);

export default router;
