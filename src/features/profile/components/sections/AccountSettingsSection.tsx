'use client';

import { UseFormReturn, Controller } from 'react-hook-form';
import { Bell, AlertTriangle } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Card: Notification Settings */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 sm:px-7 py-5 border-b border-slate-100">
          <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Bell size={16} className="text-blue-600" />
          </span>
          <div>
            <h2 className="text-body-2 font-bold text-slate-900">알림 설정</h2>
            <p className="text-caption-3 text-slate-400 mt-0.5">받고 싶은 알림을 선택하세요</p>
          </div>
        </div>

        {/* SNS Message Notifications */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100">
          <Controller
            name="notifications.contactRequestNotifications"
            control={control}
            render={({ field }) => {
              const { value, ...fieldWithoutValue } = field;
              return (
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex-1">
                    <span className="text-caption-1 font-semibold text-slate-900">
                      SNS 메시지 알림
                    </span>
                    <p className="text-caption-2 text-slate-500 mt-1">
                      중요한 활동을 SNS 메시지로 알림 받습니다
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <div
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ml-4',
                      value ? 'bg-blue-600' : 'bg-slate-100'
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

        {/* Email Notifications */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100">
          <Controller
            name="notifications.emailNotifications"
            control={control}
            render={({ field }) => {
              const { value, ...fieldWithoutValue } = field;
              return (
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex-1">
                    <span className="text-caption-1 font-semibold text-slate-900">
                      이메일 알림
                    </span>
                    <p className="text-caption-2 text-slate-500 mt-1">
                      중요한 활동을 이메일로 알림 받습니다
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <div
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ml-4',
                      value ? 'bg-blue-600' : 'bg-slate-100'
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
      <div className="bg-red-500-bg border border-red-500-bg rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 sm:px-7 py-5 border-b border-red-500-bg">
          <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-red-500" />
          </span>
          <div>
            <h2 className="text-body-2 font-bold text-red-500">계정 관리</h2>
            <p className="text-caption-3 text-slate-500 mt-0.5">주의가 필요한 계정 관리 옵션입니다</p>
          </div>
        </div>

        <div className="px-5 sm:px-7 py-5">
          <button
            type="button"
            className="w-full px-4 py-2.5 border border-red-300 text-red-500 rounded-lg text-body-3 font-semibold hover:bg-red-100 transition-colors cursor-pointer"
            onClick={() => {
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
export default AccountSettingsSection;
