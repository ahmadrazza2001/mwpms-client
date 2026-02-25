import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { AuthUser } from "../types";

interface LoginResponse {
  token: string;
  user: AuthUser;
}

type ForgotStep = "request-otp" | "verify-otp" | "reset-password";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("request-otp");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotInfo, setForgotInfo] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/counsellor/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForgotPasswordFlow = () => {
    setShowForgotPassword(false);
    setForgotStep("request-otp");
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setResetToken("");
    setForgotError("");
    setForgotInfo("");
    setForgotLoading(false);
  };

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotInfo("");
    setForgotLoading(true);
    try {
      const response = await apiFetch<{ message: string }>("/auth/forgot-password/request-otp", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotInfo(response.message);
      setForgotStep("verify-otp");
    } catch (err) {
      setForgotError((err as Error).message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotInfo("");
    setForgotLoading(true);
    try {
      const response = await apiFetch<{ message: string; resetToken: string }>(
        "/auth/forgot-password/verify-otp",
        {
          method: "POST",
          body: JSON.stringify({ email: forgotEmail, otp }),
        }
      );
      setResetToken(response.resetToken);
      setForgotInfo(response.message);
      setForgotStep("reset-password");
    } catch (err) {
      setForgotError((err as Error).message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotInfo("");
    setForgotLoading(true);
    try {
      const response = await apiFetch<{ message: string }>("/auth/forgot-password/reset", {
        method: "POST",
        body: JSON.stringify({ resetToken, newPassword }),
      });
      setForgotInfo(response.message);
      setTimeout(() => {
        resetForgotPasswordFlow();
      }, 1200);
    } catch (err) {
      setForgotError((err as Error).message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md mt-20">
      <h1 className="mb-5 text-center text-2xl font-extrabold text-brand-50 md:text-3xl">
        Mental Wellness Program Management System
      </h1>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        {!showForgotPassword ? (
          <>
            <h2 className="text-2xl font-bold">Welcome back!</h2>
            <p className="mt-1 text-sm text-slate-400">Sign in to your account</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className="mb-1 block text-sm">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="p-0 text-sm text-brand-500 hover:text-brand-50"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-400">
              New counsellor? <Link to="/register" className="text-brand-500">Register</Link>
            </p>
          </>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Reset password</h3>
              <button type="button" className="text-sm text-slate-300" onClick={resetForgotPasswordFlow}>
                Back to login
              </button>
            </div>

            {forgotStep === "request-otp" && (
              <form className="space-y-3" onSubmit={handleRequestOtp}>
                <div>
                  <label className="mb-1 block text-sm">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-brand-500 text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {forgotLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {forgotStep === "verify-otp" && (
              <form className="space-y-3" onSubmit={handleVerifyOtp}>
                <p className="text-xs text-slate-400">Enter the 6-digit OTP sent to {forgotEmail}</p>
                <div>
                  <label className="mb-1 block text-sm">OTP</label>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-brand-500 text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {forgotStep === "reset-password" && (
              <form className="space-y-3" onSubmit={handleResetPassword}>
                <div>
                  <label className="mb-1 block text-sm">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-brand-500 text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {forgotLoading ? "Updating..." : "Update password"}
                </button>
              </form>
            )}

            {forgotError && <p className="mt-3 text-sm text-red-400">{forgotError}</p>}
            {forgotInfo && <p className="mt-3 text-sm text-brand-50">{forgotInfo}</p>}
          </>
        )}
      </div>
    </div>
  );
};
