import { Link } from "react-router-dom";
import { FiBook, FiUsers, FiList, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";

export default function InstructorDashboard() {
  const { user, courses, deleteCourse, enrollmentCount, getStudents } = useApp();

  const mine = courses.filter((c) => c.ownerEmail === user.email);
  const totalEnrollments = mine.reduce((s, c) => s + enrollmentCount(c.id), 0);
  const totalLessons = mine.reduce((s, c) => s + c.lessons.length, 0);
  const popular = [...mine].sort((a, b) => enrollmentCount(b.id) - enrollmentCount(a.id)).slice(0, 5);
  const max = Math.max(1, ...popular.map((c) => enrollmentCount(c.id)));

  const stats = [
    { icon: FiBook, n: mine.length, label: "My courses" },
    { icon: FiUsers, n: totalEnrollments, label: "Enrollments" },
    { icon: FiList, n: totalLessons, label: "Lessons" },
  ];

  const handleDelete = (c) => {
    if (window.confirm(`Delete "${c.title}" and all its lessons? Students will lose their progress.`)) deleteCourse(c.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Instructor dashboard</h2>
        <Link to="/instructor/courses/new" className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
          <FiPlus /> New course
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, n, label }) => (
          <div key={label} className="rounded-xl border bg-white p-4 shadow-sm">
            <Icon className="mb-2 text-blue-600" size={22} />
            <h3 className="text-2xl font-bold">{n}</h3>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 font-bold">Popular courses</h3>
        {popular.length === 0 ? (
          <p className="text-gray-500">No course yet.</p>
        ) : (
          <div className="space-y-3">
            {popular.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{c.title}</span>
                  <span className="text-gray-500">{enrollmentCount(c.id)} students</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: `${(enrollmentCount(c.id) / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 font-bold">My courses</h3>
        {mine.length === 0 ? (
          <p className="text-gray-500">You have no course yet. Click "New course" to create one.</p>
        ) : (
          <ul className="divide-y">
            {mine.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <Link to={`/courses/${c.id}`} className="font-semibold hover:text-blue-600">{c.title}</Link>
                  <p className="text-xs text-gray-500">{c.lessons.length} lessons · {enrollmentCount(c.id)} students</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/instructor/courses/${c.id}`} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm">
                    <FiEdit2 /> Edit
                  </Link>
                  <button onClick={() => handleDelete(c)} className="flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 font-bold">Students and their progress</h3>
        {mine.every((c) => enrollmentCount(c.id) === 0) ? (
          <p className="text-gray-500">No student has enrolled yet.</p>
        ) : (
          mine.filter((c) => enrollmentCount(c.id) > 0).map((c) => (
            <div key={c.id} className="mb-5 last:mb-0">
              <h4 className="mb-2 text-sm font-semibold text-gray-600">{c.title}</h4>
              <div className="space-y-3">
                {getStudents(c.id).map((s) => (
                  <div key={s.email}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{s.name} <span className="text-xs text-gray-400">{s.email}</span></span>
                      <span className="text-gray-500">{s.done}/{s.total} · {s.percent}%</span>
                    </div>
                    <ProgressBar percent={s.percent} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}