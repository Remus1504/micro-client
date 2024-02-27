import { Dispatch, SetStateAction } from "react";
import { InstructorCourse } from "src/features/courses/interfaces/course.interface";
import { IOrderDocument } from "src/features/enrolment/interfaces/enrolment.interface";
import { IRatingCategories } from "src/features/enrolment/interfaces/review.interface";

export type InstructorContextType = {
  courses: InstructorCourse[];
  pausedCourses: InstructorCourse[];
  orders: IOrderDocument[];
  instructor: InstructorDocument | null;
};

export interface ILanguage {
  [key: string]: string | number | undefined;
  _id?: string;
  language: string;
  level: string;
}

export interface IExperience {
  [key: string]: string | number | boolean | undefined;
  _id?: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  currentlyWorkingHere: boolean | undefined;
}

export interface IEducation {
  [key: string]: string | number | undefined;
  _id?: string;
  country: string;
  university: string;
  title: string;
  major: string;
  year: string;
}

export interface ICertificate {
  [key: string]: string | number | undefined;
  _id?: string;
  name: string;
  from: string;
  year: number | string;
}

export interface IPersonalInfoData {
  [key: string]: string;
  fullName: string;
  profilePicture: string;
  description: string;
  responseTime: string;
  oneliner: string;
}

export interface IPersonalInfoProps {
  personalInfo: IPersonalInfoData;
  setPersonalInfo: Dispatch<SetStateAction<IPersonalInfoData>>;
  personalInfoErrors: IPersonalInfoData[];
}

export interface IReduxInstructor {
  type?: string;
  payload: InstructorDocument;
}

export interface IProfileHeaderProps {
  showHeaderInfo?: boolean;
  showEditIcons: boolean;
  instructorProfile?: InstructorDocument;
  setInstructorProfile?: Dispatch<SetStateAction<InstructorDocument>>;
}

export interface IExperienceProps {
  selectedField?: IExperience;
  experienceFields?: IExperience[];
  experienceErrors?: IExperience[];
  setExperienceFields?: Dispatch<SetStateAction<IExperience[]>>;
  setShowExperienceAddForm?: Dispatch<SetStateAction<boolean>>;
  setShowExperienceEditForm?: Dispatch<SetStateAction<boolean>>;
}

export interface IEducationProps {
  selectedField?: IEducation;
  educationFields?: IEducation[];
  educationErrors?: IEducation[];
  setEducationFields?: Dispatch<SetStateAction<IEducation[]>>;
  setShowEducationAddForm?: Dispatch<SetStateAction<boolean>>;
  setShowEducationEditForm?: Dispatch<SetStateAction<boolean>>;
}

export interface ISkillProps {
  type?: string;
  selectedField?: string[];
  skillsFields?: string[];
  skillsErrors?: string[];
  setSkillsFields?: Dispatch<SetStateAction<string[]>>;
  setShowSkillEditForm?: Dispatch<SetStateAction<boolean>>;
  setShowSkillAddForm?: Dispatch<SetStateAction<boolean>>;
}

export interface ILanguageProps {
  languageEdit?: ILanguage;
  languageFields?: ILanguage[];
  languagesErrors?: ILanguage[];
  setLanguageFields?: Dispatch<SetStateAction<ILanguage[]>>;
  setShowLanguageEditForm?: Dispatch<SetStateAction<boolean>>;
  setShowLanguageAddForm?: Dispatch<SetStateAction<boolean>>;
}

export interface ICertificateProps {
  selectedField?: ICertificate;
  certificatesFields?: ICertificate[];
  setCertificatesFields?: Dispatch<SetStateAction<ICertificate[]>>;
  setShowCertificateAddForm?: Dispatch<SetStateAction<boolean>>;
  setShowCertificateEditForm?: Dispatch<SetStateAction<boolean>>;
}

export interface ISocialLinksProps {
  socialFields?: string[];
  type?: string;
  setSocialFields?: Dispatch<SetStateAction<string[]>>;
  setShowSocialLinksAddForm?: Dispatch<SetStateAction<boolean>>;
  setShowSocialLinksEditForm?: Dispatch<SetStateAction<boolean>>;
}

export interface InstructorContext {
  showEditIcons: boolean;
  instructorProfile: InstructorDocument;
  setInstructorProfile?: Dispatch<SetStateAction<InstructorDocument>>;
}

export interface ILanguageEditFieldsProps {
  type: string;
  selectedLanguage?: ILanguage;
  setShowLanguageEditForm?: Dispatch<SetStateAction<boolean>>;
  setShowLanguageAddForm?: Dispatch<SetStateAction<boolean>>;
}

export interface ISocialEditLinksProps {
  type: string;
  selectedLink?: string;
  setShowSocialLinksAddForm?: Dispatch<SetStateAction<boolean>>;
  setShowSocialLinksEditForm?: Dispatch<SetStateAction<boolean>>;
}

export interface ICertificateEditProps {
  type: string;
  selectedCertificate?: ICertificate;
  setShowCertificateAddForm?: Dispatch<SetStateAction<boolean>>;
  setShowCertificateEditForm?: Dispatch<SetStateAction<boolean>>;
}

export interface IExperienceEditProps {
  type: string;
  selectedExperience?: IExperience;
  setShowExperienceAddForm?: Dispatch<SetStateAction<boolean>>;
  setShowExperienceEditForm?: Dispatch<SetStateAction<boolean>>;
}

export interface IEducationEditProps {
  type: string;
  selectedEducation?: IEducation;
  setShowEducationAddForm?: Dispatch<SetStateAction<boolean>>;
  setShowEducationEditForm?: Dispatch<SetStateAction<boolean>>;
}

export interface ISkillEditProps {
  type: string;
  selectedSkill?: string;
  setShowSkillEditForm?: Dispatch<SetStateAction<boolean>>;
  setShowSkillAddForm?: Dispatch<SetStateAction<boolean>>;
}

export interface IProfileTabsProps {
  type: string;
  setType?: Dispatch<SetStateAction<string>>;
}

export interface IShowEditItem {
  fullname: boolean;
  oneliner: boolean;
}

export interface InstructorProfileItem {
  fullname: string;
  oneliner: string;
}

// By extending InstructorDocument with the Record<string, any> you allow an object to contain other
// string keys with any values along with those defined in the interface.
// The nice part is that you still have the autocompletion for the defined properties
export type InstructorType =
  | string
  | string[]
  | number
  | IRatingCategories
  | Date
  | IExperience
  | IExperience[]
  | IEducation
  | IEducation[]
  | ICertificate
  | ICertificate[]
  | ILanguage
  | ILanguage[]
  | unknown
  | undefined;

export interface InstructorDocument extends Record<string, InstructorType> {
  _id?: string;
  profilePublicId?: string;
  fullName: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  description: string;
  country: string;
  oneliner: string;
  skills: string[];
  ratingsCount?: number;
  ratingSum?: number;
  ratingCategories?: IRatingCategories;
  languages: ILanguage[];
  responseTime: number;
  recentDelivery?: Date | string;
  experience: IExperience[];
  education: IEducation[];
  socialLinks: string[];
  certificates: ICertificate[];
  ongoingJobs?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalEarnings?: number;
  totalCourses?: number;
  paypal?: string; // not needed
  createdAt?: Date | string;
}
