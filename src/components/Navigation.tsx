import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Brain, CheckSquare, BarChart, HelpCircle } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:top-0 md:bottom-auto shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 ${
            isActive('/') ? 'text-sage-600' : 'text-gray-600'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/thoughts"
          className={`flex flex-col items-center p-2 ${
            isActive('/thoughts') ? 'text-sage-600' : 'text-gray-600'
          }`}
        >
          <Brain className="h-5 w-5" />
          <span className="text-xs mt-1">Thoughts</span>
        </Link>
        <Link
          to="/completed-commitments"
          className={`flex flex-col items-center p-2 ${
            isActive('/completed-commitments') ? 'text-sage-600' : 'text-gray-600'
          }`}
        >
          <CheckSquare className="h-5 w-5" />
          <span className="text-xs mt-1">Completed</span>
        </Link>
        <Link
          to="/dashboard"
          className={`flex flex-col items-center p-2 ${
            isActive('/dashboard') ? 'text-sage-600' : 'text-gray-600'
          }`}
        >
          <BarChart className="h-5 w-5" />
          <span className="text-xs mt-1">Stats</span>
        </Link>
        <Link
          to="/faq"
          className={`flex flex-col items-center p-2 ${
            isActive('/faq') ? 'text-sage-600' : 'text-gray-600'
          }`}
        >
          <HelpCircle className="h-5 w-5" />
          <span className="text-xs mt-1">FAQ</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;