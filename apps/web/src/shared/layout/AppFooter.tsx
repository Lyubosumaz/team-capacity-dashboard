import { TzarFooter } from '@tzardom-ui/react';
import { useTranslations } from 'next-intl';

export const AppFooter = () => {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <TzarFooter
      data-testid="app-footer"
      copyright={t('footer.copyright', { year })}
      appName={t('footer.appName')}
      builtWith={t('footer.builtWith')}
    />
  );
};
