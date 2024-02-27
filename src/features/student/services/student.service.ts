import { IResponse } from "src/shared/shared.interface";
import { api } from "src/store/apis";

export const studentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCurrentStudentByUsername: build.query<IResponse, void>({
      query: () => "student/username",
      providesTags: ["Student"],
    }),
    getStudentByUsername: build.query<IResponse, string>({
      query: (username: string) => `student/${username}`,
      providesTags: ["Student"],
    }),
    getStudentByEmail: build.query<IResponse, void>({
      query: () => "student/email",
      providesTags: ["Student"],
    }),
  }),
});

export const {
  useGetCurrentStudentByUsernameQuery,
  useGetStudentByUsernameQuery,
  useGetStudentByEmailQuery,
} = studentApi;
