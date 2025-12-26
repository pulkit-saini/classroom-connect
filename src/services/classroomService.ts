import axios from 'axios';

const BASE_URL = 'https://classroom.googleapis.com/v1';

const getHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export interface Course {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  alternateLink?: string;
  courseState?: string;
  ownerId?: string;
  enrollmentCode?: string;
  creationTime?: string;
  updateTime?: string;
  teacherFolder?: {
    id: string;
    title: string;
    alternateLink: string;
  };
}

export interface CourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  materials?: Material[];
  state?: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  dueDate?: { year: number; month: number; day: number };
  dueTime?: { hours: number; minutes: number };
  maxPoints?: number;
  workType?: string;
  submission?: StudentSubmission;
}

export interface StudentSubmission {
  id: string;
  courseId: string;
  courseWorkId: string;
  userId: string;
  creationTime?: string;
  updateTime?: string;
  state: 'NEW' | 'CREATED' | 'TURNED_IN' | 'RETURNED' | 'RECLAIMED_BY_STUDENT';
  late?: boolean;
  assignedGrade?: number;
  alternateLink?: string;
  assignmentSubmission?: {
    attachments?: Attachment[];
  };
}

export interface Announcement {
  id: string;
  courseId: string;
  text: string;
  state?: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  creatorUserId?: string;
  materials?: Material[];
}

export interface Material {
  driveFile?: {
    driveFile: {
      id: string;
      title: string;
      alternateLink: string;
      thumbnailUrl?: string;
    };
    shareMode?: string;
  };
  youtubeVideo?: {
    id: string;
    title: string;
    alternateLink: string;
    thumbnailUrl?: string;
  };
  link?: {
    url: string;
    title?: string;
    thumbnailUrl?: string;
  };
  form?: {
    formUrl: string;
    title?: string;
    thumbnailUrl?: string;
  };
}

export interface Attachment {
  driveFile?: {
    id: string;
    title: string;
    alternateLink: string;
    thumbnailUrl?: string;
  };
  youTubeVideo?: {
    id: string;
    title: string;
    alternateLink: string;
    thumbnailUrl?: string;
  };
  link?: {
    url: string;
    title?: string;
    thumbnailUrl?: string;
  };
  form?: {
    formUrl: string;
    title?: string;
    thumbnailUrl?: string;
  };
}

export interface Teacher {
  courseId: string;
  userId: string;
  profile?: UserProfile;
}

export interface Student {
  courseId: string;
  userId: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  name?: {
    givenName: string;
    familyName: string;
    fullName: string;
  };
  emailAddress?: string;
  photoUrl?: string;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  materials?: Material[];
  state?: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
}

export const classroomService = {
  // ==================== COURSES ====================
  getCourses: async (token: string): Promise<Course[]> => {
    const response = await axios.get(`${BASE_URL}/courses`, getHeaders(token));
    return response.data.courses || [];
  },

  getCourse: async (token: string, courseId: string): Promise<Course> => {
    const response = await axios.get(`${BASE_URL}/courses/${courseId}`, getHeaders(token));
    return response.data;
  },

  // ==================== COURSEWORK ====================
  getCourseWork: async (token: string, courseId: string): Promise<CourseWork[]> => {
    const response = await axios.get(
      `${BASE_URL}/courses/${courseId}/courseWork`,
      getHeaders(token)
    );
    return response.data.courseWork || [];
  },

  getCourseWorkItem: async (token: string, courseId: string, courseWorkId: string): Promise<CourseWork> => {
    const response = await axios.get(
      `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}`,
      getHeaders(token)
    );
    return response.data;
  },

  // ==================== SUBMISSIONS ====================
  getSubmission: async (token: string, courseId: string, courseWorkId: string): Promise<StudentSubmission | null> => {
    const response = await axios.get(
      `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions?userId=me`,
      getHeaders(token)
    );
    return response.data.studentSubmissions ? response.data.studentSubmissions[0] : null;
  },

  getAllSubmissions: async (token: string, courseId: string): Promise<StudentSubmission[]> => {
    try {
      const courseWork = await classroomService.getCourseWork(token, courseId);
      const submissions: StudentSubmission[] = [];
      
      for (const work of courseWork) {
        const submission = await classroomService.getSubmission(token, courseId, work.id);
        if (submission) {
          submissions.push(submission);
        }
      }
      
      return submissions;
    } catch {
      return [];
    }
  },

  addLink: async (token: string, courseId: string, courseWorkId: string, submissionId: string, linkUrl: string) => {
    const body = {
      addAttachments: [{ link: { url: linkUrl } }]
    };
    return await axios.post(
      `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:modifyAttachments`,
      body,
      getHeaders(token)
    );
  },

  turnIn: async (token: string, courseId: string, courseWorkId: string, submissionId: string) => {
    return await axios.post(
      `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:turnIn`,
      {},
      getHeaders(token)
    );
  },

  reclaim: async (token: string, courseId: string, courseWorkId: string, submissionId: string) => {
    return await axios.post(
      `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:reclaim`,
      {},
      getHeaders(token)
    );
  },

  // ==================== ANNOUNCEMENTS ====================
  getAnnouncements: async (token: string, courseId: string): Promise<Announcement[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/announcements`,
        getHeaders(token)
      );
      return response.data.announcements || [];
    } catch {
      return [];
    }
  },

  // ==================== COURSE MATERIALS ====================
  getCourseMaterials: async (token: string, courseId: string): Promise<CourseMaterial[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/courseWorkMaterials`,
        getHeaders(token)
      );
      return response.data.courseWorkMaterial || [];
    } catch {
      return [];
    }
  },

  // ==================== TEACHERS & STUDENTS ====================
  getTeachers: async (token: string, courseId: string): Promise<Teacher[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/teachers`,
        getHeaders(token)
      );
      return response.data.teachers || [];
    } catch {
      return [];
    }
  },

  getStudents: async (token: string, courseId: string): Promise<Student[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/students`,
        getHeaders(token)
      );
      return response.data.students || [];
    } catch {
      return [];
    }
  },

  // ==================== USER PROFILE ====================
  getUserProfile: async (token: string): Promise<UserProfile> => {
    const response = await axios.get(
      `${BASE_URL}/userProfiles/me`,
      getHeaders(token)
    );
    return response.data;
  },
};
