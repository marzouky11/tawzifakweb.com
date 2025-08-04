import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أنشئ سيرتك الذاتية مجانًا',
  description: 'أنشئ سيرة ذاتية احترافية باللغة العربية مجانًا عبر منصة توظيفك، واختر من بين عدة قوالب جاهزة تساعدك في الحصول على وظيفة أحلامك.',
};

export default function CVBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
