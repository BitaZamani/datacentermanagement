import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { dataBase } from "../server/firebase";
import type { DBInitialState, DataCenterType, RackType } from "../types/types";
import { notify } from "../components/notify";
import type { RootState } from "./store";
import { nanoid } from "nanoid";

const initialState: DBInitialState = {
  dataCenter: { id: "", name: "", description: "" },
  dataCenters: [],
  rack: {
    id: "",
    name: "",
    description: "",
    dataCenterID: "",
    dataCenterName: "",
  },
  racks: [],
  loading: false,
  error: "",
  rackError: "",
  dataCenterError: "",
};

// Get Data Centers
export const getDataCenters = createAsyncThunk<
  DataCenterType[],
  void,
  { rejectValue: string }
>("db/getDataCenters", async (_, { rejectWithValue }) => {
  try {
    const snapshot = await getDocs(collection(dataBase, "datacenters"));
    const dataCenters: DataCenterType[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description || "",
    }));
    return dataCenters;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "خطا در برقراری ارتباط";
    notify("error", message);
    return rejectWithValue(message);
  }
});

// Get Racks
export const getRacks = createAsyncThunk<
  RackType[],
  void,
  { state: RootState; rejectValue: string }
>("db/getRacks", async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const snapshot = await getDocs(collection(dataBase, "racks"));
    let dataCenters = getState().db.dataCenters;
    if (!dataCenters.length)
      dataCenters = await dispatch(getDataCenters()).unwrap();

    const racks: RackType[] = snapshot.docs.map((rack) => {
      const rackData = rack.data();
      return {
        id: rack.id,
        name: rackData.name,
        description: rackData.description || "",
        dataCenterID: rackData.dataCenterID,
        dataCenterName:
          dataCenters.find((dc) => dc.id === rackData.dataCenterID)?.name || "",
      };
    });
    return racks;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "خطا در برقراری ارتباط";
    notify("error", message);
    return rejectWithValue(message);
  }
});

// Save Rack
export const saveRack = createAsyncThunk<
  RackType,
  RackType,
  { state: RootState; rejectValue: string }
>("db/saveRack", async (rack, { getState, rejectWithValue }) => {
  try {
    const dbState = getState().db;
    if (
      dbState.rack &&
      dbState.rack.name === rack.name &&
      dbState.rack.description === rack.description &&
      dbState.rack.dataCenterID === rack.dataCenterID
    ) {
      notify("info", "تغییری برای ثبت وجود ندارد.");
      return rejectWithValue("no change");
    }

    if (!rack.name || !rack.dataCenterID) {
      notify("error", "فرم ناقص است.");
      return rejectWithValue("error");
    }

    if (rack.id) {
      await updateDoc(doc(dataBase, "racks", rack.id), rack);
    } else {
      const id = nanoid(5);
      await setDoc(doc(dataBase, "racks", id), rack);
      rack.id = id;
    }

    return rack;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "خطا در برقراری ارتباط";
    notify("error", message);
    return rejectWithValue(message);
  }
});

// Save Data Center
export const saveDataCenter = createAsyncThunk<
  DataCenterType,
  DataCenterType,
  { state: RootState; rejectValue: string }
>("db/saveDataCenter", async (dataCenter, { getState, rejectWithValue }) => {
  try {
    const dbState = getState().db;
    if (
      dbState.dataCenter &&
      dbState.dataCenter.name === dataCenter.name &&
      dbState.dataCenter.description === dataCenter.description
    ) {
      notify("info", "تغییری برای ثبت وجود ندارد.");
      return rejectWithValue("no change");
    }
    if (!dataCenter.name) {
      notify("error", "فرم ناقص است.");
      return rejectWithValue("error");
    }
    if (dataCenter.id) {
      await updateDoc(doc(dataBase, "datacenters", dataCenter.id), dataCenter);
    } else {
      const id = nanoid(5);
      await setDoc(doc(dataBase, "datacenters", id), dataCenter);
      dataCenter.id = id;
    }

    return dataCenter;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "خطا در برقراری ارتباط";
    notify("error", message);
    return rejectWithValue(message);
  }
});

// Delete Data Center
export const deleteDataCenter = createAsyncThunk<string, DataCenterType>(
  "db/deleteDataCenter",
  async (dataCenter) => {
    const batch = writeBatch(dataBase);
    const racksSnapshot = await getDocs(collection(dataBase, "racks"));

    racksSnapshot.forEach((rack) => {
      if (rack.data().dataCenterID === dataCenter.id) {
        batch.delete(doc(dataBase, "racks", rack.id));
      }
    });

    await batch.commit();
    await deleteDoc(doc(dataBase, "datacenters", dataCenter.id));

    return dataCenter.id;
  }
);

// Delete Rack
export const deleteRack = createAsyncThunk<string, RackType>(
  "db/deleteRack",
  async (rack) => {
    await deleteDoc(doc(dataBase, "racks", rack.id));
    return rack.id;
  }
);

// Slice
const dbSlice = createSlice({
  name: "db",
  initialState,
  reducers: {
    setDataCenter: (state, action: PayloadAction<DataCenterType>) => {
      state.dataCenter = action.payload;
    },
    setRack: (state, action: PayloadAction<RackType>) => {
      state.rack = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataCenters.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getDataCenters.fulfilled, (state, action) => {
        state.dataCenters = action.payload;
        state.loading = false;
      })
      .addCase(getDataCenters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "";
      })

      .addCase(getRacks.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getRacks.fulfilled, (state, action) => {
        state.racks = action.payload;
        state.loading = false;
      })
      .addCase(getRacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "";
      })

      .addCase(saveRack.fulfilled, (state, action) => {
        const rack = state.racks.find((r) => r.id === action.payload.id);
        const dataCenterName =
          state.dataCenters.find((dc) => dc.id === action.payload.dataCenterID)
            ?.name || "";
        if (rack) {
          state.racks = state.racks.map((r) =>
            r.id === action.payload.id
              ? { ...action.payload, dataCenterName }
              : r
          );
        } else {
          state.racks.push({ ...action.payload, dataCenterName });
        }
        state.rack = {
          id: "",
          name: "",
          description: "",
          dataCenterID: "",
          dataCenterName: "",
        };
        state.rackError = "";
      })
      .addCase(saveRack.rejected, (state, action) => {
        state.rackError = action.payload || "";
      })

      .addCase(saveDataCenter.fulfilled, (state, action) => {
        const dc = state.dataCenters.find((dc) => dc.id === action.payload.id);
        if (dc) {
          state.dataCenters = state.dataCenters.map((d) =>
            d.id === action.payload.id ? action.payload : d
          );
        } else {
          state.dataCenters.push(action.payload);
        }
        state.dataCenter = { id: "", name: "", description: "" };
        state.dataCenterError = "";
      })
      .addCase(saveDataCenter.rejected, (state, action) => {
        state.dataCenterError = action.payload || "";
      })

      .addCase(deleteDataCenter.fulfilled, (state, action) => {
        state.dataCenters = state.dataCenters.filter(
          (dc) => dc.id !== action.payload
        );
        state.racks = state.racks.filter(
          (r) => r.dataCenterID !== action.payload
        );
      })
      .addCase(deleteRack.fulfilled, (state, action) => {
        state.racks = state.racks.filter((r) => r.id !== action.payload);
      });
  },
});

export const dbReducer = dbSlice.reducer;
export const { setDataCenter, setRack } = dbSlice.actions;
