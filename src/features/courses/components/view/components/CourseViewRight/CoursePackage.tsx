import { FC, ReactElement, useContext, useState } from "react";
import { FaArrowRight, FaRegClock } from "react-icons/fa";
import {
  createSearchParams,
  NavigateFunction,
  useNavigate,
} from "react-router-dom";
import { CourseContext } from "src/features/courses/context/CourseContext";
import { IEnrolment } from "src/features/enrolment/interfaces/enrolment.interface";
import Button from "src/shared/Button/Button";
import ApprovalModal from "src/shared/modals/Approval";
import { IApprovalModalContent } from "src/shared/modals/interfaces/modal.interface";
import { useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";

const CoursePackage: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const { course } = useContext(CourseContext);
  const [approvalModalContent, setApprovalModalContent] =
    useState<IApprovalModalContent>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();

  const continueToCheck = () => {
    const durationInDays: number = parseInt(
      course.expectedDuration.split(" ")[0],
    );
    const newDate: Date = new Date();
    newDate.setDate(newDate.getDate() + durationInDays);
    const offerParams: IEnrolment = {
      courseTitle: course.title,
      description: course.basicDescription,
      price: course.price,
      durationInDays,
      oldStartDate: `${newDate}`,
      newStartDate: `${newDate}`,
      accepted: false,
      cancelled: false,
    };
    navigate(
      `/course/checkout/${course.id}?${createSearchParams({
        offer: JSON.stringify(offerParams),
      })}`,
      { state: course },
    );
  };

  return (
    <>
      {showModal && (
        <ApprovalModal
          approvalModalContent={approvalModalContent}
          hideCancel={true}
          onClick={() => setShowModal(false)}
        />
      )}
      <div className="border-grey mb-8 border">
        <div className="flex border-b px-4 py-2">
          <h4 className="font-bold">${course.price}</h4>
        </div>
        <ul className="mb-0 list-none px-4 py-2">
          <li className="flex justify-between">
            <div className="ml-15 flex w-full pb-3">
              <div className="text-base font-bold">{course.basicTitle}</div>
            </div>
          </li>
          <li className="flex justify-between">
            <div className="ml-15 flex w-full pb-4">
              <div className="text-sm font-normal">
                {course.basicDescription}
              </div>
            </div>
          </li>
          <li className="flex justify-between">
            <div className="ml-15 flex w-full pb-3">
              <FaRegClock className="flex self-center" />{" "}
              <span className="ml-3 text-sm font-semibold">
                {course.expectedDuration}
              </span>
            </div>
          </li>
          <li className="flex justify-between">
            <div className="ml-15 flex w-full py-1">
              <Button
                disabled={authUser.username === course.username}
                className={`text-md flex w-full justify-between rounded bg-sky-500 px-8 py-2 font-bold text-white focus:outline-none
                ${
                  authUser.username === course.username
                    ? "opacity-20 cursor-not-allowed"
                    : "hover:bg-sky-400 cursor-pointer"
                }
                `}
                label={
                  <>
                    <span className="w-full">Continue</span>
                    <FaArrowRight className="flex self-center" />
                  </>
                }
                onClick={() => {
                  if (authUser && !authUser.emailVerified) {
                    setApprovalModalContent({
                      header: "Email Verification Notice",
                      body: "Please verify your email before you continue.",
                      btnText: "OK",
                      btnColor: "bg-sky-500 hover:bg-sky-400",
                    });
                    setShowModal(true);
                  } else {
                    continueToCheck();
                  }
                }}
              />
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default CoursePackage;
