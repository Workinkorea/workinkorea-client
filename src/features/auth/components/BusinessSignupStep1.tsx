'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SignupStep1Data } from '@/features/auth/types/signup.types';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Button } from '@/shared/ui/Button';
import { IconButton } from '@/shared/ui/IconButton';

interface BusinessSignupStep1Props {
  initialData?: SignupStep1Data;
  onNextAction: (data: SignupStep1Data) => void;
  onViewTermsAction: (termType: string) => void;
}

export default function BusinessSignupStep1({
  initialData,
  onNextAction,
  onViewTermsAction
}: BusinessSignupStep1Props) {
  const t = useTranslations('auth.companySignup');
  const [agreements, setAgreements] = useState(
    initialData?.agreements || {
      all: false,
      termsOfService: false,
      privacyPolicy: false,
      personalInfo: false,
      thirdParty: false,
      marketing: false,
    }
  );

  useEffect(() => {
    if (initialData?.agreements) {
      setAgreements(initialData.agreements);
    }
  }, [initialData]);

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      termsOfService: checked,
      privacyPolicy: checked,
      personalInfo: checked,
      thirdParty: checked,
      marketing: checked,
    });
  };

  const handleIndividualAgreement = (key: keyof Omit<typeof agreements, 'all'>, checked: boolean) => {
    const newAgreements = {
      ...agreements,
      [key]: checked,
    };

    const allChecked = Object.entries(newAgreements)
      .filter(([k]) => k !== 'all')
      .every(([, value]) => value);

    setAgreements({
      ...newAgreements,
      all: allChecked,
    });
  };

  const isRequiredAgreementsChecked =
    agreements.termsOfService &&
    agreements.privacyPolicy &&
    agreements.personalInfo &&
    agreements.thirdParty;

  const getProgressPercentage = () => {
    const checkedCount = [
      agreements.termsOfService,
      agreements.privacyPolicy,
      agreements.personalInfo,
      agreements.thirdParty
    ].filter(Boolean).length;

    if (checkedCount === 0) return 0;
    if (checkedCount === 1) return 15;
    if (checkedCount === 2) return 35;
    if (checkedCount === 3) return 65;
    return 100;
  };

  const progressPercentage = getProgressPercentage();

  const handleNext = () => {
    if (!isRequiredAgreementsChecked) {
      toast.error(t('termsRequired'));
      return;
    }
    onNextAction({ agreements });
  };

  const handleViewTerms = (type: string) => {
    onViewTermsAction(type);
  };

  return (
    <div className="h-full">
      <div className="px-4 py-8">

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-title-2 sm:text-title-1 text-label-900 text-center mb-4 leading-tight">
            <p>{t('step1Title')}</p>
          </h1>
          <div className="flex items-center justify-between text-body-3">
            <div />
            <span className="text-primary-600">{progressPercentage}%</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-label-100 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </motion.div>

        {/* 전체 동의 */}
        <motion.div
          className="pb-4 border-b border-line-400"
          whileTap={{ scale: 0.98 }}
        >
          <Checkbox
            checked={agreements.all}
            onChange={(e) => handleAllAgreement(e.target.checked)}
            label={t('agreeAllLabel')}
            size="md"
          />
        </motion.div>

        <div className="space-y-4">
          {/* 서비스 이용약관 */}
          <motion.div
            className="flex items-center justify-between pt-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Checkbox
              checked={agreements.termsOfService}
              onChange={(e) => handleIndividualAgreement('termsOfService', e.target.checked)}
              label={t('terms1Label')}
              size="md"
              className="flex-1"
            />
            <IconButton
              icon={ChevronRight}
              variant="ghost"
              size="sm"
              shape="circle"
              label={t('terms1View')}
              type="button"
              onClick={() => handleViewTerms(t('terms1Key'))}
            />
          </motion.div>

          {/* 개인정보 수집 및 이용 */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Checkbox
              checked={agreements.privacyPolicy}
              onChange={(e) => handleIndividualAgreement('privacyPolicy', e.target.checked)}
              label={t('terms2Label')}
              size="md"
              className="flex-1"
            />
            <IconButton
              icon={ChevronRight}
              variant="ghost"
              size="sm"
              shape="circle"
              label={t('terms2View')}
              type="button"
              onClick={() => handleViewTerms(t('terms2Key'))}
            />
          </motion.div>

          {/* 개인정보 제공 및 위탁 */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Checkbox
              checked={agreements.personalInfo}
              onChange={(e) => handleIndividualAgreement('personalInfo', e.target.checked)}
              label={t('terms3Label')}
              size="md"
              className="flex-1"
            />
            <IconButton
              icon={ChevronRight}
              variant="ghost"
              size="sm"
              shape="circle"
              label={t('terms3View')}
              type="button"
              onClick={() => handleViewTerms(t('terms3Key'))}
            />
          </motion.div>

          {/* 개인정보 조회 */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Checkbox
              checked={agreements.thirdParty}
              onChange={(e) => handleIndividualAgreement('thirdParty', e.target.checked)}
              label={t('terms4Label')}
              size="md"
              className="flex-1"
            />
            <IconButton
              icon={ChevronRight}
              variant="ghost"
              size="sm"
              shape="circle"
              label={t('terms4View')}
              type="button"
              onClick={() => handleViewTerms(t('terms4Key'))}
            />
          </motion.div>

          {/* 마케팅 (선택) */}
          <motion.div
            className="flex items-center justify-between mt-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <Checkbox
              checked={agreements.marketing}
              onChange={(e) => handleIndividualAgreement('marketing', e.target.checked)}
              label={t('terms5Label')}
              size="md"
              className="flex-1"
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-8 flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={handleNext}
            disabled={!isRequiredAgreementsChecked}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            {t('nextBtn')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
