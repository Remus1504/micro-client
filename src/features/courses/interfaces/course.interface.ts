import { InstructorDocument, courseType } from "@remus1504/micrograde";
import { Dispatch, SetStateAction } from "react";
import {
  IRatingCategories,
  IReviewDocument,
} from "src/features/enrolment/interfaces/review.interface";

export interface ITagsInputProps {
  title: string;
  placeholder: string;
  courseInfo: ICreateCourse;
  tags: string[];
  itemName: string;
  itemInput: string;
  inputErrorMessage: boolean;
  counterText: string;
  setItem: Dispatch<SetStateAction<string[]>>;
  setItemInput: Dispatch<SetStateAction<string>>;
  setCourseInfo: Dispatch<SetStateAction<ICreateCourse>>;
}

export interface ICoursePaginateProps {
  courses: InstructorCourse[];
  totalCourses: number;
  itemsPerPage: number;
  showNumbers: boolean;
  setItemFrom: Dispatch<SetStateAction<string>>;
  setPaginationType: Dispatch<SetStateAction<string>>;
}

export interface IAllowedCourseItem {
  courseTitle: string;
  basicTitle: string;
  basicDescription: string;
  descriptionCharacters: string;
}

export interface ICourseDropdown {
  budget: boolean;
  durationTime: boolean;
}

export interface IShowCourseModal {
  image: boolean;
  cancel: boolean;
}

export interface ICourseTextLength {
  courseTitle: number;
  basicTitle: number;
  basicDescription: number;
  fullDescription: number;
}

export const COURSE_MAX_LENGTH: ICourseTextLength = {
  courseTitle: 80,
  basicTitle: 40,
  basicDescription: 100,
  fullDescription: 1200,
};

export interface ICoursesProps {
  type?: string;
  course?: InstructorCourse;
}

export type CourseType = string | string[] | number | unknown | undefined;

export interface ICreateCourse extends Record<string, courseType> {
  // [key: string]: string | string[] | number | undefined;
  instructorId?: string;
  profilePicture?: string;
  title: string;
  categories: string;
  description: string;
  subCategories: string[];
  tags: string[];
  price: number;
  coverImage: string;
  expectedDuration: string;
  basicTitle: string;
  basicDescription: string;
}

export interface InstructorCourse {
  _id?: string;
  id?: string;
  instructorId?: string;
  title: string;
  username?: string;
  profilePicture?: string;
  email?: string;
  description: string;
  active?: boolean;
  categories: string;
  subCategories: string[];
  tags: string[];
  ratingsCount?: number;
  ratingSum?: number;
  ratingCategories?: IRatingCategories;
  expectedDuration: string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  coverImage: string;
  createdAt?: Date | string;
  sortId?: number;
}

export interface ISelectedBudget {
  minPrice: string;
  maxPrice: string;
}

export interface ICourseViewReviewsProps {
  showRatings: boolean;
  reviews?: IReviewDocument[];
  hasFetchedReviews?: boolean;
}

export interface ICourseContext {
  course: InstructorCourse;
  instructor: InstructorDocument;
  isSuccess?: boolean;
  isLoading?: boolean;
}

export interface ICourseInfo {
  total: number | string;
  title: string;
  bgColor: string;
}

export interface ICourseCardItems {
  course: InstructorCourse;
  linkTarget: boolean;
  showEditIcon: boolean;
}

export interface ICourseTopProps {
  courses: InstructorCourse[];
  title?: string;
  subTitle?: string;
  category?: string;
  width: string;
  type: string;
}
