// move this reusable Layout to _app.js

import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";

function Layout({ children }) {
  return (
    <main className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden h-screen">
      <div className="flex items-start justify-between">
        <Sidebar />
        <div className="w-full pl-0 md:p-4 md:space-y-4">
          <Navbar />
          {children}
        </div>
      </div>
    </main>
  );
}

export default Layout;
