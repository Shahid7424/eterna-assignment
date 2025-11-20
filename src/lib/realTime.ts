
export function subscribeToDexMock(
  addresses: string[],
  onUpdate: (msg: any) => void
) {
  console.log("[MockWS] connected, simulating live price updates…");

  const interval = setInterval(() => {
    addresses.forEach((addr) => {
      onUpdate({
        id: addr,
        priceUsd: (0.0001 + Math.random() * 0.01).toFixed(8),
        priceChange: { h24: (Math.random() * 10 - 5).toFixed(2) },
        volume: { h24: Math.random() * 500000 },
        liquidity: { usd: 10000 + Math.random() * 200000 },
      });
    });
  }, 3000);

  return {
    close() {
      clearInterval(interval);
      console.log("[MockWS] closed");
    }
  };
}
