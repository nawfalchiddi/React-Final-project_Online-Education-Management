import { Link } from "react-router-dom";
import { FiBook, FiUsers, FiList, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";

export default function InstructorDashboard() {
  const { user, courses, deleteCourse, enrollmentCount, getStudents } = useApp();

  // my courses only
  const mine = [];
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].ownerEmail === user.email) {
      mine.push(courses[i]);
    }
  }

  // totals
  let totalEnrollments = 0;
  let totalLessons = 0;
  for (let i = 0; i < mine.length; i++) {
    totalEnrollments = totalEnrollments + enrollmentCount(mine[i].id);
    totalLessons = totalLessons + mine[i].lessons.length;
  }

  // popular courses: most students first, keep 5
  const sorted = mine.slice();
  sorted.sort(function (a, b) {
    return enrollmentCount(b.id) - enrollmentCount(a.id);
  });
  const popular = sorted.slice(0, 5);

  // biggest number of students (to draw the bars)
  let max = 1;
  for (let i = 0; i < popular.length; i++) {
    if (enrollmentCount(popular[i].id) > max) {
      max = enrollmentCount(popular[i].id);
    }
  }

  function handleDelete(c) {
    if (window.confirm('Delete "' + c.title + '" and all its lessons? Students will lose their progress.')) {
      deleteCourse(c.id);
    }
  }

  // ----- popular courses bars -----
  let popularBox;
  if (popular.length === 0) {
    popularBox = <p className="text-gray-500">No course yet.</p>;
  } else {
    const bars = [];
    for (let i = 0; i < popular.length; i++) {
      const c = popular[i];
      const count = enrollmentCount(c.id);
      const width = (count / max) * 100;
      bars.push(
        <div key={c.id}>
          <div className="mb-1 flex justify-between text-sm">
            <span>{c.title}</span>
            <span className="text-gray-500">{count} students</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: width + "%" }} />
          </div>
        </div>
      );
    }
    popularBox = <div className="space-y-3">{bars}</div>;
  }

  // ----- my courses list -----
  let myCoursesBox;
  if (mine.length === 0) {
    myCoursesBox = <p className="text-gray-500">You have no course yet. Click "New course" to create one.</p>;
  } else {
    const items = [];
    for (let i = 0; i < mine.length; i++) {
      const c = mine[i];
      items.push(
        <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <Link to={"/courses/" + c.id} className="font-semibold hover:text-blue-600">{c.title}</Link>
            <p className="text-xs text-gray-500">{c.lessons.length} lessons · {enrollmentCount(c.id)} students</p>
          </div>
          <div className="flex gap-2">
            <Link to={"/instructor/courses/" + c.id} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm">
              <FiEdit2 /> Edit
            </Link>
            <button onClick={() => handleDelete(c)} className="flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600">
              <FiTrash2 /> Delete
            </button>
          </div>
        </li>
      );
    }
    myCoursesBox = <ul className="divide-y">{items}</ul>;
  }

  // ----- students and their progress -----
  const studentBlocks = [];
  for (let i = 0; i < mine.length; i++) {
    const c = mine[i];
    if (enrollmentCount(c.id) > 0) {
      const students = getStudents(c.id);
      const studentRows = [];
      for (let k = 0; k < students.length; k++) {
        const s = students[k];
        studentRows.push(
          <div key={s.email}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{s.name} <span className="text-xs text-gray-400">{s.email}</span></span>
              <span className="text-gray-500">{s.done}/{s.total} · {s.percent}%</span>
            </div>
            <ProgressBar percent={s.percent} />
          </div>
        );
      }
      studentBlocks.push(
        <div key={c.id} className="mb-5 last:mb-0">
          <h4 className="mb-2 text-sm font-semibold text-gray-600">{c.title}</h4>
          <div className="space-y-3">{studentRows}</div>
        </div>
      );
    }
  }

  let studentsBox;
  if (studentBlocks.length === 0) {
    studentsBox = <p className="text-gray-500">No student has enrolled yet.</p>;
  } else {
    studentsBox = studentBlocks;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Instructor dashboard</h2>
        <Link to="/instructor/courses/new" className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
          <FiPlus /> New course
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <FiBook className="mb-2 text-blue-600" size={22} />
          <h3 className="text-2xl font-bold">{mine.length}</h3>
          <p className="text-sm text-gray-500">My courses</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <FiUsers className="mb-2 text-blue-600" size={22} />
          <h3 className="text-2xl font-bold">{totalEnrollments}</h3>
          <p className="text-sm text-gray-500">Enrollments</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <FiList className="mb-2 text-blue-600" size={22} />
          <h3 className="text-2xl font-bold">{totalLessons}</h3>
          <p className="text-sm text-gray-500">Lessons</p>
        </div>
      </div>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 font-bold">Popular courses</h3>
        {popularBox}
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 font-bold">My courses</h3>
        {myCoursesBox}
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 font-bold">Students and their progress</h3>
        {studentsBox}
      </section>
    </div>
  );
}