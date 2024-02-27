import { IResponse } from "src/shared/shared.interface";
import { api } from "src/store/apis";

import { InstructorDocument } from "../interfaces/instructor.interface";

export const instructorApi = api.injectEndpoints({
  endpoints: (build) => ({
    getInstructorByUsername: build.query<IResponse, string>({
      query: (username: string) => `instructor/username/${username}`,
      providesTags: ["Instructor"],
    }),
    getInstructorById: build.query<IResponse, string>({
      query: (instructorId: string) => `instructor/id/${instructorId}`,
      providesTags: ["Instructor"],
    }),
    getRandomInstructor: build.query<IResponse, string>({
      query: (size: string) => `instructor/random/${size}`,
      providesTags: ["Instructor"],
    }),
    createInstructor: build.mutation<IResponse, InstructorDocument>({
      query(body: InstructorDocument) {
        return {
          url: "instructor/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Instructor"],
    }),
    updateInstructor: build.mutation<
      IResponse,
      { instructorId: string; instructor: InstructorDocument }
    >({
      query(body) {
        return {
          url: `instructor/${body.instructorId}`,
          method: "PUT",
          body: body.instructor,
        };
      },
      invalidatesTags: ["Instructor"],
    }),
  }),
});

export const {
  useGetInstructorByUsernameQuery,
  useGetInstructorByIdQuery,
  useGetRandomInstructorQuery,
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
} = instructorApi;
