import { SwapQuote, InboundAddress } from "./thorchainClient.js";

/**
 * Modelo normalizado para la UI de Tonalli.
 * Abstrae la complejidad de THORChain en un formato digerible para la wallet.
 */
export interface TonalliNormalizedQuote {
  isViable: boolean;
  blockerReason?: string;

  // Datos para la transacción UTXO
  targetVaultAddress: string;
  opReturnMemo: string;

  // Datos para mostrar en UI
  expectedOutputAmount: string;
  estimatedTimeSeconds: number;
  totalFeesInBaseAsset: string;

  // Estado de tiempo
  expiryTimestamp: number;
  secondsUntilExpiry: number;
}

export class QuoteInspector {
  /**
   * Analiza la cotización y el estado de la red para determinar si es seguro
   * permitir al usuario proceder con el swap.
   */
  static analyze(
    quote: SwapQuote,
    inboundState?: InboundAddress
  ): TonalliNormalizedQuote {
    const currentTimestampSeconds = Math.floor(Date.now() / 1000);
    const secondsUntilExpiry = quote.expiry - currentTimestampSeconds;
    const isExpired = secondsUntilExpiry <= 0;

    let isViable = true;
    let blockerReason: string | undefined = undefined;

    // 1. Validación de estado de red
    if (!inboundState) {
      isViable = false;
      blockerReason = "Could not verify inbound vault state.";
    } else if (inboundState.halted) {
      isViable = false;
      blockerReason = "Inbound chain is halted for safety.";
    } else if (
      inboundState.global_trading_paused ||
      inboundState.chain_trading_paused
    ) {
      isViable = false;
      blockerReason = "Trading is paused globally or for this specific chain.";
    }
    // 2. Validación de expiración
    else if (isExpired) {
      isViable = false;
      blockerReason = "Quote expired. Please request a new quote.";
    }
    // 3. Validación de advertencias críticas
    else if (quote.warning && quote.warning.toLowerCase().includes("halt")) {
      isViable = false;
      blockerReason = `Protocol warning: ${quote.warning}`;
    }

    return {
      isViable,
      blockerReason,
      targetVaultAddress: inboundState?.address || quote.inbound_address || "",
      opReturnMemo: quote.memo,
      expectedOutputAmount: quote.expected_amount_out,
      estimatedTimeSeconds:
        quote.total_swap_seconds || quote.inbound_confirmation_seconds,
      totalFeesInBaseAsset: quote.fees.total,
      expiryTimestamp: quote.expiry,
      secondsUntilExpiry: secondsUntilExpiry > 0 ? secondsUntilExpiry : 0
    };
  }
}
