import { motion, useInView } from 'framer-motion';
import { CalendarClock, Gauge, Layers, Users } from 'lucide-react';
import { useRef } from 'react';
import { Section } from '@/components/ui/Section';
import { StatCard, type StatCardProps } from '@/components/ui/StatCard';
import { easeOutExpo } from '@/lib/motion';

/** Only verified figures from the resume. Do not add metrics here without a source. */
const metrics: (Pick<StatCardProps, 'value' | 'suffix' | 'label' | 'description' | 'variant'> & { icon: typeof Gauge })[] = [
  { value: 5, suffix: '+', label: 'Years of experience', description: 'Building enterprise React applications at Accenture.', icon: CalendarClock },
  { value: 100, suffix: '+', label: 'Application screens built', description: 'Shipped across five enterprise products.', icon: Layers },
  { value: 4, label: 'Frontend developers led', description: 'On a GenAI reporting product built from scratch.', icon: Users, variant: 'highlight' },
  { value: 60, suffix: '%', label: 'Page-load improvement, at best', description: 'Up to 60% through memoization and lazy loading.', icon: Gauge },
];

export function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <Section id="impact" labelledBy="impact-title" className="py-16 md:py-20">
      <h2 id="impact-title" className="eyebrow flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--color-signal-soft))]" />
        Impact at a glance
      </h2>
      <div ref={ref} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ icon: Icon, ...metric }, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: i * 0.08, ease: easeOutExpo }}
          >
            <StatCard {...metric} icon={<Icon size={18} aria-hidden="true" />} start={inView} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
