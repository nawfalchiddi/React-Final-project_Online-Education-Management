import { Link } from "react-router-dom";
import { FiBook, FiCheckCircle, FiAward, FiHeart } from "react-icons/fi";
import { useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";
import CourseCard from "../../../components/CourseCard";

// one row for an enrolled course
function CourseRow({ course }) {
  const { getProgress, getEnrollment, unenroll } = useApp();
  const progress = getProgress(course);
  const enrollment = getEnrollment(course.id);

  // which lesson to open: the last opened one, else the first not completed, else the first
  let lessonId = null;
  if (enrollment !== null) {
    for (let i = 0; i < course.lessons.length; i++) {
      if (course.lessons[i].id === enrollment.lastLessonId) {
        lessonId = course.lessons[i].id;
      }
    }
    if (lessonId === null) {
      for (let i = 0; i < course.lessons.length; i++) {
        if (!enrollment.completed.includes(course.lessons[i].id)) {
          lessonId = course.lessons[i].id;
          break;
        }
      }
    }
  }
  if (lessonId === null && course.lessons.length > 0) {
    lessonId = course.lessons[0].id;
  }

  function handleUnenroll() {
    if (window.confirm('Unenroll from "' + course.title + '"? Your progress will be lost.')) {
      unenroll(course.id);
    }
  }

  let openButton = null;
  if (lessonId !== null) {
    let buttonText = "Continue";
    if (progress.percent === 100) {
      buttonText = "Review";
    }
    openButton = (
      <Link to={"/courses/" + course.id + "/lessons/" + lessonId} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white">
        {buttonText}
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {course.image && <img src={course.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
      <div className="min-w-[180px] flex-1">
        <Link to={"/courses/" + course.id} className="font-semibold hover:text-blue-600">{course.title}</Link>
        <p className="mb-1 text-xs text-gray-500">{progress.done}/{progress.total} lessons · {progress.percent}%</p>
        <ProgressBar percent={progress.percent} />
      </div>
      {openButton}
      <button onClick={handleUnenroll} className="rounded-lg border px-3 py-1.5 text-sm">Unenroll</button>
    </div>
  );
}

export default function Dashboard() {
  const { courses, favourites, isEnrolled, getProgress } = useApp();

  // sort my courses in lists
  const myCourses = [];
  const inProgress = [];
  const finished = [];
  let lessonsDone = 0;

  for (let i = 0; i < courses.length; i++) {
    const c = courses[i];
    if (isEnrolled(c.id)) {
      myCourses.push(c);
      const p = getProgress(c);
      lessonsDone = lessonsDone + p.done;
      if (p.percent === 100) {
        finished.push(c);
      } else {
        inProgress.push(c);
      }
    }
  }

  const saved = [];
  for (let i = 0; i < courses.length; i++) {
    if (favourites.includes(courses[i].id)) {
      saved.push(courses[i]);
    }
  }

  // makes the rows of a list of courses
  function makeRows(list) {
    const rows = [];
    for (let i = 0; i < list.length; i++) {
      rows.push(<CourseRow key={list[i].id} course={list[i]} />);
    }
    return rows;
  }

  let inProgressBox;
  if (inProgress.length === 0) {
    inProgressBox = <p className="text-gray-500">Nothing in progress. <Link to="/courses" className="text-blue-600">Find a course</Link></p>;
  } else {
    inProgressBox = <div className="space-y-5">{makeRows(inProgress)}</div>;
  }

  let finishedBox;
  if (finished.length === 0) {
    finishedBox = <p className="text-gray-500">No completed course yet. Finish all lessons of a course to see it here.</p>;
  } else {
    finishedBox = <div className="space-y-5">{makeRows(finished)}</div>;
  }

  let savedBox;
  if (saved.length === 0) {
    savedBox = <p className="text-gray-500">No saved course. Tap the heart on a course to save it.</p>;
  } else {
    savedBox = (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {saved.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl ">My Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl shadow shadow-blue-500 bg-white p-4 shadow-sm">
          <FiBook className="mb-2 text-blue-600" size={22} />
          <h3 className="text-2xl font-bold">{myCourses.length}</h3>
          <p className="text-sm text-gray-500">Enrolled courses</p>
        </div>
        <div className="rounded-xl shadow shadow-blue-500 bg-white p-4 shadow-sm">
          <FiCheckCircle className="mb-2 text-blue-600" size={22} />
          <h3 className="text-2xl font-bold">{lessonsDone}</h3>
          <p className="text-sm text-gray-500">Lessons completed</p>
        </div>
        <div className="rounded-xl shadow shadow-blue-500 bg-white p-4 shadow-sm">
          <FiAward className="mb-2 text-blue-600" size={22} />
          <h3 className="text-2xl font-bold">{finished.length}</h3>
          <p className="text-sm text-gray-500">Courses finished</p>
        </div>
        <div className="rounded-xl shadow shadow-blue-500 bg-white p-4 shadow-sm">
          <FiHeart className="mb-2 text-blue-600" size={22} />
          <h3 className="text-2xl font-bold">{saved.length}</h3>
          <p className="text-sm text-gray-500">Saved courses</p>
        </div>
      </div>

      <section className="rounded-xl shadow shadow-blue-500 bg-white p-6">
        <h3 className="mb-4 font-bold">In progress</h3>
        {inProgressBox}
      </section>

      <section className="rounded-xl shadow shadow-blue-500 bg-white p-6">
        <h3 className="mb-4 font-bold">Completed courses</h3>
        {finishedBox}
      </section>

      <section>
        <h3 className="mb-3 font-bold">Saved courses</h3>
        {savedBox}
      </section>
    </div>
  );
}