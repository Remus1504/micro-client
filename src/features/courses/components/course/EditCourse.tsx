import Quill from "quill";
import { ChangeEvent, FC, ReactElement, useRef, useState } from "react";
import equal from "react-fast-compare";
import { FaCamera } from "react-icons/fa";
import ReactQuill, { UnprivilegedEditor } from "react-quill";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Breadcrumb from "src/shared/breadcrumb/breadcrumb";
import Button from "src/shared/Button/Button";
import Dropdown from "src/shared/dropdown/dropdown";
import TextAreaInput from "src/shared/Entries/TextAreaInput";
import TextInput from "src/shared/Entries/Input";
import ApprovalModal from "src/shared/modals/Approval";
import { IApprovalModalContent } from "src/shared/modals/interfaces/modal.interface";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import { IResponse } from "src/shared/shared.interface";
import { checkImage, readAsBase64 } from "src/shared/utils/image-util.service";
import {
  categories,
  expectedCourseDuration,
  lowerCase,
  reactQuillUtils,
  replaceSpacesWithDash,
  showErrorToast,
  showSuccessToast,
} from "src/shared/utils/utils";
import { useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";

import { useCourseSchema } from "../../hooks/useCourseSchema";
import {
  COURSE_MAX_LENGTH,
  IAllowedCourseItem,
  ICreateCourse,
  InstructorCourse,
  IShowCourseModal,
} from "../../interfaces/course.interface";
import { courseInfoSchema } from "../../schemes/course.schema";
import { useUpdateCourseMutation } from "../../services/course.service";
import TagsInput from "./components/TagsInput";

const EditCourse: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const { state }: { state: InstructorCourse } = useLocation();
  const defaultCourseInfo: ICreateCourse = {
    title: state?.title,
    categories: state?.categories,
    description: state?.description,
    subCategories: state?.subCategories,
    tags: state?.tags,
    price: state?.price,
    coverImage: state?.coverImage,
    expectedDuration: state?.expectedDuration,
    basicTitle: state?.basicTitle,
    basicDescription: state?.basicDescription,
  };
  const [courseInfo, setCourseInfo] =
    useState<ICreateCourse>(defaultCourseInfo);
  const [subCategory, setSubCategory] = useState<string[]>(
    state?.subCategories,
  );
  const [subCategoryInput, setSubCategoryInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>(state?.tags);
  const [tagsInput, setTagsInput] = useState<string>("");
  const [showCourseModal, setShowCourseModal] = useState<IShowCourseModal>({
    image: false,
    cancel: false,
  });
  const reactQuillRef = useRef<ReactQuill | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [allowedCourseItemLength, setAllowedCourseItemLength] =
    useState<IAllowedCourseItem>({
      courseTitle: `${COURSE_MAX_LENGTH.courseTitle - state?.title.length}/80`,
      basicTitle: `${
        COURSE_MAX_LENGTH.basicTitle - state?.basicTitle.length
      }/40`,
      basicDescription: `${
        COURSE_MAX_LENGTH.basicDescription - state?.basicDescription.length
      }/100`,
      descriptionCharacters: `${
        COURSE_MAX_LENGTH.fullDescription - state?.description.length
      }/1200`,
    });
  const courseInfoRef = useRef<ICreateCourse>(defaultCourseInfo);
  const [approvalModalContent, setApprovalModalContent] =
    useState<IApprovalModalContent>();
  const navigate: NavigateFunction = useNavigate();
  const { courseId } = useParams<string>();
  const [schemaValidation] = useCourseSchema({
    schema: courseInfoSchema,
    courseInfo,
  });
  const [updateGig, { isLoading }] = useUpdateCourseMutation();

  const handleFileChange = async (event: ChangeEvent): Promise<void> => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.files) {
      const file: File = target.files[0];
      const isValid = checkImage(file, "image");
      if (isValid) {
        const dataImage: string | ArrayBuffer | null = await readAsBase64(file);
        setCourseInfo({ ...courseInfo, coverImage: `${dataImage}` });
      }
      setShowCourseModal({ ...showCourseModal, image: false });
    }
  };

  const onEditCourse = async (): Promise<void> => {
    try {
      const editor: Quill | undefined = reactQuillRef?.current?.editor;
      // In React, it is not recommended to mutate objects directly. It is better to update with useState method.
      // The reason it is not recommended is because if the object is mutated directly,
      // 1) React is not able to keep track of the change
      // 2) There will be no re-renderng of the component.
      // In our case, we don't care about the above reasons because we update a property, validate and send to the backend.
      // The updated properly is not reflected in the component and we don't need to keep track of the object.
      // We are not using the useState method inside useEffect because it causes too many rerender errors.
      // Also, we are not updating the property inside the onChange method because editor?.getText() causes too many rerender errors.
      // The only option we have right now is to directly mutate the courseInfo useState object.
      courseInfo.description = editor?.getText().trim() as string;
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        const course: ICreateCourse = {
          title: courseInfo.title,
          categories: courseInfo.categories,
          description: courseInfo.description,
          subCategories: subCategory,
          tags,
          price: courseInfo.price,
          coverImage: courseInfo.coverImage,
          expectedDuration: courseInfo.expectedDuration,
          basicTitle: courseInfo.basicTitle,
          basicDescription: courseInfo.basicDescription,
        };
        const response: IResponse = await updateGig({
          courseId: `${courseId}`,
          course,
        }).unwrap();
        const title: string = replaceSpacesWithDash(course.title);
        showSuccessToast("Updated course successfully.");
        navigate(
          `/course/${lowerCase(`${authUser.username}`)}/${title}/${
            response?.course?.instructorId
          }/${response?.course?.id}/view`,
        );
      }
    } catch (error) {
      showErrorToast("Error updating course");
    }
  };

  const onCancelEdit = (): void => {
    navigate(
      `/instructor_profile/${lowerCase(
        `${authUser.username}/${state.instructorId}/edit`,
      )}`,
    );
  };

  return (
    <>
      {showCourseModal.cancel && (
        <ApprovalModal
          approvalModalContent={approvalModalContent}
          onClose={() =>
            setShowCourseModal({ ...showCourseModal, cancel: false })
          }
          onClick={onCancelEdit}
        />
      )}
      <div className="relative w-screen">
        <Breadcrumb breadCrumbItems={["Instructor", "Edit course"]} />
        <div className="container relative mx-auto my-5 px-2 pb-12 md:px-0">
          {isLoading && <CircularPageLoader />}
          <div className="border-grey left-0 top-0 z-10 mt-4 block rounded border bg-white p-6">
            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Course title
                <sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <TextInput
                  className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
                  type="text"
                  name="courseTitle"
                  value={courseInfo.title}
                  placeholder="I will build something I'm good at."
                  maxLength={80}
                  onChange={(event: ChangeEvent) => {
                    const courseTitleValue: string = (
                      event.target as HTMLInputElement
                    ).value;
                    setCourseInfo({ ...courseInfo, title: courseTitleValue });
                    const counter: number =
                      COURSE_MAX_LENGTH.courseTitle - courseTitleValue.length;
                    setAllowedCourseItemLength({
                      ...allowedCourseItemLength,
                      courseTitle: `${counter}/80`,
                    });
                  }}
                />
                <span className="flex justify-end text-xs text-[#95979d]">
                  {allowedCourseItemLength.courseTitle} Characters
                </span>
              </div>
            </div>
            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Basic title
                <sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <TextInput
                  className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
                  placeholder="Write what exactly you'll do in short."
                  type="text"
                  name="basicTitle"
                  value={courseInfo.basicTitle}
                  maxLength={40}
                  onChange={(event: ChangeEvent) => {
                    const basicTitleValue: string = (
                      event.target as HTMLInputElement
                    ).value;
                    setCourseInfo({
                      ...courseInfo,
                      basicTitle: basicTitleValue,
                    });
                    const counter: number =
                      COURSE_MAX_LENGTH.basicTitle - basicTitleValue.length;
                    setAllowedCourseItemLength({
                      ...allowedCourseItemLength,
                      basicTitle: `${counter}/40`,
                    });
                  }}
                />
                <span className="flex justify-end text-xs text-[#95979d]">
                  {allowedCourseItemLength.basicTitle} Characters
                </span>
              </div>
            </div>
            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Brief description
                <sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <TextAreaInput
                  className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
                  placeholder="Write a brief description..."
                  name="basicDescription"
                  value={courseInfo.basicDescription}
                  rows={5}
                  maxLength={100}
                  onChange={(event: ChangeEvent) => {
                    const basicDescriptionValue: string = (
                      event.target as HTMLInputElement
                    ).value;
                    setCourseInfo({
                      ...courseInfo,
                      basicDescription: basicDescriptionValue,
                    });
                    const counter: number =
                      COURSE_MAX_LENGTH.basicDescription -
                      basicDescriptionValue.length;
                    setAllowedCourseItemLength({
                      ...allowedCourseItemLength,
                      basicDescription: `${counter}/100`,
                    });
                  }}
                />
                <span className="flex justify-end text-xs text-[#95979d]">
                  {allowedCourseItemLength.basicDescription} Characters
                </span>
              </div>
            </div>
            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Full description
                <sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <ReactQuill
                  theme="snow"
                  value={courseInfo.description}
                  className="border-grey border rounded"
                  modules={reactQuillUtils().modules}
                  formats={reactQuillUtils().formats}
                  ref={(element: ReactQuill | null) => {
                    reactQuillRef.current = element;
                    const reactQuillEditor = reactQuillRef.current?.getEditor();
                    reactQuillEditor?.on("text-change", () => {
                      if (
                        reactQuillEditor.getLength() >
                        COURSE_MAX_LENGTH.fullDescription
                      ) {
                        reactQuillEditor.deleteText(
                          COURSE_MAX_LENGTH.fullDescription,
                          reactQuillEditor.getLength(),
                        );
                      }
                    });
                  }}
                  onChange={(
                    event: string,
                    _,
                    __,
                    editor: UnprivilegedEditor,
                  ) => {
                    setCourseInfo({ ...courseInfo, description: event });
                    const counter: number =
                      COURSE_MAX_LENGTH.fullDescription -
                      editor.getText().length;
                    setAllowedCourseItemLength({
                      ...allowedCourseItemLength,
                      descriptionCharacters: `${counter}/1200`,
                    });
                  }}
                />
                <span className="flex justify-end text-xs text-[#95979d]">
                  {allowedCourseItemLength.descriptionCharacters} Characters
                </span>
              </div>
            </div>
            <div className="mb-12 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Category
                <sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="relative col-span-4 md:w-11/12 lg:w-8/12">
                <Dropdown
                  text={courseInfo.categories}
                  maxHeight="300"
                  mainClassNames="absolute bg-white"
                  values={categories()}
                  onClick={(item: string) => {
                    setCourseInfo({ ...courseInfo, categories: item });
                  }}
                />
              </div>
            </div>

            <TagsInput
              title="SubCategory"
              placeholder="E.g. Website development, Mobile apps"
              courseInfo={courseInfo}
              setCourseInfo={setCourseInfo}
              tags={subCategory}
              itemInput={subCategoryInput}
              itemName="subCategories"
              counterText="Subcategories"
              inputErrorMessage={false}
              setItem={setSubCategory}
              setItemInput={setSubCategoryInput}
            />

            <TagsInput
              title="Tags"
              placeholder="Enter search terms for your course"
              courseInfo={courseInfo}
              setCourseInfo={setCourseInfo}
              tags={tags}
              itemInput={tagsInput}
              itemName="tags"
              counterText="Tags"
              inputErrorMessage={false}
              setItem={setTags}
              setItemInput={setTagsInput}
            />

            <div className="mb-6 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Price
                <sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="col-span-4 md:w-11/12 lg:w-8/12">
                <TextInput
                  type="number"
                  className="border-grey mb-1 w-full rounded border p-3.5 text-sm font-normal text-gray-600 focus:outline-none"
                  placeholder="Enter minimum price"
                  name="price"
                  value={`${courseInfo.price}`}
                  onChange={(event: ChangeEvent) => {
                    const value: string = (event.target as HTMLInputElement)
                      .value;
                    setCourseInfo({
                      ...courseInfo,
                      price: parseInt(value) > 0 ? parseInt(value) : 0,
                    });
                  }}
                />
              </div>
            </div>
            <div className="mb-12 grid md:grid-cols-5">
              <div className="pb-2 text-base font-medium">
                Expected Duration
                <sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div className="relative col-span-4 md:w-11/12 lg:w-8/12">
                <Dropdown
                  text={courseInfo.expectedDuration}
                  maxHeight="300"
                  mainClassNames="absolute bg-white z-40"
                  values={expectedCourseDuration()}
                  onClick={(item: string) => {
                    setCourseInfo({ ...courseInfo, expectedDurationm: item });
                  }}
                />
              </div>
            </div>
            <div className="mb-6 grid md:grid-cols-5">
              <div className="mt-6 pb-2 text-base font-medium lg:mt-0">
                Cover image
                <sup className="top-[-0.3em] text-base text-red-500">*</sup>
              </div>
              <div
                className="relative col-span-4 cursor-pointer md:w-11/12 lg:w-8/12"
                onMouseEnter={() => {
                  setShowCourseModal((item) => ({
                    ...item,
                    image: !item.image,
                  }));
                }}
                onMouseLeave={() => {
                  setShowCourseModal((item) => ({ ...item, image: false }));
                }}
              >
                {courseInfo.coverImage && (
                  <img
                    src={courseInfo.coverImage}
                    alt="Cover Image"
                    className="left-0 top-0 h-[220px] w-[320px] bg-white object-cover"
                  />
                )}
                {!courseInfo.coverImage && (
                  <div className="left-0 top-0 flex h-[220px] w-[320px] cursor-pointer justify-center bg-[#dee1e7]"></div>
                )}
                {showCourseModal.image && (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="absolute left-0 top-0 flex h-[220px] w-[320px] cursor-pointer justify-center bg-[#dee1e7]"
                  >
                    <FaCamera className="flex self-center" />
                  </div>
                )}
                <TextInput
                  name="image"
                  ref={fileRef}
                  type="file"
                  style={{ display: "none" }}
                  onClick={() => {
                    if (fileRef.current) {
                      fileRef.current.value = "";
                    }
                  }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="grid xs:grid-cols-1 md:grid-cols-5">
              <div className="pb-2 text-base font-medium lg:mt-0"></div>
              <div className="col-span-4 flex gap-x-4 md:w-11/12 lg:w-8/12">
                <Button
                  disabled={isLoading}
                  className="rounded bg-sky-500 px-8 py-3 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-3 md:text-base"
                  label="Edit Course"
                  onClick={onEditCourse}
                />
                <Button
                  disabled={isLoading}
                  className="rounded bg-red-500 px-8 py-3 text-center text-sm font-bold text-white hover:bg-red-400 focus:outline-none md:py-3 md:text-base"
                  label="Cancel"
                  onClick={() => {
                    const isEqual: boolean = equal(
                      courseInfo,
                      courseInfoRef.current,
                    );
                    if (!isEqual) {
                      setApprovalModalContent({
                        header: "Cancel Course Edit",
                        body: "Are you sure you want to cancel?",
                        btnText: "Yes, Cancel",
                        btnColor: "bg-red-500 hover:bg-red-400",
                      });
                      setShowCourseModal({ ...showCourseModal, cancel: true });
                    } else {
                      onCancelEdit();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCourse;
