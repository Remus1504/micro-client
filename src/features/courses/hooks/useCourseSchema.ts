/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { validationErrorsType } from "src/shared/shared.interface";
import { ObjectSchema } from "yup";

import { ICreateCourse } from "../interfaces/course.interface";

interface IUseCourseSchema {
  schema: ObjectSchema<ICreateCourse | any>;
  courseInfo: ICreateCourse;
}

const useCourseSchema = ({
  schema,
  courseInfo,
}: IUseCourseSchema): [() => Promise<boolean>, validationErrorsType[]] => {
  const [validationErrors, setValidationErrors] = useState<
    validationErrorsType[]
  >([]);

  async function schemaValidation(): Promise<boolean> {
    await schema
      .validate(courseInfo, { abortEarly: false })
      .then(() => setValidationErrors([]))
      .catch((err) => {
        setValidationErrors([...err.errors]);
      });
    const validation: boolean = await schema.isValid(courseInfo, {
      abortEarly: false,
    });
    return validation;
  }
  return [schemaValidation, validationErrors];
};

export { useCourseSchema };
