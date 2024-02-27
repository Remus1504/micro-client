import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { InstructorCourse } from "src/features/courses/interfaces/course.interface";
import { IOffer } from "src/features/enrolment/interfaces/enrolment.interface";
import { InstructorDocument } from "src/features/instructors/interfaces/instructor.interface";

export interface IChatWindowProps {
  chatMessages: IMessageDocument[];
  isError: boolean;
  isLoading: boolean;
  setSkip?: Dispatch<SetStateAction<boolean>>;
}

export interface IFilePreviewProps {
  image: string;
  file: File;
  isLoading: boolean;
  message: string;
  handleChange: (event: ChangeEvent) => void;
  onSubmit: (event: FormEvent) => void;
  onRemoveImage: () => void;
}

export interface IConversationDocument {
  _id: string;
  conversationId: string;
  senderUsername: string;
  receiverUsername: string;
}

export interface IMessageDocument {
  _id?: string;
  conversationId?: string;
  body?: string;
  url?: string;
  file?: string;
  fileType?: string;
  fileSize?: string;
  fileName?: string;
  courseId?: string;
  instructorId?: string;
  studentId?: string;
  senderUsername?: string;
  senderPicture?: string;
  receiverUsername?: string;
  receiverPicture?: string;
  isRead?: boolean;
  hasOffer?: boolean;
  offer?: IOffer;
  hasConversationId?: boolean;
  createdAt?: Date | string;
}

export interface IChatBoxProps {
  instructor: IChatInstructorProps;
  student: IChatStudentProps;
  courseId: string;
  onClose: () => void;
}

export interface IChatInstructorProps {
  _id: string;
  username: string;
  profilePicture: string;
  responseTime: number;
}

export interface IChatStudentProps {
  _id: string;
  username: string;
  profilePicture: string;
}

export interface IChatMessageProps {
  message: IMessageDocument;
  instructor?: InstructorDocument;
  course?: InstructorCourse;
}
