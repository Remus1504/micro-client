import { Context, createContext } from "react";
import { emptyCourseData, emptyInstructorData } from "src/shared/utils/static";
import { ICourseContext } from "../interfaces/course.interface";

export const CourseContext: Context<ICourseContext> =
  createContext<ICourseContext>({
    course: emptyCourseData,
    instructor: emptyInstructorData,
  });
