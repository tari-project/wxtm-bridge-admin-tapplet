# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Admin panel ("tapplet") for the WXTM bridge — the system that wraps Tari (XTM) into wXTM (ERC-20) on Ethereum and unwraps it back. Operators use this UI to review wrap/unwrap transactions, manage bridge settings (service status, batch limits, daily limits), and propose/sign/execute Gnosis Safe multisig transactions that mint wXTM. It's a [Refine](https://refine.dev) + Material UI single-page app built with Vite, deployed as a static site to S3/CloudFront.

## Commands

```bash
npm run dev        # refine dev server (http://localhost:5173)
npm run build      # tsc typecheck + refine build → dist/
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run test       # vitest (jsdom). Append a path or -t "name" for a single test.
```

Single test: `npm run test -- src/helpers/convert-wxtm-token-to-18-decimals.test.ts`. Tests are `src/**/*.test.ts` only (no component/JSX tests).

CI runs lint → typecheck → test on every PR; all three must pass.

## Environment

Requires a `.env` (see `.env.sample`). `src/config/index.ts` re-exports `VITE_*` vars under clean names. Notable ones beyond Auth0/API: `MINT_LOW_SAFE_ADDRESS` / `MINT_HIGH_SAFE_ADDRESS` (the two Gnosis Safes), `WXTM_TOKEN_ADDRESS`, `NETWORK_ID` (`11155111` = Sepolia for staging, mainnet for prod).

The `@tari-project/wxtm-bridge-backend-api` and `@tari-project/wxtm-bridge-contracts` packages come from a private registry — `npm ci` needs a GitHub token configured (`@tari-project:registry` + `_authToken`), as the CI workflows do.

## Architecture

Refine is configured in `src/App.tsx`, which is the single source of truth for resources, routes, and which data provider serves each resource. Refine's `resources` array maps a resource name → list/edit/show routes + an icon, and `meta.dataProviderName` selects one of the **four** data providers registered on `<Refine dataProvider={{...}}>`. This multi-provider setup is the core architectural pattern — each provider talks to a *different* backend:

- **`default` (`custom-nestjsx-crud-provider.ts`)** — the bridge backend's NestJS CRUD API. Serves `wrap-token-transactions` and `tokens-unwrapped`. Wraps `@refinedev/nestjsx-crud` and rewrites filters in `getList`: maps human-readable status labels (e.g. "Amount Mismatch") to backend enum values, translates the grid's `contains` operator to nestjsx's `cont`, and converts decimal token amounts on `tokenAmount`/`amountAfterFee`/`feeAmount` (6 decimals) into BigInt strings / ranges so amount columns are filterable.
- **`mintLowSafeDataProvider` / `mintHighSafeDataProvider` (`safe-transactions-data-provider.ts`)** — read-only, backed by the Gnosis Safe Transaction Service via `@safe-global/api-kit`. Same provider factory, instantiated once per Safe address. Only `getList`/`getOne` are implemented; create/update/delete throw.
- **`settingsDataProvider` (`settings-data-provider.ts`)** — a single settings record via the backend's generated `SettingsService`. Only `getOne`/`update`; the `/settings` page edits service status, batch limits, and wrap/unwrap daily limits.

The Safe data providers are read-only on purpose: **writes go through the connected wallet, not a data provider.** The mint flow lives in hooks under `src/hooks/`, built on `@safe-global/protocol-kit` + wagmi:

- `use-safe.ts` — builds a `Safe` instance and `SafeApiKit` from the wallet connector (`useAccount`).
- `use-propose-mint-transaction.ts` — encodes `mintLowAmount(to, amount)` on the `WXTMController` contract (ABI from `@tari-project/wxtm-bridge-contracts`), creates + signs the Safe tx, and proposes it.
- `use-sign-transaction.ts` / `use-execute-transaction.ts` — additional owners confirm; once threshold is met, execute on-chain and wait for the receipt via `@wagmi/core`.

Wallet connectivity (`src/components/wallet-provider/`, `src/config/wagmi-config.ts`) wraps the app in wagmi + ConnectKit + react-query, MetaMask injected connector, chains Sepolia + mainnet.

**Auth** (`src/hooks/use-auth-provider.ts`): Auth0 (`@auth0/auth0-react`) issues the token; `check()` fetches it silently, sets it on both the axios default header and the generated SDK's `OpenAPI.TOKEN`, then calls `UserService.getMe()` and **only authenticates users where `isAdmin` is true** — non-admins are logged out.

## Conventions

- Folder-per-component under `src/components/<name>/` with `index.tsx` + `types.ts` (and sometimes `const.ts`). Pages mirror this under `src/pages/<resource>/`.
- Edit pages use a tabbed layout (`@mui/lab` TabContext) — e.g. a wrap transaction has Data / Audit / Debug / Aggregated tabs, conditionally shown based on the record.
- Token amounts are 6-decimal BigInt strings end-to-end; use the `ethers` v5 `utils.parseUnits`/`formatUnits` helpers (see `src/helpers/`) rather than manual math. Contract calldata is decoded via `decode-wxtm-token-calldata.ts`.
- DataGrid filter operators are restricted per-column via `src/helpers/allowed-operators.ts`.

## Deployment

`main` → auto-deploys to **dev** (S3 `admin.staging-bridge.tari.com`); pushing a **tag** → deploys to **prod** (`admin.bridge.tari.com`). The `Makefile` (`deploy-dev` / `deploy-prod`) runs `npm run build` then `aws s3 sync` + CloudFront invalidation. CI injects env vars by decrypting `env.dev.json` / `env.prod.json` with `sops exec-env`.
