# Architecture

## Modules

### THORChain API Client
Responsible for fetching live protocol data needed for wallet-side experimentation.

### Quote Consumer
Requests swap quotes and surfaces:
- inbound address
- memo
- expected output
- fee data
- warnings

### Conceptual XEC Flow Layer
A future UI layer that can illustrate how a user intent from XEC could map into a THORChain-compatible routing path once protocol-level support exists.

## Design Principles
- modularity
- explicit scope boundaries
- no static vault configuration
- no overclaiming of chain support
- clear separation between wallet-side research and protocol-side integration
