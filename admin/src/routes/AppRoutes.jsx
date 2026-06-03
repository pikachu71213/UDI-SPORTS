import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Login = lazy(() => import("../modules/admin/pages/Login"));
const Dashboard = lazy(() => import("../modules/admin/pages/Dashboard"));
const AdminLayout = lazy(() => import("../modules/admin/layout/AdminLayout"));
const Players = lazy(() => import("../modules/admin/pages/Players"));
const Blogs = lazy(() => import("../modules/admin/pages/Blogs"));
const Events = lazy(() => import("../modules/admin/pages/event/Events"));
const Settings = lazy(() => import("../modules/admin/pages/Settings"));
const GeneralMembers = lazy(() => import("../modules/admin/pages/members/GeneralMembers"));
const SpecialMembers = lazy(() => import("../modules/admin/pages/members/SpecialMembers"));
const IncomingMembers = lazy(() => import("../modules/admin/pages/incoming/IncomingMembers"));
const IncomingContacts = lazy(() => import("../modules/admin/pages/incoming/IncomingContacts"));
const CommitteeAdmin = lazy(() => import("../modules/admin/pages/committee/Committeeadmin"));
const ForgotPassword = lazy(() => import("../modules/admin/pages/Forgotpassword"));

function RequireAuth({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-slate-500 text-[13px] font-semibold">
      Loading...
    </div>
  );
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="players" element={<Players />} />
            <Route path="committees" element={<CommitteeAdmin />} />
            <Route path="members/general" element={<GeneralMembers />} />
            <Route path="members/special" element={<SpecialMembers />} />
            <Route path="incoming/members" element={<IncomingMembers />} />
            <Route path="incoming/contacts" element={<IncomingContacts />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="events" element={<Events />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;