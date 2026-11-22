import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowUp, FiArrowDown, FiEdit2, FiTrash2 } from "react-icons/fi";
import { categories, levels, useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";

const emptyLesson = { title: "", duration: "", content: "", videoUrl: "", free: false };
const input = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500";

export default function CourseEditor() {
  const { id } = useParams();
  const { courses, user } = useApp();
  const course = id ? courses.find((c) => c.id === id) : null;

  if (id && (!course || course.ownerEmail !== user.email)) {
    return (
      <div className="py-20 text-center">
        <p>Course not found.</p>
        <Link to="/instructor" className="text-blue-600">Back to dashboard</Link>
      </div>
    );
  }
  return <EditorForm key={id || "new"} course={course} />;
}

function EditorForm({ course }) {
  const navigate = useNavigate();
  const { addCourse, updateCourse, addLesson, updateLesson, deleteLesson, moveLesson, getStudents } = useApp();

  const [form, setForm] = useState({
    title: course?.title || "",
    category: course?.category || categories[0],
    level: course?.level || levels[0],
    image: course?.image || "",
    description: course?.description || "",
  });
  const [saved, setSaved] = useState(false);
  const [lf, setLf] = useState(emptyLesson); 
  const [editingId, setEditingId] = useState(null);

  const change = (e) => {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveCourse = (e) => {
    e.preventDefault();
    if (course) {
      updateCourse(course.id, form);
      setSaved(true);
    } else {
      const newId = addCourse(form);
      navigate(`/instructor/courses/${newId}`, { replace: true }); 
    }
  };

  const lessonChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLf({ ...lf, [name]: type === "checkbox" ? checked : value });
  };

  const saveLesson = (e) => {
    e.preventDefault();
    if (editingId) updateLesson(course.id, editingId, lf);
    else addLesson(course.id, lf);
    setLf(emptyLesson);
    setEditingId(null);
  };

  const startEdit = (l) => {
    setEditingId(l.id);
    setLf({ title: l.title, duration: l.duration, content: l.content, videoUrl: l.videoUrl, free: l.free });
  }

  const handleDeleteLesson = (l) => {
    if (window.confirm(`Delete lesson "${l.title}"?`)) deleteLesson(course.id, l.id);
  }

  const students = course ? getStudents(course.id) : []

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/instructor" className="flex items-center gap-1 text-sm text-blue-600">
        <FiArrowLeft /> Instructor dashboard
      </Link>

      <form onSubmit={saveCourse} className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-bold">{course ? "Edit course" : "New course"}</h2>

        <label className="block text-sm font-medium">
          Title
          <input name="title" value={form.title} onChange={change} required className={input} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Category
            <select name="category" value={form.category} onChange={change} className={input}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Level
            <select name="level" value={form.level} onChange={change} className={input}>
              {levels.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Image link
          <input name="image" value={form.image} onChange={change} placeholder="https://..." className={input} />
        </label>
        <label className="block text-sm font-medium">
          Description
          <textarea name="description" value={form.description} onChange={change} rows={3} required className={input} />
        </label>

        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
            {course ? "Save changes" : "Create course"}
          </button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
        </div>
      </form>

      {course && (
        <>
       
          <section className="rounded-xl border bg-white">
            <h3 className="border-b p-4 font-bold">Lessons ({course.lessons.length})</h3>
            {course.lessons.length === 0 && <p className="p-4 text-sm text-gray-500">No lesson yet. Add the first one below.</p>}
            <ul>
              {course.lessons.map((l, i) => (
                <li key={l.id} className="flex items-center justify-between gap-3 border-b p-4 last:border-b-0">
                  <div>
                    <p className="font-medium">{i + 1}. {l.title}</p>
                    <p className="text-xs text-gray-500">
                      {l.duration}
                      {l.free && <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-green-700">Free preview</span>}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => moveLesson(course.id, l.id, -1)} disabled={i === 0} aria-label="Move up" className="rounded border p-2 disabled:opacity-30"><FiArrowUp /></button>
                    <button onClick={() => moveLesson(course.id, l.id, 1)} disabled={i === course.lessons.length - 1} aria-label="Move down" className="rounded border p-2 disabled:opacity-30"><FiArrowDown /></button>
                    <button onClick={() => startEdit(l)} aria-label="Edit lesson" className="rounded border p-2"><FiEdit2 /></button>
                    <button onClick={() => handleDeleteLesson(l)} aria-label="Delete lesson" className="rounded border border-red-300 p-2 text-red-600"><FiTrash2 /></button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

 
          <form onSubmit={saveLesson} className="space-y-4 rounded-xl border bg-white p-6">
            <h3 className="font-bold">{editingId ? "Edit lesson" : "Add a lesson"}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Title
                <input name="title" value={lf.title} onChange={lessonChange} required className={input} />
              </label>
              <label className="block text-sm font-medium">
                Duration
                <input name="duration" value={lf.duration} onChange={lessonChange} placeholder="10 min" className={input} />
              </label>
            </div>
            <label className="block text-sm font-medium">
              Content
              <textarea name="content" value={lf.content} onChange={lessonChange} rows={4} className={input} />
            </label>
            <label className="block text-sm font-medium">
              Video embed link (optional)
              <input name="videoUrl" value={lf.videoUrl} onChange={lessonChange} placeholder="https://www.youtube.com/embed/VIDEO_ID" className={input} />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="free" checked={lf.free} onChange={lessonChange} /> Free preview (visible without enrolling)
            </label>
            <div className="flex gap-3">
              <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
                {editingId ? "Save lesson" : "Add lesson"}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setLf(emptyLesson); }} className="rounded-lg border px-4 py-2">
                  Cancel
                </button>
              )}
            </div>
          </form>


          <section className="rounded-xl border bg-white p-6">
            <h3 className="mb-4 font-bold">Enrolled students ({students.length})</h3>
            {students.length === 0 ? (
              <p className="text-sm text-gray-500">No student has enrolled yet.</p>
            ) : (
              <div className="space-y-3">
                {students.map((s) => (
                  <div key={s.email}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{s.name} <span className="text-xs text-gray-400">{s.email}</span></span>
                      <span className="text-gray-500">{s.done}/{s.total} · {s.percent}%</span>
                    </div>
                    <ProgressBar percent={s.percent} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}