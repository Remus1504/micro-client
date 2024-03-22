/* eslint-disable @typescript-eslint/no-explicit-any */
import { array, number, object, ObjectSchema, string } from "yup";

import { ICreateCourse } from "../interfaces/course.interface";

const courseInfoSchema: ObjectSchema<ICreateCourse | any> = object({
  instructorId: string().optional(),
  profilePicture: string().optional(),
  title: string()
    .max(80, { title: "Course title must be at most 80" })
    .required({ title: "Course title is a required field" }),
  categories: string()
    .notOneOf(["Select a category"], { categories: "Select a category" })
    .required({ categories: "Categories is a required field" }),
  description: string()
    .max(1200, { description: "Description must be at most 1200" })
    .required({ description: "Description is a required field" }),
  coverImage: string().required({
    coverImage: "Course cover image is a required field",
  }),
  expectedDuration: string()
    .notOneOf(["Expected duration"], {
      expectedDuration: "Select expected duration",
    })
    .required({
      expectedDuration: "Course expected duration is a required field",
    }),
  basicDescription: string()
    .max(100, {
      basicDescription: "Course basic description must be at most 100",
    })
    .required({
      basicDescription: "Course basic description is a required field",
    }),
  basicTitle: string()
    .max(40, { basicTitle: "Course basic title must be at most 40" })
    .required({ basicTitle: "Course basic title is a required field" }),
  subCategories: array(string()).min(1, {
    subCategories: "Subcategory is a required field",
  }),
  tags: array(string()).min(1, { tags: "Tags is a required field" }),
  price: number().min(5, { price: "Price is a required field" }),
});

export { courseInfoSchema };
