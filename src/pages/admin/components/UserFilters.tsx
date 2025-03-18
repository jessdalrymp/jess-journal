
import React from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Search } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchField: 'email' | 'id';
  setSearchField: (field: 'email' | 'id') => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  searchField,
  setSearchField,
  currentTab,
  setCurrentTab
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={`Search by ${searchField}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={searchField === 'email' ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchField('email')}
          >
            Email
          </Button>
          <Button
            variant={searchField === 'id' ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchField('id')}
          >
            ID
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="subscribed">Subscribed</TabsTrigger>
          <TabsTrigger value="trial">Trial</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};
