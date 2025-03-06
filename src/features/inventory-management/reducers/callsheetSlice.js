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
          const existingItem = state.items.find(
            (item) => (item.transactionId === newItem.transactionId && item.itemCode === newItem.itemCode)
          );
        
          if (existingItem) {
            // Merge existing BBDs with new ones, avoiding duplicates
            newItem.itemBbds.forEach((newBbd) => {
              const existingBbd = existingItem.itemBbds.find(
                (bbd) => bbd.bbdId === newBbd.bbdId
              );
              if (existingBbd) {
                existingBbd.quantity = newBbd.quantity;
                existingBbd.bbd = newBbd.bbd;
              } else {
                existingItem.itemBbds.push(newBbd); // Add new BBD
              }
            });
          } else {
            state.items.push(newItem); // Add new item
          }
        });
      },
      
    updateBbd: (state, action) => {
      const { transactionId, bbdId, quantity, bbd } = action.payload;
      const item = state.items.find((item) => item.transactionId === transactionId);

      if (item) {
        const existingBbd = item.itemBbds.find((bbdItem) => bbdItem.bbdId === bbdId);
        if (existingBbd) {
          // Update BBD details
          existingBbd.quantity = quantity;
          existingBbd.bbd = bbd;
        } else {
          // Add new BBD
          item.itemBbds.push({ bbdId, quantity, bbd });
        }
      }
    },
    selectItem: (state, action) => {
      const { transactionId } = action.payload;
      const item = state.items.find((item) => item.transactionId === transactionId);
      return item;
    },
  },
});

export const { upsertItem, updateBbd, selectItem } = callsheetSlice.actions;
export default callsheetSlice.reducer;
