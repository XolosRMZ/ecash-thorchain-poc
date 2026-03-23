import { DEFAULT_TIMEOUT_MS, THORCHAIN_API_BASE } from "./config.js";

export interface InboundAddress {
  chain: string;
  pub_key?: string;
  address: string;
  halted?: boolean;
  global_trading_paused?: boolean;
  chain_trading_paused?: boolean;
  chain_lp_actions_paused?: boolean;
  gas_rate?: string;
  gas_rate_units?: string;
  outbound_tx_size?: string;
  outbound_fee?: string;
  dust_threshold?: string;
  router?: string;
}

export interface SwapQuoteFees {
  asset: string;
  affiliate: string;
  outbound: string;
  liquidity: string;
  total: string;
  slippage_bps: number;
  total_bps: number;
}

export interface SwapQuote {
  inbound_address: string;
  inbound_confirmation_blocks: number;
  inbound_confirmation_seconds: number;
  outbound_delay_blocks: number;
  outbound_delay_seconds: number;
  fees: SwapQuoteFees;
  slippage_bps: number;
  streaming_slippage_bps?: number;
  expiry: number;
  warning?: string;
  notes?: string;
  dust_threshold?: string;
  recommended_min_amount_in?: string;
  recommended_gas_rate?: string;
  gas_rate_units?: string;
  memo: string;
  expected_amount_out: string;
  expected_amount_out_streaming?: string;
  max_streaming_quantity?: number;
  streaming_swap_blocks?: number;
  streaming_swap_seconds?: number;
  total_swap_seconds?: number;
}

export interface SwapQuoteParams {
  fromAsset: string;
  toAsset: string;
  amount: string;
  destination: string;
  liquidityToleranceBps?: number;
  streamingInterval?: number;
  streamingQuantity?: number;
  affiliate?: string;
  affiliateBps?: number;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined>
): string {
  const url = new URL(`${THORCHAIN_API_BASE}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function fetchJson<T>(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`THORChain API error ${response.status}: ${body}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export class ThorchainClient {
  async getInboundAddresses(): Promise<InboundAddress[]> {
    const url = buildUrl("/inbound_addresses");
    return fetchJson<InboundAddress[]>(url);
  }

  async getInboundAddressForChain(chain: string): Promise<InboundAddress | undefined> {
    const addresses = await this.getInboundAddresses();
    return addresses.find((item) => item.chain.toUpperCase() === chain.toUpperCase());
  }

  async getSwapQuote(params: SwapQuoteParams): Promise<SwapQuote> {
    const url = buildUrl("/quote/swap", {
      from_asset: params.fromAsset,
      to_asset: params.toAsset,
      amount: params.amount,
      destination: params.destination,
      liquidity_tolerance_bps: params.liquidityToleranceBps,
      streaming_interval: params.streamingInterval,
      streaming_quantity: params.streamingQuantity,
      affiliate: params.affiliate,
      affiliate_bps: params.affiliateBps
    });

    return fetchJson<SwapQuote>(url);
  }
}
