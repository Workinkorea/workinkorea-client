'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField } from '@/shared/ui/FormField';
import type { AccountSettingsForm } from '../../validations/profile';

/**
 * AccountSettingsSection Component
 *
 * Presentational component for account settings (notifications, privacy, danger zone).
 * Receives form instance from parent container.
 *
 * @example
 * <AccountSettingsSection form={accountForm} />
 *
 * Architecture Decision:
 * - Nested form fields (notifications.emailNotifications) using dot notation
 * - Checkbox pattern: Destructure `value` separately to use `checked` prop
 * - Danger zone (delete account) visually separated with red accents
 *
 * Why nested forms?
 * - Mirrors API structure: { notifications: { emailNotifications: true } }
 * - Easier validation with Zod schemas
 * - Better type safety with TypeScript
 */

export interface AccountSettingsSectionProps {
  /** react-hook-form instance for account settings */
  form: UseFormReturn<AccountSettingsForm>;
}

const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({ form }) => {
  const { control } = form;

  return (
    <div className="space-y-8">
      {/* Notification Settings */}
      <div className="space-y-4">
        <div className="border-b border-line-200 pb-3">
          <h4 className="text-body-2 font-semibold text-label-700">
            알림 설정
          </h4>
          <p className="text-caption-2 text-label-500 mt-1">
            받고 싶은 알림을 선택하세요
          </p>
        </div>

        <div className="space-y-3">
          {/* SNS Message Notifications */}
          <FormField
            name="notifications.contactRequestNotifications"
            control={control}
            label=""
            render={(field, fieldId) => {
              // Destructure to handle checkbox separately
              const { value, ...fieldWithoutValue } = field;
              return (
                <label className="flex items-center justify-between p-3 bg-component-alternative rounded-lg cursor-pointer">
                  <div>
                    <span className="text-body-3 font-medium">
                      SNS 메시지 알림
                    </span>
                    <p className="text-caption-2 text-label-500">
                      중요한 활동을 SNS 메시지로 알림 받습니다
                    </p>
                  </div>
                  <input
                    {...fieldWithoutValue}
                    id={fieldId}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                </label>
              );
            }}
          />

          {/* Email Notifications */}
          <FormField
            name="notifications.emailNotifications"
            control={control}
            label=""
            render={(field, fieldId) => {
              const { value, ...fieldWithoutValue } = field;
              return (
                <label className="flex items-center justify-between p-3 bg-component-alternative rounded-lg cursor-pointer">
                  <div>
                    <span className="text-body-3 font-medium">
                      이메일 알림
                    </span>
                    <p className="text-caption-2 text-label-500">
                      중요한 활동을 이메일로 알림 받습니다
                    </p>
                  </div>
                  <input
                    {...fieldWithoutValue}
                    id={fieldId}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                </label>
              );
            }}
          />
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="space-y-4">
        <div className="border-b border-status-error pb-3">
          <h4 className="text-body-2 font-semibold text-status-error">
            계정 관리
          </h4>
          <p className="text-caption-2 text-label-500 mt-1">
            주의가 필요한 계정 관리 옵션입니다
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="
              w-full text-left p-3
              border border-status-error rounded-lg
              text-body-3 text-status-error
              hover:bg-component-alternative
              transition-colors cursor-pointer
            "
            onClick={() => {
              // TODO: Implement account deletion confirmation modal
              alert('계정 삭제 기능은 준비 중입니다.');
            }}
          >
            계정 삭제 요청
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Performance Notes:
 * - Memoized to prevent re-renders when parent container state changes
 * - Checkbox pattern avoids unnecessary controlled input warnings
 * - Future: Could extract notification items into separate component if list grows
 */
export default React.memo(AccountSettingsSection);
