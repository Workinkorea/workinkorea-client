import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import { Search, Plus, X, Settings, Trash2, Heart } from 'lucide-react';

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['ghost', 'outline', 'filled', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    shape: {
      control: 'select',
      options: ['square', 'circle'],
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: Settings,
    label: 'Settings',
  },
};

export const Ghost: Story = {
  args: {
    icon: X,
    label: 'Close',
    variant: 'ghost',
  },
};

export const Outline: Story = {
  args: {
    icon: Search,
    label: 'Search',
    variant: 'outline',
  },
};

export const Filled: Story = {
  args: {
    icon: Plus,
    label: 'Add item',
    variant: 'filled',
  },
};

export const Destructive: Story = {
  args: {
    icon: Trash2,
    label: 'Delete',
    variant: 'destructive',
  },
};

export const Small: Story = {
  args: {
    icon: X,
    label: 'Close',
    size: 'sm',
    variant: 'ghost',
  },
};

export const Large: Story = {
  args: {
    icon: Settings,
    label: 'Settings',
    size: 'lg',
    variant: 'outline',
  },
};

export const CircleShape: Story = {
  args: {
    icon: Heart,
    label: 'Like',
    shape: 'circle',
    variant: 'outline',
  },
};

export const Loading: Story = {
  args: {
    icon: Settings,
    label: 'Loading',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: Plus,
    label: 'Add',
    variant: 'filled',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton icon={Settings} label="Ghost" variant="ghost" />
      <IconButton icon={Search} label="Outline" variant="outline" />
      <IconButton icon={Plus} label="Filled" variant="filled" />
      <IconButton icon={Trash2} label="Destructive" variant="destructive" />
    </div>
  ),
};
