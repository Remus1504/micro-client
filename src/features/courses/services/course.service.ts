import { IResponse } from "src/shared/shared.interface";
import { api } from "src/store/apis";

import {
  ICreateCourse,
  InstructorCourse,
} from "../interfaces/course.interface";

export const coursesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCourseById: build.query<IResponse, string>({
      query: (courseId: string) => `course/${courseId}`,
      providesTags: ["Courses"],
    }),
    getCoursesByInstructorId: build.query<IResponse, string>({
      query: (instructorId: string) => `course/instructor/${instructorId}`,
      providesTags: ["Courses"],
    }),
    getInstructorPausedCourses: build.query<IResponse, string>({
      query: (instructorId: string) =>
        `course/instructor/pause/${instructorId}`,
      providesTags: ["Courses"],
    }),
    getCoursesByCategory: build.query<IResponse, string>({
      query: (username: string) => `course/category/${username}`,
      providesTags: ["Courses"],
    }),
    getMoreCoursesLikeThis: build.query<IResponse, string>({
      query: (courseId: string) => `course/similar/${courseId}`,
      providesTags: ["Courses"],
    }),
    getTopRatedCoursesByCategory: build.query<IResponse, string>({
      query: (username: string) => `course/top/${username}`,
      providesTags: ["Courses"],
    }),
    createCourse: build.mutation<IResponse, ICreateCourse>({
      query(body: ICreateCourse) {
        return {
          url: "course/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Courses"],
    }),
    updateCourse: build.mutation<
      IResponse,
      { courseId: string; course: InstructorCourse }
    >({
      query({ courseId, course }) {
        return {
          url: `course/${courseId}`,
          method: "PUT",
          body: course,
        };
      },
      invalidatesTags: ["Courses"],
    }),
    updateActiveCourse: build.mutation<
      IResponse,
      { courseId: string; active: boolean }
    >({
      query({ courseId, active }) {
        return {
          url: `course/active/${courseId}`,
          method: "PUT",
          body: { active },
        };
      },
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: build.mutation<
      IResponse,
      { courseId: string; instructorId: string }
    >({
      query({ courseId, instructorId }) {
        return {
          url: `course/${courseId}/${instructorId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useGetCourseByIdQuery,
  useGetCoursesByInstructorIdQuery,
  useGetInstructorPausedCoursesQuery,
  useGetCoursesByCategoryQuery,
  useGetMoreCoursesLikeThisQuery,
  useGetTopRatedCoursesByCategoryQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useUpdateActiveCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;
