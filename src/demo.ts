import { ThorchainClient } from "./thorchainClient.js";

async function main(): Promise<void> {
  const client = new ThorchainClient();

  console.log("Fetching inbound addresses...");
  const inbound = await client.getInboundAddresses();

  const btc = inbound.find((x) => x.chain === "BTC");
  const eth = inbound.find((x) => x.chain === "ETH");

  console.log("BTC inbound:", btc);
  console.log("ETH inbound:", eth);

  console.log("\nFetching sample swap quote...");
  const quote = await client.getSwapQuote({
    fromAsset: "BTC.BTC",
    toAsset: "ETH.ETH",
    amount: "100000",
    destination: "0x86d526d6624AbC0178cF7296cD538Ecc080A95F1",
    streamingInterval: 1,
    streamingQuantity: 0
  });

  console.log("Quote inbound address:", quote.inbound_address);
  console.log("Quote memo:", quote.memo);
  console.log("Expected out:", quote.expected_amount_out);
  console.log("Expiry:", quote.expiry);
  console.log("Warning:", quote.warning);
  console.log("Notes:", quote.notes);
}

main().catch((error) => {
  console.error("Demo failed:", error);
  process.exit(1);
});
