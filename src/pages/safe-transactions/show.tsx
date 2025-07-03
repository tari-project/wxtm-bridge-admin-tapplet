import { useCallback, useMemo } from 'react';
import { utils } from 'ethers';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
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
import { BlockchainExplorerLink } from '../../components/blockchain-explorer-link';
import { MINT_HIGH_SAFE_ADDRESS } from '../../config';

export const SafeTransactionsShow = () => {
  const {
    query: { data, isLoading, refetch },
  } = useShow<SafeTransaction>({});

  const transaction = data?.data;
  const safeAddress = transaction?.safe;

  const isHighMintSafe = useMemo(() => {
    return safeAddress === MINT_HIGH_SAFE_ADDRESS;
  }, [safeAddress]);

  const { signTransaction, loading } = useSignTransaction(safeAddress);
  const { executeTransaction, loading: executingTransaction } = useExecuteTransaction(safeAddress);

  const handleSignTransaction = useCallback(() => {
    if (transaction) {
      signTransaction(transaction).then(() => {
        refetch();
      });
    }
  }, [transaction, signTransaction, refetch]);

  const handleExecuteTransaction = useCallback(() => {
    if (transaction) {
      executeTransaction(transaction).then(() => {
        refetch();
      });
    }
  }, [transaction, executeTransaction, refetch]);

  const allSignaturesCollected = useMemo(() => {
    return (transaction?.confirmationsRequired || 1) <= (transaction?.confirmations?.length || 0);
  }, [transaction]);

  const decodedData = useMemo(() => {
    return decodeWXTMTokenCalldata({ data: transaction?.data });
  }, [transaction]);

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
            onClick={handleExecuteTransaction}
            loading={executingTransaction}
            variant="contained"
            color="error"
            disabled={true}
            sx={{ visibility: 'hidden' }}
          >
            Execute Transaction
          </Button>

          <Button
            onClick={handleSignTransaction}
            loading={loading}
            variant="contained"
            color="error"
            disabled={allSignaturesCollected || !isHighMintSafe}
          >
            Sign Transaction
          </Button>
        </>
      )}
    >
      <Stack gap={4} mt={2}>
        {allSignaturesCollected && isHighMintSafe && (
          <Typography variant="h6" fontWeight="bold" color="warning.main">
            All required signatures have been collected. The transaction will be executed
            automatically within one hour; there is no need to execute it manually.
          </Typography>
        )}

        <SafeTransactionStatus transaction={transaction} />

        <TextField
          label="Proposer"
          value={transaction.proposer || 'N/A'}
          slotProps={{ input: { readOnly: true } }}
        />

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

        <TextField
          label="To Address"
          value={decodedData?.parameters[0]?.value || 'N/A'}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="Token Amount"
          value={
            decodedData?.parameters[1]?.value
              ? utils.formatUnits(decodedData.parameters[1].value, 18)
              : 'N/A'
          }
          slotProps={{ input: { readOnly: true } }}
        />

        <Box pl={1}>
          <Typography variant="body1" fontWeight="medium" mb={1}>
            Transaction Hash:
          </Typography>
          <BlockchainExplorerLink txHash={transaction.transactionHash}>
            {transaction.transactionHash}
          </BlockchainExplorerLink>
        </Box>

        <CallDataView decodedData={decodedData} />
      </Stack>
    </Show>
  );
};
