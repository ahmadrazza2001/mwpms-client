import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Counsellor } from "../types";

export const AdminUsers = () => {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await apiFetch<Counsellor[]>("/admin/all-counsellors");
      setCounsellors(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (id: number, status: "active" | "inactive") => {
    try {
      await apiFetch(`/admin/update-counsellor-status/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await fetchUsers();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-4 overflow-x-hidden">
      <h1 className="text-xl font-bold">Users</h1>
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:w-full sm:px-0">
        <table className="min-w-full w-max text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="whitespace-nowrap py-2">Sr.</th>
              <th className="whitespace-nowrap py-2">Name</th>
              <th className="whitespace-nowrap py-2">Email</th>
              <th className="whitespace-nowrap py-2">Account status</th>
              <th className="whitespace-nowrap py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {counsellors.map((item, index) => (
              <tr key={item.id} className="border-t border-slate-800">
                <td className="whitespace-nowrap py-3">{index + 1}</td>
                <td className="whitespace-nowrap py-3">{item.name}</td>
                <td className="whitespace-nowrap py-3">{item.email}</td>
                <td className="whitespace-nowrap py-3 capitalize">{item.account_status}</td>
                <td className="whitespace-nowrap py-3">
                  <button
                    className={`${item.account_status === "active" ? "bg-red-600" : "bg-green-600"} text-white py-1 rounded-full font-normal hover:bg-slate-600`}
                    onClick={() => updateStatus(item.id, item.account_status === "active" ? "inactive" : "active")}
                  >
                    {item.account_status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {counsellors.length === 0 && (
              <tr>
                <td className="py-3 text-slate-400" colSpan={4}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
