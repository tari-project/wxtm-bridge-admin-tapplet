import { useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useShow, useNavigation } from '@refinedev/core';
import { Show } from '@refinedev/mui';

import { SafeTransaction } from '../../providers/safe-transactions-data-provider';
import { useSignTransaction } from '../../hooks/use-sign-transaction';
import { useExecuteTransaction } from '../../hooks/use-execute-transaction';

export const SafeTransactionsShow = () => {
  const { query } = useShow<SafeTransaction>({});
  const { push } = useNavigation();
  const { signTransaction, loading } = useSignTransaction();
  const { executeTransaction, loading: executingTransaction } = useExecuteTransaction();

  const { data, isLoading } = query;
  const transaction = data?.data;

  const handleSignTransaction = useCallback(() => {
    if (transaction) {
      signTransaction(transaction).then(() => {
        push('/safe-transactions');
      });
    }
  }, [transaction, signTransaction, push]);

  const handleExecuteTransaction = useCallback(() => {
    if (transaction) {
      executeTransaction(transaction).then(() => {
        push('/safe-transactions');
      });
    }
  }, [transaction, executeTransaction, push]);

  const allSignaturesCollected = useMemo(() => {
    return transaction?.confirmationsRequired === transaction?.confirmations?.length;
  }, [transaction]);

  const canExecuteTransaction = useMemo(() => {
    return allSignaturesCollected && !transaction?.isExecuted;
  }, [transaction, allSignaturesCollected]);

  return (
    <Show
      isLoading={isLoading}
      title="Sign Transaction"
      headerButtons={() => (
        <>
          <Button
            onClick={handleSignTransaction}
            loading={loading}
            variant="contained"
            color="error"
            disabled={allSignaturesCollected}
          >
            Sign Transaction
          </Button>

          <Button
            onClick={handleExecuteTransaction}
            loading={executingTransaction}
            variant="contained"
            color="error"
            disabled={!canExecuteTransaction}
          >
            Execute Transaction
          </Button>
        </>
      )}
    >
      <Stack gap={1} mt={2}>
        <Box>
          {transaction?.isSuccessful ? (
            <Chip label="Success" color="success" size="small" />
          ) : (
            <Chip
              label={`${transaction?.confirmations?.length || 0}/${
                transaction?.confirmationsRequired
              } Signatures`}
              color="info"
              size="small"
            />
          )}
        </Box>

        {transaction?.confirmations && (
          <List dense>
            {transaction.confirmations.map((confirmation, index) => (
              <Box key={confirmation.owner}>
                {index > 0 && <Divider component="li" />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" component="div">
                        Signer-{index + 1}: {confirmation.owner}
                      </Typography>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Stack>
    </Show>
  );
};
