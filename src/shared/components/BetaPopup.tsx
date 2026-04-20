'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FlaskConical } from 'lucide-react';

const BETA_POPUP_KEY = 'wik_beta_popup_seen';

export function BetaPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // incognito 또는 cookie/storage 차단 환경에서 localStorage 접근이
    // SecurityError 를 던질 수 있다. RootLayout 에서 항상 렌더되는 컴포넌트이므로
    // 여기서 실패하면 전체 앱 마운트가 차단될 수 있다.
    try {
      const seen = localStorage.getItem(BETA_POPUP_KEY);
      if (!seen) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(BETA_POPUP_KEY, '1');
    } catch {
      // storage 차단 환경에서는 무시 (세션 내에서는 닫힘 유지)
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          {/* panel */}
          <motion.div
            key="panel"
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <div className="pointer-events-auto bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
              {/* header gradient bar */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <FlaskConical size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-caption-3 font-semibold text-blue-200 uppercase tracking-wider">Beta Service</p>
                    <h2 className="text-title-5 font-bold text-white leading-tight">베타 서비스 안내</h2>
                  </div>
                </div>
                <button
                  onClick={dismiss}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer mt-0.5"
                  aria-label="닫기"
                >
                  <X size={18} />
                </button>
              </div>

              {/* body */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-body-3 text-slate-700 leading-relaxed">
                  현재 <span className="font-semibold text-blue-600">워크인코리아</span>는 베타 서비스 테스트 중입니다.
                </p>
                <p className="text-caption-1 text-slate-500 leading-relaxed">
                  일부 기능이 제한되거나 변경될 수 있으며, 예상치 못한 오류가 발생할 수 있습니다. 불편을 드려 죄송합니다.
                </p>
                <div className="bg-blue-50 rounded-xl px-4 py-3 text-caption-2 text-blue-700 leading-relaxed">
                  더 나은 서비스를 위해 지속적으로 개선하고 있습니다. 이용해주셔서 감사합니다! 🙏
                </div>
              </div>

              {/* footer */}
              <div className="px-6 pb-5">
                <button
                  onClick={dismiss}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-body-3 font-semibold transition-colors cursor-pointer"
                >
                  확인했습니다
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
