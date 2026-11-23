import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGraduationCap } from "react-icons/fc";
import { useApp } from "../../../utils/Mycontext";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // location.state 
  //  the hidden note we sent using navigate
  let from = null;
  let justRegistered = false;
  if (location.state !== null) {
    if (location.state.from) from = location.state.from;
    if (location.state.registered) justRegistered = true;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = login(email, password);
    if (result.ok === false) {
      setError(result.error);
      return;
    }

    // go back to the page the visitor wanted
    //  else to the right dashboard
    let goTo;
    if (from !== null) {
      goTo = from;
    } else if (result.role === "instructor") {
      goTo = "/instructor";
    } else {
      goTo = "/dashboard";
    }
    navigate(goTo, { replace: true });
  }

  const input = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <FcGraduationCap className="text-4xl" /> LearnPro
        </h1>
        <h2 className="text-lg font-semibold">Log in</h2>

        {justRegistered && (
          <p className="rounded-lg bg-green-100 p-2 text-sm text-green-700">Account created. Log in to start.</p>
        )}
        {error !== "" && <p className="rounded-lg bg-red-100 p-2 text-sm text-red-700">{error}</p>}

        <label className="block text-sm font-medium">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={input} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={input} />
        </label>

        <button className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">Log in</button>

        <p className="text-center text-sm text-gray-500">
          No account yet? <Link to="/register" className="text-blue-600">Create one</Link>
        </p>
        <p className="text-center text-xs text-gray-400">
          <Link to="/" className="hover:text-blue-600">Continue as visitor</Link>
        </p>
      </form>
    </div>
  );
}