import { ComingSoon } from '@piar/coming-soon';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function Home({
  params,
}: {
  params: any;
}) {
  const resolvedParams = typeof params?.then === 'function' ? await params : params;
  const locale = resolvedParams?.locale ?? 'en';
  return <ComingSoon language={locale as 'ca' | 'es' | 'en'} />;
}
