/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

/* ---------------- 1) SEED DATA (first start only) ---------------- */
export const categories = ["Design", "Programming", "Marketing", "Photography"];
export const levels = ["Beginner", "Intermediate", "Advanced"];

const OWNER = "instructor@learnpro.com";

const mk = (id, title, category, instructor, level, image, description, lessonTitles) => ({
  id, title, category, instructor, level, image, description, ownerEmail: OWNER,
  lessons: lessonTitles.map((t, i) => ({
    id: `${id}-l${i + 1}`,
    title: t,
    duration: `${8 + i * 3} min`,
    content: `Welcome to "${t}". Read this lesson, practice, then mark it as completed.`,
    videoUrl: "",
    free: i === 0, // first lesson = free preview
  })),
});

const seedCourses = [
  mk("ux", "UI/UX Design Fundamentals", "Design", "Jane Cooper", "Beginner",
    "https://anddreamsdigital.com/wp-content/uploads/2023/01/what-is-ui-ux-design-1210x660.jpg",
    "Learn the basics of user research, wireframing and visual design.",
    ["What is UX?", "User research", "Wireframes", "Color & typography", "Prototyping in Figma"]),
  mk("brand", "Brand Identity Design", "Design", "Leslie Alexander", "Intermediate",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdxX_tUxvqlBPzBz1PmsPe2S7A1Kc0ZVxhLJfprw1d1ZGGRTMPK7E23fjN&s=10",
    "Create logos and brand systems that people remember.",
    ["Brand strategy", "Logo basics", "Color systems", "Brand guidelines"]),
  mk("py", "Python Programming for Beginners", "Programming", "Robert Fox", "Beginner",
    "https://files.realpython.com/media/building_with_python_watermark.2ebe5beb5b1e.jpg",
    "Start coding with Python: variables, loops, functions and more.",
    ["Install Python", "Variables & types", "Conditions", "Loops", "Functions", "Mini project"]),
  mk("react", "React for Beginners", "Programming", "Cody Fisher", "Intermediate",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZdSEdU4nTcHCZSH4N3tLbtTZjSvOSvDrmv_leu0ookzNVLxcc3t7i8Uc&s=10",
    "Build modern interfaces with components, props, state and hooks.",
    ["JSX", "Components & props", "State", "Effects", "Routing"]),
  mk("dm", "Digital Marketing Strategy", "Marketing", "Albert Flores", "Beginner",
    "https://blog.tuf.edu.pk/wp-content/uploads/2021/06/Digital-Marketing.jpg",
    "Plan campaigns across social media, email and search.",
    ["Marketing funnel", "Social media", "Email campaigns", "SEO basics"]),
  mk("ma", "Marketing Analytics", "Marketing", "Albert Flores", "Advanced",
    "https://i2idirectmarketing.com/wp-content/uploads/2023/01/Marketing-Analytics.jpg",
    "Measure what matters and make decisions with data.",
    ["KPIs", "Google Analytics", "A/B testing"]),
  mk("photo", "Photography Masterclass", "Photography", "Brooklyn Simmons", "Beginner",
    "https://i.ytimg.com/vi/8VuKE6GV6q0/maxresdefault.jpg",
    "Understand your camera, light and composition.",
    ["Camera basics", "Exposure triangle", "Composition", "Editing"]),
  mk("portrait", "Portrait Photography", "Photography", "Kristin Watson", "Intermediate",
    "https://www.australianphotographyschool.com.au/wp-content/uploads/shutterstock_2519105737-scaled.jpg",
    "Pose, light and retouch portraits like a pro.",
    ["Posing", "Natural light", "Studio light", "Retouching"]),
];

// Demo instructor account: instructor@learnpro.com / 123456
const seedAccounts = [{ name: "Jane Cooper", email: OWNER, password: "123456", role: "instructor" }];

/* ---------------- 2) CONTEXT ---------------- */
export const TheDataCont = createContext(null);
export const useApp = () => useContext(TheDataCont);

// useState that is saved in localStorage
function usePersistent(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue];
}

/* ---------------- 3) PROVIDER ---------------- */
export const Theprovider = ({ children }) => {
  const [accounts, setAccounts] = usePersistent("lp_accounts", seedAccounts); // everyone who signed up
  const [user, setUser] = usePersistent("lp_session", null);                  // logged-in user
  const [courses, setCourses] = usePersistent("lp_courses", seedCourses);
  // one row per student + course: { email, courseId, completed: [lessonIds], lastLessonId }
  const [enrollments, setEnrollments] = usePersistent("lp_enrollments", []);
  const [favs, setFavs] = usePersistent("lp_favs", {});                        // { email: [courseIds] }

  const email = user?.email;

  /* ----- auth ----- */
  const signup = ({ name, email, password, role }) => {
    const mail = email.trim().toLowerCase();
    if (accounts.some((a) => a.email === mail)) {
      return { ok: false, error: "This email is already registered." };
    }
    setAccounts([...accounts, { name: name.trim(), email: mail, password, role }]);
    return { ok: true };
  };

  const login = (mail, password) => {
    const found = accounts.find((a) => a.email === mail.trim().toLowerCase() && a.password === password);
    if (!found) return { ok: false, error: "Wrong email or password." };
    setUser({ name: found.name, email: found.email, role: found.role });
    return { ok: true, role: found.role };
  };

  const logout = () => setUser(null);

  /* ----- instructor: courses ----- */
  const addCourse = (data) => {
    const id = crypto.randomUUID();
    setCourses((prev) => [...prev, { ...data, id, ownerEmail: email, instructor: user.name, lessons: [] }]);
    return id;
  };
  const updateCourse = (id, patch) =>
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const deleteCourse = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setEnrollments((prev) => prev.filter((e) => e.courseId !== id));
  };

  /* ----- instructor: lessons ----- */
  const changeLessons = (courseId, fn) =>
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, lessons: fn(c.lessons) } : c)));

  const addLesson = (courseId, data) =>
    changeLessons(courseId, (list) => [...list, { ...data, id: crypto.randomUUID() }]);
  const updateLesson = (courseId, lessonId, patch) =>
    changeLessons(courseId, (list) => list.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)));
  const deleteLesson = (courseId, lessonId) =>
    changeLessons(courseId, (list) => list.filter((l) => l.id !== lessonId));
  const moveLesson = (courseId, lessonId, dir) =>
    changeLessons(courseId, (list) => {
      const i = list.findIndex((l) => l.id === lessonId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  /* ----- student: enrollment and progress ----- */
  const getEnrollment = (courseId) => enrollments.find((e) => e.email === email && e.courseId === courseId);
  const isEnrolled = (courseId) => !!getEnrollment(courseId);

  const enroll = (courseId) => {
    if (!email || user.role !== "student") return;
    setEnrollments((prev) =>
      prev.some((e) => e.email === email && e.courseId === courseId)
        ? prev // no double enrollment
        : [...prev, { email, courseId, completed: [], lastLessonId: null }]
    );
  };
  const unenroll = (courseId) =>
    setEnrollments((prev) => prev.filter((e) => !(e.email === email && e.courseId === courseId)));

  const patchEnrollment = (courseId, fn) =>
    setEnrollments((prev) => prev.map((e) => (e.email === email && e.courseId === courseId ? fn(e) : e)));

  const toggleLesson = (courseId, lessonId) =>
    patchEnrollment(courseId, (e) => ({
      ...e,
      completed: e.completed.includes(lessonId)
        ? e.completed.filter((x) => x !== lessonId)
        : [...e.completed, lessonId],
    }));

  const setLastLesson = (courseId, lessonId) =>
    patchEnrollment(courseId, (e) => (e.lastLessonId === lessonId ? e : { ...e, lastLessonId: lessonId }));

  // Always recalculated from the CURRENT lessons, so adding/deleting/un-marking updates the percent
  const getProgress = (course, mail = email) => {
    const e = enrollments.find((x) => x.email === mail && x.courseId === course.id);
    const total = course.lessons.length;
    const done = e ? course.lessons.filter((l) => e.completed.includes(l.id)).length : 0;
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  };

  /* ----- instructor: students ----- */
  const enrollmentCount = (courseId) => enrollments.filter((e) => e.courseId === courseId).length;
  const getStudents = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return enrollments
      .filter((e) => e.courseId === courseId)
      .map((e) => ({
        email: e.email,
        name: accounts.find((a) => a.email === e.email)?.name || e.email,
        ...getProgress(course, e.email),
      }));
  };

  /* ----- favourites (per student) ----- */
  const favourites = (favs[email] || []).filter((id) => courses.some((c) => c.id === id));
  const isFavourite = (id) => favourites.includes(id);
  const toggleFavourite = (id) => {
    if (!email) return;
    setFavs((prev) => {
      const list = prev[email] || [];
      return { ...prev, [email]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] };
    });
  };

  const value = {
    user, courses, favourites,
    signup, login, logout,
    addCourse, updateCourse, deleteCourse,
    addLesson, updateLesson, deleteLesson, moveLesson,
    enroll, unenroll, isEnrolled, getEnrollment, toggleLesson, setLastLesson, getProgress,
    enrollmentCount, getStudents,
    isFavourite, toggleFavourite,
  };

  return <TheDataCont.Provider value={value}>{children}</TheDataCont.Provider>;
};