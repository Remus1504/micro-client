import { IResponse } from "src/shared/shared.interface";
import { api } from "src/store/apis";

export const searchCoursesApi = api.injectEndpoints({
  endpoints: (build) => ({
    searchCourses: build.query<
      IResponse,
      { query: string; from: string; size: string; type: string }
    >({
      query: ({ query, from, size, type }) =>
        `course/search/${from}/${size}/${type}?${query}`,
      providesTags: ["Search"],
    }),
  }),
});

export const { useSearchCoursesQuery } = searchCoursesApi;
