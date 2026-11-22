import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCheck, FiLock } from "react-icons/fi";
import { useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";

export default function LessonPage() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const { courses, user, isEnrolled, enroll, getEnrollment, toggleLesson, setLastLesson, getProgress } = useApp();

  // find the course
  //  and the lesson
  let course = null;
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].id === id) {
      course = courses[i];
    }
  }

  let index = -1;
  let lesson = null;
  if (course !== null) {
    for (let i = 0; i < course.lessons.length; i++) {
      if (course.lessons[i].id === lessonId) {
        index = i;
        lesson = course.lessons[i];
      }
    }
  }

  const enrolled = isEnrolled(id);

  let isOwner = false;
  if (user !== null && course !== null && user.email === course.ownerEmail) {
    isOwner = true;
  }

  // can the user see this lesson
  let canView = false;
  if (lesson !== null) {
    if (enrolled || lesson.free || isOwner) {
      canView = true;
    }
  }

  // remember the last opened lesson 
  // continue where you last step on a course
  useEffect(() => {
    if (enrolled && lesson !== null) {
      setLastLesson(id, lessonId);
    }
    
  }, [enrolled, id, lessonId]);

  if (course === null || lesson === null) {
    return (
      <div className="py-20 text-center">
        <p>Lesson not found.</p>
        <Link to="/courses" className="text-blue-600">Back to catalog</Link>
      </div>
    );
  }

  // previous 
  // and next lessons
  let prev = null;
  if (index > 0) {
    prev = course.lessons[index - 1];
  }
  let next = null;
  if (index < course.lessons.length - 1) {
    next = course.lessons[index + 1];
  }

  let isDone = false;
  const enrollment = getEnrollment(id);
  if (enrollment !== null) {
    isDone = enrollment.completed.includes(lessonId);
  }

  const progress = getProgress(course);

  // can this person enroll 
  // visitors and students
  let canEnroll = false;
  if (user === null || user.role === "student") {
    canEnroll = true;
  }

  function handleEnroll() {
    if (user === null) {
      navigate("/login", { state: { from: "/courses/" + id + "/lessons/" + lessonId } });
    } else {
      enroll(id);
    }
  }

  // button 
  // mmark as completed
  let doneClass = "flex items-center gap-2 rounded-lg px-4 py-2 font-semibold bg-blue-600 text-white";
  let doneText = "Mark as completed";
  if (isDone) {
    doneClass = "flex items-center gap-2 rounded-lg px-4 py-2 font-semibold bg-green-100 text-green-700";
    doneText = "Completed (click to undo)";
  }

  // the middle part 
  //  locked box
  //  or the lesson
  let middle;
  if (!canView) {
    middle = (
      <div className="rounded-xl border bg-white p-8 text-center">
        <FiLock className="mx-auto mb-3 text-3xl text-gray-400" />
        <p className="mb-4">This lesson is locked. enroll in the course to unlock it.</p>
        {canEnroll && (
          <button onClick={handleEnroll} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
            Enroll in this course
          </button>
        )}
      </div>
    );
  } else {
    middle = (
      <>
        {lesson.videoUrl && (
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe src={lesson.videoUrl} title={lesson.title} className="h-full w-full" allowFullScreen />
          </div>
        )}
        <div className="whitespace-pre-line rounded-xl border bg-white p-5 text-gray-700">{lesson.content}</div>

        {enrolled && (
          <button onClick={() => toggleLesson(id, lessonId)} className={doneClass}>
            <FiCheck /> {doneText}
          </button>
        )}
        {!enrolled && lesson.free && canEnroll && (
          <p className="text-sm text-gray-500">
            This is a free preview. <button onClick={handleEnroll} className="text-blue-600 underline">Enroll</button> to unlock all lessons and save your progress.
          </p>
        )}
      </>
    );
  }

  // previous or
  //  next buttons
  let prevButton = <span />;
  if (prev !== null) {
    prevButton = (
      <Link to={"/courses/" + id + "/lessons/" + prev.id} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm">
        <FiArrowLeft /> Previous
      </Link>
    );
  }
  let nextButton = <span />;
  if (next !== null) {
    nextButton = (
      <Link to={"/courses/" + id + "/lessons/" + next.id} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm">
        Next <FiArrowRight />
      </Link>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to={"/courses/" + id} className="flex items-center gap-1 text-sm text-blue-600">
        <FiArrowLeft /> {course.title}
      </Link>

      <h2 className="text-2xl italic">{index + 1}. {lesson.title}</h2>

      {enrolled && (
        <div>
          <ProgressBar percent={progress.percent} />
          <p className="mt-1 text-xs text-gray-500">Course progress: {progress.percent}%</p>
        </div>
      )}

      {middle}

      <div className="flex justify-between">
        {prevButton}
        {nextButton}
      </div>
    </div>
  );
}