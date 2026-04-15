import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search } from 'lucide-react';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'password'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Invalid input',
    error: true,
    value: 'wrong value',
  },
};

export const WithSuccess: Story = {
  args: {
    placeholder: 'Valid input',
    success: true,
    value: 'correct value',
  },
};

export const Password: Story = {
  args: {
    variant: 'password',
    placeholder: 'Enter password...',
    showPassword: false,
    onTogglePassword: () => {},
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithRightElement: Story = {
  args: {
    placeholder: 'Search...',
    rightElement: <Search size={16} className="text-slate-400" />,
  },
};
