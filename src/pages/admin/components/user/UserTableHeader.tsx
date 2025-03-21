
import React from 'react';
import {
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

export const UserTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Email</TableHead>
        <TableHead>Joined</TableHead>
        <TableHead>Last Login</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Subscription</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
