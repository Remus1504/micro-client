import { cloneDeep, filter, findIndex } from "lodash";
import { ChangeEvent, FC, ReactElement, useContext, useState } from "react";
import { instructorContext } from "src/features/instructors/context/InstructorContext";
import { ISocialEditLinksProps } from "src/features/instructors/interfaces/instructor.interface";
import Button from "src/shared/Button/Button";
import TextInput from "src/shared/Entries/Input";

const SocialLinksEditField: FC<ISocialEditLinksProps> = ({
  type,
  selectedLink,
  setShowSocialLinksAddForm,
  setShowSocialLinksEditForm,
}): ReactElement => {
  const [socialLink, setSocialLink] = useState<string>(
    selectedLink ? `${selectedLink}` : ""
  );
  const { instructorProfile, setInstructorProfile } =
    useContext(instructorContext);

  const onHandleUpdate = (): void => {
    if (type === "add") {
      const clonedSocialLinks: string[] = cloneDeep(
        instructorProfile.socialLinks
      ) as string[];
      clonedSocialLinks.push(socialLink);
      if (setInstructorProfile && setShowSocialLinksAddForm) {
        setInstructorProfile({
          ...instructorProfile,
          socialLinks: clonedSocialLinks,
        });
        setShowSocialLinksAddForm(false);
      }
    } else {
      const itemIndex: number = findIndex(
        instructorProfile?.socialLinks,
        (value: string) => value === selectedLink
      );
      const clonedSocialLinks: string[] = cloneDeep(
        instructorProfile?.socialLinks
      ) as string[];
      clonedSocialLinks.splice(itemIndex, 1, socialLink);
      const filtered = filter(clonedSocialLinks, (item: string) => item !== "");
      if (setInstructorProfile && setShowSocialLinksEditForm) {
        setInstructorProfile({ ...instructorProfile, socialLinks: filtered });
        setShowSocialLinksEditForm(false);
      }
    }
  };

  const onCancelUpdate = (): void => {
    if (type === "add" && setShowSocialLinksAddForm) {
      setShowSocialLinksAddForm(false);
    } else if (type === "edit" && setShowSocialLinksEditForm) {
      setShowSocialLinksEditForm(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 px-3">
        <TextInput
          className="border-grey w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
          placeholder="Social media link"
          type="text"
          name="socialLink"
          value={socialLink}
          onChange={(event: ChangeEvent) => {
            setSocialLink((event.target as HTMLInputElement).value);
          }}
        />
      </div>
      <div className="z-20 my-4 mt-10 flex cursor-pointer justify-center md:z-0 md:mt-0">
        <Button
          disabled={!socialLink && type === "add"}
          className={`md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white
          hover:bg-sky-400 focus:outline-none md:py-2 ${
            !socialLink && type === "add"
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer"
          }`}
          label={`${type === "add" ? "Add" : "Update"}`}
          onClick={onHandleUpdate}
        />
        &nbsp;&nbsp;
        <Button
          className="md:text-md rounded bg-gray-300 px-6 py-1 text-center text-sm font-bold hover:bg-gray-200 focus:outline-none md:py-2"
          label="Cancel"
          onClick={onCancelUpdate}
        />
      </div>
    </div>
  );
};

export default SocialLinksEditField;
