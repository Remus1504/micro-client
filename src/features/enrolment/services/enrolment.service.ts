import { IResponse } from "src/shared/shared.interface";
import { api } from "src/store/apis";

import {
  IDeliveredWork,
  IExtendedDelivery,
  IOrderDocument,
  IOrderMessage,
} from "../interfaces/enrolment.interface";

export const enrolmentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEnrolmentByEnrolmentId: build.query<IResponse, string>({
      query: (orderId: string) => `enrolment/${orderId}`,
      providesTags: ["Enrolment"],
    }),
    getEnrolmentByInstructorId: build.query<IResponse, string>({
      query: (instructorId: string) => `enrolment/seller/${instructorId}`,
      providesTags: ["Enrolment"],
    }),
    getEnrolmentByStudentId: build.query<IResponse, string>({
      query: (studentId: string) => `enrolment/student/${studentId}`,
      providesTags: ["Enrolment"],
    }),
    createOrderIntent: build.mutation<IResponse, number>({
      query(price: number) {
        return {
          url: "enrolment/create-payment-intent",
          method: "POST",
          body: { price },
        };
      },
      invalidatesTags: ["Enrolment"],
    }),
    createEnrolment: build.mutation<IResponse, IOrderDocument>({
      query(body: IOrderDocument) {
        return {
          url: "enrolment",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Enrolment"],
    }),
    cancelEnrolment: build.mutation<
      IResponse,
      { paymentIntentId: string; orderId: string; body: IOrderMessage }
    >({
      query({ paymentIntentId, orderId, body }) {
        return {
          url: `enrolment/cancel/${orderId}`,
          method: "PUT",
          body: { paymentIntentId, orderData: body },
        };
      },
      invalidatesTags: ["Enrolment"],
    }),
    requestStartDateExtension: build.mutation<
      IResponse,
      { orderId: string; body: IExtendedDelivery }
    >({
      query({ orderId, body }) {
        return {
          url: `enrolment/extension/${orderId}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Enrolment"],
    }),
    updateStartDate: build.mutation<
      IResponse,
      { orderId: string; type: string; body: IExtendedDelivery }
    >({
      query({ orderId, type, body }) {
        return {
          url: `enrolment/course/${type}/${orderId}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Enrolment"],
    }),
    deliverOrder: build.mutation<
      IResponse,
      { orderId: string; body: IDeliveredWork }
    >({
      query({ orderId, body }) {
        return {
          url: `enrolment/deliver-enrolment/${orderId}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Enrolment"],
    }),
    approveEnrolment: build.mutation<
      IResponse,
      { orderId: string; body: IOrderMessage }
    >({
      query({ orderId, body }) {
        return {
          url: `enrolment/approve-enrolment/${orderId}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Enrolment"],
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
  useDeliverOrderMutation,
  useApproveEnrolmentMutation,
} = enrolmentApi;
