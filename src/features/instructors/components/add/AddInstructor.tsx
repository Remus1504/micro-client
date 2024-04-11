import { filter } from "lodash";
import { FC, FormEvent, ReactElement, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { StudentDocument } from "src/features/student/interfaces/student.interface";
import { addStudent } from "src/features/student/reducers/student.reducer";
import Breadcrumb from "src/shared/breadcrumb/breadcrumb";
import Button from "src/shared/Button/Button";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import { IResponse } from "src/shared/shared.interface";
import {
  deleteFromLocalStorage,
  lowerCase,
  showErrorToast,
} from "src/shared/utils//utils";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";

import { useInstructorSchema } from "../../hooks/useInstructorSchema";
import {
  ICertificate,
  IEducation,
  IExperience,
  ILanguage,
  IPersonalInfoData,
  InstructorDocument,
} from "../../interfaces/instructor.interface";
import { addInstructor } from "../../reducers/instructor.reducer";
import { useCreateInstructorMutation } from "../../services/Instructor.service";
import PersonalInfo from "./components/PersonalInfo";
import InstructorCertificateFields from "./components/InstructorCertificateFields";
import InstructorEducationFields from "./components/InstructorEducationFields";
import InstructorExperienceFields from "./components/InstructorExperienceFields";
import InstructorLanguagesFields from "./components/InstructorLanguagesFields";
import InstructorSkillField from "./components/InstructorSkillField";
import InstructorSocialLinksField from "./components/InstructorSocialLinksFields";

const AddInstructor: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const student = useAppSelector((state: IReduxState) => state.student);
  const [personalInfo, setPersonalInfo] = useState<IPersonalInfoData>({
    fullName: "",
    profilePicture: `${authUser.profilePicture}`,
    description: "",
    responseTime: "",
    oneliner: "",
  });
  const [experienceFields, setExperienceFields] = useState<IExperience[]>([
    {
      title: "",
      company: "",
      startDate: "Start Year",
      endDate: "End Year",
      currentlyWorkingHere: false,
      description: "",
    },
  ]);
  const [educationFields, setEducationFields] = useState<IEducation[]>([
    {
      country: "Country",
      university: "",
      title: "Title",
      major: "",
      year: "Year",
    },
  ]);
  const [skillsFields, setSkillsFields] = useState<string[]>([""]);
  const [languageFields, setLanguageFields] = useState<ILanguage[]>([
    {
      language: "",
      level: "Level",
    },
  ]);
  const [certificateFields, setCertificateFields] = useState<ICertificate[]>([
    {
      name: "",
      from: "",
      year: "Year",
    },
  ]);
  const [socialFields, setSocialFields] = useState<string[]>([""]);
  const [
    schemaValidation,
    personalInfoErrors,
    experienceErrors,
    educationErrors,
    skillsErrors,
    languagesErrors,
  ] = useInstructorSchema({
    personalInfo,
    experienceFields,
    educationFields,
    skillsFields,
    languageFields,
  });
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [createInstructor, { isLoading }] = useCreateInstructorMutation();

  const errors = [
    ...personalInfoErrors,
    ...experienceErrors,
    ...educationErrors,
    ...skillsErrors,
    ...languagesErrors,
  ];

  const onCreateInstructor = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        const skills: string[] = filter(
          skillsFields,
          (skill: string) => skill !== "",
        ) as string[];
        const socialLinks: string[] = filter(
          socialFields,
          (item: string) => item !== "",
        ) as string[];
        const certificates: ICertificate[] = filter(
          certificateFields,
          (item: ICertificate) =>
            item.name !== "" && item.from !== "" && item.year !== "",
        ) as ICertificate[];
        const instructorData: InstructorDocument = {
          email: `${authUser.email}`,
          profilePublicId: `${authUser.profilePublicId}`,
          profilePicture: `${authUser.profilePicture}`,
          fullName: personalInfo.fullName,
          description: personalInfo.description,
          country: `${authUser.country}`,
          skills,
          oneliner: personalInfo.oneliner,
          languages: languageFields,
          responseTime: parseInt(personalInfo.responseTime, 10),
          experience: experienceFields,
          education: educationFields,
          socialLinks,
          certificates,
        };
        const updateStudent: StudentDocument = {
          ...student,
          isInstructor: true,
        };
        const response: IResponse =
          await createInstructor(instructorData).unwrap();
        dispatch(addInstructor(response.instructor));
        dispatch(addStudent(updateStudent));
        console.log(response);
        navigate(
          `/instructor_profile/${lowerCase(`${authUser.username}`)}/${
            response.instructor?._id
          }/edit`,
        );
      }
    } catch (error) {
      showErrorToast("Error creating instructor profile.");
    }
  };

  useEffect(() => {
    return () => {
      // delete becomeAInstructor from localStorage when user leaves this page
      deleteFromLocalStorage("becomeAInstructor");
    };
  }, []);

  return (
    <div className="relative w-full">
      <Breadcrumb breadCrumbItems={["Instructor", "Create Profile"]} />
      <div className="container mx-auto my-5 overflow-hidden px-2 pb-12 md:px-0">
        {isLoading && <CircularPageLoader />}
        {authUser && !authUser.emailVerified && (
          <div className="absolute left-0 top-0 z-50 flex h-full w-full justify-center bg-white/[0.8] text-sm font-bold md:text-base lg:text-xl">
            <span className="mt-20">Please verify your email.</span>
          </div>
        )}

        <div className="left-0 top-0 z-10 mt-4 block h-full bg-white">
          {errors.length > 0 ? (
            <div className="text-red-400">{`You have ${errors.length} error${
              errors.length > 1 ? "s" : ""
            }`}</div>
          ) : (
            <></>
          )}
          <PersonalInfo
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
            personalInfoErrors={personalInfoErrors}
          />
          <InstructorExperienceFields
            experienceFields={experienceFields}
            setExperienceFields={setExperienceFields}
            experienceErrors={experienceErrors}
          />
          <InstructorEducationFields
            educationFields={educationFields}
            setEducationFields={setEducationFields}
            educationErrors={educationErrors}
          />
          <InstructorSkillField
            skillsFields={skillsFields}
            setSkillsFields={setSkillsFields}
            skillsErrors={skillsErrors}
          />
          <InstructorLanguagesFields
            languageFields={languageFields}
            setLanguageFields={setLanguageFields}
            languagesErrors={languagesErrors}
          />
          <InstructorCertificateFields
            certificatesFields={certificateFields}
            setCertificatesFields={setCertificateFields}
          />
          <InstructorSocialLinksField
            socialFields={socialFields}
            setSocialFields={setSocialFields}
          />
          <div className="flex justify-end p-6">
            <Button
              onClick={onCreateInstructor}
              className="rounded bg-sky-500 px-8 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-3 md:text-base"
              label="Create Profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInstructor;
