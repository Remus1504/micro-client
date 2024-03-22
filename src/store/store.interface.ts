import { IAuthUser } from 'src/features/auth/interfaces/authenticationinterface';
import { StudentDocument } from 'src/features/student/interfaces/student.interface';
import { InstructorDocument } from 'src/features/instructors/interfaces/instructor.interface';
import { INotification } from 'src/shared/header/interfaces/header.interface';

export interface IReduxState {
  authUser: IAuthUser;
  header: string;
  logout: boolean;
  student: StudentDocument;
  instructor: InstructorDocument;
  showCategoryContainer: boolean;
  notification: INotification;
}
