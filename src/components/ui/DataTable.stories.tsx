import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DataTable from './DataTable';
import { Users } from 'lucide-react';
import type { PaginationState, SortingState } from '@tanstack/react-table';

const meta: Meta<typeof DataTable> = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => <div className="p-8 h-[600px]"><Story /></div>,
  ],
};
export default meta;
type Story = StoryObj<typeof DataTable>;

// Mock data and columns
type Person = {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
};

const mockData: Person[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 5 === 0 ? 'Admin' : 'User',
  status: i % 3 === 0 ? 'Inactive' : 'Active',
}));

// Explicitly type the accessorKey to be a key of the Person type. This resolves the generic type inference issue.
const mockColumns: { accessorKey: keyof Person; header: string; }[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
];

const DataTableTemplate: Story['render'] = (args) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  // Simulate server-side logic for Storybook
  const paginatedData = ((args.data || []) as Person[]).slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );
  const pageCount = Math.ceil(((args.data || []) as Person[]).length / pagination.pageSize);

  return (
    // Explicitly provide the generic type to DataTable to fix type inference in Storybook.
    <DataTable<Person>
      {...args}
      data={args.isLoading ? [] : paginatedData}
      columns={mockColumns}
      pageCount={pageCount}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
    />
  );
};

export const Default: Story = {
  name: 'State: With Data',
  render: DataTableTemplate,
  args: {
    data: mockData,
    isLoading: false,
  },
};

export const Loading: Story = {
  name: 'State: Loading',
  render: DataTableTemplate,
  args: {
    data: [], // Data is empty while loading
    isLoading: true,
  },
};

export const Empty: Story = {
  name: 'State: Empty',
  render: DataTableTemplate,
  args: {
    data: [],
    isLoading: false,
  },
};

export const WithAddButtonAndEmptyState: Story = {
  name: 'State: Empty with Action',
  render: DataTableTemplate,
  args: {
    data: [],
    isLoading: false,
    onAdd: () => alert('Add button clicked!'),
    addLabel: 'Add New User',
    emptyState: {
        icon: Users,
        title: "No Users Found",
        description: "Get started by adding the first user.",
    }
  },
};