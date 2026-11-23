import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGraduationCap } from "react-icons/fc";
import { useApp } from "../../../utils/Mycontext";

export default function Register() {
  const { signup } = useApp();
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();

    
    const newErrors = {};
    if (name.trim().length < 3) {
      newErrors.name = "Enter your full name (3 characters minimum).";
    }
    if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Enter a valid email address.";
    }
    if (password.length < 6) {
      newErrors.password = "Password must have at least 6 characters.";
    }

    setErrors(newErrors);

    // if there is 
    // one error stop
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // create
    //  account
    const result = signup({ name: name, email: email, password: password, role: role });
    if (result.ok === false) {
      setErrors({ email: result.error });
      return;
    }

    navigate("/login", { state: { registered: true } });
  }

  const input = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <FcGraduationCap className="text-4xl" /> LearnPro
        </h1>
        <h2 className="text-lg font-semibold">Create your account</h2>

        <label className="block text-sm font-medium">
          Full name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={input} />
          {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
        </label>

        <label className="block text-sm font-medium">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
        </label>

        <label className="block text-sm font-medium">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
          {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
        </label>

        <label className="block text-sm font-medium">
          I am a
          <select value={role} onChange={(e) => setRole(e.target.value)} className={input}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </label>

        <button className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">Create account</button>

        <p className="text-center text-sm text-gray-500">
          Already registered? <Link to="/login" className="text-blue-600">Log in</Link>
        </p>
      </form>
    </div>
  );
}