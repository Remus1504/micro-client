import {
  ChangeEvent,
  FC,
  FormEvent,
  ReactElement,
  RefObject,
  useRef,
  useState,
} from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import Button from "src/shared/Button/Button";
import TextInput from "src/shared/Entries/Input";
import { IResponse } from "src/shared/shared.interface";
import { generateRandomNumber, showErrorToast } from "src/shared/utils/utils";
import { useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";
import { v4 as uuidv4 } from "uuid";

import useChatScrollToBottom from "../../hooks/useChatScrollToBottom";
import {
  IChatBoxProps,
  IConversationDocument,
  IMessageDocument,
} from "../../interfaces/chat.interface";
import {
  useGetConversationQuery,
  useGetMessagesQuery,
  useSaveChatMessageMutation,
} from "../../services/chat.service";
import ChatBoxSkeleton from "./ChatBoxSkeleton";

const ChatBox: FC<IChatBoxProps> = ({
  instructor,
  student,
  courseId,
  onClose,
}): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const [message, setMessage] = useState<string>("");
  const conversationIdRef = useRef<string>(`${generateRandomNumber(15)}`);
  const { data: conversationData, isSuccess: isConversationSuccess } =
    useGetConversationQuery({
      senderUsername: `${instructor.username}`,
      receiverUsername: `${student.username}`,
    });
  const {
    data: messageData,
    isLoading: isMessageLoading,
    isSuccess: isMessageSuccess,
  } = useGetMessagesQuery(
    {
      senderUsername: `${instructor.username}`,
      receiverUsername: `${student.username}`,
    },
    { refetchOnMountOrArgChange: true }
  );
  let chatMessages: IMessageDocument[] = [];

  if (
    isConversationSuccess &&
    conversationData.conversations &&
    conversationData.conversations.length
  ) {
    conversationIdRef.current = (
      conversationData.conversations[0] as IConversationDocument
    ).conversationId;
  }
  if (isMessageSuccess) {
    chatMessages = messageData.messages as IMessageDocument[];
  }

  const scrollRef: RefObject<HTMLDivElement> =
    useChatScrollToBottom(chatMessages);
  const [saveChatMessage] = useSaveChatMessageMutation();

  const sendMessage = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!message) {
      return;
    }
    try {
      const messageBody: IMessageDocument = {
        conversationId: conversationIdRef.current,
        hasConversationId:
          conversationData &&
          conversationData.conversations &&
          conversationData.conversations.length > 0,
        body: message,
        courseId,
        instructorId: instructor._id,
        studentId: student._id,
        senderUsername:
          authUser.username === instructor.username
            ? instructor.username
            : student.username,
        senderPicture:
          authUser.username === instructor.username
            ? instructor.profilePicture
            : student.profilePicture,
        receiverUsername:
          authUser.username !== instructor.username
            ? instructor.username
            : student.username,
        receiverPicture:
          authUser.username !== instructor.username
            ? instructor.profilePicture
            : student.profilePicture,
        isRead: false,
        hasOffer: false,
      };
      const response: IResponse = await saveChatMessage(messageBody).unwrap();
      setMessage("");
      conversationIdRef.current = `${response.conversationId}`;
    } catch (error) {
      showErrorToast("Error sending message.");
    }
  };

  return (
    <>
      {isMessageLoading && !chatMessages ? (
        <ChatBoxSkeleton />
      ) : (
        <div className="border-grey fixed bottom-0 left-2 right-2 h-[400px] max-h-[500px] w-auto border bg-white md:left-8 md:h-96 md:max-h-[500px] md:w-96">
          <div className="border-grey flex items-center space-x-4 border-b px-5 py-2">
            <img
              src={
                authUser.username !== instructor.username
                  ? instructor.profilePicture
                  : student.profilePicture
              }
              className="h-10 w-10 rounded-full"
              alt="profile image"
            />
            <div className="w-full font-medium text-[#777d74]">
              <div className="flex w-full cursor-pointer justify-between text-sm font-bold text-[#777d74] md:text-base">
                <span>
                  {authUser.username !== instructor.username
                    ? instructor.username
                    : student.username}
                </span>
                <FaTimes className="flex self-center" onClick={onClose} />
              </div>
              <div className="text-xs text-gray-500">
                Avg. response time: {instructor.responseTime} hour
                {instructor.responseTime === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <div className="h-[500px] overflow-y-scroll md:h-full">
            <div
              className="my-2 flex h-[280px] flex-col overflow-y-scroll px-4 md:h-[72%]"
              ref={scrollRef}
            >
              {chatMessages.map((msg: IMessageDocument) => (
                <div
                  key={uuidv4()}
                  className={`my-2 flex max-w-[300px] gap-y-6 text-sm ${
                    msg.senderUsername !== student.username
                      ? "flex-row-reverse self-end"
                      : ""
                  }`}
                >
                  <img
                    src={student.profilePicture}
                    className={`h-8 w-8 rounded-full object-cover ${
                      msg.senderUsername !== student.username ? "hidden" : ""
                    }`}
                    alt="profile image"
                  />
                  <p
                    className={`ml-2 max-w-[200px] rounded-[10px] bg-[#e4e6eb] px-4 py-2 text-start text-sm font-normal md:max-w-[220px] ${
                      msg.senderUsername !== student.username
                        ? "max-w-[200px] rounded-[10px] bg-sky-500 text-white"
                        : ""
                    }`}
                  >
                    {msg.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={sendMessage}
            className="absolute bottom-0 left-0 right-0 mb-1 flex px-2 "
          >
            <TextInput
              type="text"
              name="message"
              value={message}
              placeholder="Enter your message..."
              className="border-grey mb-0 w-full rounded-l-lg border p-2 text-sm font-normal text-gray-600 focus:outline-none"
              onChange={(event: ChangeEvent) =>
                setMessage((event.target as HTMLInputElement).value)
              }
            />
            <Button
              className="rounded-r-lg bg-sky-500 px-6 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:px-3 md:text-base"
              label={<FaPaperPlane className="self-center" />}
            />
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBox;
