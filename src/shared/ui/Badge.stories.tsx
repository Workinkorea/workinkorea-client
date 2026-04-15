import type { Meta, StoryObj } from '@storybook/react';
import { Badge, NumericBadge, DotBadge, IndicatorBadge } from './Badge';
import { Star, AlertTriangle, Bell } from 'lucide-react';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Primary',
    color: 'primary',
  },
};

export const Success: Story = {
  args: {
    label: 'Approved',
    color: 'success',
  },
};

export const Warning: Story = {
  args: {
    label: 'Pending',
    color: 'warning',
    icon: AlertTriangle,
  },
};

export const Danger: Story = {
  args: {
    label: 'Rejected',
    color: 'danger',
  },
};

export const Neutral: Story = {
  args: {
    label: 'Draft',
    color: 'neutral',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Featured',
    color: 'primary',
    icon: Star,
    iconPosition: 'left',
  },
};

export const Rounded: Story = {
  args: {
    label: 'Tag',
    color: 'primary',
    rounded: true,
  },
};

export const SmallSize: Story = {
  args: {
    label: 'Small',
    color: 'secondary',
    size: 'sm',
  },
};

// NumericBadge stories
export const Numeric: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4">
      <NumericBadge count={3} color="danger" />
      <NumericBadge count={42} color="primary" />
      <NumericBadge count={150} max={99} color="danger" />
    </div>
  ),
};

// DotBadge stories
export const Dot: StoryObj = {
  render: () => (
    <div className="flex items-center gap-6">
      <DotBadge color="success" label="Online" />
      <DotBadge color="warning" label="Away" />
      <DotBadge color="danger" label="Busy" pulse />
    </div>
  ),
};

// IndicatorBadge stories
export const Indicator: StoryObj = {
  render: () => (
    <div className="flex items-center gap-6">
      <IndicatorBadge count={5}>
        <Bell size={24} />
      </IndicatorBadge>
      <IndicatorBadge dot>
        <Bell size={24} />
      </IndicatorBadge>
    </div>
  ),
};
