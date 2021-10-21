// move this reusable Layout to _app.js

import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";

function Layout({ children }) {
  return (
    <main className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-screen overflow-hidden relative">
      <div className="flex items-start justify-between">
        <Sidebar />
        <Navbar />
        {children}
      </div>
    </main>
  );
}

export default Layout;
