// ─── Primitive / Input ────────────────────────────────────────────
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';

export { Input } from './Input';
export type { InputProps } from './Input';

export { FormField } from './FormField';

export { ErrorMessage } from './ErrorMessage';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Radio, RadioGroup } from './Radio';
export type { RadioProps, RadioGroupProps, RadioGroupOption } from './Radio';

export { SegmentedControl } from './SegmentedControl';
export type { SegmentedControlProps, SegmentedControlOption } from './SegmentedControl';

export { default as DatePicker } from './DatePicker';

export { SelectSearchInput } from './SelectSearchInput';
export type { SelectOption } from './SelectSearchInput';

export { DaumPostcodeSearch } from './DaumPostcodeSearch';
export { default as SchoolSearch } from './SchoolSearch';

// ─── Layout / Structure ───────────────────────────────────────────
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardImage } from './Card';
export type { CardProps } from './Card';

export { Modal } from './Modal';

export { AccordionItem, AccordionGroup } from './Accordion';
export type { AccordionItemProps, AccordionGroupProps } from './Accordion';

export { Divider } from './Divider';
export type { DividerProps } from './Divider';

export { Portal } from './Portal';

export { BackToTop } from './BackToTop';

// ─── Feedback / Status ────────────────────────────────────────────
export { Badge, NumericBadge, DotBadge, IndicatorBadge } from './Badge';
export type { ContentBadgeProps, NumericBadgeProps, DotBadgeProps, IndicatorBadgeProps } from './Badge';

export { Callout, InfoCallout, WarningCallout, ErrorCallout, SuccessCallout } from './Callout';
export type { CalloutProps, CalloutVariant, CalloutBaseProps } from './Callout';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { StatCard } from './StatCard';

// ─── Data Display ─────────────────────────────────────────────────
export { Skeleton } from './Skeleton';

export {
  JobCardSkeleton,
  JobListSkeleton,
  JobDetailSkeleton,
  UserProfileSkeleton,
  CompanyDashboardSkeleton,
  CompanyJobsSkeleton,
  TableSkeleton,
  DiagnosisResultSkeleton,
  FormPageSkeleton,
  DiagnosisSkeleton,
  AdminDashboardSkeleton,
} from './SkeletonCards';

export { default as OptimizedImage } from './OptimizedImage';
export type { OptimizedImageProps } from './OptimizedImage';

// ─── Domain-specific ─────────────────────────────────────────────
export { ResumeCard } from './ResumeCard';
export { default as ResumeUpload } from './ResumeUpload';
export { default as SkillProgressBar } from './SkillProgressBar';
export { default as RadarChart } from './RadarChart';
export { default as TermsModal } from './TermsModal';
export { default as AccessibleIcon, SearchIcon, CheckIcon, GoogleIcon } from './AccessibleIcon';
