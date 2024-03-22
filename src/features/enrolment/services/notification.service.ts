import { IResponse } from 'src/shared/shared.interface';
import { api } from 'src/store/apis';

export const notificationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNotificationsById: build.query<IResponse, string>({
      query: (userTo: string) => `enrolment/notification/${userTo}`,
      providesTags: ['Notification'],
    }),
    markUnreadNotification: build.mutation<IResponse, string>({
      query(notificationId: string) {
        return {
          url: 'enrolment/notification/mark-as-read',
          method: 'PUT',
          body: { notificationId },
        };
      },
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsByIdQuery,
  useMarkUnreadNotificationMutation,
} = notificationsApi;
