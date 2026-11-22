import { Link } from "react-router-dom";
import { FiBook, FiCheckCircle, FiAward, FiHeart } from "react-icons/fi";
import { useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";
import CourseCard from "../../../components/CourseCard";

export default function Dashboard() {
  const { courses, favourites, isEnrolled, getProgress, getEnrollment, unenroll } = useApp();

  const myCourses = courses.filter((c) => isEnrolled(c.id));
  const inProgress = myCourses.filter((c) => getProgress(c).percent < 100);
  const finished = myCourses.filter((c) => getProgress(c).percent === 100);
  const saved = courses.filter((c) => favourites.includes(c.id));
  const lessonsDone = myCourses.reduce((sum, c) => sum + getProgress(c).done, 0);

  const stats = [
    { icon: FiBook, n: myCourses.length, label: "Enrolled courses" },
    { icon: FiCheckCircle, n: lessonsDone, label: "Lessons completed" },
    { icon: FiAward, n: finished.length, label: "Courses finished" },
    { icon: FiHeart, n: saved.length, label: "Saved courses" },
  ];

  const handleUnenroll = (c) => {
    if (window.confirm(`Unenroll from "${c.title}"? Your progress will be lost.`)) unenroll(c.id);
  };

  // one row of an enrolled course
  const Row = ({ c }) => {
    const { done, total, percent } = getProgress(c);
    const e = getEnrollment(c.id);
    const lessonId = c.lessons.some((l) => l.id === e?.lastLessonId)
      ? e.lastLessonId
      : (c.lessons.find((l) => !e?.completed.includes(l.id)) || c.lessons[0])?.id;
    return (
      <div className="flex flex-wrap items-center gap-4">
        {c.image && <img src={c.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
        <div className="min-w-[180px] flex-1">
          <Link to={`/courses/${c.id}`} className="font-semibold hover:text-blue-600">{c.title}</Link>
          <p className="mb-1 text-xs text-gray-500">{done}/{total} lessons · {percent}%</p>
          <ProgressBar percent={percent} />
        </div>
        {lessonId && (
          <Link to={`/courses/${c.id}/lessons/${lessonId}`} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white">
            {percent === 100 ? "Review" : "Continue"}
          </Link>
        )}
        <button onClick={() => handleUnenroll(c)} className="rounded-lg border px-3 py-1.5 text-sm">Unenroll</button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My dashboard</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ icon: Icon, n, label }) => (
          <div key={label} className="rounded-xl border bg-white p-4 shadow-sm">
            <Icon className="mb-2 text-blue-600" size={22} />
            <h3 className="text-2xl font-bold">{n}</h3>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 font-bold">In progress</h3>
        {inProgress.length === 0 ? (
          <p className="text-gray-500">Nothing in progress. <Link to="/courses" className="text-blue-600">Find a course</Link></p>
        ) : (
          <div className="space-y-5">{inProgress.map((c) => <Row key={c.id} c={c} />)}</div>
        )}
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 font-bold">Completed courses</h3>
        {finished.length === 0 ? (
          <p className="text-gray-500">No completed course yet. Finish all lessons of a course to see it here.</p>
        ) : (
          <div className="space-y-5">{finished.map((c) => <Row key={c.id} c={c} />)}</div>
        )}
      </section>

      <section>
        <h3 className="mb-3 font-bold">Saved courses</h3>
        {saved.length === 0 ? (
          <p className="text-gray-500">No saved course. Tap the heart on a course to save it.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {saved.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}