import { ThorchainClient } from "./thorchainClient.js";
import { QuoteInspector } from "./quoteInspector.js";

async function main(): Promise<void> {
  const client = new ThorchainClient();

  console.log("Fetching inbound addresses...");
  const inbound = await client.getInboundAddresses();

  const btcInbound = inbound.find((x) => x.chain === "BTC");
  const ethInbound = inbound.find((x) => x.chain === "ETH");

  console.log("BTC inbound:", btcInbound);
  console.log("ETH inbound:", ethInbound);

  console.log("\nFetching sample swap quote...");
  const quote = await client.getSwapQuote({
    fromAsset: "BTC.BTC",
    toAsset: "ETH.ETH",
    amount: "100000",
    destination: "0x86d526d6624AbC0178cF7296cD538Ecc080A95F1",
    streamingInterval: 1,
    streamingQuantity: 0
  });

  console.log("\nRaw quote:");
  console.log(JSON.stringify(quote, null, 2));

  const fromChain = quote.memo.split(":")[0].includes("=") ? "BTC" : "BTC";
  const inboundState = inbound.find((x) => x.chain === fromChain);

  const normalized = QuoteInspector.analyze(quote, inboundState);

  console.log("\nTonalli normalized quote:");
  console.log(JSON.stringify(normalized, null, 2));

  if (!normalized.isViable) {
    console.log("\nSwap blocked:");
    console.log(normalized.blockerReason);
  } else {
    console.log("\nSwap is viable.");
    console.log(`Target vault: ${normalized.targetVaultAddress}`);
    console.log(`OP_RETURN memo: ${normalized.opReturnMemo}`);
  }
}

main().catch((error) => {
  console.error("Demo failed:", error);
  process.exit(1);
});
