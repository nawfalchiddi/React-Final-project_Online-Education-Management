import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowUp, FiArrowDown, FiEdit2, FiTrash2 } from "react-icons/fi";
import { categories, levels, useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";

const inputClass = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500";

// Step 1: find the course and check that it belongs to this instructor
export default function CourseEditor() {
  const { id } = useParams(); // id is undefined on the "new course" page
  const { courses, user } = useApp();

  let course = null;
  if (id !== undefined) {
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].id === id) {
        course = courses[i];
      }
    }
    if (course === null || course.ownerEmail !== user.email) {
      return (
        <div className="py-20 text-center">
          <p>Course not found.</p>
          <Link to="/instructor" className="text-blue-600">Back to dashboard</Link>
        </div>
      );
    }
  }

  // the key makes React start a fresh form when we go from "new" to "edit"
  let formKey = "new";
  if (id !== undefined) {
    formKey = id;
  }
  return <EditorForm key={formKey} course={course} />;
}

function EditorForm({ course }) {
  const navigate = useNavigate();
  const { addCourse, updateCourse, addLesson, updateLesson, deleteLesson, moveLesson, getStudents } = useApp();

  let startTitle = "";
  let startCategory = categories[0];
  let startLevel = levels[0];
  let startImage = "";
  let startDescription = "";
  if (course !== null) {
    startTitle = course.title;
    startCategory = course.category;
    startLevel = course.level;
    startImage = course.image;
    startDescription = course.description;
  }

  const [title, setTitle] = useState(startTitle);
  const [category, setCategory] = useState(startCategory);
  const [level, setLevel] = useState(startLevel);
  const [image, setImage] = useState(startImage);
  const [description, setDescription] = useState(startDescription);
  const [saved, setSaved] = useState(false);

  const [lTitle, setLTitle] = useState("");
  const [lDuration, setLDuration] = useState("");
  const [lContent, setLContent] = useState("");
  const [lVideo, setLVideo] = useState("");
  const [lFree, setLFree] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function saveCourse(e) {
    e.preventDefault();
    const data = { title: title, category: category, level: level, image: image, description: description };
    if (course !== null) {
      updateCourse(course.id, data);
      setSaved(true);
    } else {
      const newId = addCourse(data);
      navigate("/instructor/courses/" + newId, { replace: true }); 
    }
  }

  function clearLessonForm() {
    setLTitle("");
    setLDuration("");
    setLContent("");
    setLVideo("");
    setLFree(false);
    setEditingId(null);
  }

  function saveLesson(e) {
    e.preventDefault();
    const data = { title: lTitle, duration: lDuration, content: lContent, videoUrl: lVideo, free: lFree };
    if (editingId !== null) {
      updateLesson(course.id, editingId, data);
    } else {
      addLesson(course.id, data);
    }
    clearLessonForm();
  }


  function startEdit(lesson) {
    setEditingId(lesson.id);
    setLTitle(lesson.title);
    setLDuration(lesson.duration);
    setLContent(lesson.content);
    setLVideo(lesson.videoUrl);
    setLFree(lesson.free);
  }

  function handleDeleteLesson(lesson) {
    if (window.confirm('Delete lesson "' + lesson.title + '"?')) {
      deleteLesson(course.id, lesson.id);
    }
  }

  let extraSections = null;
  if (course !== null) {
  
    const lessonRows = [];
    for (let i = 0; i < course.lessons.length; i++) {
      const l = course.lessons[i];
      const isFirst = i === 0;
      const isLast = i === course.lessons.length - 1;

      let freeBadge = null;
      if (l.free) {
        freeBadge = <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-green-700">Free preview</span>;
      }

      lessonRows.push(
        <li key={l.id} className="flex items-center justify-between gap-3 border-b p-4 last:border-b-0">
          <div>
            <p className="font-medium">{i + 1}. {l.title}</p>
            <p className="text-xs text-gray-500">
              {l.duration}
              {freeBadge}
            </p>
          </div>
          <div className="flex gap-1">
            <button onClick={() => moveLesson(course.id, l.id, -1)} disabled={isFirst} aria-label="Move up" className="rounded border p-2 disabled:opacity-30"><FiArrowUp /></button>
            <button onClick={() => moveLesson(course.id, l.id, 1)} disabled={isLast} aria-label="Move down" className="rounded border p-2 disabled:opacity-30"><FiArrowDown /></button>
            <button onClick={() => startEdit(l)} aria-label="Edit lesson" className="rounded border p-2"><FiEdit2 /></button>
            <button onClick={() => handleDeleteLesson(l)} aria-label="Delete lesson" className="rounded border border-red-300 p-2 text-red-600"><FiTrash2 /></button>
          </div>
        </li>
      );
    }

    const students = getStudents(course.id);
    const studentRows = [];
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
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

    let studentsBox = <div className="space-y-3">{studentRows}</div>;
    if (students.length === 0) {
      studentsBox = <p className="text-sm text-gray-500">No student has enrolled yet.</p>;
    }

    let lessonFormTitle = "Add a lesson";
    let lessonButtonText = "Add lesson";
    if (editingId !== null) {
      lessonFormTitle = "Edit lesson";
      lessonButtonText = "Save lesson";
    }

    extraSections = (
      <>
        <section className="rounded-xl border bg-white">
          <h3 className="border-b p-4 font-bold">Lessons ({course.lessons.length})</h3>
          {course.lessons.length === 0 && <p className="p-4 text-sm text-gray-500">No lesson yet. Add the first one below.</p>}
          <ul>{lessonRows}</ul>
        </section>

        <form onSubmit={saveLesson} className="space-y-4 rounded-xl border bg-white p-6">
          <h3 className="font-bold">{lessonFormTitle}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Title
              <input value={lTitle} onChange={(e) => setLTitle(e.target.value)} required className={inputClass} />
            </label>
            <label className="block text-sm font-medium">
              Duration
              <input value={lDuration} onChange={(e) => setLDuration(e.target.value)} placeholder="10 min" className={inputClass} />
            </label>
          </div>
          <label className="block text-sm font-medium">
            Content
            <textarea value={lContent} onChange={(e) => setLContent(e.target.value)} rows={4} className={inputClass} />
          </label>
          <label className="block text-sm font-medium">
            Video embed link (optional)
            <input value={lVideo} onChange={(e) => setLVideo(e.target.value)} placeholder="https://www.youtube.com/embed/VIDEO_ID" className={inputClass} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={lFree} onChange={(e) => setLFree(e.target.checked)} /> Free preview (visible without enrolling)
          </label>
          <div className="flex gap-3">
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">{lessonButtonText}</button>
            {editingId !== null && (
              <button type="button" onClick={clearLessonForm} className="rounded-lg border px-4 py-2">Cancel</button>
            )}
          </div>
        </form>

        <section className="rounded-xl border bg-white p-6">
          <h3 className="mb-4 font-bold">Enrolled students ({students.length})</h3>
          {studentsBox}
        </section>
      </>
    );
  }

  let formTitle = "New course";
  let courseButtonText = "Create course";
  if (course !== null) {
    formTitle = "Edit course";
    courseButtonText = "Save changes";
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/instructor" className="flex items-center gap-1 text-sm text-blue-600">
        <FiArrowLeft /> Instructor dashboard
      </Link>

      <form onSubmit={saveCourse} className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-bold">{formTitle}</h2>

        <label className="block text-sm font-medium">
          Title
          <input value={title} onChange={(e) => { setTitle(e.target.value); setSaved(false); }} required className={inputClass} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Category
            <select value={category} onChange={(e) => { setCategory(e.target.value); setSaved(false); }} className={inputClass}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Level
            <select value={level} onChange={(e) => { setLevel(e.target.value); setSaved(false); }} className={inputClass}>
              {levels.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Image link
          <input value={image} onChange={(e) => { setImage(e.target.value); setSaved(false); }} placeholder="https://..." className={inputClass} />
        </label>
        <label className="block text-sm font-medium">
          Description
          <textarea value={description} onChange={(e) => { setDescription(e.target.value); setSaved(false); }} rows={3} required className={inputClass} />
        </label>

        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">{courseButtonText}</button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
        </div>
      </form>

      {extraSections}
    </div>
  );
}