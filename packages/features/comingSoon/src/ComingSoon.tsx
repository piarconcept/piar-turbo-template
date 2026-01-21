import { useTranslations } from "next-intl";

export function ComingSoon() {
  const t = useTranslations('comingSoon');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans p-8">
      <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 m-0 mb-4 text-center tracking-tight">
        {t('title')}
      </h1>
      <p className="text-lg md:text-xl lg:text-2xl text-gray-600 m-0 text-center font-normal">
        {t('subtitle')}
      </p>
    </div>
  );
}
