export interface StudentDocument {
  _id?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  country: string;
  isInstructor?: boolean;
  enrolledCourses: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IReduxStudent {
  type?: string;
  payload: StudentDocument;
}
