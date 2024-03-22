import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useState,
} from "react";
import ChatBox from "src/features/chat/components/chatbox/ChatBox";
import {
  IChatStudentProps,
  IChatInstructorProps,
} from "src/features/chat/interfaces/chat.interface";
import { TimeAgo } from "src/shared/utils/time.utils";

import { EnrolmentContext } from "../../context/EnrolmentContext";
import {
  DivElementRefType,
  IEnrolmentActivitiesProps,
} from "../../interfaces/enrolment.interface";
import EnrolmentDelivered from "./components/EnrolmentDelivered";
import EnrolmentExtension from "./components/EnrolmentExtension";
import EnrolmentPlaced from "./components/EnrolmentPlaced";
import EnrolmentReview from "./components/EnrolmentReview";

const EnrolmentActivities: ForwardRefExoticComponent<
  Omit<IEnrolmentActivitiesProps, "ref"> & RefAttributes<HTMLDivElement>
> = forwardRef<DivElementRefType, IEnrolmentActivitiesProps>((props, ref) => {
  const { enrolment, authUser, viewDeliveryBtnClicked } = props;
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const chatInstructor: IChatInstructorProps = {
    username: `${enrolment.instructorUsername}`,
    _id: `${enrolment.instructorId}`,
    profilePicture: `${enrolment.instructorImage}`,
    responseTime: 1,
  };
  const chatStudent: IChatStudentProps = {
    username: `${enrolment.studentUsername}`,
    _id: `${enrolment.studentId}`,
    profilePicture: `${enrolment.studentImage}`,
  };

  return (
    <div className="mb-3 mt-4 rounded-[4px] bg-white p-3">
      <div className="flex">
        <div className="my-5 rounded-full bg-[#e8e8e8] px-4 py-2 text-center text-sm font-bold">
          {TimeAgo.chatMessageTransform(`${enrolment.dateEnrolled}`)}
        </div>
      </div>
      <EnrolmentContext.Provider
        value={{ enrolment, authUser, viewDeliveryBtnClicked }}
      >
        <EnrolmentPlaced />
        <EnrolmentExtension />
        <EnrolmentDelivered ref={ref} />
        <EnrolmentReview />
      </EnrolmentContext.Provider>
      <div className="px-3 pt-2 flex">
        If you need to contact the{" "}
        {enrolment.studentUsername === authUser.username
          ? "instructor"
          : "student"}
        ,
        <div
          onClick={() => setShowChatBox((item: boolean) => !item)}
          className="px-2 text-blue-500 cursor-pointer hover:underline"
        >
          Go to Inbox
        </div>
      </div>
      {showChatBox && (
        <ChatBox
          instructor={chatInstructor}
          student={chatStudent}
          courseId={enrolment.courseId}
          onClose={() => setShowChatBox(false)}
        />
      )}
    </div>
  );
});

export default EnrolmentActivities;
