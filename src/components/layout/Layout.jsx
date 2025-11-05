import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Fixed Header */}
      <Header />
      
      {/* Main container with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Fixed Sidebar */}
        <Sidebar />
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-x-auto overflow-y-auto p-6 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;