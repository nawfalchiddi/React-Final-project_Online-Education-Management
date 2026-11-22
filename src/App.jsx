import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useApp } from "./utils/Mycontext";

import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Footer from "./layouts/Foter";

import Home from "./pages/Home/Home";
import Catalog from "./pages/Home/components/Catalog";
import CourseDetails from "./pages/Home/components/CourseDetails";
import LessonPage from "./pages/Home/components/LessonPage";
import Dashboard from "./pages/Home/components/Dashboard";
import Favourites from "./pages/Home/components/Favourites";
import InstructorDashboard from "./pages/Home/components/InstructorDashboard";
import CourseEditor from "./pages/Home/components/CourseEditor";
import Login from "./pages/Home/components/Login";
import Register from "./pages/Home/components/Register";

export default function App() {
  const { user } = useApp();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // Show the page only to the right role. Visitors go to /login and come back after.
  const only = (role, page) => {
    if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    return user.role === role ? page : <Navigate to="/" replace />;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
      {!isAuthPage && <Sidebar />}

      <div className="flex min-w-0 flex-1 flex-col">
        {!isAuthPage && <Header />}

        <main className={`flex-1 overflow-y-auto ${isAuthPage ? "" : "p-4 md:p-6"}`}>
          <Routes>
            {/* Everyone (visitors too) */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Catalog />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/courses/:id/lessons/:lessonId" element={<LessonPage />} />

            {/* Students only */}
            <Route path="/dashboard" element={only("student", <Dashboard />)} />
            <Route path="/favourites" element={only("student", <Favourites />)} />

            {/* Instructors only */}
            <Route path="/instructor" element={only("instructor", <InstructorDashboard />)} />
            <Route path="/instructor/courses/new" element={only("instructor", <CourseEditor />)} />
            <Route path="/instructor/courses/:id" element={only("instructor", <CourseEditor />)} />

            {/* Login / Register (hidden when already logged in) */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
}