export const ACH_META: Record<string, { label: string; en: string; chip: string; dot: string }> = {
  COMPETITION: { label: "竞赛获奖", en: "COMPETITION", chip: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  TEACHING: { label: "教学成果", en: "TEACHING", chip: "bg-blue-50 text-blue-700", dot: "bg-blue-600" },
  ACTIVITY: { label: "活动成果", en: "ACTIVITY", chip: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
};

export const ACH_TABS = [
  { key: "ALL", label: "全部成果" },
  { key: "COMPETITION", label: "竞赛获奖" },
  { key: "TEACHING", label: "教学成果" },
  { key: "ACTIVITY", label: "活动成果" },
];
