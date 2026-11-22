import { useSearchParams } from "react-router-dom";
import { categories, levels, useApp } from "../../../utils/Mycontext";
import CourseCard from "../../../components/CourseCard";

export default function Catalog() {
  const { courses } = useApp();
  const [params, setParams] = useSearchParams();

  // read the filters from the address bar (get gives null if missing)
  let q = params.get("q");
  if (q === null) q = "";
  let category = params.get("category");
  if (category === null) category = "";
  let level = params.get("level");
  if (level === null) level = "";

  // change ONE filter and keep the others
  function changeFilter(name, value) {
    const next = new URLSearchParams(params);
    if (value === "") {
      next.delete(name);
    } else {
      next.set(name, value);
    }
    setParams(next);
  }

  // keep only the courses that match all the filters
  const filtered = [];
  for (let i = 0; i < courses.length; i++) {
    const c = courses[i];

    const textOk = (c.title + " " + c.instructor).toLowerCase().includes(q.toLowerCase());

    let categoryOk = true;
    if (category !== "") {
      categoryOk = c.category === category;
    }

    let levelOk = true;
    if (level !== "") {
      levelOk = c.level === level;
    }

    if (textOk && categoryOk && levelOk) {
      filtered.push(c);
    }
  }

  const select = "rounded-lg shadow shadow-blue-500 outline-none focus:border-blue-500 focus:shadow shadow-blue-400 bg-white px-3 py-2 text-sm";

  let result;
  if (filtered.length === 0) {
    result = <p className="py-10 text-center text-gray-500">No course matches your filters. Try clearing them.</p>;
  } else {
    result = (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    );
  }

  const hasFilter = q !== "" || category !== "" || level !== "";

  return (
    <div className="space-y-5">
      <h2 className="text-2xl italic">Courses catalog</h2>

      <div className="flex flex-wrap gap-3">
        <input
          type="search" value={q} placeholder="Search by title or instructor"
          onChange={(e) => changeFilter("q", e.target.value)}
          className={select + " w-full sm:w-72 "}
        />
        <select value={category} onChange={(e) => changeFilter("category", e.target.value)} className={select} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={level} onChange={(e) => changeFilter("level", e.target.value)} className={select} aria-label="Level">
          <option value="">All levels</option>
          {levels.map((l) => <option key={l}>{l}</option>)}
        </select>
        {hasFilter && (
          <button onClick={() => setParams({})} className="text-sm text-blue-600">Clear filters</button>
        )}
      </div>

      {result}
    </div>
  );
}