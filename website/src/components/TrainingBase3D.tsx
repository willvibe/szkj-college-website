"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  BASE_D,
  BASE_W,
  CORRIDOR,
  CONTEXT_ZONES,
  ROOMS,
  VIEW_PRESETS,
  WALL_H,
  type Rect,
  type RoomDef,
} from "@/lib/trainingBase3D";

// ===== 通用材质（复用，减少 draw call）=====
const MAT = {
  ground: new THREE.MeshLambertMaterial({ color: "#d7dfea" }), // 场地地坪
  slab: new THREE.MeshLambertMaterial({ color: "#bcc7d6" }), // 建筑楼板
  corridor: new THREE.MeshLambertMaterial({ color: "#aab6c8" }), // 走廊
  wallOuter: new THREE.MeshLambertMaterial({ color: "#f8fafc" }),
  wallInner: new THREE.MeshLambertMaterial({ color: "#eef2f8" }),
  desk: new THREE.MeshLambertMaterial({ color: "#ffffff" }),
  screen: new THREE.MeshLambertMaterial({ color: "#334155" }),
  chair: new THREE.MeshLambertMaterial({ color: "#7c8ba1" }),
  glass: new THREE.MeshLambertMaterial({ color: "#9ec7dd", transparent: true, opacity: 0.55 }),
  core: new THREE.MeshLambertMaterial({ color: "#aeb9c9" }),
};

const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
const HEX = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);

function box(
  parent: THREE.Object3D,
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  geo: THREE.BufferGeometry = BOX
) {
  const m = new THREE.Mesh(geo, mat);
  m.scale.set(w, h, d);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/** 墙体：按矩形生成 4 面薄墙（可指定开口方向） */
function addWalls(parent: THREE.Object3D, r: Rect, mat: THREE.Material, openings: { north?: number; south?: number } = {}) {
  const t = 0.18;
  const y = WALL_H / 2;
  // 南北墙（按开口宽度切断）
  for (const [side, gap] of [["north", openings.north], ["south", openings.south]] as const) {
    const z = side === "north" ? r.z : r.z + r.d;
    if (!gap) {
      box(parent, mat, r.x + r.w / 2, y, z, r.w, WALL_H, t);
    } else {
      const seg = (r.w - gap) / 2;
      if (seg > 0.2) {
        box(parent, mat, r.x + seg / 2, y, z, seg, WALL_H, t);
        box(parent, mat, r.x + r.w - seg / 2, y, z, seg, WALL_H, t);
      }
    }
  }
  // 东西墙
  box(parent, mat, r.x, y, r.z + r.d / 2, t, WALL_H, r.d);
  box(parent, mat, r.x + r.w, y, r.z + r.d / 2, t, WALL_H, r.d);
}

// ===== 家具生成（按房间类型，抽象为体块，符合建筑尺度观感）=====
function addFurniture(parent: THREE.Object3D, room: RoomDef) {
  const { x, z, w, d } = room.rect;
  const accent: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({ color: room.accent });
  const pad = 1.6;
  const ix = x + pad;
  const iz = z + pad;
  const iw = w - pad * 2;
  const id = d - pad * 2;

  switch (room.furnishing) {
    case "desk-rows": {
      // 台式机排桌：按工位数换算排数（每排 12 座）
      const perRow = 12;
      const rows = Math.max(3, Math.round((room.seats ?? 48) / perRow));
      const rowGap = id / rows;
      const cols = 3; // 每排 3 组，形成过道
      const colGap = iw / cols;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cw = colGap * 0.78;
          const cx = ix + colGap * (c + 0.5);
          const cz = iz + rowGap * (r + 0.5);
          box(parent, MAT.desk, cx, 0.38, cz, cw, 0.08, rowGap * 0.42); // 桌面
          box(parent, accent, cx, 0.19, cz, cw * 0.95, 0.36, rowGap * 0.36); // 桌体
          box(parent, MAT.screen, cx, 0.62, cz - rowGap * 0.12, cw * 0.8, 0.34, 0.06); // 显示器
          box(parent, MAT.chair, cx - cw * 0.28, 0.25, cz + rowGap * 0.28, 0.45, 0.5, 0.45); // 座椅
          box(parent, MAT.chair, cx + cw * 0.28, 0.25, cz + rowGap * 0.28, 0.45, 0.5, 0.45);
        }
      }
      box(parent, accent, x + w / 2, 0.75, z + 0.75, w * 0.42, 0.65, 0.28); // 讲台
      box(parent, MAT.screen, x + w / 2, 1.55, z + 0.35, w * 0.34, 1.5, 0.08); // 大屏
      break;
    }
    case "notebook-clusters": {
      // 笔记本分组桌：3 列 × 2 行 大桌，每桌 8 座
      const cols = 3;
      const rowsN = 2;
      const cw = iw / cols;
      const ch = id / rowsN;
      for (let r = 0; r < rowsN; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = ix + cw * (c + 0.5);
          const cz = iz + ch * (r + 0.5);
          box(parent, accent, cx, 0.37, cz, cw * 0.72, 0.1, ch * 0.5); // 蓝色三人桌
          box(parent, MAT.desk, cx, 0.42, cz, cw * 0.66, 0.04, ch * 0.44);
          box(parent, MAT.screen, cx, 0.62, cz, cw * 0.5, 0.26, 0.05); // 笔记本
          for (const [dx, dz] of [
            [-0.3, 0.32],
            [0.3, 0.32],
            [-0.3, -0.32],
            [0.3, -0.32],
          ] as const) {
            box(parent, MAT.chair, cx + cw * dx, 0.25, cz + ch * dz, 0.42, 0.5, 0.42);
          }
        }
      }
      box(parent, accent, x + w / 2, 0.75, z + 0.75, w * 0.4, 0.65, 0.26);
      box(parent, MAT.screen, x + w / 2, 1.5, z + 0.32, w * 0.32, 1.4, 0.08);
      break;
    }
    case "green-rows": {
      // 绿色实训台：3 排 × 4 列
      const rows = 3;
      const cols = 4;
      const cw = iw / cols;
      const ch = id / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = ix + cw * (c + 0.5);
          const cz = iz + ch * (r + 0.5);
          box(parent, accent, cx, 0.36, cz, cw * 0.8, 0.36, ch * 0.56);
          box(parent, MAT.desk, cx, 0.56, cz, cw * 0.78, 0.05, ch * 0.54);
          box(parent, MAT.screen, cx, 0.78, cz - ch * 0.14, cw * 0.6, 0.28, 0.05);
          box(parent, MAT.chair, cx, 0.25, cz + ch * 0.3, 0.42, 0.5, 0.42);
        }
      }
      box(parent, accent, x + w / 2, 0.72, z + 0.7, w * 0.4, 0.6, 0.24);
      break;
    }
    case "hex-clusters": {
      // 六边形拼桌（创新创业实训室）
      const cols = 3;
      const rowsN = 2;
      const cw = iw / cols;
      const ch = id / rowsN;
      const R = Math.min(cw, ch) * 0.42;
      for (let r = 0; r < rowsN; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = ix + cw * (c + 0.5);
          const cz = iz + ch * (r + 0.5);
          box(parent, accent, cx, 0.36, cz, R, 0.36, R, HEX);
          box(parent, MAT.desk, cx, 0.56, cz, R * 0.94, 0.05, R * 0.94, HEX);
          for (let k = 0; k < 6; k++) {
            const a = (k / 6) * Math.PI * 2;
            box(parent, MAT.chair, cx + Math.cos(a) * R * 0.78, 0.24, cz + Math.sin(a) * R * 0.78, 0.38, 0.48, 0.38);
          }
        }
      }
      box(parent, MAT.screen, x + w / 2, 1.45, z + 0.35, w * 0.3, 1.3, 0.08);
      break;
    }
    case "live-booths": {
      // 直播工位（含环形补光灯）+ 休息沙发区 + 大屏
      const booths = 6;
      const cols = 3;
      const cw = iw / cols;
      const ch = id / 2;
      for (let i = 0; i < booths; i++) {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const cx = ix + cw * (c + 0.5);
        const cz = iz + ch * (r + 0.5) * 0.9;
        box(parent, accent, cx, 0.36, cz, cw * 0.66, 0.36, ch * 0.44); // 直播台
        box(parent, MAT.desk, cx, 0.56, cz, cw * 0.64, 0.05, ch * 0.42);
        box(parent, MAT.screen, cx, 0.85, cz - ch * 0.16, cw * 0.44, 0.3, 0.05);
        box(parent, MAT.glass, cx, 0.9, cz + ch * 0.16, cw * 0.5, 1.6, 0.06); // 补光板
        box(parent, MAT.chair, cx, 0.25, cz + ch * 0.26, 0.42, 0.5, 0.42);
      }
      // 沙发休息区
      box(parent, MAT.chair, x + w - 2.4, 0.3, z + d - 1.7, 3.4, 0.55, 1.1);
      box(parent, accent, x + w - 2.4, 0.62, z + d - 2.3, 1.6, 0.28, 0.5);
      box(parent, MAT.screen, x + 1.2, 1.45, z + d - 0.4, w * 0.24, 1.25, 0.08);
      break;
    }
    case "podium":
      break;
  }
  void CYL;
}

/** 房间悬浮标签（canvas 贴图 Sprite） */
function makeLabel(room: RoomDef) {
  const c = document.createElement("canvas");
  const scale = 2;
  c.width = 320 * scale;
  c.height = 96 * scale;
  const g = c.getContext("2d")!;
  g.scale(scale, scale);
  g.fillStyle = "rgba(15,23,42,0.86)";
  const r = 14;
  g.beginPath();
  g.moveTo(r, 0);
  g.arcTo(320, 0, 320, 96, r);
  g.arcTo(320, 96, 0, 96, r);
  g.arcTo(0, 96, 0, 0, r);
  g.arcTo(0, 0, 320, 0, r);
  g.closePath();
  g.fill();
  g.fillStyle = room.accent;
  g.fillRect(0, 0, 6, 96);
  g.fillStyle = "#ffffff";
  g.font = "bold 30px 'Microsoft YaHei', sans-serif";
  g.fillText(room.name, 22, 40);
  g.fillStyle = "#94a3b8";
  g.font = "600 20px Menlo, monospace";
  g.fillText(`${room.code}`, 22, 70);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.scale.set(13, 3.9, 1);
  sp.position.set(room.rect.x + room.rect.w / 2, WALL_H + 2.6, room.rect.z + room.rect.d / 2);
  sp.renderOrder = 10;
  return sp;
}

/** 建筑中心（取景注视点） */
const CENTER = new THREE.Vector3(BASE_W / 2, 0, BASE_D / 2);

/** 建筑包围盒（用于精确取景：外扩 1m，高度含悬浮标签 Sprite） */
function buildingBox() {
  return new THREE.Box3(
    new THREE.Vector3(-1, -0.6, -1),
    new THREE.Vector3(BASE_W + 1, WALL_H + 4.8, BASE_D + 1)
  );
}

/**
 * 精确取景：沿观察方向二分搜索最小相机距离，使包围盒 8 个角点全部落入视野
 * margin 1.06 → 角点最多占视口 94.3%，四周保留约 3% 安全边，长条形楼层任意视口下必然完整入镜
 */
function fitCameraDistance(
  camera: THREE.PerspectiveCamera,
  target: THREE.Vector3,
  dirArr: readonly [number, number, number],
  margin = 1.06,
  box: THREE.Box3 = buildingBox()
) {
  const pts: THREE.Vector3[] = [];
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z));

  const dir = new THREE.Vector3(dirArr[0], dirArr[1], dirArr[2]).normalize();
  const probe = new THREE.Vector3();
  const saved = camera.position.clone();
  const fits = (d: number) => {
    camera.position.copy(target).addScaledVector(dir, d);
    camera.lookAt(target);
    camera.updateMatrixWorld(true);
    for (const p of pts) {
      probe.copy(p).project(camera);
      if (Math.abs(probe.x) > 1 / margin || Math.abs(probe.y) > 1 / margin || probe.z > 1 || probe.z < -1) {
        return false;
      }
    }
    return true;
  };

  let lo = 10;
  let hi = 1500;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) hi = mid;
    else lo = mid;
  }
  camera.position.copy(saved); // 还原相机，仅返回所需距离
  return hi;
}

/** 由观察方向与距离计算相机机位 */
function viewPos(dirArr: readonly [number, number, number], dist: number) {
  const dir = new THREE.Vector3(dirArr[0], dirArr[1], dirArr[2]).normalize();
  return CENTER.clone().addScaledVector(dir, dist);
}

export default function TrainingBase3D({
  onSelect,
  activeCode,
}: {
  onSelect?: (code: string) => void;
  activeCode?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    floorMats: Map<string, THREE.MeshLambertMaterial>;
    labels: THREE.Sprite[];
    pickTargets: THREE.Mesh[];
    raf: number;
    anim?: { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; start: number };
  } | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("iso");
  const viewRef = useRef("iso");
  const userMovedRef = useRef(false);

  const rooms = useMemo(() => ROOMS, []);

  // 初始化场景
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eef3f9");
    scene.fog = new THREE.Fog("#eef3f9", 280, 560);

    const camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight || 1.9, 0.5, 800);
    camera.position.copy(viewPos(VIEW_PRESETS[0].dir, fitCameraDistance(camera, CENTER, VIEW_PRESETS[0].dir)));

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(CENTER);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.minDistance = 12;
    controls.maxDistance = 320;

    // 灯光（主光投射阴影，营造体块层次；环境光偏亮以保证室内配色可辨识）
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc3cedd, 0.78));
    const dir = new THREE.DirectionalLight(0xffffff, 0.95);
    dir.position.set(-30, 70, 55);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    dir.shadow.camera.left = -60;
    dir.shadow.camera.right = 60;
    dir.shadow.camera.top = 60;
    dir.shadow.camera.bottom = -60;
    dir.shadow.camera.far = 240;
    dir.shadow.bias = -0.0006;
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0xdbeafe, 0.3);
    dir2.position.set(70, 46, -50);
    scene.add(dir2);

    const world = new THREE.Group();
    scene.add(world);

    // 场地地坪（承接阴影）
    const ground = box(world, MAT.ground, BASE_W / 2, -0.45, BASE_D / 2, BASE_W + 12, 0.3, BASE_D + 12);
    ground.receiveShadow = true;
    // 建筑楼板
    const slab = box(world, MAT.slab, BASE_W / 2, -0.15, BASE_D / 2, BASE_W + 1.6, 0.3, BASE_D + 1.6);
    slab.receiveShadow = true;
    // 走廊
    box(world, MAT.corridor, CORRIDOR.x + CORRIDOR.w / 2, 0.02, CORRIDOR.z + CORRIDOR.d / 2, CORRIDOR.w, 0.04, CORRIDOR.d);
    // 走廊中线（视觉引导）
    box(world, new THREE.MeshLambertMaterial({ color: "#8e9cb0" }), BASE_W / 2, 0.05, CORRIDOR.z + CORRIDOR.d / 2, BASE_W, 0.01, 0.14);

    // 外围墙（南北留出入口）
    const outer: Rect = { x: -0.8, z: -0.8, w: BASE_W + 1.6, d: BASE_D + 1.6 };
    addWalls(world, outer, MAT.wallOuter, { north: 18, south: 18 });

    const floorMats = new Map<string, THREE.MeshLambertMaterial>();
    const pickTargets: THREE.Mesh[] = [];
    const labels: THREE.Sprite[] = [];

    // 房间
    for (const room of rooms) {
      const { x, z, w, d } = room.rect;
      const mat = new THREE.MeshLambertMaterial({ color: room.floorTint });
      floorMats.set(room.code, mat);
      const floor = box(world, mat, x + w / 2, 0.03, z + d / 2, w - 0.2, 0.05, d - 0.2);
      floor.userData.roomCode = room.code;
      pickTargets.push(floor);

      // 隔墙（临走廊一侧留门洞）
      const opening = Math.min(6, w * 0.4);
      addWalls(world, room.rect, MAT.wallInner, room.side === "north" ? { south: opening } : { north: opening });

      addFurniture(world, room);

      const label = makeLabel(room);
      labels.push(label);
      world.add(label);
    }

    // 结构性空间
    for (const zone of CONTEXT_ZONES) {
      if (zone.rect.d <= 0) continue;
      const { x, z, w, d } = zone.rect;
      const m = new THREE.MeshLambertMaterial({
        color: zone.kind === "display" ? "#e7edf7" : zone.kind === "core" ? "#e2e6ee" : "#eef1f6",
      });
      box(world, m, x + w / 2, 0.03, z + d / 2, w - 0.2, 0.05, d - 0.2);
      addWalls(world, zone.rect, MAT.wallInner, { south: 3 });
      if (zone.kind === "core") {
        // 楼梯体块
        for (let i = 0; i < 8; i++) {
          box(world, MAT.core, x + 2.6, 0.12 + i * 0.18, z + d / 2 - i * 0.36, 3.2, 0.18, 0.34);
        }
        box(world, MAT.glass, x + w * 0.72, 0.9, z + d * 0.55, 2.2, 1.8, 2.2); // 机房机柜
      }
      if (zone.kind === "display") {
        box(world, MAT.screen, x + w / 2, 1.5, z + 0.4, w * 0.62, 1.4, 0.1);
        box(world, MAT.chair, x + w * 0.35, 0.3, z + d * 0.62, 2.4, 0.5, 0.9);
        box(world, MAT.chair, x + w * 0.68, 0.3, z + d * 0.62, 2.4, 0.5, 0.9);
      }
    }

    // 交互：点击选中房间
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };
    const onDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      if (Math.abs(e.clientX - downPos.x) > 5 || Math.abs(e.clientY - downPos.y) > 5) return; // 拖拽不触发
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(pickTargets, false)[0];
      if (hit?.object.userData.roomCode) onSelect?.(hit.object.userData.roomCode as string);
    };
    const onMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(pickTargets, false)[0];
      renderer.domElement.style.cursor = hit ? "pointer" : "grab";
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);

    const onResize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
      // 用户未手动调整过视角时，按新视口重新取景，避免长条形楼层被裁切
      if (!userMovedRef.current) {
        const preset = VIEW_PRESETS.find((v) => v.key === viewRef.current) ?? VIEW_PRESETS[0];
        camera.position.copy(viewPos(preset.dir, fitCameraDistance(camera, CENTER, preset.dir)));
        controls.target.copy(CENTER);
        controls.update();
        renderer.render(scene, camera); // 立即出帧，避免等待下一帧
      }
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(host);
    controls.addEventListener("start", () => {
      userMovedRef.current = true;
    });

    const ctx = {
      renderer,
      scene,
      camera,
      controls,
      floorMats,
      labels,
      pickTargets,
      raf: 0,
      anim: undefined as
        | { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; start: number }
        | undefined,
    };
    ctxRef.current = ctx;

    const loop = () => {
      const a = ctx.anim;
      if (a) {
        const k = Math.min(1, (performance.now() - a.start) / 700);
        const e = 1 - Math.pow(1 - k, 3);
        camera.position.lerpVectors(a.from, a.to, e);
        controls.target.lerpVectors(a.tFrom, a.tTo, e);
        if (k >= 1) ctx.anim = undefined;
      }
      controls.update();
      renderer.render(scene, camera);
      ctx.raf = requestAnimationFrame(loop);
    };
    loop();
    renderer.render(scene, camera);
    onResize();
    setReady(true);

    return () => {
      cancelAnimationFrame(ctx.raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      controls.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh && m.material && !(Object.values(MAT) as THREE.Material[]).includes(m.material as THREE.Material)) {
          (m.material as THREE.Material).dispose?.();
        }
      });
      labels.forEach((l) => {
        const sm = l.material as THREE.SpriteMaterial;
        sm.map?.dispose();
        sm.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms]);

  // 选中高亮
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.floorMats.forEach((mat, code) => {
      const room = ROOMS.find((r) => r.code === code);
      if (!room) return;
      if (code === activeCode) {
        mat.color.set(room.accent);
        mat.emissive = new THREE.Color(room.accent).multiplyScalar(0.25);
      } else {
        mat.color.set(room.floorTint);
        mat.emissive = new THREE.Color(0x000000);
      }
    });
  }, [activeCode, ready]);

  // 标签显隐
  useEffect(() => {
    ctxRef.current?.labels.forEach((l) => (l.visible = showLabels));
  }, [showLabels, ready]);

  // 视角切换（按视口宽高比自动计算距离，保证长条形楼层完整入镜）
  const applyView = useCallback((key: string) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const preset = VIEW_PRESETS.find((v) => v.key === key);
    if (!preset) return;
    setView(key);
    viewRef.current = key;
    userMovedRef.current = false;
    const dist = fitCameraDistance(ctx.camera, CENTER, preset.dir);
    ctx.anim = {
      from: ctx.camera.position.clone(),
      to: viewPos(preset.dir, dist),
      tFrom: ctx.controls.target.clone(),
      tTo: CENTER.clone(),
      start: performance.now(),
    };
  }, []);

  // 选中房间时镜头聚焦（按房间自身包围盒取景，保证该房间完整入镜）
  const focusRoom = useCallback((code: string) => {
    const ctx = ctxRef.current;
    const room = ROOMS.find((r) => r.code === code);
    if (!ctx || !room) return;
    const { x, z, w, d } = room.rect;
    const target = new THREE.Vector3(x + w / 2, 0, z + d / 2);
    const box = new THREE.Box3(
      new THREE.Vector3(x - 1.2, -0.4, z - 1.2),
      new THREE.Vector3(x + w + 1.2, WALL_H + 1.4, z + d + 1.2)
    );
    const dirArr: [number, number, number] = room.side === "north" ? [0.16, 0.9, -0.95] : [0.16, 0.9, 0.95];
    const dist = Math.max(16, fitCameraDistance(ctx.camera, target, dirArr, 1.14, box));
    const dir = new THREE.Vector3(...dirArr).normalize();
    ctx.anim = {
      from: ctx.camera.position.clone(),
      to: target.clone().addScaledVector(dir, dist),
      tFrom: ctx.controls.target.clone(),
      tTo: target,
      start: performance.now(),
    };
  }, []);

  // 选中房间时镜头聚焦（首次挂载不触发，保留总览机位）
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (activeCode) focusRoom(activeCode);
  }, [activeCode, focusRoom]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
      {/* 顶部工具条 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300">
            THREE.JS DIGITAL TWIN · 实训基地 3D 数字孪生
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {VIEW_PRESETS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => applyView(v.key)}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                view === v.key ? "bg-blue-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {v.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setShowLabels((s) => !s);
            }}
            className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
              showLabels ? "bg-white/10 text-cyan-300" : "bg-white/5 text-slate-400"
            }`}
          >
            标签
          </button>
        </div>
      </div>

      {/* 3D 画布 */}
      <div ref={hostRef} className="h-[440px] w-full touch-none sm:h-[560px] lg:h-[640px]" />

      {/* 底部提示 */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2.5 text-[11px] text-slate-400 sm:px-6">
        <span>拖拽旋转 · 滚轮缩放 · 点击房间查看详情</span>
        <span className="font-mono text-slate-500">
          建筑面积 {BASE_W}×{BASE_D}m · {ROOMS.length} 个实训空间 · 依据实训基地布局图还原
        </span>
      </div>
    </div>
  );
}