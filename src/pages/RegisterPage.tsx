import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

const PASSWORD_RULES_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.";

const isStrongPassword = (value: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value);

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isStrongPassword(password)) {
        throw new Error(PASSWORD_RULES_MESSAGE);
      }

      if (!isStrongPassword(confirmPassword)) {
        throw new Error(PASSWORD_RULES_MESSAGE);
      }

      if (password !== confirmPassword) {
        throw new Error("Password and Confirm Password must match.");
      }

      await apiFetch<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }), // confirmPassword intentionally excluded
      });
      navigate("/login");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md mt-20">
      <h1 className="mb-5 text-center text-2xl font-extrabold text-brand-50 md:text-3xl">
        Mental Wellness Program Management System
      </h1>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-2xl font-bold">Create a new account</h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        <p className="text-xs text-slate-400">{PASSWORD_RULES_MESSAGE}</p>

        <button
          type="submit"
            disabled={loading}
            className="w-full bg-brand-500 text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Already registered? <Link to="/login" className="text-brand-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
