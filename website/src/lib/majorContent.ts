import { prisma } from "./prisma";
import { DATA_MATRIX, type MatrixNode } from "./abilityMatrix";
import { COURSE_SYSTEMS, type CourseSystem } from "./courseSystems";
import { TRAINING_SYSTEM } from "./trainingSystem";

export type TrainingSystem = typeof TRAINING_SYSTEM;

function parseJson<T>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// 读取某专业的后台可编辑内容：数据库 JSON 优先，回退内置 TS 数据
export async function getMajorContent(slug: string): Promise<{
  matrix: MatrixNode | null;
  courseSystem: CourseSystem | null;
  trainingSystem: TrainingSystem | null;
}> {
  const m = await prisma.major.findUnique({
    where: { slug },
    select: {
      abilityMatrixJson: true,
      courseSystemJson: true,
      trainingSystemJson: true,
    },
  });
  return {
    matrix: parseJson<MatrixNode>(m?.abilityMatrixJson) ?? (slug === "data" ? DATA_MATRIX : null),
    courseSystem:
      parseJson<CourseSystem>(m?.courseSystemJson) ?? COURSE_SYSTEMS[slug] ?? null,
    trainingSystem: parseJson<TrainingSystem>(m?.trainingSystemJson) ?? (slug === "data" ? TRAINING_SYSTEM : null),
  };
}
