import { createSlice } from "@reduxjs/toolkit";
import type { InteractionInitialState } from "../types/types";

const initialState: InteractionInitialState = {
  menuKey: "dashboard",
  openRackModal: false,
  openDataCenterModal: false,
};
const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    setMenuKey: (state, action) => {
      state.menuKey = action.payload;
    },
    setOpenRackModal: (state, action) => {
      state.openRackModal = action.payload;
    },
    setOpenDataCenterModal: (state, action) => {
      state.openDataCenterModal = action.payload;
    },
  },
});
export const interactionReducer = interactionSlice.reducer;
export const { setMenuKey, setOpenRackModal, setOpenDataCenterModal } =
  interactionSlice.actions;
