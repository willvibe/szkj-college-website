export type CarouselRow = {
  id: number;
  title: string;
  subtitle: string | null;
  badge: string | null;
  image: string;
  link: string | null;
  btnText: string | null;
};

export type MajorRow = {
  id: number;
  slug: string;
  code: string;
  name: string;
  englishName: string;
  positioning: string;
  tagline: string;
  description: string;
  abilities: string[];
  coreCourses: string[];
  careers: string[];
  honors: string[];
  cooperation: string;
  practice: string;
  faculty: string;
  research: string;
  projectSlugs: string[];
};

export type ProjectRow = {
  id: number;
  slug: string;
  code: string;
  name: string;
  englishName: string;
  summary: string;
  projectType: string[];
  studentRoles: string[];
  process: string[];
  outputs: string[];
  learningModel: string[];
  status: string;
  cover: string | null;
  majorCodes: string[];
};

export type WorkRow = {
  id: number;
  slug: string;
  code: string;
  title: string;
  summary: string;
  type: string[];
  tags: string[];
  challenge: string;
  brief: string;
  process: string[];
  tools: string[];
  team: { name: string; major: string; role: string }[];
  mentor: string | null;
  outputs: string[];
  results: string[];
  commercialUse: boolean;
  crossMajor: boolean;
  cover: string | null;
  featured: boolean;
  majorCodes: string[];
};

export type SpaceRow = {
  id: number;
  roomNo: string | null;
  name: string;
  spaceType: string;
  area: number | null;
  capacity: number | null;
  majors: string[];
  projects: string[];
  courses: string[];
  description: string;
  equipmentSummary: string[];
  cover: string | null;
  posX: number;
  posY: number;
  width: number;
  height: number;
};

export type Stat = {
  id: number;
  value: string;
  suffix: string | null;
  label: string;
  englishLabel: string | null;
  description: string | null;
};

export type StepRow = {
  code: string;
  englishName: string;
  name: string;
  description: string;
};

export type AchievementRow = {
  id: number;
  slug: string;
  code: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  detail: string;
  results: string[];
  cover: string | null;
  featured: boolean;
};

export type NewsRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  cover: string | null;
  publishedAt: string;
  featured: boolean;
};
