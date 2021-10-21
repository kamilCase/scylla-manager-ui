// move this reusable Layout to _app.js

import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";

function Layout({children}) {
  return (
    <div className="bg-gray-800 font-sans leading-normal tracking-normal mt-12">
      <Navbar/>
      <div className="flex flex-col md:flex-row">
        <Sidebar/>
        <div className="main-content flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout;
