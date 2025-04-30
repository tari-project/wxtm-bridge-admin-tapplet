import { useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useShow } from '@refinedev/core';
import { Show } from '@refinedev/mui';

import { SafeTransaction } from '../../providers/safe-transactions-data-provider';
import { useSignTransaction } from '../../hooks/use-sign-transaction';
import { useExecuteTransaction } from '../../hooks/use-execute-transaction';
import { SafeTransactionStatus } from '../../components/safe-transaction-status';
import CallDataView from '../../components/call-data-view';
import { decodeWXTMTokenCalldata } from '../../helpers/decode-wxtm-token-calldata';

export const SafeTransactionsShow = () => {
  const { query } = useShow<SafeTransaction>({});
  const { signTransaction, loading } = useSignTransaction();
  const { executeTransaction, loading: executingTransaction } = useExecuteTransaction();

  const { data, isLoading } = query;
  const transaction = data?.data;

  const handleSignTransaction = useCallback(() => {
    if (transaction) {
      signTransaction(transaction);
    }
  }, [transaction, signTransaction]);

  const handleExecuteTransaction = useCallback(() => {
    if (transaction) {
      executeTransaction(transaction);
    }
  }, [transaction, executeTransaction]);

  const allSignaturesCollected = useMemo(() => {
    return transaction?.confirmationsRequired === transaction?.confirmations?.length;
  }, [transaction]);

  const canExecuteTransaction = useMemo(() => {
    return allSignaturesCollected && !transaction?.isExecuted;
  }, [transaction, allSignaturesCollected]);

  if (!transaction) {
    return null;
  }

  return (
    <Show
      isLoading={isLoading}
      title="Back"
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
        <SafeTransactionStatus transaction={transaction} />

        {transaction.confirmations && (
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

        <CallDataView decodedData={decodeWXTMTokenCalldata({ data: transaction.data })} />
      </Stack>
    </Show>
  );
};
