import type { Meta, StoryObj } from '@storybook/react';
import { Callout } from './Callout';
import { Button } from './Button';

const meta = {
  title: 'UI/Callout',
  component: Callout,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'warning', 'error', 'success'],
    },
  },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children: 'Your profile is being reviewed. This usually takes 1-2 business days.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Attention Required',
    children: 'Your subscription will expire in 3 days. Please renew to continue.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'Failed to save your changes. Please try again.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    children: 'Your application has been submitted successfully.',
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    children: 'A simple callout message without a title.',
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'warning',
    title: 'No Icon',
    icon: false,
    children: 'This callout has its icon disabled.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    title: 'Dismissible',
    children: 'Click the X button to dismiss this callout.',
    dismissible: true,
    onDismiss: () => {},
  },
};

export const WithActions: Story = {
  args: {
    variant: 'warning',
    title: 'Update Available',
    children: 'A new version is available. Update now to get the latest features.',
    actions: (
      <div className="flex gap-2">
        <Button size="sm">Update Now</Button>
        <Button size="sm" variant="ghost">Later</Button>
      </div>
    ),
  },
};
