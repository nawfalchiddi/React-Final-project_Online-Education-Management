/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

/* ================= 1) STATIC DATA ================= */
export const categories = ["Design", "Programming", "Marketing", "Photography"];
export const levels = ["Beginner", "Intermediate", "Advanced"];

const OWNER = "instructor@learnpro.com";

// builds one course object (the lessons are created from the titles)
function makeCourse(id, title, category, instructor, level, image, description, lessonTitles) {
  const lessons = [];
  for (let i = 0; i < lessonTitles.length; i++) {
    lessons.push({
      id: id + "-l" + (i + 1),
      title: lessonTitles[i],
      duration: 8 + i * 3 + " min",
      content: 'Welcome to "' + lessonTitles[i] + '". Read this lesson, practice, then mark it as completed.',
      videoUrl: "",
      free: i === 0, // first lesson = free preview
    });
  }
  return {
    id: id,
    title: title,
    category: category,
    instructor: instructor,
    level: level,
    image: image,
    description: description,
    ownerEmail: OWNER,
    lessons: lessons,
  };
}

const seedCourses = [
  makeCourse("ux", "UI/UX Design Fundamentals", "Design", "Jane Cooper", "Beginner",
    "https://anddreamsdigital.com/wp-content/uploads/2023/01/what-is-ui-ux-design-1210x660.jpg",
    "Learn the basics of user research, wireframing and visual design.",
    ["What is UX?", "User research", "Wireframes", "Color & typography", "Prototyping in Figma"]),
  makeCourse("brand", "Brand Identity Design", "Design", "Leslie Alexander", "Intermediate",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdxX_tUxvqlBPzBz1PmsPe2S7A1Kc0ZVxhLJfprw1d1ZGGRTMPK7E23fjN&s=10",
    "Create logos and brand systems that people remember.",
    ["Brand strategy", "Logo basics", "Color systems", "Brand guidelines"]),
  makeCourse("py", "Python Programming for Beginners", "Programming", "Robert Fox", "Beginner",
    "https://files.realpython.com/media/building_with_python_watermark.2ebe5beb5b1e.jpg",
    "Start coding with Python: variables, loops, functions and more.",
    ["Install Python", "Variables & types", "Conditions", "Loops", "Functions", "Mini project"]),
  makeCourse("react", "React for Beginners", "Programming", "Cody Fisher", "Intermediate",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZdSEdU4nTcHCZSH4N3tLbtTZjSvOSvDrmv_leu0ookzNVLxcc3t7i8Uc&s=10",
    "Build modern interfaces with components, props, state and hooks.",
    ["JSX", "Components & props", "State", "Effects", "Routing"]),
  makeCourse("dm", "Digital Marketing Strategy", "Marketing", "Albert Flores", "Beginner",
    "https://blog.tuf.edu.pk/wp-content/uploads/2021/06/Digital-Marketing.jpg",
    "Plan campaigns across social media, email and search.",
    ["Marketing funnel", "Social media", "Email campaigns", "SEO basics"]),
  makeCourse("ma", "Marketing Analytics", "Marketing", "Albert Flores", "Advanced",
    "https://i2idirectmarketing.com/wp-content/uploads/2023/01/Marketing-Analytics.jpg",
    "Measure what matters and make decisions with data.",
    ["KPIs", "Google Analytics", "A/B testing"]),
  makeCourse("photo", "Photography Masterclass", "Photography", "Brooklyn Simmons", "Beginner",
    "https://i.ytimg.com/vi/8VuKE6GV6q0/maxresdefault.jpg",
    "Understand your camera, light and composition.",
    ["Camera basics", "Exposure triangle", "Composition", "Editing"]),
  makeCourse("portrait", "Portrait Photography", "Photography", "Kristin Watson", "Intermediate",
    "https://www.australianphotographyschool.com.au/wp-content/uploads/shutterstock_2519105737-scaled.jpg",
    "Pose, light and retouch portraits like a pro.",
    ["Posing", "Natural light", "Studio light", "Retouching"]),
];

// Demo instructor account: instructor@learnpro.com / 123456
const seedAccounts = [{ name: "Jane Cooper", email: OWNER, password: "123456", role: "instructor" }];

// reads a value from the browser memory (localStorage)
function loadFromStorage(key, defaultValue) {
  const saved = localStorage.getItem(key);
  if (saved === null) {
    return defaultValue;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return defaultValue;
  }
}

/* ================= 2) CONTEXT ================= */
export const TheDataCont = createContext(null);

export function useApp() {
  return useContext(TheDataCont);
}

/* ================= 3) PROVIDER ================= */
export function Theprovider({ children }) {
  // The data. (We pass a function to useState so it reads localStorage only once.)
  const [accounts, setAccounts] = useState(() => loadFromStorage("lp_accounts", seedAccounts));
  const [user, setUser] = useState(() => loadFromStorage("lp_session", null));
  const [courses, setCourses] = useState(() => loadFromStorage("lp_courses", seedCourses));
  // enrollments: one row per student + course  { email, courseId, completed: [lessonIds], lastLessonId }
  const [enrollments, setEnrollments] = useState(() => loadFromStorage("lp_enrollments", []));
  // favs: { "ali@mail.com": ["py", "ux"] }
  const [favs, setFavs] = useState(() => loadFromStorage("lp_favs", {}));

  // Save to localStorage each time the data changes
  useEffect(() => {
    localStorage.setItem("lp_accounts", JSON.stringify(accounts));
  }, [accounts]);
  useEffect(() => {
    localStorage.setItem("lp_session", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem("lp_courses", JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem("lp_enrollments", JSON.stringify(enrollments));
  }, [enrollments]);
  useEffect(() => {
    localStorage.setItem("lp_favs", JSON.stringify(favs));
  }, [favs]);

  // email of the logged-in user (null if nobody)
  let email = null;
  if (user !== null) {
    email = user.email;
  }

  /* ---------- small helper ---------- */
  function findCourse(courseId) {
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].id === courseId) {
        return courses[i];
      }
    }
    return null;
  }

  /* ---------- login / signup ---------- */
  function signup(data) {
    const mail = data.email.trim().toLowerCase();
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].email === mail) {
        return { ok: false, error: "This email is already registered." };
      }
    }
    const newAccount = {
      name: data.name.trim(),
      email: mail,
      password: data.password,
      role: data.role,
    };
    setAccounts(accounts.concat([newAccount]));
    return { ok: true };
  }

  function login(mail, password) {
    const cleanMail = mail.trim().toLowerCase();
    for (let i = 0; i < accounts.length; i++) {
      const a = accounts[i];
      if (a.email === cleanMail && a.password === password) {
        setUser({ name: a.name, email: a.email, role: a.role }); // no password in the session
        return { ok: true, role: a.role };
      }
    }
    return { ok: false, error: "Wrong email or password." };
  }

  function logout() {
    setUser(null);
  }

  /* ---------- instructor: courses ---------- */
  function addCourse(data) {
    const newId = crypto.randomUUID();
    const newCourse = {
      id: newId,
      title: data.title,
      category: data.category,
      level: data.level,
      image: data.image,
      description: data.description,
      ownerEmail: email,
      instructor: user.name,
      lessons: [],
    };
    setCourses(courses.concat([newCourse]));
    return newId;
  }

  function updateCourse(courseId, changes) {
    const newCourses = [];
    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      if (c.id === courseId) {
        newCourses.push({ ...c, ...changes }); // copy the course, then overwrite the changed fields
      } else {
        newCourses.push(c);
      }
    }
    setCourses(newCourses);
  }

  function deleteCourse(courseId) {
    const newCourses = [];
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].id !== courseId) {
        newCourses.push(courses[i]);
      }
    }
    setCourses(newCourses);

    // also remove the students' enrollments of this course
    const newEnrollments = [];
    for (let i = 0; i < enrollments.length; i++) {
      if (enrollments[i].courseId !== courseId) {
        newEnrollments.push(enrollments[i]);
      }
    }
    setEnrollments(newEnrollments);
  }

  /* ---------- instructor: lessons ---------- */
  // puts a new list of lessons inside a course
  function setLessonsOfCourse(courseId, newLessons) {
    const newCourses = [];
    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      if (c.id === courseId) {
        newCourses.push({ ...c, lessons: newLessons });
      } else {
        newCourses.push(c);
      }
    }
    setCourses(newCourses);
  }

  function addLesson(courseId, data) {
    const course = findCourse(courseId);
    if (course === null) return;
    const newLesson = {
      id: crypto.randomUUID(),
      title: data.title,
      duration: data.duration,
      content: data.content,
      videoUrl: data.videoUrl,
      free: data.free,
    };
    setLessonsOfCourse(courseId, course.lessons.concat([newLesson]));
  }

  function updateLesson(courseId, lessonId, data) {
    const course = findCourse(courseId);
    if (course === null) return;
    const newLessons = [];
    for (let i = 0; i < course.lessons.length; i++) {
      const l = course.lessons[i];
      if (l.id === lessonId) {
        newLessons.push({ ...l, ...data });
      } else {
        newLessons.push(l);
      }
    }
    setLessonsOfCourse(courseId, newLessons);
  }

  function deleteLesson(courseId, lessonId) {
    const course = findCourse(courseId);
    if (course === null) return;
    const newLessons = [];
    for (let i = 0; i < course.lessons.length; i++) {
      if (course.lessons[i].id !== lessonId) {
        newLessons.push(course.lessons[i]);
      }
    }
    setLessonsOfCourse(courseId, newLessons);
  }

  // direction: -1 = move up, 1 = move down
  function moveLesson(courseId, lessonId, direction) {
    const course = findCourse(courseId);
    if (course === null) return;
    const list = course.lessons.slice(); // a copy

    let i = -1;
    for (let k = 0; k < list.length; k++) {
      if (list[k].id === lessonId) {
        i = k;
      }
    }
    const j = i + direction; // the neighbour
    if (i === -1 || j < 0 || j >= list.length) return;

    const temp = list[i]; // swap
    list[i] = list[j];
    list[j] = temp;
    setLessonsOfCourse(courseId, list);
  }

  /* ---------- student: enrollment ---------- */
  // the enrollment of the logged-in student in this course (or null)
  function getEnrollment(courseId) {
    for (let i = 0; i < enrollments.length; i++) {
      const e = enrollments[i];
      if (e.email === email && e.courseId === courseId) {
        return e;
      }
    }
    return null;
  }

  function isEnrolled(courseId) {
    return getEnrollment(courseId) !== null;
  }

  function enroll(courseId) {
    if (user === null) return;
    if (user.role !== "student") return;
    if (isEnrolled(courseId)) return; // no double enrollment
    const newEnrollment = { email: email, courseId: courseId, completed: [], lastLessonId: null };
    setEnrollments(enrollments.concat([newEnrollment]));
  }

  function unenroll(courseId) {
    const newEnrollments = [];
    for (let i = 0; i < enrollments.length; i++) {
      const e = enrollments[i];
      if (e.email === email && e.courseId === courseId) {
        // skip it = remove it
      } else {
        newEnrollments.push(e);
      }
    }
    setEnrollments(newEnrollments);
  }

  // mark a lesson as completed, or un-mark it
  function toggleLesson(courseId, lessonId) {
    const newEnrollments = [];
    for (let i = 0; i < enrollments.length; i++) {
      const e = enrollments[i];
      if (e.email === email && e.courseId === courseId) {
        let newCompleted = [];
        if (e.completed.includes(lessonId)) {
          for (let k = 0; k < e.completed.length; k++) {
            if (e.completed[k] !== lessonId) {
              newCompleted.push(e.completed[k]);
            }
          }
        } else {
          newCompleted = e.completed.concat([lessonId]);
        }
        newEnrollments.push({
          email: e.email,
          courseId: e.courseId,
          completed: newCompleted,
          lastLessonId: e.lastLessonId,
        });
      } else {
        newEnrollments.push(e);
      }
    }
    setEnrollments(newEnrollments);
  }

  // remember the last lesson the student opened
  function setLastLesson(courseId, lessonId) {
    let changed = false;
    const newEnrollments = [];
    for (let i = 0; i < enrollments.length; i++) {
      const e = enrollments[i];
      if (e.email === email && e.courseId === courseId && e.lastLessonId !== lessonId) {
        newEnrollments.push({
          email: e.email,
          courseId: e.courseId,
          completed: e.completed,
          lastLessonId: lessonId,
        });
        changed = true;
      } else {
        newEnrollments.push(e);
      }
    }
    if (changed) {
      setEnrollments(newEnrollments);
    }
  }

  // progress is calculated each time from the CURRENT lessons
  function getProgress(course, mail) {
    let who = mail;
    if (who === undefined) {
      who = email; // by default: the logged-in student
    }

    let enrollment = null;
    for (let i = 0; i < enrollments.length; i++) {
      if (enrollments[i].email === who && enrollments[i].courseId === course.id) {
        enrollment = enrollments[i];
      }
    }

    const total = course.lessons.length;
    let done = 0;
    if (enrollment !== null) {
      for (let i = 0; i < course.lessons.length; i++) {
        if (enrollment.completed.includes(course.lessons[i].id)) {
          done = done + 1;
        }
      }
    }

    let percent = 0;
    if (total > 0) {
      percent = Math.round((done / total) * 100);
    }
    return { done: done, total: total, percent: percent };
  }

  /* ---------- instructor: students ---------- */
  function enrollmentCount(courseId) {
    let count = 0;
    for (let i = 0; i < enrollments.length; i++) {
      if (enrollments[i].courseId === courseId) {
        count = count + 1;
      }
    }
    return count;
  }

  function getStudents(courseId) {
    const course = findCourse(courseId);
    const students = [];
    if (course === null) return students;

    for (let i = 0; i < enrollments.length; i++) {
      const e = enrollments[i];
      if (e.courseId === courseId) {
        let name = e.email;
        for (let k = 0; k < accounts.length; k++) {
          if (accounts[k].email === e.email) {
            name = accounts[k].name;
          }
        }
        const progress = getProgress(course, e.email);
        students.push({
          email: e.email,
          name: name,
          done: progress.done,
          total: progress.total,
          percent: progress.percent,
        });
      }
    }
    return students;
  }

  /* ---------- favourites (saved courses) ---------- */
  // ids of the saved courses of the logged-in student (only courses that still exist)
  const favourites = [];
  if (email !== null && favs[email] !== undefined) {
    for (let i = 0; i < favs[email].length; i++) {
      if (findCourse(favs[email][i]) !== null) {
        favourites.push(favs[email][i]);
      }
    }
  }

  function isFavourite(courseId) {
    return favourites.includes(courseId);
  }

  function toggleFavourite(courseId) {
    if (email === null) return;

    let oldList = [];
    if (favs[email] !== undefined) {
      oldList = favs[email];
    }

    let newList = [];
    if (oldList.includes(courseId)) {
      for (let i = 0; i < oldList.length; i++) {
        if (oldList[i] !== courseId) {
          newList.push(oldList[i]);
        }
      }
    } else {
      newList = oldList.concat([courseId]);
    }

    const newFavs = { ...favs };
    newFavs[email] = newList;
    setFavs(newFavs);
  }

  const value = {
    user: user,
    courses: courses,
    favourites: favourites,
    signup: signup,
    login: login,
    logout: logout,
    addCourse: addCourse,
    updateCourse: updateCourse,
    deleteCourse: deleteCourse,
    addLesson: addLesson,
    updateLesson: updateLesson,
    deleteLesson: deleteLesson,
    moveLesson: moveLesson,
    enroll: enroll,
    unenroll: unenroll,
    isEnrolled: isEnrolled,
    getEnrollment: getEnrollment,
    toggleLesson: toggleLesson,
    setLastLesson: setLastLesson,
    getProgress: getProgress,
    enrollmentCount: enrollmentCount,
    getStudents: getStudents,
    isFavourite: isFavourite,
    toggleFavourite: toggleFavourite,
  };

  return <TheDataCont.Provider value={value}>{children}</TheDataCont.Provider>;
}