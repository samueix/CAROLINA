export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  activities: string[];
  isFreelance?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  completionYear: string;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  syllabus: string[];
}

export interface Skill {
  name: string;
  level: number; // 1-100 percentage for the illustrative bar
  category: 'administrative' | 'financial' | 'client-relations' | 'personal';
}
