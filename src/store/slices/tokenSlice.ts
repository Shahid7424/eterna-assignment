import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, TabType } from '@/lib/types/token';

interface TokenState {
  tokens: Record<TabType, Token[]>;
  activeTab: TabType;
  isLoading: boolean;
}

const initialState: TokenState = {
  tokens: {
    new: [],
    final: [],
    migrated: [],
  },
  activeTab: 'new',
  isLoading: true,
};

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Record<TabType, Token[]>>) => {
      state.tokens = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<TabType>) => {
      state.activeTab = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateTokenPrice: (state, action: PayloadAction<{ id: string; price: number; priceChange: number }>) => {
      const { id, price, priceChange } = action.payload;
      const tokens = state.tokens[state.activeTab];
      const tokenIndex = tokens.findIndex(t => t.id === id);
      
      if (tokenIndex !== -1) {
        tokens[tokenIndex].price = price;
        tokens[tokenIndex].priceChange24h = priceChange;
      }
    },
  },
});

export const { setTokens, setActiveTab, setLoading, updateTokenPrice } = tokenSlice.actions;
export default tokenSlice.reducer;