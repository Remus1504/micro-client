import { IAuthUser } from "src/features/auth/interfaces/authenticationinterface";

export type DivElementRefType = HTMLDivElement;

export interface ICheckoutProps {
  courseId: string;
  offer: IOffer;
}

export interface IOrderProps {
  order: IOrderDocument;
  authUser: IAuthUser;
}

export interface IOrderActivitiesProps {
  order: IOrderDocument;
  authUser: IAuthUser;
  viewDeliveryBtnClicked?: boolean;
  showDeliveryPanel?: boolean;
  showReviewPanel?: boolean;
}

export interface IOffer {
  [key: string]: string | number | boolean | undefined;
  courseTitle: string;
  price: number;
  description: string;
  durationInDays: number;
  oldStartDate: string;
  newStartDate: string;
  accepted: boolean;
  cancelled: boolean;
  reason?: string; // this is the reason for extending the delivery date
}

export interface IOrderDeliveredProps {
  ref?: HTMLDivElement;
}

export interface IOrderInvoice {
  invoiceId: string;
  orderId: string;
  date: string;
  studentUsername: string;
  orderService: IOrderInvoiceService[];
}

export interface IOrderInvoiceService {
  service: string;
  quantity: number;
  price: number;
}

export interface IOrderContext {
  order?: IOrderDocument;
  authUser?: IAuthUser;
  orderInvoice?: IOrderInvoice;
  viewDeliveryBtnClicked?: boolean;
}

export interface IExtendedDateModalProps {
  order: IOrderDocument;
  onClose: () => void;
}

export interface IOrderTableProps {
  type: string;
  orders: IOrderDocument[];
  orderTypes: number;
}

export interface IActiveOrderProps {
  activeOrders: IOrderDocument[];
}

export interface IOrderDisplayModal {
  deliverWork: boolean;
  extendDelivery: boolean;
}

export interface IOrderDeliveredModal {
  enrolment: boolean;
  enrolmentApproval: boolean;
}

export interface IOrderReviewModal {
  studentReview: boolean;
  instructorReview: boolean;
  studentPanel: boolean;
  instructorPanel: boolean;
}

export interface IExtendedDelivery {
  originalDate: string;
  newDate: string;
  days: number;
  reason: string;
  startDateUpdate?: string;
}

export interface IDeliveredWork {
  message: string;
  file: string;
  fileType: string;
  fileSize: number;
  fileName: string;
}

export interface IOrderEvents {
  placeOrder: string;
  requirements: string;
  orderStarted: string;
  deliveryDateUpdate?: string;
  sucessfulEnrolment?: string;
  studentReview?: string;
  instructorReview?: string;
}

export interface IOrderReview {
  rating: number;
  review: string;
  date?: string;
}

export interface IOrderDocument {
  offer: IOffer;
  courseId: string;
  instructorId: string;
  instructorUsername: string;
  instructorImage: string;
  instructorEmail: string;
  courseCoverImage: string;
  courseMainTitle: string;
  courseBasicTitle: string;
  courseBasicDescription: string;
  studentId: string;
  studentUsername: string;
  studentEmail: string;
  studentImage: string;
  status: string;
  orderId: string;
  invoiceId: string;
  quantity: number;
  price: number;
  requestExtension?: IExtendedDelivery;
  serviceFee?: number;
  requirements?: string;
  approved?: boolean;
  cancelled?: boolean;
  delivered?: boolean;
  approvedAt?: string;
  deliveredWork?: IDeliveredWork[];
  dateEnrolled?: string;
  events: IOrderEvents;
  studentReview?: IOrderReview;
  instructorReview?: IOrderReview;
  paymentIntent?: string;
}

export interface IOrderMessage {
  instructorId?: string;
  studentId?: string;
  ongoingJobs?: number;
  completedJobs?: number;
  totalEarnings?: number;
  enrolledCourses?: string;
  recentDelivery?: string;
  type?: string;
  receiverEmail?: string;
  username?: string;
  template?: string;
  sender?: string;
  offerLink?: string;
  amount?: string;
  studentUsername?: string;
  instructorUsername?: string;
  title?: string;
  description?: string;
  startDate?: string;
  orderId?: string;
  invoiceId?: string;
  orderDue?: string;
  requirements?: string;
  orderUrl?: string;
  originalDate?: string;
  newDate?: string;
  reason?: string;
  subject?: string;
  header?: string;
  total?: string;
  message?: string;
  serviceFee?: string;
}

export interface IOrderNotifcation {
  _id?: string;
  userTo: string;
  senderUsername: string;
  senderPicture: string;
  receiverUsername: string;
  receiverPicture: string;
  isRead?: boolean;
  orderId: string;
  type?: string;
  message: string;
  rating?: number;
  createdAt: Date;
}
