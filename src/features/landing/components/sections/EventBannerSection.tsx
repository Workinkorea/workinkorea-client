import Image from 'next/image';
import Link from 'next/link';
import { getActiveEvents } from '@/features/events/api/eventsApi';
import type { Event, EventType } from '@/features/events/types/event';
import { getTranslations } from 'next-intl/server';

// ── 타입 배지 ────────────────────────────────────────────────────────────────
function EventTypeBadge({ type, labels }: { type: EventType; labels: Record<EventType, string> }) {
  const styles: Record<EventType, string> = {
    notice: 'bg-blue-100 text-blue-700',
    event: 'bg-amber-500-bg text-amber-500',
    promotion: 'bg-emerald-500-bg text-emerald-500',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption-3 font-semibold ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

// ── 이벤트 카드 ──────────────────────────────────────────────────────────────
function EventCard({ event, labels }: { event: Event; labels: Record<EventType, string> }) {
  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col">
      {/* 배너 이미지 */}
      {event.banner_url ? (
        <div className="relative h-40 overflow-hidden">
          <Image
            src={event.banner_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="h-40 bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center">
          <span className="text-title-1 select-none">
            {event.type === 'notice' ? '📢' : event.type === 'event' ? '🎉' : '🎁'}
          </span>
        </div>
      )}

      {/* 카드 본문 */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2.5">
          <EventTypeBadge type={event.type} labels={labels} />
        </div>

        <h3 className="text-body-2 font-bold text-slate-900 leading-snug line-clamp-2 mb-auto">
          {event.title}
        </h3>

        <p className="text-caption-2 text-slate-400 mt-3">
          {event.start_date} ~ {event.end_date}
        </p>
      </div>
    </article>
  );
}

// ── 메인 섹션 ────────────────────────────────────────────────────────────────
export default async function EventBannerSection() {
  const t = await getTranslations('landing.events');
  let events: Event[] = [];

  try {
    events = await getActiveEvents();
  } catch {
    // API가 준비되지 않았거나 에러 발생 시 섹션 숨김
    return null;
  }

  if (events.length === 0) return null;

  const displayed = events.slice(0, 4);
  const typeLabels: Record<EventType, string> = {
    notice: t('typeNotice'),
    event: t('typeEvent'),
    promotion: t('typePromotion'),
  };

  return (
    <section className="py-16 bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-caption-2 font-bold text-blue-600 uppercase tracking-[1.5px] mb-2">
              {t('overline')}
            </p>
            <h2 className="text-title-2 font-extrabold text-slate-900">
              {t('title')}
            </h2>
            <p className="text-body-3 text-slate-500 mt-1.5">
              {t('subtitle')}
            </p>
          </div>

          {events.length > 4 && (
            <Link
              href="/events"
              className="text-caption-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              {t('viewAll')}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {/* 이벤트 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayed.map((event) => (
            <EventCard key={event.id} event={event} labels={typeLabels} />
          ))}
        </div>
      </div>
    </section>
  );
}
