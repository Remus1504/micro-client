import { FC, ReactElement } from "react";
import { Outlet, useParams } from "react-router-dom";
import { InstructorCourse } from "src/features/courses/interfaces/course.interface";
import {
  useGetCoursesByInstructorIdQuery,
  useGetInstructorPausedCoursesQuery,
} from "src/features/courses/services/course.service";
import { IEnrolmentDocument } from "src/features/enrolment/interfaces/enrolment.interface";
import { useGetEnrolmentByInstructorIdQuery } from "src/features/enrolment/services/enrolment.service";
import DashboardHeader from "src/shared/header/components/DashboardHeader";

import { InstructorDocument } from "../../interfaces/instructor.interface";
import { useGetInstructorByIdQuery } from "../../services/Instructor.service";

const Instructor: FC = (): ReactElement => {
  const { instructorId } = useParams<string>();
  const { data, isSuccess } = useGetInstructorByIdQuery(`${instructorId}`);
  const { data: instructorCourses, isSuccess: isInstructorCoursesSucess } =
    useGetCoursesByInstructorIdQuery(`${instructorId}`);
  const {
    data: instructorPausedCourses,
    isSuccess: isInstructorPausedCoursesSuccess,
  } = useGetInstructorPausedCoursesQuery(`${instructorId}`);
  const { data: instructorOrders, isSuccess: isInstructorOrderSucess } =
    useGetEnrolmentByInstructorIdQuery(`${instructorId}`);
  let courses: InstructorCourse[] = [];
  let pausedCourses: InstructorCourse[] = [];
  let enrolments: IEnrolmentDocument[] = [];
  let instructor: InstructorDocument | undefined = undefined;

  if (isSuccess) {
    instructor = data?.instructor as InstructorDocument;
  }

  if (isInstructorCoursesSucess) {
    courses = instructorCourses?.courses as InstructorCourse[];
  }

  if (isInstructorPausedCoursesSuccess) {
    pausedCourses = instructorPausedCourses?.courses as InstructorCourse[];
  }

  if (isInstructorOrderSucess) {
    enrolments = instructorOrders?.enrolments as IEnrolmentDocument[];
  }

  return (
    <div className="relative w-screen">
      <DashboardHeader />
      <div className="m-auto px-6 w-screen xl:container md:px-12 lg:px-6 relative min-h-screen">
        <Outlet context={{ instructor, courses, pausedCourses, enrolments }} />
      </div>
    </div>
  );
};

export default Instructor;
