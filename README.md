# eCash ↔ THORChain PoC

A wallet-side proof of concept for exploring how eCash (XEC) could interface with THORChain flows, user experience, and future chain-level integration requirements through Tonalli Wallet.

## Important Scope Boundary

This repository **does not imply native XEC support on THORChain**.

It explores:
- THORChain swap flow and quote retrieval
- inbound vault address discovery
- memo construction requirements
- UX patterns for a future eCash interoperability path
- gap analysis for possible future chain-level integration

It does **not** include:
- a live XEC bridge into THORChain
- native XEC support in THORChain state machine
- production transaction broadcasting to THORChain vaults

## Project Structure

```text
.
├── README.md
├── package.json
├── tsconfig.json
├── docs/
│   ├── architecture.md
│   ├── poc-scope.md
│   └── thorchain-flow-notes.md
└── src/
    ├── config.ts
    ├── demo.ts
    └── thorchainClient.ts
