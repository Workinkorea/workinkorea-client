import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './StatCard';
import { Users, Briefcase, TrendingUp, Eye } from 'lucide-react';

const meta = {
  title: 'UI/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Total Users',
    value: 1234,
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Active Users',
    value: 892,
    icon: Users,
    color: 'primary',
  },
};

export const WithTrend: Story = {
  args: {
    title: 'Job Postings',
    value: 56,
    icon: Briefcase,
    color: 'success',
    trend: {
      value: 12,
      isPositive: true,
      label: 'vs last month',
    },
  },
};

export const NegativeTrend: Story = {
  args: {
    title: 'Page Views',
    value: '3.2K',
    icon: Eye,
    color: 'danger',
    trend: {
      value: -5,
      isPositive: false,
      label: 'vs last week',
    },
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Growth Rate',
    value: '24%',
    subtitle: 'Compared to previous quarter',
    icon: TrendingUp,
    color: 'success',
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <StatCard title="Primary" value={100} color="primary" icon={Users} />
      <StatCard title="Success" value={85} color="success" icon={TrendingUp} />
      <StatCard title="Warning" value={23} color="warning" icon={Eye} />
      <StatCard title="Danger" value={5} color="danger" icon={Briefcase} />
    </div>
  ),
};
