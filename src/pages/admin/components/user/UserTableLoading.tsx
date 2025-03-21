
import React from 'react';

export const UserTableLoading = () => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin w-6 h-6 border-t-2 border-jess-primary border-r-2 rounded-full mx-auto mb-2"></div>
      <p>Loading users...</p>
    </div>
  );
};
