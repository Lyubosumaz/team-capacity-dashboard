'use client';

import { TzarFooter } from '@tzardom-ui/react';
import { useLocalization } from '@/shared/i18n/LocalizationProvider';

const getCurrentYear = () => new Date().getFullYear();

export const AppFooter = () => {
  const { t } = useLocalization();
  const year = getCurrentYear();

  const copyright = t('footer.copyright').replace('{year}', `${year}`);

  return (
    <TzarFooter
      data-testid="app-footer"
      copyright={copyright}
      appName={t('footer.appName')}
      builtWith={t('footer.builtWith')}
    />
  );
};
