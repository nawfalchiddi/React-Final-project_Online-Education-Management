import { useSearchParams } from "react-router-dom";
import { categories, levels, useApp } from "../../../utils/Mycontext";
import CourseCard from "../../../components/CourseCard";

export default function Catalog() {
  const { courses } = useApp();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const level = params.get("level") || "";

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const filtered = courses.filter(
    (c) =>
      (c.title + c.instructor).toLowerCase().includes(q.toLowerCase()) &&
      (!category || c.category === category) &&
      (!level || c.level === level)
  );

  const select = "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm";

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Courses catalog</h2>

      <div className="flex flex-wrap gap-3">
        <input
          type="search" value={q} placeholder="Search by title or instructor"
          onChange={(e) => setParam("q", e.target.value)}
          className={`${select} w-full sm:w-72`}
        />
        <select value={category} onChange={(e) => setParam("category", e.target.value)} className={select} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={level} onChange={(e) => setParam("level", e.target.value)} className={select} aria-label="Level">
          <option value="">All levels</option>
          {levels.map((l) => <option key={l}>{l}</option>)}
        </select>
        {(q || category || level) && (
          <button onClick={() => setParams({})} className="text-sm text-blue-600">Clear filters</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No course matches your filters. Try clearing them.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  );
}