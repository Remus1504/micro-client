import { createSlice, Slice } from "@reduxjs/toolkit";
import { emptyInstructorData } from "src/shared/utils/static";

import {
  IReduxInstructor,
  InstructorDocument,
} from "../interfaces/instructor.interface";

const initialValue: InstructorDocument = emptyInstructorData;

const instructorSlice: Slice = createSlice({
  name: "instructor",
  initialState: initialValue,
  reducers: {
    addInstructor: (
      state: InstructorDocument,
      action: IReduxInstructor
    ): InstructorDocument => {
      if (!action.payload) {
        return state;
      }

      state = { ...action.payload };
      return state;
    },
    emptyInstructor: (): InstructorDocument => {
      return emptyInstructorData;
    },
  },
});

export const { addInstructor, emptyInstructor } = instructorSlice.actions;
export default instructorSlice.reducer;
