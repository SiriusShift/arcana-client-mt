import { createSlice } from "@reduxjs/toolkit";

export const bbdCacheSlice = createSlice({
  name: "bbdCache",
  initialState: {
    bbdCaches: {},
  },
  reducers: {
    removeBbd: (state, action) => {
      const { itemCode, fieldName } = action.payload;

      // Assuming there is a map inside the bbdCaches object with the key itemCode
      // Remove the map with the key itemCode
      state.bbdCaches[fieldName].delete(itemCode);
    },
    clearBbdCache: (state, action) => {
      const { fieldName } = action.payload;
      // Clear BBD cache for a specific item
      state.bbdCaches[fieldName] = new Map();
    },
    clearAllBbdCache: (state) => {
      // Clear all BBD cache
      state.bbdCaches = {};
    },
  },
});

export const { updateBbdCache, removeBbd, clearBbdCache } =
  bbdCacheSlice.actions;

export default bbdCacheSlice.reducer;
