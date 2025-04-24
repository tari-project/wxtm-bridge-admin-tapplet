import { DateField } from '@refinedev/mui';

import { DateFormatedFieldProps } from './types';

export const DateFormatedField = ({ date }: DateFormatedFieldProps) => {
  return <DateField value={date} format="YYYY-MM-DD HH:MM" />;
};
