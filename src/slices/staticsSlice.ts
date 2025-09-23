import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { StaticsInitialState } from "../types/types";
import { dataBase } from "../server/firebase";
import { collection, getCountFromServer } from "firebase/firestore";

const initialState: StaticsInitialState = {
  racksCount: null,
  dataCentersCount: null,
  loading: true,
};

export const getCounts = createAsyncThunk("statics/getcount", async () => {
  const dataCentersRef = collection(dataBase, "datacenters");
  const racksRef = collection(dataBase, "racks");
  const dcCount = await getCountFromServer(dataCentersRef);
  const rCount = await getCountFromServer(racksRef);
  return {
    racksCount: rCount.data().count,
    dataCentersCount: dcCount.data().count,
  };
});
const staticsSlice = createSlice({
  name: "statics",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getCounts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCounts.fulfilled, (state, action) => {
      state.loading = false;
      state.dataCentersCount = action.payload.dataCentersCount;
      state.racksCount = action.payload.racksCount;
    });
    builder.addCase(getCounts.rejected, (state) => {
      state.loading = false;
    });
  },
});
export const staticsReducer = staticsSlice.reducer;
