import { FC, ReactElement, useContext } from "react";
import { useParams } from "react-router-dom";
import { CourseContext } from "src/features/courses/context/CourseContext";
import { ICourseViewReviewsProps } from "src/features/courses/interfaces/course.interface";
import {
  IRatingCategories,
  IRatingCategoryItem,
  IReviewDocument,
} from "src/features/enrolment/interfaces/review.interface";
import { useGetReviewsByCourseIdQuery } from "src/features/enrolment/services/review.service";
import StarRating from "src/shared/rating/rating";
import { ratingTypes } from "src/shared/utils/static";
import { TimeAgo } from "src/shared/utils/time.utils";
import { rating, shortenLargeNumbers } from "src/shared/utils/utils";
import { v4 as uuidv4 } from "uuid";

const CourseViewReviews: FC<ICourseViewReviewsProps> = ({
  showRatings,
  reviews,
  hasFetchedReviews,
}): ReactElement => {
  const { courseId } = useParams<string>();
  const { course } = useContext(CourseContext);
  const { data, isSuccess } = useGetReviewsByCourseIdQuery(`${courseId}`, {
    skip: hasFetchedReviews,
  });
  if (isSuccess && !hasFetchedReviews) {
    reviews = data.reviews as IReviewDocument[];
  }

  const percentage = (partialValue: number, totalValue: number): number => {
    return (100 * partialValue) / totalValue;
  };

  return (
    <>
      {showRatings && course && (
        <>
          <div className="mb-10">
            <h2 className="mb-4 text-lg font-bold">Reviews</h2>
            <div className="flex flex-col gap-y-3 pt-2 lg:flex-row lg:gap-x-6">
              <div className="w-full">
                {Object.entries(
                  course?.ratingCategories as IRatingCategories
                ).map((rating: [string, IRatingCategoryItem]) => (
                  <div
                    key={uuidv4()}
                    className="mb-8 flex flex-col gap-y-2 lg:flex-row lg:gap-x-2"
                  >
                    <div className="w-full truncate text-sm lg:w-1/12">
                      {ratingTypes[`${rating[0]}`]} Star
                      {rating[0] === "one" ? "" : "s"}
                    </div>
                    <div className="flex h-2.5 w-full self-center rounded-full bg-slate-200 lg:w-full">
                      <div
                        className="h-2.5 rounded-full bg-orange-400"
                        style={{
                          width: `${percentage(
                            rating[1].value,
                            parseInt(`${course?.ratingSum}`)
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="w-full text-start text-sm lg:w-1/12 lg:text-end">
                      ({shortenLargeNumbers(rating[1].count)})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr className="border-grey my-3" />
        </>
      )}

      <div className="flex flex-col gap-6">
        {reviews &&
          reviews.map((item: IReviewDocument) => (
            <div key={uuidv4()}>
              <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-4">
                <img
                  className="flex self-center h-12 w-12 mt-4 rounded-full object-cover md:self-auto"
                  src={item.reviewerImage}
                  alt="Reviewer Image"
                />
                <div className="flex flex-col self-center">
                  <div className="flex cursor-pointer self-center pt-0 no-underline md:block md:self-start md:pt-4">
                    <span className="text-base font-bold md:mb-5">
                      {item.reviewerUsername}
                    </span>
                  </div>
                  <span className="flex self-center text-sm md:block md:self-start">
                    {item.country}
                  </span>
                  <div className="flex w-full gap-x-1 self-center justify-center md:justify-start">
                    <div className="mt-1 w-20 gap-x-2">
                      <StarRating value={rating(item.rating)} size={14} />
                    </div>
                    <div className="ml-2 mt-[1px] flex gap-1 text-sm">
                      <span className="text-orange-400">
                        {rating(item.rating)}
                      </span>
                      |
                      <span>
                        {TimeAgo.chatMessageTransform(`${item.createdAt}`)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-center md:text-base md:text-left">
                    {item.review}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default CourseViewReviews;
