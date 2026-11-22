import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false); // phone menu

  // on login/register pages we hide the sidebar, header and footer
  let isAuthPage = false;
  if (location.pathname === "/login" || location.pathname === "/register") {
    isAuthPage = true;
  }

  // shows the page only to the right role
  function only(role, page) {
    if (user === null) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    if (user.role === role) {
      return page;
    }
    return <Navigate to="/" replace />;
  }

  // logged-in users can't see login/register again
  let loginPage = <Login />;
  let registerPage = <Register />;
  if (user !== null) {
    loginPage = <Navigate to="/" replace />;
    registerPage = <Navigate to="/" replace />;
  }

  let sidebarArea = null;
  if (!isAuthPage) {
    sidebarArea = (
      <>
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

        {menuOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMenuOpen(false)} />
        )}
      </>
    );
  }

  let mainClass = "flex-1 overflow-y-auto p-4 md:p-6";
  if (isAuthPage) {
    mainClass = "flex-1 overflow-y-auto";
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
      {sidebarArea}

      <div className="flex min-w-0 flex-1 flex-col">
        {!isAuthPage && <Header onMenuClick={() => setMenuOpen(true)} />}

        <main className={mainClass}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Catalog />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/courses/:id/lessons/:lessonId" element={<LessonPage />} />

            <Route path="/dashboard" element={only("student", <Dashboard />)} />
            <Route path="/favourites" element={only("student", <Favourites />)} />

            <Route path="/instructor" element={only("instructor", <InstructorDashboard />)} />
            <Route path="/instructor/courses/new" element={only("instructor", <CourseEditor />)} />
            <Route path="/instructor/courses/:id" element={only("instructor", <CourseEditor />)} />

            <Route path="/login" element={loginPage} />
            <Route path="/register" element={registerPage} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
}