// layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="dashboard flex">
      <aside className="w-64 bg-gray-100">Sidebar (Profile/Links)</aside>
      <section className="flex-1 p-4">
        <Outlet />
      </section>
    </div>
  );
}
