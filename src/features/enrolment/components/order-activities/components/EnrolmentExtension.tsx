import { FC, ReactElement, useContext, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { EnrolmentContext } from "src/features/enrolment/context/EnrolmentContext";
import { IExtendedEnrolment } from "src/features/enrolment/interfaces/enrolment.interface";
import { useUpdateStartDateMutation } from "src/features/enrolment/services/enrolment.service";
import Button from "src/shared/Button/Button";
import ApprovalModal from "src/shared/modals/Approval";
import { IApprovalModalContent } from "src/shared/modals/interfaces/modal.interface";
import { TimeAgo } from "src/shared/utils/time.utils";
import {
  lowerCase,
  showErrorToast,
  showSuccessToast,
} from "src/shared/utils/utils";

const EnrolmentExtension: FC = (): ReactElement => {
  const { enrolment, authUser } = useContext(EnrolmentContext);
  const [approvalModalContent, setApprovalModalContent] =
    useState<IApprovalModalContent>();
  const [showExtensionApprovalModal, setShowExtensionApprovalModal] =
    useState<boolean>(false);
  const [updateDeliveryDate] = useUpdateStartDateMutation();

  // console.log("Enrolment object:", enrolment);

  // Check if enrolment object exists
  // if (enrolment) {
  //   // Check if requestExtension exists
  //   if (enrolment.requestExtension) {
  //     console.log("Request extension:", enrolment.requestExtension);

  //     // Check if newDate exists
  //     if (enrolment.requestExtension.newDate) {
  //       console.log("New date:", enrolment.requestExtension.newDate);
  //     } else {
  //       console.log("New date is missing.");
  //     }
  //   } else {
  //     console.log("Request extension is missing.");
  //   }

  //   // Check if offer exists
  //   if (enrolment.offer) {
  //     console.log("Offer:", enrolment.offer);

  //     // Check if oldStartDate and newStartDate exist
  //     if (enrolment.offer.oldStartDate && enrolment.offer.newStartDate) {
  //       console.log("Old start date:", enrolment.offer.oldStartDate);
  //       console.log("New start date:", enrolment.offer.newStartDate);
  //     } else {
  //       console.log("Old or new start date is missing.");
  //     }
  //   } else {
  //     console.log("Offer is missing.");
  //   }
  // } else {
  //   console.log("Enrolment object is missing.");
  // }

  const onApproveHandler = async (): Promise<void> => {
    try {
      const extended: IExtendedEnrolment = {
        originalDate: `${enrolment?.offer.oldStartDate}`,
        newDate: `${enrolment?.requestExtension?.newDate}`,
        days: parseInt(`${enrolment?.requestExtension?.days}`),
        reason: `${enrolment?.requestExtension?.reason}`,
        startDateUpdate: `${new Date()}`,
      };
      await updateDeliveryDate({
        enrolmentId: `${enrolment?.enrolmentId}`,
        type: lowerCase(`${approvalModalContent?.btnText}`),
        body: extended,
      });
      setShowExtensionApprovalModal(false);
      showSuccessToast(`${approvalModalContent?.header} successful.`);
    } catch (error) {
      showErrorToast(`${approvalModalContent?.header} error.`);
    }
  };

  return (
    <>
      {showExtensionApprovalModal && (
        <ApprovalModal
          approvalModalContent={approvalModalContent}
          hideCancel={false}
          onClose={() => setShowExtensionApprovalModal(false)}
          onClick={onApproveHandler}
        />
      )}
      {enrolment?.requestExtension &&
        enrolment.requestExtension.newDate &&
        TimeAgo.compareDates(
          enrolment.offer.oldStartDate,
          enrolment.offer.newStartDate,
        ) === 0 && (
          <div className="flex rounded-[4px] bg-white px-4 py-1">
            <div className="w-full">
              <div className="flex gap-4">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fffdcc]">
                    <FaCheck size={18} color="#e8e123" />
                  </div>
                </div>
                <div className="border-grey w-full cursor-pointer border-b pb-6">
                  <div className="flex items-center justify-between font-medium text-gray-500">
                    <div className="items-left mt-2 flex flex-col gap-2 text-gray-500 md:flex-row md:items-center">
                      {enrolment?.studentUsername === authUser?.username ? (
                        <span className="text-sm font-bold md:text-base">
                          {enrolment.instructorUsername} requested for a
                          enrolment date extension
                        </span>
                      ) : (
                        <span className="text-sm font-bold md:text-base">
                          You requested for a enrolment date extension
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="border-grey mt-4 flex w-full flex-col rounded border">
                    <div className="mt-2">
                      <div className="px-4 py-1 text-left text-sm text-gray-500">
                        <div className="flex flex-col md:grid md:grid-cols-3">
                          <span className="col-span-1 text-sm font-bold">
                            Original enrolment date
                          </span>
                          <p className="col-span-2 text-sm">
                            {TimeAgo.dayMonthYear(
                              enrolment?.requestExtension.originalDate,
                            )}
                          </p>
                        </div>
                        <div className="mt-5 flex flex-col md:grid md:grid-cols-3">
                          <span className="col-span-1 text-sm font-bold">
                            New enrolment date
                          </span>
                          <p className="col-span-2 text-sm">
                            {TimeAgo.dayMonthYear(
                              enrolment?.requestExtension.newDate,
                            )}
                          </p>
                        </div>
                        <div className="mt-5 flex flex-col md:grid md:grid-cols-3">
                          <span className="col-span-1 text-sm font-bold">
                            Reason
                          </span>
                          <p className="col-span-2 text-sm">
                            {enrolment?.requestExtension.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-grey border-b py-1"></div>
                    <div className="flex gap-4 px-3 py-4">
                      {enrolment.studentUsername === authUser?.username && (
                        <>
                          <Button
                            className="rounded bg-green-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-green-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                            label="Yes, Approve extension"
                            onClick={() => {
                              setApprovalModalContent({
                                header: "Approve Extension",
                                body: "Are you sure you want to approve the request for an extension?",
                                btnText: "Approve",
                                btnColor: "bg-sky-500 hover:bg-sky-400",
                              });
                              setShowExtensionApprovalModal(true);
                            }}
                          />
                          <Button
                            className="rounded bg-red-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-red-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                            label="No, Reject extension"
                            onClick={() => {
                              setApprovalModalContent({
                                header: "Reject Extension",
                                body: "Are you sure you don't want to reconsider this extension request?",
                                btnText: "Reject",
                                btnColor: "bg-red-500 hover:bg-red-400",
                              });
                              setShowExtensionApprovalModal(true);
                            }}
                          />
                        </>
                      )}
                      {enrolment.studentUsername !== authUser?.username && (
                        <span>Waiting for approval for extension.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {enrolment?.offer.reason && (
        <div className="flex rounded-[4px] bg-white px-4 py-1">
          <div className="w-full">
            <div className="flex gap-4">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fffdcc]">
                  <FaCheck size={18} color="#e8e123" />
                </div>
              </div>
              <div className="border-grey w-full cursor-pointer border-b pb-6">
                <div className="flex items-center justify-between font-medium text-gray-500">
                  <div className="items-left mt-2 flex flex-col gap-2 text-gray-500 md:flex-row md:items-center">
                    {enrolment?.studentUsername !== authUser?.username ? (
                      <span className="text-sm font-bold md:text-base">
                        {enrolment.studentUsername} approved enrolment date
                        extension request
                      </span>
                    ) : (
                      <span className="text-sm font-bold md:text-base">
                        You approved enrolment date extension request
                      </span>
                    )}
                    <p className="text-sm font-normal italic">
                      {TimeAgo.dayWithTime(
                        `${enrolment?.events.startDateUpdate}`,
                      )}
                    </p>
                  </div>
                </div>
                <div className="border-grey mt-4 flex w-full flex-col rounded border">
                  <div className="mt-2">
                    <div className="px-4 py-1 text-left text-sm text-gray-500">
                      <div className="flex flex-col md:grid md:grid-cols-3">
                        <span className="col-span-1 text-sm font-bold">
                          Original enrolment date
                        </span>
                        <p className="col-span-2 text-sm">
                          {TimeAgo.dayMonthYear(
                            `${enrolment?.offer.oldStartDate}`,
                          )}
                        </p>
                      </div>
                      <div className="mt-5 flex flex-col md:grid md:grid-cols-3">
                        <span className="col-span-1 text-sm font-bold">
                          New enrolment date
                        </span>
                        <p className="col-span-2 text-sm">
                          {TimeAgo.dayMonthYear(
                            `${enrolment?.offer.newStartDate}`,
                          )}
                        </p>
                      </div>
                      <div className="mt-5 flex flex-col md:grid md:grid-cols-3">
                        <span className="col-span-1 text-sm font-bold">
                          Reason
                        </span>
                        <p className="col-span-2 text-sm">
                          {enrolment?.offer.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnrolmentExtension;
