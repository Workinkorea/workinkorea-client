import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta = {
  title: 'UI/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
    },
    thickness: {
      control: 'select',
      options: ['thin', 'normal', 'thick'],
    },
    labelAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'OR',
  },
};

export const LabelLeft: Story = {
  args: {
    label: 'Section',
    labelAlign: 'left',
  },
};

export const LabelRight: Story = {
  args: {
    label: 'End',
    labelAlign: 'right',
  },
};

export const Dashed: Story = {
  args: {
    variant: 'dashed',
  },
};

export const Dotted: Story = {
  args: {
    variant: 'dotted',
  },
};

export const Thick: Story = {
  args: {
    thickness: 'thick',
  },
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center h-16 gap-4">
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <Divider />
      <Divider variant="dashed" />
      <Divider variant="dotted" />
      <Divider label="OR" />
      <Divider thickness="thick" />
    </div>
  ),
};
