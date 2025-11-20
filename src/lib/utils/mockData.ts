import { Token, TabType } from "../types/token";

// REAL LIVE TOKEN ADDRESSES 👍
const realAddresses = [
  "0x6982508145454ce325ddbe47a25d4ec3d2311933", // PEPE
  "0xa38f8f7f2d59dba300e6f1b8601c058b79c8bc29", // WOJAK
  "0xba2ae424d960c26247dd6c32edc70b295c744c43", // DOGE (BSC)
  "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce", // SHIB
  "0x5c3895a59d43fd4a7be2b6a7a72c3265a3e4c1f9", // BONK
  "0x0b2c639c533813f4aa9d7837caf62653d097ff85", // WIF
  "0xc6b16b44aac4b8b8f3aab39f6e4fb2b670fef238", // POPCAT
  "0x0f746ae5f3f5acb523bfbf27adf3efc75ebc6d64", // MEW
  "0xda85b7d20ffcd98049662de6cf6ab0f049936613", // MYRO
  "0xdeadcafebabecafebabefacefedc0debafec0ffe", // PONKE (placeholder)
];

const symbols = [
  "PEPE",
  "WOJAK",
  "DOGE",
  "SHIB",
  "BONK",
  "WIF",
  "POPCAT",
  "MEW",
  "MYRO",
  "PONKE",
];

const names = [
  "Pepe Coin",
  "Wojak Finance",
  "Doge Killer",
  "Shiba Revolution",
  "Bonk Token",
  "Dogwifhat",
  "Popcat Meme",
  "Cat in Memes",
  "Myro Token",
  "Ponke Coin",
];

// ⭐ FIXED VERSION (real addresses used)
export const generateMockToken = (index: number, tab: TabType): Token => {
  const randomIndex = Math.floor(Math.random() * symbols.length);

  return {
    id: `token-${tab}-${index}`,
    name: `${names[randomIndex]} ${index}`,
    symbol: `${symbols[randomIndex]}${index}`,

    // ⭐ REAL ADDRESS HERE ⭐
    address: realAddresses[randomIndex],

    // Mock metrics (these will be replaced by live WS)
    price: Math.random() * 0.01,
    priceChange24h: (Math.random() - 0.5) * 200,
    volume24h: Math.random() * 1000000,
    liquidity: Math.random() * 500000,
    marketCap: Math.random() * 5000000,
    holders: Math.floor(Math.random() * 10000),
    transactions: Math.floor(Math.random() * 50000),
    buys: Math.floor(Math.random() * 25000),
    sells: Math.floor(Math.random() * 25000),
    age: Math.floor(Math.random() * 1440),
    top10HoldersPercent: Math.random() * 50,
    devHoldingPercent: Math.random() * 20,
    snipersPercent: Math.random() * 30,
    insidersPercent: Math.random() * 15,
    bondingProgress: tab === "final" ? 70 + Math.random() * 29 : undefined,
    isHoneypot: Math.random() > 0.9,
    isVerified: Math.random() > 0.7,
    migrationTime:
      tab === "migrated"
        ? Date.now() - Math.random() * 3600000
        : undefined,
  };
};

export const generateMockTokens = (count: number, tab: TabType): Token[] => {
  return Array.from({ length: count }, (_, i) => generateMockToken(i, tab));
};
