import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { Program } from "../types";

interface ProgramForm {
  title: string;
  description: string;
  session_date: string;
}

const initialForm: ProgramForm = {
  title: "",
  description: "",
  session_date: "",
};

export const CounsellorDashboard = () => {
  const [form, setForm] = useState<ProgramForm>(initialForm);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPrograms = async () => {
    try {
      const data = await apiFetch<Program[]>("/programs/my-programs");
      setPrograms(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const pendingPrograms = useMemo(
    () => programs.filter((program) => program.approval_status === "pending"),
    [programs]
  );

  const handleCreateProgram = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch<{ message: string }>("/programs/create-program", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm(initialForm);
      await fetchPrograms();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/programs/delete-program/${id}`, { method: "DELETE" });
      await fetchPrograms();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <h1 className="text-xl font-bold">Counsellor Dashboard</h1>

      <section className="rounded-xl max-w-[650px] border border-slate-800 bg-slate-950/40 p-4">
        <h2 className="text-lg font-semibold">Create session request</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleCreateProgram}>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Session date and time</label>
            <input
              type="datetime-local"
              value={form.session_date}
              onChange={(e) => setForm((prev) => ({ ...prev, session_date: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "Creating.." : "Create Program"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <h2 className="text-lg font-semibold">Pending programs</h2>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="-mx-4 mt-3 w-[calc(100%+2rem)] overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:w-full sm:px-0">
          <table className="min-w-full w-max text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="whitespace-nowrap py-2">Sr.</th>

                <th className="whitespace-nowrap py-2">Program Title</th>
                <th className="whitespace-nowrap py-2">Date & Time</th>
                <th className="whitespace-nowrap py-2">Approval</th>
                <th className="whitespace-nowrap py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingPrograms.map((program, index) => (
                <tr key={program.id} className="border-t border-slate-800">
                  <td className="whitespace-nowrap py-3">{index + 1}</td>
                  <td className="whitespace-nowrap py-3">{program.title}</td>
                  <td className="whitespace-nowrap py-3">{new Date(program.session_date).toLocaleString()}</td>
                  <td className="whitespace-nowrap py-3 capitalize">{program.approval_status}</td>
                  <td className="whitespace-nowrap py-3">
                    <button
                      className="bg-red-700 text-white hover:bg-red-600"
                      onClick={() => handleDelete(program.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {pendingPrograms.length === 0 && (
                <tr>
                  <td className="py-3 bg-slate-700 px-3 rounded-lg text-slate-400" colSpan={6}>
                    No pending programs to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
