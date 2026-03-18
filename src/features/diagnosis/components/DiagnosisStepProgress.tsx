import { motion } from 'framer-motion';

/**
 * DiagnosisStepProgress Component
 *
 * Shows step-based progress for multi-step diagnosis flow.
 * Displays current step, total steps, and percentage completion.
 *
 * @example
 * <DiagnosisStepProgress currentStep={3} totalSteps={5} />
 */

interface DiagnosisStepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const DiagnosisStepProgress = ({ currentStep, totalSteps }: DiagnosisStepProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-body-2 font-medium text-slate-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-body-2 font-medium text-blue-600">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
