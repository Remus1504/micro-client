import { FC, ReactElement } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import {
  ICoursesProps,
  InstructorCourse,
} from "src/features/courses/interfaces/course.interface";
import { rating, replaceSpacesWithDash } from "src/shared/utils/utils";

const CourseIndexItem: FC<ICoursesProps> = ({ course }): ReactElement => {
  const courseData: InstructorCourse = course as InstructorCourse;
  const title: string = replaceSpacesWithDash(courseData.title);
  console.log(title);

  return (
    <div className="rounded">
      <div className="mb-8 flex cursor-pointer flex-col gap-2">
        <Link to={`/course/${courseData.id}/${title}`}>
          <LazyLoadImage
            src={courseData.coverImage}
            alt="Course cover image"
            className="w-full rounded-lg"
            placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
            effect="blur"
          />
        </Link>
        <div className="flex items-center gap-2">
          <LazyLoadImage
            src={courseData.profilePicture}
            alt="profile"
            className="h-7 w-7 rounded-full object-cover"
            placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
            effect="blur"
          />
          <div className="flex w-full justify-between">
            <span className="text-md hover:underline">
              <strong className="text-sm font-medium md:text-base">
                {courseData.username}
              </strong>
            </span>
          </div>
        </div>
        <div>
          <Link to={`/course/${courseData.id}/${title}`}>
            <p className="line-clamp-2 text-sm text-[#404145] hover:underline md:text-base">
              {courseData.basicDescription}
            </p>
          </Link>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          {parseInt(`${courseData.ratingsCount}`) > 0 ? (
            <FaStar />
          ) : (
            <FaRegStar />
          )}
          <strong className="text-sm font-bold">
            (
            {rating(
              parseInt(`${courseData.ratingSum}`) /
                parseInt(`${courseData.ratingsCount}`)
            )}
            )
          </strong>
        </div>
        <div>
          <strong className="text-sm font-bold md:text-base">
            From ${courseData.price}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default CourseIndexItem;
