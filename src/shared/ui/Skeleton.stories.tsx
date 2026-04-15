import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['rect', 'circle', 'text'],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rectangle: Story = {
  args: {
    variant: 'rect',
    width: 200,
    height: 120,
  },
};

export const Circle: Story = {
  args: {
    variant: 'circle',
    width: 64,
    height: 64,
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    width: 300,
    height: 16,
  },
};

export const CustomSize: Story = {
  args: {
    variant: 'rect',
    width: '100%',
    height: 200,
  },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="w-80 p-4 border border-slate-200 rounded-xl space-y-3">
      <Skeleton variant="rect" width="100%" height={160} />
      <Skeleton variant="text" width="70%" height={20} />
      <Skeleton variant="text" width="90%" height={14} />
      <Skeleton variant="text" width="50%" height={14} />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton variant="circle" width={32} height={32} />
        <Skeleton variant="text" width={100} height={14} />
      </div>
    </div>
  ),
};
