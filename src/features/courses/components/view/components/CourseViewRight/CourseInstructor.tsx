import { FC, ReactElement, useContext, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ChatBox from "src/features/chat/components/chatbox/ChatBox";
import {
  IChatStudentProps,
  IChatInstructorProps,
} from "src/features/chat/interfaces/chat.interface";
import { CourseContext } from "src/features/courses/context/CourseContext";
import { ILanguage } from "src/features/instructors/interfaces/instructor.interface";
import Button from "src/shared/Button/Button";
import ApprovalModal from "src/shared/modals/Approval";
import { IApprovalModalContent } from "src/shared/modals/interfaces/modal.interface";
import StarRating from "src/shared/rating/rating";
import { TimeAgo } from "src/shared/utils/time.utils";
import { lowerCase, rating, shortenLargeNumbers } from "src/shared/utils/utils";
import { useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";
import { v4 as uuidv4 } from "uuid";

const CourseInstructor: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const student = useAppSelector((state: IReduxState) => state.student);
  const { course, instructor } = useContext(CourseContext);
  const [approvalModalContent, setApprovalModalContent] =
    useState<IApprovalModalContent>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const chatSeller: IChatInstructorProps = {
    username: `${instructor.username}`,
    _id: `${instructor._id}`,
    profilePicture: `${instructor.profilePicture}`,
    responseTime: parseInt(`${instructor.responseTime}`),
  };
  const chatStudent: IChatStudentProps = {
    username: `${student.username}`,
    _id: `${student._id}`,
    profilePicture: `${student.profilePicture}`,
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
          <h4 className="font-bold">About The Instructor</h4>
        </div>
        <div className="mb-0 px-4 pt-2">
          <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-2">
            <img
              className="flex h-24 w-24 self-center rounded-full object-cover"
              src={course.profilePicture}
              alt=""
            />
            <div className="flex flex-col self-center">
              <Link
                to={`/instructor_profile/${lowerCase(`${course.username}`)}/${
                  course.instructorId
                }/view`}
                className="flex cursor-pointer self-center no-underline hover:underline md:block md:self-start"
              >
                <span className="text-base font-bold md:mb-5">
                  {course.username}
                </span>
              </Link>
              <span className="flex self-center text-sm md:block md:self-start">
                {instructor.oneliner}
              </span>
              <div className="flex w-full justify-center pt-1 md:justify-start">
                <div
                  className={`flex w-full justify-center md:justify-start ${
                    instructor.ratingsCount === 0 ? "gap-x-[5.8rem]" : "gap-x-5"
                  }`}
                >
                  <div className="flex w-full justify-center gap-x-1 md:justify-start">
                    <div className="mt-1 w-20 gap-x-2">
                      <StarRating
                        value={rating(
                          parseInt(`${course.ratingSum}`) /
                            parseInt(`${course.ratingsCount}`)
                        )}
                        size={14}
                      />
                    </div>
                    <div className="ml-2 mt-[1px] flex gap-1 text-sm">
                      <span className="">
                        ({shortenLargeNumbers(course?.ratingsCount)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="border-grey my-3" />
          <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2">
            <div className="flex flex-col">
              <span className="">From</span>
              <span className="font-bold">{instructor.country}</span>
            </div>
            <div className="flex flex-col">
              <span className="">Member since</span>
              <span className="font-bold">
                {TimeAgo.formatDateToMonthAndYear(`${instructor.createdAt}`)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="">Avg. resp time</span>
              <span className="font-bold">
                {instructor.responseTime} hour
                {`${instructor.responseTime > 1 ? "s" : ""}`}{" "}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="">Languages</span>
              <div className="flex flex-wrap">
                {instructor?.languages &&
                  instructor?.languages.map(
                    (language: ILanguage, index: number) => (
                      <span className="font-bold" key={uuidv4()}>
                        {`${language.language}${
                          index !== instructor.languages.length - 1 ? "," : ""
                        }`}
                        &nbsp;
                      </span>
                    )
                  )}
              </div>
            </div>
          </div>
          <hr className="border-grey my-2" />
          <div className="ml-15 mb-2 flex w-full py-1">
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
                  <span className="w-full">Contact Me</span>
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
                  setShowChatBox((item: boolean) => !item);
                }
              }}
            />
          </div>
        </div>
        {showChatBox && (
          <ChatBox
            instructor={chatSeller}
            student={chatStudent}
            courseId={`${course.id}`}
            onClose={() => setShowChatBox(false)}
          />
        )}
      </div>
    </>
  );
};

export default CourseInstructor;
