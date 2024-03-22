import { FC, ReactElement, useEffect, useState } from "react";
import equal from "react-fast-compare";
import { useParams } from "react-router-dom";
import CourseViewReviews from "src/features/courses/components/view/components/CourseViewLeft/CourseViewReviews";
import { InstructorCourse } from "src/features/courses/interfaces/course.interface";
import { useGetCoursesByInstructorIdQuery } from "src/features/courses/services/course.service";
import { IReviewDocument } from "src/features/enrolment/interfaces/review.interface";
import { useGetReviewsByInstructorIdQuery } from "src/features/enrolment/services/review.service";
import Breadcrumb from "src/shared/breadcrumb/breadcrumb";
import Button from "src/shared/Button/Button";
import CourseCardDisplayItem from "src/shared/courses/CourseCardDisplayItem";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import { IResponse } from "src/shared/shared.interface";
import { showErrorToast, showSuccessToast } from "src/shared/utils/utils";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";
import { v4 as uuidv4 } from "uuid";

import { InstructorDocument } from "../../interfaces/instructor.interface";
import { addInstructor } from "../../reducers/instructor.reducer";
import { useUpdateInstructorMutation } from "../../services/Instructor.service";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import InstructorOverview from "./components/InstructorOverview";

const CurrentInstructorProfile: FC = (): ReactElement => {
  const instructor = useAppSelector((state: IReduxState) => state.instructor);
  const [instructorProfile, setInstructorProfile] =
    useState<InstructorDocument>(instructor);
  const [showEdit, setShowEdit] = useState<boolean>(true);
  const [type, setType] = useState<string>("Overview");
  const { instructorId } = useParams();
  const dispatch = useAppDispatch();
  const {
    data,
    isSuccess: isInstructorCourseSuccess,
    isLoading: isInstructorCourseLoading,
  } = useGetCoursesByInstructorIdQuery(`${instructorId}`);
  const {
    data: instructorData,
    isSuccess: isCourseReviewSuccess,
    isLoading: isCourseReviewLoading,
  } = useGetReviewsByInstructorIdQuery(`${instructorId}`);
  const [updateInstructor, { isLoading }] = useUpdateInstructorMutation();
  let reviews: IReviewDocument[] = [];
  if (isCourseReviewSuccess) {
    reviews = instructorData.reviews as IReviewDocument[];
  }

  const isDataLoading: boolean =
    isInstructorCourseLoading &&
    isCourseReviewLoading &&
    !isInstructorCourseSuccess &&
    !isCourseReviewSuccess;

  const onUpdateInstructor = async (): Promise<void> => {
    try {
      const response: IResponse = await updateInstructor({
        instructorId: `${instructorId}`,
        instructor: instructorProfile,
      }).unwrap();
      console.log(instructorId);
      dispatch(addInstructor(response.instructor));
      setInstructorProfile(response.instructor as InstructorDocument);
      setShowEdit(false);
      showSuccessToast("Instructor profile updated successfully.");
    } catch (error) {
      showErrorToast("Error updating profile.");
    }
  };

  useEffect(() => {
    const isEqual: boolean = equal(instructorProfile, instructor);
    setShowEdit(isEqual);
  }, [instructor, instructorProfile]);

  return (
    <div className="relative w-full pb-6">
      <Breadcrumb breadCrumbItems={["Instructor", `${instructor.username}`]} />
      {isLoading || isDataLoading ? (
        <CircularPageLoader />
      ) : (
        <div className="container mx-auto px-2 md:px-0">
          <div className="my-2 flex h-8 justify-end md:h-10">
            {!showEdit && (
              <div>
                <Button
                  className="md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-2"
                  label="Update"
                  onClick={onUpdateInstructor}
                />
                &nbsp;&nbsp;
                <Button
                  className="md:text-md rounded bg-red-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-red-500 focus:outline-none md:py-2"
                  label="Cancel"
                  onClick={() => {
                    setShowEdit(false);
                    setInstructorProfile(instructor);
                    dispatch(addInstructor(instructor));
                  }}
                />
              </div>
            )}
          </div>
          <ProfileHeader
            instructorProfile={instructorProfile}
            setInstructorProfile={setInstructorProfile}
            showHeaderInfo={true}
            showEditIcons={true}
          />
          <div className="my-4 cursor-pointer">
            <ProfileTabs type={type} setType={setType} />
          </div>

          <div className="flex flex-wrap bg-white">
            {type === "Overview" && (
              <InstructorOverview
                instructorProfile={instructorProfile}
                setInstructorProfile={setInstructorProfile}
                showEditIcons={true}
              />
            )}
            {type === "Active Courses" && (
              <div className="grid gap-x-6 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {data?.courses &&
                  data?.courses.map((course: InstructorCourse) => (
                    <CourseCardDisplayItem
                      key={uuidv4()}
                      course={course}
                      linkTarget={false}
                      showEditIcon={true}
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

export default CurrentInstructorProfile;
