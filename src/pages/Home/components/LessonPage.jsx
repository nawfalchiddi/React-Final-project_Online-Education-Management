import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCheck, FiLock } from "react-icons/fi";
import { useApp } from "../../../utils/Mycontext";
import ProgressBar from "../../../components/ProgressBar";

export default function LessonPage() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const { courses, user, isEnrolled, enroll, getEnrollment, toggleLesson, setLastLesson, getProgress } = useApp();

  const course = courses.find((c) => c.id === id);
  const index = course ? course.lessons.findIndex((l) => l.id === lessonId) : -1;
  const lesson = course?.lessons[index];
  const enrolled = isEnrolled(id);
  const isOwner = user && course && user.email === course.ownerEmail;
  const canView = !!lesson && (enrolled || lesson.free || isOwner);

  useEffect(() => {
    if (enrolled && lesson) setLastLesson(id, lessonId)




    // eslint-disable-next-line 
    // react-hooks/exhaustive-deps


  }, [enrolled, id, lessonId])

  if (!course || !lesson) {
    return (
      <div className="py-20 text-center">
        <p>Lesson not found.</p>
        <Link to="/courses" className="text-blue-600">Back to catalog</Link>
      </div>
    );
  }

  const prev = course.lessons[index - 1];
  const next = course.lessons[index + 1];
  const isDone = getEnrollment(id)?.completed.includes(lessonId);
  const { percent } = getProgress(course);

  const handleEnroll = () => {
    if (!user) navigate("/login", { state: { from: `/courses/${id}/lessons/${lessonId}` } });
    else enroll(id);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to={`/courses/${id}`} className="flex items-center gap-1 text-sm text-blue-600">
        <FiArrowLeft /> {course.title}
      </Link>

      <h2 className="text-2xl italic">{index + 1}. {lesson.title}</h2>

      {enrolled && (
        <div>
          <ProgressBar percent={percent} />
          <p className="mt-1 text-xs text-gray-500">Course progress: {percent}%</p>
        </div>
      )}

      {!canView ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <FiLock className="mx-auto mb-3 text-3xl text-gray-400" />
          <p className="mb-4">This lesson is locked. enroll in the course to unlock it.</p>
          {(!user || user.role === "student") && (
            <button onClick={handleEnroll} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
              Enroll in this course
            </button>
          )}
        </div>
      ) : (
        <>
          {lesson.videoUrl && (
            <div className="aspect-video overflow-hidden rounded-xl bg-black">
              <iframe src={lesson.videoUrl} title={lesson.title} className="h-full w-full" allowFullScreen />
            </div>
          )}
          <div className="whitespace-pre-line rounded-xl border bg-white p-5 text-gray-700">{lesson.content}</div>

          {enrolled && (
            <button
              onClick={() => toggleLesson(id, lessonId)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold ${
                isDone ? "bg-green-100 text-green-700" : "bg-blue-600 text-white"
              }`}
            >
              <FiCheck /> {isDone ? "Completed (click to undo)" : "Mark as completed"}
            </button>
          )}
          {!enrolled && lesson.free && (!user || user.role === "student") && (
            <p className="text-sm text-gray-500">
              This is a free preview. <button onClick={handleEnroll} className="text-blue-600 underline">Enroll</button> to unlock all lessons and save your progress.
            </p>
          )}
        </>
      )}

      <div className="flex justify-between">
        {prev ? (
          <Link to={`/courses/${id}/lessons/${prev.id}`} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm">
            <FiArrowLeft /> Previous
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/courses/${id}/lessons/${next.id}`} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm">
            Next <FiArrowRight />
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}