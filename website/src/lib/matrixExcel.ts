// 能力矩阵 Excel 模板定义与解析（后台专业能力图谱导入用）
import type { MatrixNode } from "./abilityMatrix";

/** 模板表头（六层，与旭日图层级一一对应） */
export const MATRIX_HEADERS = ["岗位群", "核心岗位", "主要职责", "典型任务", "核心技能", "职业素养"];

/** 模板示例行（下载模板时附带，供参考格式） */
export const MATRIX_SAMPLE_ROWS: string[][] = [
  ["数据智能分析与AI应用岗位群", "数据分析/BI工程师", "数据获取与分析", "需求指标拆解：访谈业务用户，明确问题与指标口径", "分析需求访谈：识别用户目标、业务对象和决策场景", "沟通澄清能力"],
  ["数据智能分析与AI应用岗位群", "数据分析/BI工程师", "数据获取与分析", "需求指标拆解：访谈业务用户，明确问题与指标口径", "分析需求访谈：识别用户目标、业务对象和决策场景", "业务理解能力"],
  ["数据智能分析与AI应用岗位群", "数据分析/BI工程师", "数据获取与分析", "指标框架设计：拆解指标、维度、口径和分析路径", "指标体系搭建：定义计算口径与维度结构", "结构化思维"],
  ["数据智能分析与AI应用岗位群", "数据分析师", "数据清洗与治理", "多源数据采集：编写爬虫与接口采集业务数据", "Python 网络爬虫开发", "数据敏感度"],
  ["数据智能分析与AI应用岗位群", "数据分析师", "数据清洗与治理", "多源数据采集：编写爬虫与接口采集业务数据", "接口数据获取与解析", "严谨细致"],
];

/** 模板"填写说明"工作表内容 */
export const MATRIX_GUIDE_ROWS: string[][] = [
  ["能力矩阵 Excel 模板填写说明"],
  [""],
  ["1. 第一行表头（六列）请勿修改、删除或调换顺序。"],
  ["2. 每一行代表一条完整的路径：从岗位群一直到职业素养（叶子层），六列均必填。"],
  ["3. 同一路径下多个素养 → 复制多行，前五列保持相同，第六列分别填写。"],
  ["4. 相同名称的上层节点（岗位/职责/任务/技能）会自动聚合，无需合并单元格。"],
  ["5. \"岗位群\"列所有行建议填写同一名称，该名称将作为旭日图中心盘标题。"],
  ["6. 填写完成后，在后台点击\"导入 Excel\"，解析结果进入预览，确认无误后点\"保存\"才生效。"],
  ["7. 弧面显示文字会按层自动折行；如需精细调整，导入后可在树形编辑器中修改。"],
];

/** 中文按字数折行（生成弧面显示文本 name） */
export function wrapCn(text: string, perLine: number): string {
  const lines: string[] = [];
  let line = "";
  let w = 0;
  for (const ch of [...text]) {
    const cw = /[\x00-\xff]/.test(ch) ? 0.55 : 1;
    if (line && w + cw > perLine) {
      lines.push(line);
      line = "";
      w = 0;
    }
    line += ch;
    w += cw;
  }
  if (line) lines.push(line);
  return lines.join("\n");
}

const PER_LINE = [6, 6, 7, 8, 9, 99]; // 各层每行字数（叶子一般较短不折）

export type ParseResult =
  | { ok: true; tree: MatrixNode; stats: { jobs: number; duties: number; tasks: number; skills: number; lits: number } }
  | { ok: false; error: string };

/**
 * 将模板行数据（含表头行）聚合为六层 MatrixNode 树。
 * 相同名称的上层节点自动合并；素养为叶子（value 1）。
 */
export function rowsToMatrix(rows: string[][]): ParseResult {
  // 定位表头行（容忍说明行，取首个包含全部六列表头的行）
  const norm = (s: string) => String(s ?? "").trim().replace(/\s+/g, "");
  let headerIdx = -1;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const cells = (rows[i] ?? []).map(norm);
    if (MATRIX_HEADERS.every((h, k) => cells[k] === h)) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx < 0) {
    return { ok: false, error: `未找到表头行，请使用后台提供的标准模板（表头应为：${MATRIX_HEADERS.join(" / ")}）` };
  }

  const root: MatrixNode = { name: "", full: "", children: [] };
  const jobMap = new Map<string, MatrixNode>();
  const dutyMap = new Map<string, MatrixNode>();
  const taskMap = new Map<string, MatrixNode>();
  const skillMap = new Map<string, MatrixNode>();
  let dataRows = 0;

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const cells = (rows[i] ?? []).map((c) => String(c ?? "").trim());
    if (cells.every((c) => !c)) continue; // 空行跳过
    // 六列校验
    const miss: number[] = [];
    for (let k = 0; k < 6; k++) if (!cells[k]) miss.push(k + 1);
    if (miss.length) {
      return { ok: false, error: `第 ${i + 1} 行第 ${miss.join("、")} 列为空，每行必须完整填写到"职业素养"层` };
    }
    const [grp, job, duty, task, skill, lit] = cells;
    if (!root.full) {
      root.full = grp;
      root.name = wrapCn(grp, PER_LINE[0]);
    }
    if (grp !== root.full) {
      return { ok: false, error: `第 ${i + 1} 行"岗位群"（${grp}）与首行（${root.full}）不一致，请保持同一岗位群` };
    }

    let jn = jobMap.get(job);
    if (!jn) {
      jn = { name: wrapCn(job, PER_LINE[1]), full: job, children: [] };
      jobMap.set(job, jn);
      root.children!.push(jn);
    }
    // 下层节点以"父路径|名称"为键：跨岗位/跨职责的同名节点不得互相合并
    const dutyKey = `${job}|${duty}`;
    let dn = dutyMap.get(dutyKey);
    if (!dn) {
      dn = { name: wrapCn(duty, PER_LINE[2]), full: duty, children: [] };
      dutyMap.set(dutyKey, dn);
      jn.children!.push(dn);
    }
    const taskKey = `${dutyKey}|${task}`;
    let tn = taskMap.get(taskKey);
    if (!tn) {
      tn = { name: wrapCn(task, PER_LINE[3]), full: task, children: [] };
      taskMap.set(taskKey, tn);
      dn.children!.push(tn);
    }
    const skillKey = `${taskKey}|${skill}`;
    let sn = skillMap.get(skillKey);
    if (!sn) {
      sn = { name: wrapCn(skill, PER_LINE[4]), full: skill, children: [] };
      skillMap.set(skillKey, sn);
      tn.children!.push(sn);
    }
    // 同一技能下同名素养去重（重复行不重复计权）
    if (!(sn.children ?? []).some((l) => l.full === lit)) {
      sn.children!.push({ name: lit, full: lit, value: 1 });
    } else {
      dataRows--; // 重复行不计入统计
    }
    dataRows++;
  }

  if (dataRows === 0) {
    return { ok: false, error: "表头下没有数据行，请填写至少一行完整路径" };
  }

  return {
    ok: true,
    tree: root,
    stats: {
      jobs: root.children!.length,
      duties: dutyMap.size,
      tasks: taskMap.size,
      skills: skillMap.size,
      lits: dataRows,
    },
  };
}
