import { FC, ReactElement, useState } from "react";
import { useParams } from "react-router-dom";
import CourseViewReviews from "src/features/courses/components/view/components/CourseViewLeft/CourseViewReviews";
import { InstructorCourse } from "src/features/courses/interfaces/course.interface";
import { useGetCoursesByInstructorIdQuery } from "src/features/courses/services/course.service";
import { IReviewDocument } from "src/features/enrolment/interfaces/review.interface";
import { useGetReviewsByInstructorIdQuery } from "src/features/enrolment/services/review.service";
import Breadcrumb from "src/shared/breadcrumb/breadcrumb";
import CourseCardDisplayItem from "src/shared/courses/CourseCardDisplayItem";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import { v4 as uuidv4 } from "uuid";

import { useGetInstructorByIdQuery } from "../../services/Instructor.service";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import InstructorOverview from "./components/InstructorOverview";

const InstructorProfile: FC = (): ReactElement => {
  const [type, setType] = useState<string>("Overview");
  const { instructorId } = useParams();
  const {
    data: instructorData,
    isLoading: isInstructorLoading,
    isSuccess: isInstructorSuccess,
  } = useGetInstructorByIdQuery(`${instructorId}`);
  const {
    data: courseData,
    isSuccess: isInstructorCourseSuccess,
    isLoading: isInstructorCourseLoading,
  } = useGetCoursesByInstructorIdQuery(`${instructorId}`);
  const {
    data: instructorReviewsData,
    isSuccess: isCourseReviewSuccess,
    isLoading: isCourseReviewLoading,
  } = useGetReviewsByInstructorIdQuery(`${instructorId}`);
  let reviews: IReviewDocument[] = [];
  if (isCourseReviewSuccess) {
    reviews = instructorReviewsData.reviews as IReviewDocument[];
  }

  const isLoading: boolean =
    isInstructorCourseLoading &&
    isInstructorLoading &&
    isCourseReviewLoading &&
    !isInstructorSuccess &&
    !isInstructorCourseSuccess &&
    !isCourseReviewSuccess;

  return (
    <div className="relative w-full pb-6">
      <Breadcrumb
        breadCrumbItems={[
          "Instructor",
          `${
            instructorData && instructorData.instructor
              ? instructorData.instructor.username
              : ""
          }`,
        ]}
      />
      {isLoading ? (
        <CircularPageLoader />
      ) : (
        <div className="container mx-auto px-2 md:px-0">
          <ProfileHeader
            instructorProfile={instructorData?.instructor}
            showHeaderInfo={true}
            showEditIcons={false}
          />
          <div className="my-4 cursor-pointer">
            <ProfileTabs type={type} setType={setType} />
          </div>

          <div className="flex flex-wrap bg-white">
            {type === "Overview" && (
              <InstructorOverview
                instructorProfile={instructorData?.instructor}
                showEditIcons={false}
              />
            )}
            {type === "Active Courses" && (
              <div className="grid gap-x-6 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {courseData?.courses &&
                  courseData?.courses.map((course: InstructorCourse) => (
                    <CourseCardDisplayItem
                      key={uuidv4()}
                      course={course}
                      linkTarget={false}
                      showEditIcon={false}
                    />
                  ))}
              </div>
            )}
            {type === "Ratings & Reviews" && (
              <CourseViewReviews
                showRatings={false}
                reviews={reviews}
                hasFetchedReviews={true}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorProfile;
