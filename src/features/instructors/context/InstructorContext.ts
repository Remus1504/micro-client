import { Context, createContext } from "react";
import { emptyInstructorData } from "src/shared/utils/static";

import { InstructorContext } from "../interfaces/instructor.interface";

export const instructorContext: Context<InstructorContext> = createContext({
  showEditIcons: false,
  instructorProfile: emptyInstructorData,
}) as Context<InstructorContext>;
