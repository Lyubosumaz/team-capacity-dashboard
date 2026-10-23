import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SashePage = () => {
  const t = useTranslations();

  return (
    <div className="mx-auto flex w-full flex-1 items-center justify-center px-4 pb-8 pt-6 md:px-6 gap-4">
      <Heart className="h-32 w-32 text-rose-500" aria-hidden="true" />
      <p className="text-4xl md:text-8xl font-semibold text-center text-rose-500">
        {t('sashe.message')}
      </p>
      <Heart className="h-32 w-32 text-rose-500" aria-hidden="true" />
    </div>
  );
};

export default SashePage;
