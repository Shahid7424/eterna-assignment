import { useEffect, useState } from "react";
import { subscribeToDexMock } from "../realTime";

export const useLivePrices = (addresses: string[]) => {
  const [updates, setUpdates] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!addresses || addresses.length === 0) return;

    const ws = subscribeToDexMock(addresses, (msg) => {
      const addr = msg.id.toLowerCase();

      setUpdates((prev) => ({
        ...prev,
        [addr]: {
          price: Number(msg.priceUsd),
          priceChange24h: Number(msg.priceChange.h24),
          volume24h: msg.volume.h24,
          liquidity: msg.liquidity.usd,
        },
      }));
    });

    return () => ws.close();
  }, [JSON.stringify(addresses)]);

  return updates;
};
