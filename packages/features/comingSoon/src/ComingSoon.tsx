import { useTranslations } from "next-intl";

export function ComingSoon() {
  const t = useTranslations('comingSoon');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: 700,
          color: '#1a1a1a',
          margin: 0,
          marginBottom: '1rem',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}
      >
        {t('title')}
      </h1>
      <p
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          color: '#6c757d',
          margin: 0,
          textAlign: 'center',
          fontWeight: 400,
        }}
      >
        {t('subtitle')}
      </p>
    </div>
  );
}
