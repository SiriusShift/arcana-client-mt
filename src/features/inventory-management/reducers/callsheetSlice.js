import { createSlice } from "@reduxjs/toolkit";

export const callsheetSlice = createSlice({
  name: "callsheet",
  initialState: {
    items: [],
  },
  reducers: {
    upsertItem: (state, action) => {
      const newItems = action.payload;

      newItems.forEach((newItem) => {
        const existingIndex = state.items.findIndex(
          (item) => item.itemCode === newItem.itemCode
        );

        if (existingIndex !== -1) {
          // ✅ Replace the entire item
          state.items[existingIndex] = newItem;
        } else {
          // ✅ Add new item if not found
          state.items.push(newItem);
        }
      });
    },

    updateBbd: (state, action) => {
      const { itemCode, bbdId, quantity, bbd } = action.payload;
      const item = state.items.find((item) => item.itemCode === itemCode);

      if (item) {
        const existingBbd = item.bbds.find(
          (bbdItem) => bbdItem.bbdId === bbdId
        );
        if (existingBbd) {
          // Update BBD details
          existingBbd.quantity = quantity;
          existingBbd.bbd = bbd;
        } else {
          // Add new BBD
          item.bbds.push({ bbdId, quantity, bbd });
        }
      }
    },
    selectItem: (state, action) => {
      const { itemCode } = action.payload;
      return state.items.find((item) => item.itemCode === itemCode);
    },
    clearCallsheet: (state) => {
      state.items = [];
    },
  },
});

export const { upsertItem, updateBbd, selectItem, clearCallsheet } =
  callsheetSlice.actions;
export default callsheetSlice.reducer;
