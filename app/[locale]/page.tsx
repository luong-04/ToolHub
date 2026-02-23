import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-black text-white">{t('title')}</h1>
      <p className="text-gray-400">{t('description')}</p>
      <button className="bg-neon-blue text-black px-6 py-2 rounded-lg">
        {t('explore')}
      </button>
    </div>
  );
}