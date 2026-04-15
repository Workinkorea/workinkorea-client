import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'ghost'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Simple card content goes here.',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: 'Elevated card with stronger shadow.',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined card with thicker border.',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost card with subtle background.',
  },
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>A short description for this card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Action</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Are you sure you want to proceed?</p>
      </CardContent>
      <CardFooter className="gap-3 justify-end">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: 'Hover me to see the effect.',
  },
};

export const Clickable: Story = {
  args: {
    clickable: true,
    children: 'Click me — I have cursor pointer and hover styles.',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card padding="sm">Small padding (p-4)</Card>
      <Card padding="md">Medium padding (p-6) — default</Card>
      <Card padding="lg">Large padding (p-8)</Card>
    </div>
  ),
};
