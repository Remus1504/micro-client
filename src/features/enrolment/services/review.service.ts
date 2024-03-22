import { IResponse } from 'src/shared/shared.interface';
import { api } from 'src/store/apis';

import { IReviewDocument } from '../interfaces/review.interface';

export const reviewApi = api.injectEndpoints({
  endpoints: (build) => ({
    getReviewsByCourseId: build.query<IResponse, string>({
      query: (courseId: string) => `review/course/${courseId}`,
      providesTags: ['Review'],
    }),
    getReviewsByInstructorId: build.query<IResponse, string>({
      query: (instructorId: string) => `review/instructor/${instructorId}`,
      providesTags: ['Review'],
    }),
    addReview: build.mutation<IResponse, { body: IReviewDocument }>({
      query({ body }) {
        return {
          url: 'review',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useGetReviewsByCourseIdQuery,
  useGetReviewsByInstructorIdQuery,
  useAddReviewMutation,
} = reviewApi;
