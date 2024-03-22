import { FC, ReactElement } from "react";
import { FaRegClock } from "react-icons/fa";
import {
  createSearchParams,
  NavigateFunction,
  useNavigate,
} from "react-router-dom";
import { IEnrolment } from "src/features/enrolment/interfaces/enrolment.interface";
import Button from "src/shared/Button/Button";
import { showErrorToast } from "src/shared/utils/utils";

import { IChatMessageProps } from "../../interfaces/chat.interface";
import { useUpdateOfferMutation } from "../../services/chat.service";

const ChatOffer: FC<IChatMessageProps> = ({
  message,
  instructor,
  course,
}): ReactElement => {
  const navigate: NavigateFunction = useNavigate();
  const [updateOffer] = useUpdateOfferMutation();
  const messageOffer: IEnrolment = message.offer as IEnrolment;

  const updateStudentOffer = async (
    messageId: string,
    type: string,
    offer: IEnrolment,
  ): Promise<void> => {
    try {
      await updateOffer({ messageId, type });
      const offerParams: IEnrolment = {
        courseTitle: offer.courseTitle,
        description: offer.description,
        price: offer.price,
        durationInDays: offer.durationInDays,
        oldStartDate: offer.oldStartDate,
        newStartDate: offer.newStartDate,
        accepted: offer.accepted,
        cancelled: offer.cancelled,
      };
      if (type === "accepted") {
        navigate(
          `/course/checkout/${message.courseId}?${createSearchParams({
            offer: JSON.stringify(offerParams),
          })}`,
          { state: course },
        );
      }
    } catch (error) {
      showErrorToast("Error updating student offer.");
    }
  };

  return (
    <div className="z-1 border-grey mt-2 flex h-72 max-w-xl flex-col overflow-hidden rounded border">
      <div className="w-full">
        <div className="border-grey flex flex-row justify-between border-b bg-[#fafafa] p-4 text-sm font-bold md:text-base">
          <span className="">{message.offer?.courseTitle}</span>
          <span>${message.offer?.price}</span>
        </div>
        <div className="border-grey h-28 max-h-28 overflow-y-scroll border-b px-4 py-3">
          {messageOffer.description}
        </div>
        <div className="border-grey flex flex-row gap-x-2 border-b px-4 py-3 text-sm font-bold md:text-base">
          <FaRegClock className="self-center" /> {messageOffer.durationInDays}{" "}
          Day
          {parseInt(`${messageOffer.durationInDays}`) > 1 ? "s" : ""} Delivery
        </div>
        <div className="relative top-[5%] mr-3 flex flex-row justify-end gap-4">
          <Button
            className={`rounded px-6 py-3 text-center text-sm font-bold text-white focus:outline-none md:px-4 md:py-2 md:text-base ${
              messageOffer.accepted || messageOffer.cancelled
                ? "cursor-not-allowed bg-red-200 hover:bg-red-200"
                : "bg-red-500 hover:bg-red-400"
            }`}
            disabled={messageOffer.accepted || messageOffer.cancelled}
            label="Cancel Offer"
            onClick={() =>
              updateStudentOffer(`${message._id}`, "cancelled", messageOffer)
            }
          />

          {instructor && instructor._id !== message.instructorId && (
            <Button
              className={`rounded px-6 py-3 text-center text-sm font-bold text-white focus:outline-none md:px-4 md:py-2 md:text-base ${
                messageOffer.accepted || messageOffer.cancelled
                  ? "cursor-not-allowed bg-sky-200 hover:bg-sky-200"
                  : "bg-sky-500 hover:bg-sky-400"
              }`}
              disabled={messageOffer.accepted || messageOffer.cancelled}
              label="Accept Offer"
              onClick={() =>
                updateStudentOffer(`${message._id}`, "accepted", messageOffer)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatOffer;
