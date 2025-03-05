
import { Link } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';

export const AccountSection = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-medium mb-5">Account</h2>
      
      <Link to="/account">
        <div className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
          <div className="flex items-center">
            <User size={20} className="text-jess-primary mr-3" />
            <span>Manage your account</span>
          </div>
          <ArrowRight size={18} />
        </div>
      </Link>
    </div>
  );
};
