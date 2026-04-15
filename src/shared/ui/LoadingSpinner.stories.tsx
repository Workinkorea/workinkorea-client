import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['blue', 'white', 'slate'],
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'sm',
    color: 'blue',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    color: 'blue',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    color: 'blue',
  },
};

export const SlateColor: Story = {
  args: {
    size: 'md',
    color: 'slate',
  },
};

export const WhiteColor: Story = {
  args: {
    size: 'md',
    color: 'white',
  },
  decorators: [
    (Story) => (
      <div className="bg-blue-600 p-8 rounded-lg inline-block">
        <Story />
      </div>
    ),
  ],
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LoadingSpinner size="sm" />
      <LoadingSpinner size="md" />
      <LoadingSpinner size="lg" />
    </div>
  ),
};
