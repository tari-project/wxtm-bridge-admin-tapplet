import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Typography, Menu, MenuItem, CircularProgress } from '@mui/material';
import { useDisconnect, useAccountEffect, useAccount } from 'wagmi';
import { ConnectKitButton, ChainIcon } from 'connectkit';
import { useTheme } from '@mui/material/styles';

const BUTTON_WIDTH = 200;

export const WalletConnect = () => {
  const { status, address: reconnectingAddress, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const [address, setAddress] = useState<string | undefined>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const theme = useTheme();

  const disconnectWallet = useCallback(() => {
    disconnect();
    setAddress(undefined);
  }, [disconnect, setAddress]);

  const onConnect = useCallback(
    (address: string) => {
      setAddress(address);
    },
    [setAddress]
  );

  const isWalletReconecting = useMemo(
    () => status === 'reconnecting' || status === 'connecting',
    [status]
  );

  useAccountEffect({
    onConnect: ({ address }) => onConnect(address),
    onDisconnect: () => {
      setAddress(undefined);
    },
  });

  useEffect(() => {
    if (
      (status === 'reconnecting' || status === 'connected') &&
      !!reconnectingAddress &&
      reconnectingAddress !== address
    ) {
      onConnect(reconnectingAddress);
    }
  }, [status, reconnectingAddress, onConnect, address]);

  return (
    <>
      {!address && (
        <ConnectKitButton.Custom>
          {({ show }) => {
            return (
              <Button
                type="button"
                style={{
                  display: 'flex',
                  backgroundColor: theme.palette.background.paper,
                  width: BUTTON_WIDTH,
                }}
                onClick={show}
                disabled={isWalletReconecting}
              >
                {isWalletReconecting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      ml: 1,
                    }}
                  >
                    Connect Wallet
                  </Typography>
                )}
              </Button>
            );
          }}
        </ConnectKitButton.Custom>
      )}

      {address && (
        <>
          <Button
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}
            style={{
              display: 'flex',
              backgroundColor: theme.palette.background.paper,
              width: BUTTON_WIDTH,
            }}
          >
            <ChainIcon id={chainId} size={20} />
            <Typography
              color="textSecondary"
              sx={{
                ml: 1,
              }}
            >
              {address.slice(0, 7)}...{address.slice(-5)}
            </Typography>
          </Button>
          <Menu
            id="address-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClick={() => setAnchorEl(null)}
          >
            <MenuItem
              sx={{
                width: BUTTON_WIDTH,
                p: 0,
                justifyContent: 'center',
                backgroundColor: theme.palette.background.paper,
              }}
              onClick={disconnectWallet}
            >
              Disconnect
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};
