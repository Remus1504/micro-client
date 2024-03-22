import { IResponse } from 'src/shared/shared.interface';
import { api } from 'src/store/apis';

import {
  IDeliveredWork,
  IExtendedEnrolment,
  IEnrolmentDocument,
  IEnrolmentMessage,
} from '../interfaces/enrolment.interface';

export const enrolmentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEnrolmentByEnrolmentId: build.query<IResponse, string>({
      query: (enrolmentId: string) => `enrolment/${enrolmentId}`,
      providesTags: ['Enrolment'],
    }),
    getEnrolmentByInstructorId: build.query<IResponse, string>({
      query: (instructorId: string) => `enrolment/instructor/${instructorId}`,
      providesTags: ['Enrolment'],
    }),
    getEnrolmentByStudentId: build.query<IResponse, string>({
      query: (studentId: string) => `enrolment/student/${studentId}`,
      providesTags: ['Enrolment'],
    }),
    createOrderIntent: build.mutation<IResponse, number>({
      query(price: number) {
        return {
          url: 'enrolment/create-payment-intent',
          method: 'POST',
          body: { price },
        };
      },
      invalidatesTags: ['Enrolment'],
    }),
    createEnrolment: build.mutation<IResponse, IEnrolmentDocument>({
      query(body: IEnrolmentDocument) {
        return {
          url: 'enrolment',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Enrolment'],
    }),
    cancelEnrolment: build.mutation<
      IResponse,
      { paymentIntentId: string; enrolmentId: string; body: IEnrolmentMessage }
    >({
      query({ paymentIntentId, enrolmentId, body }) {
        return {
          url: `enrolment/cancel/${enrolmentId}`,
          method: 'PUT',
          body: { paymentIntentId, orderData: body },
        };
      },
      invalidatesTags: ['Enrolment'],
    }),
    requestStartDateExtension: build.mutation<
      IResponse,
      { enrolmentId: string; body: IExtendedEnrolment }
    >({
      query({ enrolmentId, body }) {
        return {
          url: `enrolment/extension/${enrolmentId}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['Enrolment'],
    }),
    updateStartDate: build.mutation<
      IResponse,
      { enrolmentId: string; type: string; body: IExtendedEnrolment }
    >({
      query({ enrolmentId, type, body }) {
        return {
          url: `enrolment/course/${type}/${enrolmentId}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['Enrolment'],
    }),
    deliverEnrolment: build.mutation<
      IResponse,
      { enrolmentId: string; body: IDeliveredWork }
    >({
      query({ enrolmentId, body }) {
        return {
          url: `enrolment/deliver-enrolment/${enrolmentId}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['Enrolment'],
    }),
    approveEnrolment: build.mutation<
      IResponse,
      { enrolmentId: string; body: IEnrolmentMessage }
    >({
      query({ enrolmentId, body }) {
        return {
          url: `enrolment/approve-enrolment/${enrolmentId}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['Enrolment'],
    }),
  }),
});

export const {
  useGetEnrolmentByEnrolmentIdQuery,
  useGetEnrolmentByInstructorIdQuery,
  useGetEnrolmentByStudentIdQuery,
  useCreateOrderIntentMutation,
  useCreateEnrolmentMutation,
  useCancelEnrolmentMutation,
  useRequestStartDateExtensionMutation,
  useUpdateStartDateMutation,
  useDeliverEnrolmentMutation,
  useApproveEnrolmentMutation,
} = enrolmentApi;
