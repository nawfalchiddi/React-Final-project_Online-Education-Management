export default function ProgressBar({ percent }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200 shadow shadow-blue-400" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
}