import { Dispatch, SetStateAction } from "react";
import { IAuthUser } from "src/features/auth/interfaces/authenticationinterface";
import { StudentDocument } from "src/features/student/interfaces/student.interface";
import { InstructorDocument } from "src/features/instructors/interfaces/instructor.interface";

export interface IReduxHeader {
  type: string;
  payload: string;
}

export interface IReduxShowCategory {
  type: string;
  payload: boolean;
}

export interface IReduxNotification {
  type?: string;
  payload: INotification;
}

export interface INotification {
  hasUnreadMessage?: boolean;
  hasUnreadNotification?: boolean;
}

export interface IHomeHeaderProps {
  student?: StudentDocument;
  instructor?: InstructorDocument;
  authUser?: IAuthUser;
  type?: string;
  showCategoryContainer?: boolean;
  setIsDropdownOpen?: Dispatch<SetStateAction<boolean>>;
  setIsOrderDropdownOpen?: Dispatch<SetStateAction<boolean>>;
  setIsMessageDropdownOpen?: Dispatch<SetStateAction<boolean>>;
  setIsNotificationDropdownOpen?: Dispatch<SetStateAction<boolean>>;
}

export interface IHeaderSideBarProps {
  setShowRegisterModal?: Dispatch<SetStateAction<IHeaderModalProps>>;
  setShowLoginModal?: Dispatch<SetStateAction<IHeaderModalProps>>;
  setOpenSidebar?: Dispatch<SetStateAction<boolean>>;
}

export interface IHeader {
  navClass: string;
}

export interface ISettings {
  id: number;
  name: string;
  url: string;
  show: boolean;
}

export interface IHeaderModalProps {
  login: boolean;
  register: boolean;
  forgotPassword: boolean;
}
