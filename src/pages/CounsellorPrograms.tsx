import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Program } from "../types";
import { getRemainingTimeLabel, isMeetingEnded, isMeetingStarted } from "../lib/meeting";

export const CounsellorPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());

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

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/programs/delete-program/${id}`, { method: "DELETE" });
      await fetchPrograms();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-4 overflow-x-hidden">
      <h1 className="text-xl font-bold">Programs</h1>
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:w-full sm:px-0">
        <table className="min-w-full w-max text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="whitespace-nowrap py-2">Sr.</th>
              <th className="whitespace-nowrap py-2">Program Title</th>
              <th className="whitespace-nowrap py-2">Date & Time</th>
              <th className="whitespace-nowrap py-2">Approval</th>
              <th className="whitespace-nowrap py-2">Remaining Time</th>
              <th className="whitespace-nowrap py-2">Join Meeting</th>
              <th className="whitespace-nowrap py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program, index) => (
              <tr key={program.id} className="border-t border-slate-800">
                <td className="whitespace-nowrap py-2">{index + 1}</td>
                <td className="whitespace-nowrap py-2">{program.title}</td>
                <td className="whitespace-nowrap py-2">{new Date(program.session_date).toLocaleString()}</td>
                <td className="whitespace-nowrap py-2 capitalize">{program.approval_status}</td>
                <td className="whitespace-nowrap py-2">{getRemainingTimeLabel(program, now)}</td>
                <td className="whitespace-nowrap py-2">
                  {isMeetingEnded(program, now) ? (
                    <span className="text-slate-400">Meeting Ended</span>
                  ) : program.approval_status !== "approved" || !isMeetingStarted(program, now) ? (
                    <button className="cursor-not-allowed rounded-full bg-slate-700 py-1 font-normal text-slate-300 opacity-60" disabled>
                      Join Meeting
                    </button>
                  ) : program.meet_link ? (
                    <a href={program.meet_link} target="_blank" rel="noreferrer" className="text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/50">
                      Join Meeting
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="whitespace-nowrap py-2">
                  {program.approval_status === "approved" || program.approval_status === "rejected" ? (
                    <span className="text-slate-400">Action unavailable</span>
                  ) : (
                    <button
                      className="bg-red-700 text-white hover:bg-red-600"
                      onClick={() => handleDelete(program.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {programs.length === 0 && (
              <tr>
                <td className="py-3 bg-slate-700 px-3 rounded-lg text-slate-400" colSpan={6}>
                  No programs added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
