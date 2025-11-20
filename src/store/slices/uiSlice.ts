import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token } from '@/lib/types/token';

interface UIState {
  selectedToken: Token | null;
  showQuickBuyModal: Token | null;
  showFilterPanel: boolean;
}

const initialState: UIState = {
  selectedToken: null,
  showQuickBuyModal: null,
  showFilterPanel: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedToken: (state, action: PayloadAction<Token | null>) => {
      state.selectedToken = action.payload;
    },
    setShowQuickBuyModal: (state, action: PayloadAction<Token | null>) => {
      state.showQuickBuyModal = action.payload;
    },
    toggleFilterPanel: (state) => {
      state.showFilterPanel = !state.showFilterPanel;
    },
  },
});

export const { setSelectedToken, setShowQuickBuyModal, toggleFilterPanel } = uiSlice.actions;
export default uiSlice.reducer;