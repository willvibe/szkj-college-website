// 实训基地 3D 数字孪生 —— 空间布局数据
// 几何依据《实训基地布局图》CAD 图纸整理：长条形单层、中间一条走廊、南北双侧房间
// 房间面积取自学院实训空间台账（T-01 ~ T-06），配色取自各室实景照片的代表色

export type FurnitureKind =
  | "desk-rows" // 台式机排桌（大数据 / 创新培训中心）
  | "notebook-clusters" // 笔记本分组讨论桌（人工智能）
  | "green-rows" // 绿色实训台排列（金融科技）
  | "live-booths" // 直播工位 + 休息沙发（电商直播）
  | "hex-clusters" // 六边形拼桌（创新创业）
  | "podium"; // 讲台 + 大屏

export type Rect = { x: number; z: number; w: number; d: number };

export type RoomDef = {
  code: string; // 空间编号，与数据库 TrainingSpace.roomNo 对应
  name: string;
  rect: Rect; // 单位：米（x 沿建筑长向，z 沿进深方向）
  accent: string; // 家具主色（取自实景照片）
  floorTint: string; // 地面色（取自实景照片）
  furnishing: FurnitureKind;
  seats?: number; // 工位数（用于换算桌位数量）
  side: "north" | "south";
  photos: string[]; // 详情面板用的实景照片
};

/** 建筑外围尺寸（米） */
export const BASE_W = 78; // 长向
export const BASE_D = 26; // 进深
/** 中间走廊（南北房间分界） */
export const CORRIDOR: Rect = { x: 0, z: 9.5, w: BASE_W, d: 4 };
/** 墙高（压低以便俯视看到室内布置） */
export const WALL_H = 2.6;

/** 6 个可交互实训空间（位置按图纸南北分区排布） */
export const ROOMS: RoomDef[] = [
  // ===== 北侧 =====
  {
    code: "T-06",
    name: "创新培训中心",
    rect: { x: 0, z: 0, w: 38, d: 9.5 },
    accent: "#a78bfa",
    floorTint: "#eef0f6",
    furnishing: "desk-rows",
    seats: 120,
    side: "north",
    photos: ["/images/base/room-overview.jpg"],
  },
  {
    code: "T-05",
    name: "创新创业实训室",
    rect: { x: 48.5, z: 0, w: 19, d: 9.5 },
    accent: "#f59e0b",
    floorTint: "#f3f1ea",
    furnishing: "hex-clusters",
    seats: 36,
    side: "north",
    photos: ["/images/base/room-innov-2.jpg", "/images/base/room-innov-1.jpg", "/images/base/room-innov-3.jpg"],
  },
  // ===== 南侧 =====
  {
    code: "T-02",
    name: "大数据实训室",
    rect: { x: 0, z: 13.5, w: 22.4, d: 12.5 },
    accent: "#3b82f6",
    floorTint: "#eceff5",
    furnishing: "desk-rows",
    seats: 48,
    side: "south",
    photos: ["/images/base/room-bigdata-1.jpg", "/images/base/room-label-1.jpg", "/images/base/room-label-2.jpg"],
  },
  {
    code: "T-01",
    name: "人工智能实训室",
    rect: { x: 22.4, z: 13.5, w: 20.8, d: 12.5 },
    accent: "#38bdf8",
    floorTint: "#eaf1f6",
    furnishing: "notebook-clusters",
    seats: 48,
    side: "south",
    photos: ["/images/base/room-ai-1.jpg"],
  },
  {
    code: "T-04",
    name: "金融科技实训室",
    rect: { x: 43.2, z: 13.5, w: 16, d: 12.5 },
    accent: "#6366f1",
    floorTint: "#edf0f7",
    furnishing: "green-rows",
    seats: 45,
    side: "south",
    photos: ["/images/base/room-fintech-1.jpg"],
  },
  {
    code: "T-03",
    name: "直播电商实训室",
    rect: { x: 59.2, z: 13.5, w: 17.6, d: 12.5 },
    accent: "#10b981",
    floorTint: "#eaf4ef",
    furnishing: "live-booths",
    seats: 40,
    side: "south",
    photos: ["/images/base/room-live-2.jpg", "/images/base/room-live-1.jpg", "/images/base/room-media-1.jpg", "/images/base/room-media-2.jpg"],
  },
];

/** 非交互的结构性空间（核心筒 / 展厅 / 办公），仅用于还原图纸空间关系 */
export const CONTEXT_ZONES: Array<{ label: string; rect: Rect; kind: "core" | "display" | "office" }> = [
  { label: "楼梯 · 卫生间 · 机房", rect: { x: 38, z: 0, w: 10.5, d: 9.5 }, kind: "core" },
  { label: "数智展厅", rect: { x: 67.5, z: 0, w: 10.5, d: 9.5 }, kind: "display" },
  { label: "教师工作室", rect: { x: 59.2, z: 0, w: 8.3, d: 0 }, kind: "office" },
];

/** 视角预设：dir 为自建筑中心出发的观察方向（相机距离按视口宽高比自动适配） */
export const VIEW_PRESETS = [
  { key: "iso", label: "鸟瞰总览", dir: [0.05, 0.72, 0.86] as [number, number, number] },
  { key: "top", label: "正俯视图", dir: [0, 1, 0.02] as [number, number, number] },
  { key: "north", label: "北侧视角", dir: [0.02, 0.42, -1] as [number, number, number] },
  { key: "south", label: "南侧视角", dir: [0.02, 0.42, 1] as [number, number, number] },
  { key: "east", label: "东侧视角", dir: [1, 0.4, 0.05] as [number, number, number] },
];