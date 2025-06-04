import { getGridStringOperators } from '@mui/x-data-grid';

export const equalsEmptyOperators = () =>
  getGridStringOperators().filter((op) => ['equals', 'isEmpty', 'isNotEmpty'].includes(op.value));

export const containsEqualsEmptyOperators = () =>
  getGridStringOperators().filter((op) =>
    ['contains', 'equals', 'isEmpty', 'isNotEmpty'].includes(op.value)
  );
