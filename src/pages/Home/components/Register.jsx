import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGraduationCap } from "react-icons/fc";
import { useApp } from "../../../utils/Mycontext";

export default function Register() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 3) err.name = "Enter your full name (3 characters minimum).";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email address.";
    if (form.password.length < 6) err.password = "Password must have at least 6 characters.";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    const res = signup(form);
    if (!res.ok) {
      setErrors({ email: res.error });
      return;
    }
    navigate("/login", { state: { registered: true } });
  };

  const input = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <FcGraduationCap className="text-4xl" /> LearnPro
        </h1>
        <h2 className="text-lg font-semibold">Create your account</h2>

        {[
          ["name", "Full name", "text"],
          ["email", "Email", "email"],
          ["password", "Password", "password"],
        ].map(([name, label, type]) => (
          <label key={name} className="block text-sm font-medium">
            {label}
            <input name={name} type={type} value={form[name]} onChange={handleChange} className={input} />
            {errors[name] && <span className="text-xs text-red-600">{errors[name]}</span>}
          </label>
        ))}

        <label className="block text-sm font-medium">
          I am a
          <select name="role" value={form.role} onChange={handleChange} className={input}>
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