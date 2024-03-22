import { FC, ReactElement, useContext, useState } from "react";
import { FaChevronDown, FaChevronUp, FaRegStar } from "react-icons/fa";
import { EnrolmentContext } from "src/features/enrolment/context/EnrolmentContext";
import { IEnrolmentReviewModal } from "src/features/enrolment/interfaces/enrolment.interface";
import Button from "src/shared/Button/Button";
import ReviewModal from "src/shared/modals/ReviewModal";
import StarRating from "src/shared/rating/rating";
import { TimeAgo } from "src/shared/utils/time.utils";

const EnrolmentReview: FC = (): ReactElement => {
  const { enrolment, authUser } = useContext(EnrolmentContext);
  const [orderReviewModal, setOrderReviewModal] =
    useState<IEnrolmentReviewModal>({
      studentReview: false,
      instructorReview: false,
      studentPanel: false,
      instructorPanel: false,
    });

  return (
    <>
      {orderReviewModal.studentReview && (
        <ReviewModal
          type="student-review"
          enrolment={enrolment}
          onClose={() =>
            setOrderReviewModal({ ...orderReviewModal, studentReview: false })
          }
        />
      )}
      {orderReviewModal.instructorReview && (
        <ReviewModal
          type="instructor-review"
          enrolment={enrolment}
          onClose={() =>
            setOrderReviewModal({
              ...orderReviewModal,
              instructorReview: false,
            })
          }
        />
      )}
      {enrolment?.approved &&
        authUser?.username === enrolment.studentUsername &&
        enrolment.studentReview?.rating === 0 && (
          <div className="flex rounded-[4px] bg-white px-4 py-3">
            <div className="w-full">
              <div className="flex gap-4">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eb8c34]">
                    <FaRegStar size={18} color="#fcd5b1" />
                  </div>
                </div>
                <div className="w-full cursor-pointer pb-6">
                  <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
                    <span>Ready to review the instructor?</span>
                  </div>
                  <div className="my-3 flex">
                    <Button
                      onClick={() =>
                        setOrderReviewModal({
                          ...orderReviewModal,
                          studentReview: true,
                        })
                      }
                      className="rounded bg-green-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-green-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                      label="Leave a Review"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {enrolment?.approved &&
        enrolment?.studentReview &&
        enrolment?.studentReview?.rating > 0 && (
          <div className="flex rounded-[4px] bg-white px-4 py-3">
            <div className="w-full">
              <div className="flex gap-4">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ededed]">
                    <FaRegStar size={18} color="#6d6d6e" />
                  </div>
                </div>
                <div className="border-grey w-full cursor-pointer border-b pb-6">
                  <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
                    <div className="flex gap-2">
                      {authUser?.username === enrolment.studentUsername && (
                        <span>
                          You left a {enrolment.studentReview?.rating}-star
                          review
                        </span>
                      )}
                      {authUser?.username === enrolment.instructorUsername && (
                        <span>
                          {enrolment.studentUsername} gave you a{" "}
                          {enrolment.studentReview?.rating}-star review
                        </span>
                      )}
                      <p className="flex self-center text-sm font-normal italic">
                        {TimeAgo.dayWithTime(
                          `${enrolment?.events.studentReview}`,
                        )}
                      </p>
                    </div>
                    <div
                      onClick={() =>
                        setOrderReviewModal({
                          ...orderReviewModal,
                          studentPanel: !orderReviewModal.studentPanel,
                        })
                      }
                    >
                      {!orderReviewModal.studentPanel ? (
                        <FaChevronDown size={15} />
                      ) : (
                        <FaChevronUp size={15} />
                      )}
                    </div>
                  </div>
                  {orderReviewModal.studentPanel && (
                    <div className="my-3 flex flex-col">
                      <div className="relative overflow-x-auto">
                        <div className="border-grey w-full rounded border text-left text-sm text-gray-500">
                          <div className="border-grey border-b bg-[#fafafb] py-3 font-medium uppercase">
                            <span className="px-5">
                              {authUser?.username === enrolment.studentUsername
                                ? "Your Review"
                                : `${enrolment.studentUsername}'s Review`}
                            </span>
                          </div>
                          <div className="flex w-full cursor-pointer flex-col items-center space-x-4 px-5 py-4 md:flex-row">
                            <div className="flex w-full justify-center md:w-12 md:self-start">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={enrolment.studentImage}
                                alt="Student Image"
                              />
                            </div>
                            <div className="w-full text-sm dark:text-white">
                              <div className="flex justify-between text-sm font-bold text-[#777d74] md:text-base">
                                <div className="flex flex-row gap-2">
                                  {authUser?.username ===
                                  enrolment.studentUsername
                                    ? "Me"
                                    : enrolment.studentUsername}
                                  <div className="flex self-center">
                                    <div className="flex flex-row items-center gap-x-1">
                                      <StarRating
                                        value={enrolment.studentReview?.rating}
                                        size={14}
                                      />
                                    </div>
                                    <div className="ml-1 flex gap-1 text-sm">
                                      <span className="text-orange-400">
                                        ({enrolment.studentReview?.rating})
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-1 flex flex-col justify-between text-[#777d74]">
                                <span className="text-sm md:text-[15px]">
                                  {enrolment.studentReview?.review}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      {enrolment?.approved &&
        authUser?.username === enrolment.instructorUsername &&
        enrolment?.instructorReview?.rating === 0 &&
        enrolment?.studentReview &&
        enrolment?.studentReview?.rating > 0 && (
          <div className="flex rounded-[4px] bg-white px-4 py-3">
            <div className="w-full">
              <div className="flex gap-4">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eb8c34]">
                    <FaRegStar size={18} color="#fcd5b1" />
                  </div>
                </div>
                <div className="w-full cursor-pointer pb-6">
                  <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
                    <span>Ready to review the student?</span>
                  </div>
                  <div className="my-3 flex">
                    <Button
                      onClick={() =>
                        setOrderReviewModal({
                          ...orderReviewModal,
                          instructorReview: true,
                        })
                      }
                      className="rounded bg-green-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-green-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                      label="Leave a Review"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {enrolment?.approved &&
        enrolment?.instructorReview &&
        enrolment?.instructorReview?.rating > 0 && (
          <div className="flex rounded-[4px] bg-white px-4 py-3">
            <div className="w-full">
              <div className="flex gap-4">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ededed]">
                    <FaRegStar size={18} color="#6d6d6e" />
                  </div>
                </div>
                <div className="w-full cursor-pointer pb-6">
                  <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
                    <div className="flex gap-2">
                      {authUser?.username === enrolment.instructorUsername && (
                        <span>
                          You left {enrolment.studentUsername} a{" "}
                          {enrolment.instructorReview?.rating}-star review
                        </span>
                      )}
                      {authUser?.username === enrolment.studentUsername && (
                        <span>
                          {enrolment.instructorUsername} gave you a{" "}
                          {enrolment.instructorReview?.rating}-star review
                        </span>
                      )}
                      <p className="flex self-center text-sm font-normal italic">
                        {TimeAgo.dayWithTime(
                          `${enrolment?.events.instructorReview}`,
                        )}
                      </p>
                    </div>
                    <div
                      onClick={() =>
                        setOrderReviewModal({
                          ...orderReviewModal,
                          instructorPanel: !orderReviewModal.instructorPanel,
                        })
                      }
                    >
                      {!orderReviewModal.instructorPanel ? (
                        <FaChevronDown size={15} />
                      ) : (
                        <FaChevronUp size={15} />
                      )}
                    </div>
                  </div>
                  {orderReviewModal.instructorPanel && (
                    <div className="my-3 flex flex-col">
                      <div className="relative overflow-x-auto">
                        <div className="border-grey w-full rounded border text-left text-sm text-gray-500">
                          <div className="border-grey border-b bg-[#fafafb] py-3 font-medium uppercase">
                            <span className="px-5">
                              {authUser?.username ===
                              enrolment.instructorUsername
                                ? "Your Review"
                                : `${enrolment.studentUsername}'s Review`}
                            </span>
                          </div>
                          <div className="flex w-full cursor-pointer flex-col items-center space-x-4 px-5 py-4 md:flex-row">
                            <div className="flex w-full justify-center md:w-12 md:self-start">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={enrolment.instructorImage}
                                alt="Student Image"
                              />
                            </div>
                            <div className="w-full text-sm dark:text-white">
                              <div className="flex justify-between text-sm font-bold text-[#777d74] md:text-base">
                                <div className="flex flex-row gap-2">
                                  {authUser?.username ===
                                  enrolment.instructorUsername
                                    ? "Me"
                                    : enrolment.instructorUsername}
                                  <div className="flex self-center">
                                    <div className="flex flex-row items-center gap-x-1">
                                      <StarRating
                                        value={
                                          enrolment.instructorReview.rating
                                        }
                                        size={14}
                                      />
                                    </div>
                                    <div className="ml-1 flex gap-1 text-sm">
                                      <span className="text-orange-400">
                                        ({enrolment.instructorReview?.rating})
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-1 flex flex-col justify-between text-[#777d74]">
                                <span className="text-sm md:text-[15px]">
                                  {enrolment.instructorReview?.review}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default EnrolmentReview;
