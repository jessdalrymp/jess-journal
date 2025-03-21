
import React from 'react';
import { AlertCircle } from "lucide-react";

export const UserTableEmptyState = () => {
  return (
    <div className="text-center py-8 border border-dashed rounded-md">
      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-jess-muted" />
      <p className="text-jess-muted">No users found.</p>
      <p className="text-sm text-jess-muted mt-1">This could be due to permission issues or no users in the system.</p>
    </div>
  );
};
