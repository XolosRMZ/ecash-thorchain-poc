# THORChain Flow Notes

## Overview
THORChain interfaces consume live protocol data before building transactions. The most important wallet-side inputs are:

- inbound vault addresses
- swap quotes
- memo instructions
- fee and dust guidance

## Core Flow
1. The interface requests a quote.
2. THORChain returns an inbound address and memo.
3. A supported-chain wallet builds a transaction to the inbound vault.
4. For UTXO chains, the memo is usually carried in `OP_RETURN`.
5. THORChain nodes observe the transaction and process the swap.

## Critical Wallet Rule
Inbound vault addresses must not be treated as static configuration. They should be resolved dynamically from THORChain endpoints.

## Quote Data to Inspect
The quote endpoint may return:
- `inbound_address`
- `memo`
- `expected_amount_out`
- `fees`
- `dust_threshold`
- `recommended_gas_rate`
- operational notes and warnings

## PoC Relevance
The PoC focuses on the wallet-side flow and developer ergonomics, not on claiming current native XEC support.
