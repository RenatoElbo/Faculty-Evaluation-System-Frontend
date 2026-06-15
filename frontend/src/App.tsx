import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EvaluationPage from "./pages/EvaluationPage";
import ThankyouPage from "./pages/ThankyouPage";
import AdminLoginPage from "./pages/AuthPage/AdminLogin";
import DashboardPage from "./pages/Admin/Dashboard";
import AcademicYear from "./pages/Admin/AcademicYear";
import YearSectionPage from "./pages/Admin/YearSectionPage";
import EvaluationResult from "./pages/Admin/EvaluationResult"
import QuestionResultsPage from "./pages/Admin/QuestionResults";
import Faculties from "./pages/Admin/Faculties";
import type { JSX } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotFoundPage from "./pages/OtherPage/NotFound";

// Simple component to protect admin routes
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = Boolean(localStorage.getItem("user_id"));
  return isAuthenticated ? children : <AdminLoginPage />;
}

//Simple component for session timeout
function SessionHandler() {
    const navigate = useNavigate();

    function useSessionTimeout(onTimeout: () => void, timeoutMs = 30 * 60 * 1000) {
        useEffect(() => {
            let timer: ReturnType<typeof setTimeout>;

            const resetTimer = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    localStorage.removeItem("user_id");
                    onTimeout();
                }, timeoutMs);
            };

            const events = ["mousemove", "keydown", "click", "scroll"];

            events.forEach((event) =>
                window.addEventListener(event, resetTimer)
            );

            resetTimer();

            return () => {
                clearTimeout(timer);
                events.forEach((event) =>
                    window.removeEventListener(event, resetTimer)
                );
            };
        }, [onTimeout, timeoutMs]);
    }

    useSessionTimeout(() => {
        navigate("/accountadminlogin");
    });

    return null;
}

export default function App() {
    return (
        <Router>
            <SessionHandler />

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/afes" element={<EvaluationPage />} />
                <Route path="/thankyou" element={<ThankyouPage />} />

                <Route path="/accountadminlogin" element={<AdminLoginPage />} />

                <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/>
                <Route path="/admin/academic-year" element={<ProtectedRoute><AcademicYear /></ProtectedRoute>}/>
                <Route path="/admin/year-section" element={<ProtectedRoute><YearSectionPage /></ProtectedRoute>}/>
                <Route path="/admin/faculties" element={<ProtectedRoute><Faculties /></ProtectedRoute>} />
                <Route path="/admin/evareport" element={<ProtectedRoute><EvaluationResult /></ProtectedRoute>} />
                <Route path="/admin/questions" element={<ProtectedRoute><QuestionResultsPage /></ProtectedRoute>} />


                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </Router>
    );
}