import { createSlice, Slice } from "@reduxjs/toolkit";
import { emptyStudentData } from "src/shared/utils/static";

import {
  StudentDocument,
  IReduxStudent,
} from "../interfaces/student.interface";

const initialValue: StudentDocument = emptyStudentData;

const studentSlice: Slice = createSlice({
  name: "student",
  initialState: initialValue,
  reducers: {
    addStudent: (
      state: StudentDocument,
      action: IReduxStudent
    ): StudentDocument => {
      state = { ...action.payload };
      return state;
    },
    emptyStudent: (): StudentDocument => {
      return emptyStudentData;
    },
  },
});

export const { addStudent, emptyStudent } = studentSlice.actions;
export default studentSlice.reducer;
