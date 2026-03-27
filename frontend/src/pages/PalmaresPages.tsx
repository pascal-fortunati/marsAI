import React from 'react';
import { useTranslation } from 'react-i18next';
import { PalmaresView } from '../view/palmares/PalmaresView';

export const PalmaresPages = () => {
  const { t } = useTranslation();

  return (
    <PalmaresView />
  );
};