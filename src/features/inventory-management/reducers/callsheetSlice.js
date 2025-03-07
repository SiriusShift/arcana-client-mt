import { createSlice } from "@reduxjs/toolkit";

export const callsheetSlice = createSlice({
  name: "callsheet",
  initialState: {
    items: [],
  },
  reducers: {
    upsertItem: (state, action) => {
      const newItems = action.payload;

      console.log(newItems);
    
      newItems.forEach((newItem) => {
        const existingItem = state.items.find(
          (item) => {console.log(item); item.itemCode === newItem.itemCode}
        );

        console.log(existingItem);
      
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
      const { itemCode, bbdId, quantity, bbd } = action.payload;
      const item = state.items.find((item) => item.itemCode === itemCode);

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
      const { itemCode } = action.payload;
      return state.items.find((item) => item.itemCode === itemCode);
    },
    clearCallsheet: (state) => {
      state.items = [];
    },
  },
});

export const { upsertItem, updateBbd, selectItem, clearCallsheet } = callsheetSlice.actions;
export default callsheetSlice.reducer;
