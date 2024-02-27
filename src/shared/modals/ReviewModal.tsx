import { ChangeEvent, FC, ReactElement, useState } from "react";
import { FaCircleNotch } from "react-icons/fa";
import { IReviewDocument } from "src/features/enrolment/interfaces/review.interface";
import { useAddReviewMutation } from "src/features/enrolment/services/review.service";
import { showErrorToast, showSuccessToast } from "src/shared/utils/utils";
import { useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";

import Button from "../Button/Button";
import TextAreaInput from "../Entries/TextAreaInput";
import StarRating from "../rating/rating";
import { IModalProps } from "./interfaces/modal.interface";
import ModalBg from "./ModalBg";

const LOADING_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const ReviewModal: FC<IModalProps> = ({
  order,
  type,
  onClose,
}): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const [review, setReview] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [status, setStatus] = useState<string>(LOADING_STATUS.IDLE);
  const [addReview] = useAddReviewMutation();

  const onAddReview = async (): Promise<void> => {
    try {
      setStatus(LOADING_STATUS.LOADING);
      const reviewDocument: IReviewDocument = {
        courseId: `${order?.courseId}`,
        reviewerId:
          type === "student-review"
            ? `${order?.studentId}`
            : `${order?.instructorId}`,
        instructorId: `${order?.instructorId}`,
        reviewerImage:
          type === "student-review"
            ? `${order?.studentImage}`
            : `${order?.instructorImage}`,
        review,
        rating: reviewRating,
        orderId: `${order?.orderId}`,
        reviewType: type,
        reviewerUsername: `${authUser?.username}`,
        country: `${authUser?.username}`,
        createdAt: `${new Date()}`,
      };
      await addReview({ body: reviewDocument });
      setStatus(LOADING_STATUS.SUCCESS);
      showSuccessToast("Review added successfully.");
      if (onClose) {
        onClose();
      }
    } catch (error) {
      setStatus(LOADING_STATUS.ERROR);
      showErrorToast("Error adding review.");
    }
  };

  const isLoading = status === LOADING_STATUS.LOADING;

  return (
    <ModalBg>
      <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center">
        {isLoading && (
          <div className="fixed bottom-0 left-0 right-0 top-0 z-[50] flex w-full items-center justify-center opacity-80">
            <div className="absolute bottom-auto left-auto right-auto top-auto flex min-h-[290px] min-w-[500px] flex-col items-center justify-center bg-white p-4 text-[#404145]">
              <FaCircleNotch
                className="animate-spin"
                size={40}
                color="#50b5ff"
              />
              <span>Adding...</span>
            </div>
          </div>
        )}
        <div className="relative bottom-auto left-auto right-auto top-auto max-h-[90vh] min-w-[500px] bg-white p-4 text-[#404145]">
          <div className="border-grey mb-[10px] w-full border-b text-left">
            <h4 className="pb-2 text-[17px] font-bold">
              {type === "student-review" ? "Review Seller" : "Review Buyer"}
            </h4>
          </div>

          <div className="mb-4s relative mt-4 h-10">
            <StarRating setReviewRating={setReviewRating} size={20} />
          </div>
          <div className="mb-5 text-base">
            <TextAreaInput
              className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
              name="review"
              placeholder="What was it like working with the seller?"
              value={review}
              rows={4}
              onChange={(event: ChangeEvent) => {
                setReview((event.target as HTMLTextAreaElement).value);
              }}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              className="rounded bg-gray-200 px-6 py-3 text-center text-sm font-bold text-black focus:outline-none md:px-4 md:py-2 md:text-base"
              onClick={onClose}
              label="Cancel"
            />
            <Button
              className={`rounded px-6 py-3 text-center text-sm font-bold text-white focus:outline-none md:px-4 md:py-2 md:text-base ${
                !review || reviewRating === 0
                  ? "cursor-not-allowed bg-sky-200"
                  : "bg-sky-500 hover:bg-sky-400"
              }`}
              disabled={!review || reviewRating === 0}
              onClick={onAddReview}
              label="Send"
            />
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default ReviewModal;
