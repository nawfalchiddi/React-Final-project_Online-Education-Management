import { Link } from "react-router-dom";
import { categories, useApp } from "../../utils/Mycontext";
import CourseCard from "../../components/CourseCard";

export default function Home() {
  const { user, courses } = useApp();

  // the first 4 courses
  const firstCourses = [];
  for (let i = 0; i < courses.length && i < 4; i++) {
    firstCourses.push(courses[i]);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-gray-400 p-8 text-white">
        <h2 className="text-3xl ">Learn new skills, at your own pace</h2>
        <p className="mt-2 max-w-xl text-blue-100">Pick a course, follow the lessons and track your progress.</p>
        <div className="mt-5 flex gap-3">
          <Link to="/courses" className="rounded-lg bg-white px-4 py-2 font-semibold text-gray-400 hover:text-yellow-300 hover:bg-sky-300 hover:shadow shadow-yellow-400">Browse courses</Link>
          {user === null && (
            <Link to="/register" className="rounded-lg border border-white px-4 py-2 font-semibold">Create account</Link>
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg italic">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link key={c} to={"/courses?category=" + c} className="rounded-lg border border-yellow-600 bg-white px-4 py-2 text-sm hover:bg-blue-300 hover:text-white">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg italic">Available courses</h3>
          <Link to="/courses" className="text-sm text-blue-600">View all courses</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {firstCourses.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>
    </div>
  );
}