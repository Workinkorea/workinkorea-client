import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from './Button';
import { Search, FileX, Inbox } from 'lucide-react';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No items found',
    description: 'There are no items to display at the moment.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No job postings',
    description: 'Create your first job posting to start attracting candidates.',
    action: <Button size="sm">Create Job Posting</Button>,
  },
};

export const WithIcon: Story = {
  args: {
    icon: Search,
    title: 'No search results',
    description: 'Try adjusting your search terms or filters.',
  },
};

export const NoDescription: Story = {
  args: {
    icon: Inbox,
    title: 'Inbox is empty',
  },
};

export const SmallSize: Story = {
  args: {
    icon: FileX,
    title: 'No files',
    description: 'Upload files to get started.',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    icon: FileX,
    title: 'No resumes found',
    description: 'Start building your resume to apply for jobs.',
    action: <Button>Create Resume</Button>,
    size: 'lg',
  },
};
