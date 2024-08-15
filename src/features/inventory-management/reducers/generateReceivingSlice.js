import { createSlice } from "@reduxjs/toolkit";

export const generateReceivingSlice = createSlice({
  name: "generateReceiving",
  initialState: {
    data: JSON.parse(sessionStorage.getItem("generateReceiving")) || null,
  },
  reducers: {
    setData: (state, action) => {
      localStorage.setItem("generateReceiving", JSON.stringify(action.payload));
      state.data = action.payload;
    },
  },
});

export const { setData } = generateReceivingSlice.actions;

export default generateReceivingSlice.reducer;
