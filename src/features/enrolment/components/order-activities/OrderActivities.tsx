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

import { OrderContext } from "../../context/OrderContext";
import {
  DivElementRefType,
  IOrderActivitiesProps,
} from "../../interfaces/enrolment.interface";
import OrderDelivered from "./components/OrderDelivered";
import OrderExtension from "./components/OrderExtension";
import OrderPlaced from "./components/OrderPlaced";
import OrderReview from "./components/OrderReview";

const OrderActivities: ForwardRefExoticComponent<
  Omit<IOrderActivitiesProps, "ref"> & RefAttributes<HTMLDivElement>
> = forwardRef<DivElementRefType, IOrderActivitiesProps>((props, ref) => {
  const { order, authUser, viewDeliveryBtnClicked } = props;
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const chatInstructor: IChatInstructorProps = {
    username: `${order.instructorUsername}`,
    _id: `${order.instructorId}`,
    profilePicture: `${order.instructorImage}`,
    responseTime: 1,
  };
  const chatStudent: IChatStudentProps = {
    username: `${order.studentUsername}`,
    _id: `${order.studentId}`,
    profilePicture: `${order.studentImage}`,
  };

  return (
    <div className="mb-3 mt-4 rounded-[4px] bg-white p-3">
      <div className="flex">
        <div className="my-5 rounded-full bg-[#e8e8e8] px-4 py-2 text-center text-sm font-bold">
          {TimeAgo.chatMessageTransform(`${order.dateEnrolled}`)}
        </div>
      </div>
      <OrderContext.Provider
        value={{ order, authUser, viewDeliveryBtnClicked }}
      >
        <OrderPlaced />
        <OrderExtension />
        <OrderDelivered ref={ref} />
        <OrderReview />
      </OrderContext.Provider>
      <div className="px-3 pt-2 flex">
        If you need to contact the{" "}
        {order.studentUsername === authUser.username ? "seller" : "buyer"},
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
          courseId={order.courseId}
          onClose={() => setShowChatBox(false)}
        />
      )}
    </div>
  );
});

export default OrderActivities;
