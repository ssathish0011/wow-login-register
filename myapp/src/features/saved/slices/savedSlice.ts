import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";

interface SavedState {
  savedIds: string[];
}

const initialState: SavedState = {
  savedIds: ["1"],
};

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    toggleSave(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.savedIds.indexOf(id);
      if (index === -1) {
        state.savedIds.push(id);
      } else {
        state.savedIds.splice(index, 1);
      }
    },
  },
});

export const { toggleSave } = savedSlice.actions;
export const selectSavedIds = (state: RootState) => state.saved.savedIds;
export default savedSlice.reducer;

