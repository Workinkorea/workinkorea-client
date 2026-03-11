'use client';

import { UseFormReturn } from 'react-hook-form';
import { Bell, AlertTriangle } from 'lucide-react';
import { FormField } from '@/shared/ui/FormField';
import { cn } from '@/shared/lib/utils/utils';
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

function AccountSettingsSection({ form }: AccountSettingsSectionProps) {
  const { control } = form;

  return (
    <div className="space-y-6">
      {/* Card: Notification Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="mb-6 flex items-start gap-3">
          <Bell size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-[17px] font-bold text-slate-900">알림 설정</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">받고 싶은 알림을 선택하세요</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* SNS Message Notifications */}
          <FormField
            name="notifications.contactRequestNotifications"
            control={control}
            label=""
            render={(field, fieldId) => {
              const { value, ...fieldWithoutValue } = field;
              return (
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex-1">
                    <span className="text-[13px] font-semibold text-slate-900">
                      SNS 메시지 알림
                    </span>
                    <p className="text-[12px] text-slate-500 mt-1">
                      중요한 활동을 SNS 메시지로 알림 받습니다
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <div
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ml-4',
                      value ? 'bg-blue-600' : 'bg-slate-200'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                        value ? 'translate-x-5' : 'translate-x-0.5'
                      )}
                    />
                    <input
                      {...fieldWithoutValue}
                      id={fieldId}
                      type="checkbox"
                      checked={value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="sr-only"
                    />
                  </div>
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
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex-1">
                    <span className="text-[13px] font-semibold text-slate-900">
                      이메일 알림
                    </span>
                    <p className="text-[12px] text-slate-500 mt-1">
                      중요한 활동을 이메일로 알림 받습니다
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <div
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ml-4',
                      value ? 'bg-blue-600' : 'bg-slate-200'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                        value ? 'translate-x-5' : 'translate-x-0.5'
                      )}
                    />
                    <input
                      {...fieldWithoutValue}
                      id={fieldId}
                      type="checkbox"
                      checked={value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="sr-only"
                    />
                  </div>
                </label>
              );
            }}
          />
        </div>
      </div>

      {/* Card: Account Management (Danger Zone) */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="mb-6 flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-[17px] font-bold text-red-600">계정 관리</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">주의가 필요한 계정 관리 옵션입니다</p>
          </div>
        </div>

        <button
          type="button"
          className="w-full px-4 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors cursor-pointer"
          onClick={() => {
            alert('계정 삭제 기능은 준비 중입니다.');
          }}
        >
          계정 삭제 요청
        </button>
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
export default AccountSettingsSection;
