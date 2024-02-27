import { Dispatch, MouseEventHandler, ReactNode, SetStateAction } from "react";
import { IAuthUser } from "src/features/auth/interfaces/authenticationinterface";
import { StudentDocument } from "src/features/student/interfaces/student.interface";
import { IMessageDocument } from "src/features/chat/interfaces/chat.interface";
import { IOrderDocument } from "src/features/enrolment/interfaces/enrolment.interface";

export interface IModalBgProps {
  children?: ReactNode;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  onToggle?: Dispatch<SetStateAction<boolean>>;
  onTogglePassword?: Dispatch<SetStateAction<boolean>>;
}

export interface IModalProps {
  header?: string;
  courseTitle?: string;
  singleMessage?: IMessageDocument;
  order?: IOrderDocument;
  receiver?: StudentDocument;
  authUser?: IAuthUser;
  type?: string;
  approvalModalContent?: IApprovalModalContent;
  hideCancel?: boolean;
  cancelBtnHandler?: () => void;
  onClick?: () => void;
  onClose?: () => void;
}

export interface IApprovalModalContent {
  header: string;
  body: string;
  btnText: string;
  btnColor: string;
}
