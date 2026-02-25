import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Program } from "../types";

export const AdminDashboard = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState("");

  const fetchPrograms = async () => {
    try {
      const programData = await apiFetch<Program[]>("/admin/all-programs");
      setPrograms(programData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const updateApproval = async (id: number, action: "approve" | "reject") => {
    try {
      await apiFetch(`/admin/${action}-program/${id}`, { method: "PUT" });
      await fetchPrograms();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-4 overflow-x-hidden">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:w-full sm:px-0">
        <h1 className="text-md mt-10 mb-4 font-bold">Programs</h1>

        <table className="min-w-full w-max text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="whitespace-nowrap py-2">Sr.</th>
              <th className="whitespace-nowrap py-2">Program Title</th>
              <th className="whitespace-nowrap py-2">Counsellor</th>
              <th className="whitespace-nowrap py-2">Date & Time</th>
              <th className="whitespace-nowrap py-2">Status</th>
              <th className="whitespace-nowrap py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program, index) => (
              <tr key={program.id} className="border-t border-slate-800">
                <td className="whitespace-nowrap py-3">{index + 1}</td>
                <td className="whitespace-nowrap py-3">{program.title}</td>
                <td className="whitespace-nowrap py-3">{program.counsellor_name || program.counsellor_id}</td>

                <td className="whitespace-nowrap py-3">{new Date(program.session_date).toLocaleString()}</td>
                <td className="whitespace-nowrap py-3 capitalize">{program.approval_status}</td>
                <td className="whitespace-nowrap py-3">
                  {program.approval_status === "approved" || program.approval_status === "rejected" ? (
                    <span className="text-slate-400">Action unavailable</span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="bg-brand-500 text-white hover:bg-brand-700"
                        onClick={() => updateApproval(program.id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-700 text-white hover:bg-red-600"
                        onClick={() => updateApproval(program.id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {programs.length === 0 && (
              <tr>
                <td className="py-3 text-slate-400" colSpan={5}>
                  No program requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
