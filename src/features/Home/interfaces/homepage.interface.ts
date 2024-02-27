import { InstructorCourse } from "src/features/courses/interfaces/course.interface";
import { InstructorDocument } from "src/features/instructors/interfaces/instructor.interface";

export interface IHomeProps {
  courses: InstructorCourse[];
  title: string;
  subTitle?: string;
  category?: string;
}

export interface ISliderState {
  slideShow: string;
  slideIndex: number;
}

export interface IFeaturedExpertProps {
  instructors: InstructorDocument[];
}

export interface ICategory {
  name: string;
  icon: string;
}
