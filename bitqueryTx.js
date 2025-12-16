import fetch from "node-fetch";

const BITQUERY_ENDPOINT = "https://graphql.bitquery.io";

export async function fetchBitcoinTransaction({
  apiKey,
  txHash,
  network = "bitcoin",
  limit = 10,
  offset = 0
}) {
  const query = `
    query ($network: BitcoinNetwork!, $hash: String!, $limit: Int!, $offset: Int!) {
      bitcoin(network: $network) {
        transactions(txHash: {is: $hash}) {
          block {
            height
            timestamp {
              time(format: "%Y-%m-%d %H:%M:%S")
            }
          }
          index
          inputCount
          outputCount
          inputValue
          input_value_usd: inputValue(in: USD)
          outputValue
          output_value_usd: outputValue(in: USD)
          feeValue
          fee_value_usd: feeValue(in: USD)
          txSize
          txVsize
          txWeight
          txVersion
        }
        outputs(
          txHash: {is: $hash}
          options: {asc: "outputIndex", limit: $limit, offset: $offset}
        ) {
          outputIndex
          address: outputAddress {
            address
            annotation
          }
          value
          value_usd: value(in: USD)
          outputDirection
        }
        inputs(
          txHash: {is: $hash}
          options: {asc: "inputIndex", limit: $limit, offset: $offset}
        ) {
          inputIndex
          address: inputAddress {
            address
            annotation
          }
          value
          value_usd: value(in: USD)
        }
      }
    }
  `;

  const res = await fetch(BITQUERY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query,
      variables: {
        network,
        hash: txHash,
        limit,
        offset
      }
    })
  });

  if (!res.ok) {
    throw new Error(`Bitquery API error: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }

  return json.data.bitcoin;
}
