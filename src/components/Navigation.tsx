import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Brain, CheckSquare, BarChart, HelpCircle } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 md:top-0 md:bottom-auto shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-around items-center">
        <Link
          to="/"
          className={`p-2 ${
            isActive('/') ? 'text-sage-600' : 'text-gray-600'
          } hover:text-sage-500 transition-colors`}
          title="Home"
        >
          <Home className="h-7 w-7" />
        </Link>
        <Link
          to="/thoughts"
          className={`p-2 ${
            isActive('/thoughts') ? 'text-sage-600' : 'text-gray-600'
          } hover:text-sage-500 transition-colors`}
          title="Thoughts"
        >
          <Brain className="h-7 w-7" />
        </Link>
        <Link
          to="/completed-commitments"
          className={`p-2 ${
            isActive('/completed-commitments') ? 'text-sage-600' : 'text-gray-600'
          } hover:text-sage-500 transition-colors`}
          title="Completed"
        >
          <CheckSquare className="h-7 w-7" />
        </Link>
        <Link
          to="/dashboard"
          className={`p-2 ${
            isActive('/dashboard') ? 'text-sage-600' : 'text-gray-600'
          } hover:text-sage-500 transition-colors`}
          title="Stats"
        >
          <BarChart className="h-7 w-7" />
        </Link>
        <Link
          to="/faq"
          className={`p-2 ${
            isActive('/faq') ? 'text-sage-600' : 'text-gray-600'
          } hover:text-sage-500 transition-colors`}
          title="FAQ"
        >
          <HelpCircle className="h-7 w-7" />
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;