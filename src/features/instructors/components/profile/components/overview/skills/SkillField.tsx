import { cloneDeep, filter, findIndex } from "lodash";
import { ChangeEvent, FC, ReactElement, useContext, useState } from "react";
import { instructorContext } from "src/features/instructors/context/InstructorContext";
import { ISkillEditProps } from "src/features/instructors/interfaces/instructor.interface";
import Button from "src/shared/Button/Button";
import TextInput from "src/shared/Entries/Input";

const SkillField: FC<ISkillEditProps> = ({
  type,
  selectedSkill,
  setShowSkillAddForm,
  setShowSkillEditForm,
}): ReactElement => {
  const { instructorProfile, setInstructorProfile } =
    useContext(instructorContext);
  const [skill, setSkill] = useState<string>(selectedSkill ?? "");

  const onHandleUpdate = (): void => {
    if (type === "add") {
      const clonedSkills: string[] = cloneDeep(
        instructorProfile?.skills
      ) as string[];
      clonedSkills.push(skill);
      if (setInstructorProfile && setShowSkillAddForm) {
        setInstructorProfile({ ...instructorProfile, skills: clonedSkills });
        setShowSkillAddForm(false);
      }
    } else {
      const itemIndex: number = findIndex(
        instructorProfile.skills,
        (value: string) => value === selectedSkill
      );
      const clonedSkills: string[] = cloneDeep(
        instructorProfile?.skills
      ) as string[];
      clonedSkills.splice(itemIndex, 1, skill);
      const filtered: string[] = filter(
        clonedSkills,
        (item: string) => item !== ""
      );
      if (setInstructorProfile && setShowSkillEditForm) {
        setInstructorProfile({ ...instructorProfile, skills: filtered });
        setShowSkillEditForm(false);
      }
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 px-3">
        <TextInput
          className="border-grey w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
          placeholder="Skill E.g: Front End Developer"
          type="text"
          name="skill"
          value={skill}
          onChange={(event: ChangeEvent) =>
            setSkill((event.target as HTMLInputElement).value)
          }
        />
      </div>
      <div className="z-20 mx-3 my-2 flex cursor-pointer justify-start md:z-0 md:mt-0">
        <Button
          disabled={!skill && type === "add"}
          className={`md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-2
          ${
            !skill && type === "add"
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer"
          }
          `}
          label={`${type === "add" ? "Add" : "Update"}`}
          onClick={onHandleUpdate}
        />
        &nbsp;&nbsp;
        <Button
          className="md:text-md rounded bg-gray-300 px-6 py-1 text-center text-sm font-bold hover:bg-gray-200 focus:outline-none md:py-2"
          label="Cancel"
          onClick={() => {
            if (type === "add" && setShowSkillAddForm) {
              setShowSkillAddForm(false);
            } else if (type === "edit" && setShowSkillEditForm) {
              setShowSkillEditForm(false);
            }
          }}
        />
      </div>
    </div>
  );
};

export default SkillField;
