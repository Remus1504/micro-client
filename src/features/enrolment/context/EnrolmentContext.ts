import { Context, createContext } from 'react';
import { IAuthUser } from 'src/features/auth/interfaces/authenticationinterface';

import {
  IEnrolmentContext,
  IEnrolmentDocument,
  IEnrolmentInvoice,
} from '../interfaces/enrolment.interface';

export const EnrolmentContext: Context<IEnrolmentContext> = createContext({
  enrolment: {} as IEnrolmentDocument,
  authUser: {} as IAuthUser,
  enrolmentInvoice: {} as IEnrolmentInvoice,
}) as Context<IEnrolmentContext>;
