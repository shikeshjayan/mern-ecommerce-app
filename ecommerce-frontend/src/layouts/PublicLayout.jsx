import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-screen mx-auto px-0 py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
