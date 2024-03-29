import { PDFDownloadLink } from "@react-pdf/renderer";
import { ChangeEvent, FC, ReactElement, useRef, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { InstructorCourse } from "src/features/courses/interfaces/course.interface";
import { useGetCourseByIdQuery } from "src/features/courses/services/course.service";
import Button from "src/shared/Button/Button";
import TextAreaInput from "src/shared/Entries/TextAreaInput";
import { IResponse } from "src/shared/shared.interface";
import { TimeAgo } from "src/shared/utils/time.utils";
import {
  deleteFromLocalStorage,
  generateRandomNumber,
  getDataFromLocalStorage,
  showErrorToast,
} from "src/shared/utils/utils";
import { useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";

import { EnrolmentContext } from "../context/EnrolmentContext";
import {
  IEnrolment,
  IEnrolmentDocument,
  IEnrolmentInvoice,
} from "../interfaces/enrolment.interface";
import { useCreateEnrolmentMutation } from "../services/enrolment.service";
import Invoice from "./Invoice/Invoice";

const Requirement: FC = (): ReactElement => {
  const student = useAppSelector((state: IReduxState) => state.student);
  const [requirement, setRequirement] = useState<string>("");
  const { courseId } = useParams<string>();
  const [searchParams] = useSearchParams({});
  const courseRef = useRef<InstructorCourse>();
  const placeholder = "https://placehold.co/330x220?text=Placeholder";
  const offer: IEnrolment = JSON.parse(`${searchParams.get("offer")}`);
  const order_date = `${searchParams.get("order_date")}`;
  const serviceFee: number =
    offer.price < 50
      ? (5.5 / 100) * offer.price + 2
      : (5.5 / 100) * offer.price;
  const navigate: NavigateFunction = useNavigate();
  const enrolmentId = `JO${generateRandomNumber(11)}`;
  const invoiceId = `JI${generateRandomNumber(11)}`;
  const { data, isSuccess } = useGetCourseByIdQuery(`${courseId}`);
  const [createOrder] = useCreateEnrolmentMutation();

  if (isSuccess) {
    courseRef.current = data.course;
  }
  const enrolmentInvoice: IEnrolmentInvoice = {
    invoiceId,
    enrolmentId,
    date: `${new Date()}`,
    studentUsername: `${student.username}`,
    enrolmentService: [
      {
        service: `${courseRef?.current?.title}`,
        quantity: 1,
        price: offer.price,
      },
      {
        service: "Service Fee",
        quantity: 1,
        price: serviceFee,
      },
    ],
  };

  const startOrder = async (): Promise<void> => {
    try {
      const paymentIntentId = getDataFromLocalStorage("paymentIntentId");
      const order: IEnrolmentDocument = {
        offer: {
          courseTitle: offer.courseTitle,
          price: offer.price,
          description: offer.description,
          durationInDays: offer.durationInDays,
          oldStartDate: offer.oldStartDate,
          newStartDate: offer.newStartDate,
          accepted: true,
          cancelled: offer.cancelled,
        },
        courseId: `${courseId}`,
        instructorId: `${courseRef?.current?.instructorId}`,
        instructorImage: `${courseRef?.current?.profilePicture}`,
        instructorUsername: `${courseRef?.current?.username}`,
        instructorEmail: `${courseRef?.current?.email}`,
        courseCoverImage: `${courseRef?.current?.coverImage}`,
        courseMainTitle: `${courseRef?.current?.title}`,
        courseBasicTitle: `${courseRef?.current?.basicTitle}`,
        courseBasicDescription: `${courseRef?.current?.basicDescription}`,
        studentId: `${student._id}`,
        studentUsername: `${student.username}`,
        studentImage: `${student.profilePicture}`,
        studentEmail: `${student.email}`,
        status: "in progress",
        enrolmentId,
        invoiceId,
        quantity: 1,
        dateEnrolled: `${new Date()}`,
        price: offer.price,
        requirements: requirement,
        paymentIntent: `${paymentIntentId}`,
        events: {
          placeOrder: order_date, // this should be the date after successful payment
          requirements: `${new Date()}`,
          enrolmentStarted: `${new Date()}`,
        },
      };
      const response: IResponse = await createOrder(order).unwrap();
      navigate(`/enrolments/${enrolmentId}/activities`, {
        state: response?.enrolment,
      });
      deleteFromLocalStorage("paymentIntent");
    } catch (error) {
      showErrorToast("Error starting your order.");
    }
  };

  return (
    <div className="container mx-auto lg:h-screen">
      <div className="flex flex-wrap">
        <div className="order-last w-full p-4 lg:order-first lg:w-2/3">
          <div className="mb-4 flex w-full flex-col flex-wrap bg-[#d4edda] p-4">
            <span className="text-base font-bold text-black lg:text-xl">
              Thank you for your purchase
            </span>
            <div className="flex gap-1">
              You can{" "}
              <PDFDownloadLink
                document={
                  <EnrolmentContext.Provider value={{ enrolmentInvoice }}>
                    <Invoice />
                  </EnrolmentContext.Provider>
                }
                fileName={`${enrolmentInvoice.invoiceId}.pdf`}
              >
                <div className="cursor-pointer text-blue-400 underline">
                  download your invoice
                </div>
              </PDFDownloadLink>
            </div>
          </div>
          <div className="border-grey border">
            <div className="mb-3 px-4 pb-2 pt-3">
              <span className="mb-3 text-base font-medium text-black md:text-lg lg:text-xl">
                Any information you would like the instructor to know?
              </span>
              <p className="text-sm">
                Click the button to start the enrolment.
              </p>
            </div>
            <div className="flex flex-col px-4 pb-4">
              <TextAreaInput
                rows={5}
                name="requirement"
                value={requirement}
                placeholder="Write a brief description..."
                className="border-grey mb-1 w-full rounded border p-3.5 text-sm font-normal text-gray-600 focus:outline-none"
                onChange={(event: ChangeEvent) =>
                  setRequirement((event.target as HTMLTextAreaElement).value)
                }
              />
              <Button
                className="mt-3 rounded bg-sky-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                label="Start Enrolment"
                onClick={startOrder}
              />
            </div>
          </div>
        </div>

        <div className="w-full p-4 lg:w-1/3">
          <div className="border-grey mb-8 border">
            <div className="mb-2 flex flex-col border-b md:flex-row">
              <img
                className="w-full object-cover"
                src={courseRef.current?.coverImage ?? placeholder}
                alt="Course Cover Image"
              />
            </div>
            <ul className="mb-0 list-none">
              <li className="border-grey flex border-b px-4 pb-3 pt-1">
                <div className="text-sm font-normal">{offer.courseTitle}</div>
              </li>
              <li className="flex justify-between px-4 pb-2 pt-4">
                <div className="flex gap-2 text-sm font-normal">Status</div>
                <span className="rounded bg-orange-300 px-[5px] py-[2px] text-xs font-bold uppercase text-white">
                  incomplete
                </span>
              </li>
              <li className="flex justify-between px-4 pb-2 pt-2">
                <div className="flex gap-2 text-sm font-normal">Enrolment</div>
                <span className="text-sm">#{enrolmentId}</span>
              </li>
              <li className="flex justify-between px-4 pb-2 pt-2">
                <div className="flex gap-2 text-sm font-normal">
                  Enrolment Date
                </div>
                <span className="text-sm">
                  {TimeAgo.dayMonthYear(`${new Date()}`)}
                </span>
              </li>
              <li className="flex justify-between px-4 pb-2 pt-2">
                <div className="flex gap-2 text-sm font-normal">Quantity</div>
                <span className="text-sm">X 1</span>
              </li>
              <li className="flex justify-between px-4 pb-4 pt-2">
                <div className="flex gap-2 text-sm font-normal">Price</div>
                <span className="text-sm">${offer.price}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requirement;
