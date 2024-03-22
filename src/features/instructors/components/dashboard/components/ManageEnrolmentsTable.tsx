import { FC, ReactElement, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  IEnrolmentDocument,
  IEnrolmentMessage,
  IEnrolmentTableProps,
} from "src/features/enrolment/interfaces/enrolment.interface";
import { useCancelEnrolmentMutation } from "src/features/enrolment/services/enrolment.service";
import Button from "src/shared/Button/Button";
import { updateHeader } from "src/shared/header/reducers/header.reducer";
import ApprovalModal from "src/shared/modals/Approval";
import { IApprovalModalContent } from "src/shared/modals/interfaces/modal.interface";
import { TimeAgo } from "src/shared/utils/time.utils";
import {
  lowerCase,
  showErrorToast,
  showSuccessToast,
} from "src/shared/utils/utils";
import { useAppDispatch } from "src/store/store";
import { v4 as uuidv4 } from "uuid";

const ManageEnrolmentsTable: FC<IEnrolmentTableProps> = ({
  type,
  enrolments,
  enrolmentTypes,
}): ReactElement => {
  const dispatch = useAppDispatch();
  const [approvalModalContent, setApprovalModalContent] =
    useState<IApprovalModalContent>();
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const selectedOrder = useRef<IEnrolmentDocument>();
  const [cancelOrder] = useCancelEnrolmentMutation();

  const onCancelOrder = async (): Promise<void> => {
    try {
      const enrolmentData: IEnrolmentMessage = {
        instructorId: `${selectedOrder.current?.instructorId}`,
        studentId: `${selectedOrder.current?.studentId}`,
        enrolledCourses: selectedOrder.current?.courseId,
      };
      setShowCancelModal(false);
      await cancelOrder({
        paymentIntentId: `${selectedOrder.current?.paymentIntent}`,
        enrolmentId: `${selectedOrder.current?.enrolmentId}`,
        body: enrolmentData,
      });
      showSuccessToast("Enrolment cancelled successfully.");
    } catch (error) {
      showErrorToast("Error cancelling Enrolment. Try again.");
    }
  };

  return (
    <>
      {showCancelModal && (
        <ApprovalModal
          approvalModalContent={approvalModalContent}
          onClose={() => setShowCancelModal(false)}
          onClick={onCancelOrder}
        />
      )}
      <div className="flex flex-col">
        <div className="border-grey border border-b-0 px-3 py-3">
          <div className="text-xs font-bold uppercase sm:text-sm md:text-base">
            {type} enrolments{" "}
          </div>
        </div>
        <table className="border-grey flex-no-wrap flex w-full table-auto flex-row overflow-hidden border text-sm text-gray-500 sm:inline-table">
          {enrolmentTypes > 0 ? (
            <>
              <thead className="border-grey border-b text-xs uppercase text-gray-700 sm:[&>*:not(:first-child)]:hidden">
                {enrolments.map(() => (
                  <tr
                    key={uuidv4()}
                    className="mb-1 flex flex-col flex-nowrap bg-sky-500 text-white sm:mb-0 sm:table-row md:table-row lg:bg-transparent lg:text-black"
                  >
                    <th className="p-3 text-center w-auto"></th>
                    <th className="p-3 text-left w-auto">Student</th>
                    <th className="p-3 text-left">Course</th>
                    <th className="p-3 text-center">
                      {type === "cancelled" ? "Cancelled On" : "Due On"}
                    </th>
                    {type === "completed" && (
                      <th className="p-3 text-center">Start date At</th>
                    )}
                    <th className="p-3 text-center">Total</th>
                    <th className="p-3 text-center">Status</th>
                    {type === "active" && (
                      <th className="p-3 text-center">Cancel</th>
                    )}
                  </tr>
                ))}
              </thead>
              <tbody className="flex-1 sm:flex-none">
                {enrolments.map((order: IEnrolmentDocument) => (
                  <tr
                    key={uuidv4()}
                    className="bg-white border-b border-grey flex flex-col flex-nowrap sm:table-row mb-2 sm:mb-0 "
                  >
                    <td></td>
                    <td className="flex justify-start gap-3 px-3 py-3 sm:justify-center md:justify-start">
                      <div className="flex flex-wrap gap-2 self-center">
                        <img
                          className="h-6 w-6 lg:h-8 lg:w-8 rounded-full object-cover"
                          src={order.studentImage}
                          alt=""
                        />
                        <span className="font-bold flex self-center">
                          {order.studentUsername}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-left lg:text-center w-[300px]">
                      <div className="grid">
                        <Link
                          to={`/enrolments/${order.enrolmentId}/activities`}
                          onClick={() => dispatch(updateHeader("home"))}
                          className="truncate text-sm font-normal hover:text-sky-500"
                        >
                          {order.offer.courseTitle}
                        </Link>
                      </div>
                    </td>
                    <td className="p-3 text-left lg:text-center">
                      {type === "cancelled"
                        ? TimeAgo.dayMonthYear(`${order.approvedAt}`)
                        : TimeAgo.dayMonthYear(`${order.offer.newStartDate}`)}
                    </td>
                    {type === "completed" &&
                      order.events.sucessfulEnrolment && (
                        <td className="p-3 text-left lg:text-center">
                          {TimeAgo.dayMonthYear(
                            `${order.events.sucessfulEnrolment}`,
                          )}
                        </td>
                      )}
                    <td className="p-3 text-left lg:text-center">
                      ${order.price}
                    </td>
                    <td className="px-3 py-1 lg:p-3 text-left lg:text-center">
                      <span
                        className={`rounded bg-transparent text-black p-0 text-xs font-bold uppercase sm:text-white sm:px-[5px] sm:py-[4px] status ${lowerCase(
                          order.status.replace(/ /g, ""),
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    {type === "active" && (
                      <td className="px-3 py-1 lg:p-3 text-left lg:text-center">
                        <Button
                          className="rounded bg-red-500 px-6 py-3 text-center text-sm font-bold text-white focus:outline-none md:px-4 md:py-2 md:text-base"
                          label="Cancel Order"
                          onClick={() => {
                            setApprovalModalContent({
                              header: "Enrolment Cancellation",
                              body: "Are you sure you want to cancel this enrolment?",
                              btnText: "Yes, Cancel",
                              btnColor: "bg-red-500 hover:bg-red-400",
                            });
                            setShowCancelModal(true);
                            selectedOrder.current = order;
                          }}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <tbody>
              <tr>
                <td className="w-full px-4 py-2 text-sm">
                  No {type} enrolments to show.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};

export default ManageEnrolmentsTable;
