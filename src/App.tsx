import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CounsellorDashboard } from "./pages/CounsellorDashboard";
import { CounsellorPrograms } from "./pages/CounsellorPrograms";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminUsers } from "./pages/AdminUsers";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleSidebarLayout } from "./components/RoleSidebarLayout";

const App = () => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#0f172a_45%,_#020617_100%)] p-2 sm:p-4 md:p-6">
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute role="counsellor" />}>
            <Route path="/counsellor" element={<RoleSidebarLayout role="counsellor" />}>
              <Route index element={<Navigate to="/counsellor/dashboard" replace />} />
              <Route path="dashboard" element={<CounsellorDashboard />} />
              <Route path="programs" element={<CounsellorPrograms />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<RoleSidebarLayout role="admin" />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </main>
  );
};

export default App;
