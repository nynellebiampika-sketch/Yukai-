import * as THREE from 'three';

export interface SanctuaryInstance {
  setScrollProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  destroy: () => void;
  focusCardView?: (index: number) => void;
}

export function initSanctuary(canvas: HTMLCanvasElement): SanctuaryInstance {
  const win = window;
  const doc = document;
  const REDUCED = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const V3 = (a: [number, number, number]) => new THREE.Vector3(a[0], a[1], a[2]);

  let W = win.innerWidth;
  let H = win.innerHeight;
  let DPR = Math.min(win.devicePixelRatio || 1, 1.85);

  const FOG_C = 0x080b11;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: DPR < 1.6,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(DPR);
  renderer.setSize(W, H, false);
  renderer.setClearColor(FOG_C, 1);
  renderer.autoClear = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(FOG_C, 0.0168);

  const camera = new THREE.PerspectiveCamera(36, W / H, 0.35, 260);
  camera.position.set(0, 4.05, 13.6);

  // Lights
  const key = new THREE.DirectionalLight(0xc2d4f5, 0.6);
  key.position.set(26, 30, 8);
  scene.add(key);

  scene.add(new THREE.HemisphereLight(0x35486a, 0x070b12, 0.72));

  const bounce = new THREE.PointLight(0xff5a3c, 0.98, 28, 2);
  bounce.position.set(0, 1.6, -3.4);
  scene.add(bounce);

  const hallLight = new THREE.PointLight(0xffb066, 3.5, 50, 2);
  hallLight.position.set(0, 8.6, -26.5);
  scene.add(hallLight);

  const lanternLight = new THREE.PointLight(0xffc074, 1.7, 20, 2);
  lanternLight.position.set(-5.4, 2.4, -12);
  scene.add(lanternLight);

  const WORLD = new THREE.Group();
  scene.add(WORLD);
  const SKY = new THREE.Group();
  scene.add(SKY);

  // Procedural Canvas Textures
  function cv(w: number, h: number) {
    const c = doc.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function toTex(c: HTMLCanvasElement, rep?: [number, number]) {
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    if (rep) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rep[0], rep[1]);
    }
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // Yakisugi charred cedar
  const charredTex = (() => {
    const c = cv(256, 256);
    const x = c.getContext('2d')!;
    x.fillStyle = '#0d0f11';
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 230; i++) {
      const gx = Math.random() * 256;
      const w = rand(0.6, 2.4);
      const a = rand(0.03, 0.14);
      x.strokeStyle = `rgba(${Math.random() < 0.13 ? '96,58,40' : '30,34,38'},${a})`;
      x.lineWidth = w;
      x.beginPath();
      x.moveTo(gx, 0);
      for (let y = 0; y <= 256; y += 18) {
        x.lineTo(gx + Math.sin(y * 0.05 + i) * 2.4, y);
      }
      x.stroke();
    }
    return toTex(c, [3, 3]);
  })();

  // Worn stone
  const stoneTex = (() => {
    const c = cv(256, 256);
    const x = c.getContext('2d')!;
    x.fillStyle = '#22262a';
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) {
      const v = rand(-16, 16);
      x.fillStyle = `rgba(${140 + v | 0},${146 + v | 0},${150 + v | 0},${rand(0.02, 0.09)})`;
      x.fillRect(Math.random() * 256, Math.random() * 256, rand(1, 3.4), rand(1, 3.4));
    }
    for (let j = 0; j < 9; j++) {
      x.strokeStyle = 'rgba(8,10,12,.4)';
      x.lineWidth = rand(0.6, 1.6);
      x.beginPath();
      x.moveTo(Math.random() * 256, Math.random() * 256);
      x.lineTo(Math.random() * 256, Math.random() * 256);
      x.stroke();
    }
    return toTex(c, [2, 2]);
  })();

  // Kawara roof tile
  const tileTex = (() => {
    const c = cv(256, 256);
    const x = c.getContext('2d')!;
    x.fillStyle = '#151a20';
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 16; i++) {
      const px = i * 16;
      const g = x.createLinearGradient(px, 0, px + 16, 0);
      g.addColorStop(0, 'rgba(6,8,11,.85)');
      g.addColorStop(0.45, 'rgba(46,55,66,.55)');
      g.addColorStop(0.55, 'rgba(58,68,80,.42)');
      g.addColorStop(1, 'rgba(6,8,11,.85)');
      x.fillStyle = g;
      x.fillRect(px, 0, 16, 256);
    }
    for (let r = 0; r < 256; r += 32) {
      x.fillStyle = 'rgba(4,6,8,.5)';
      x.fillRect(0, r, 256, 2.5);
    }
    return toTex(c, [5, 3]);
  })();

  // Shoji paper screen
  const shojiTex = (() => {
    const c = cv(128, 192);
    const x = c.getContext('2d')!;
    const g = x.createLinearGradient(0, 0, 0, 192);
    g.addColorStop(0, '#f2d49a');
    g.addColorStop(0.55, '#e5bd79');
    g.addColorStop(1, '#c99a55');
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 192);
    for (let i = 0; i < 900; i++) {
      x.fillStyle = `rgba(255,236,196,${rand(0.02, 0.1)})`;
      x.fillRect(Math.random() * 128, Math.random() * 192, 2, 2);
    }
    x.strokeStyle = 'rgba(46,32,18,.62)';
    x.lineWidth = 3;
    for (let cx2 = 1; cx2 < 4; cx2++) {
      x.beginPath();
      x.moveTo(cx2 * 32, 0);
      x.lineTo(cx2 * 32, 192);
      x.stroke();
    }
    for (let cy2 = 1; cy2 < 6; cy2++) {
      x.beginPath();
      x.moveTo(0, cy2 * 32);
      x.lineTo(128, cy2 * 32);
      x.stroke();
    }
    x.strokeStyle = 'rgba(30,20,10,.9)';
    x.lineWidth = 7;
    x.strokeRect(0, 0, 128, 192);
    return toTex(c);
  })();

  // Vermilion moon
  const moonTex = (() => {
    const S = 512;
    const c = cv(S, S);
    const x = c.getContext('2d')!;
    const r = S / 2;
    const g = x.createRadialGradient(r * 0.82, r * 0.72, r * 0.06, r, r, r);
    g.addColorStop(0, '#f7909b');
    g.addColorStop(0.42, '#e2606f');
    g.addColorStop(0.78, '#c03f4c');
    g.addColorStop(1, '#8e2733');
    x.beginPath();
    x.arc(r, r, r - 2, 0, 7);
    x.fillStyle = g;
    x.fill();
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * 6.284;
      const d = Math.sqrt(Math.random()) * (r - 40);
      const mx = r + Math.cos(a) * d;
      const my = r + Math.sin(a) * d;
      const mr = rand(9, 44);
      const cg = x.createRadialGradient(mx, my, 0, mx, my, mr);
      cg.addColorStop(0, `rgba(96,30,40,${rand(0.16, 0.4)})`);
      cg.addColorStop(1, 'rgba(96,30,40,0)');
      x.fillStyle = cg;
      x.beginPath();
      x.arc(mx, my, mr, 0, 7);
      x.fill();
    }
    x.globalCompositeOperation = 'destination-out';
    x.beginPath();
    x.arc(r * 0.3, r * 1.06, r * 0.74, 0, 7);
    x.fill();
    x.globalCompositeOperation = 'source-over';
    return toTex(c);
  })();

  // Maple leaf
  const leafTex = (() => {
    const S = 64;
    const c = cv(S, S);
    const x = c.getContext('2d')!;
    x.translate(S / 2, S / 2);
    x.beginPath();
    for (let a = 0; a <= 6.2832; a += 0.02) {
      const k = Math.abs(Math.cos(2.5 * a));
      const rr = (S / 2 - 3) * (0.36 + 0.64 * Math.pow(k, 0.55));
      x.lineTo(Math.cos(a - 1.5708) * rr, Math.sin(a - 1.5708) * rr * 1.02);
    }
    x.closePath();
    const g = x.createRadialGradient(0, -4, 1, 0, 0, S / 2);
    g.addColorStop(0, '#ff5a4a');
    g.addColorStop(0.6, '#d82a24');
    g.addColorStop(1, '#8c1418');
    x.fillStyle = g;
    x.fill();
    x.strokeStyle = 'rgba(60,8,10,.55)';
    x.lineWidth = 1.1;
    for (let v = 0; v < 5; v++) {
      const va = -1.5708 + (v - 2) * 0.62;
      x.beginPath();
      x.moveTo(0, 4);
      x.lineTo(Math.cos(va) * 24, Math.sin(va) * 24);
      x.stroke();
    }
    return toTex(c);
  })();

  // Soft glow falloff
  const glowTex = (() => {
    const S = 128;
    const c = cv(S, S);
    const x = c.getContext('2d')!;
    const r = S / 2;
    const g = x.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.18, 'rgba(255,255,255,.72)');
    g.addColorStop(0.45, 'rgba(255,255,255,.20)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, S, S);
    return toTex(c);
  })();

  // Foliage texture
  const foliageTex = (() => {
    const S = 256;
    const c = cv(S, S);
    const x = c.getContext('2d')!;
    for (let i = 0; i < 620; i++) {
      const a = Math.random() * 6.284;
      const d = Math.pow(Math.random(), 0.7) * (S / 2 - 8);
      const px = S / 2 + Math.cos(a) * d * rand(0.6, 1);
      const py = S / 2 + Math.sin(a) * d * rand(0.5, 1) - 10;
      const rr = rand(4, 15);
      const f = 1 - d / (S / 2);
      x.fillStyle = `rgba(${10 + 22 * f | 0},${20 + 30 * f | 0},${16 + 24 * f | 0},${rand(0.25, 0.7)})`;
      x.beginPath();
      x.arc(px, py, rr, 0, 7);
      x.fill();
    }
    return toTex(c);
  })();

  // Materials
  const MAT = {
    stone: new THREE.MeshStandardMaterial({ map: stoneTex, color: 0x6b737b, roughness: 0.94, metalness: 0.02 }),
    stoneD: new THREE.MeshStandardMaterial({ map: stoneTex, color: 0x474e56, roughness: 0.96, metalness: 0.02 }),
    wood: new THREE.MeshStandardMaterial({ map: charredTex, color: 0x333b45, roughness: 0.9, metalness: 0.03 }),
    tile: new THREE.MeshStandardMaterial({ map: tileTex, color: 0x44505e, roughness: 0.82, metalness: 0.08, side: THREE.DoubleSide }),
    verm: new THREE.MeshStandardMaterial({ color: 0x5f120f, roughness: 0.82, metalness: 0.03 }),
    vermLit: new THREE.MeshStandardMaterial({ color: 0x7d1813, roughness: 0.78, metalness: 0.03 }),
    shoji: new THREE.MeshBasicMaterial({ map: shojiTex, toneMapped: false }),
    ember: new THREE.MeshBasicMaterial({ color: 0xffcf94, toneMapped: false }),
    dark: new THREE.MeshStandardMaterial({ color: 0x171e26, roughness: 0.95, metalness: 0 }),
  };

  // Roof geometry generator
  function roofGeo(w: number, d: number, h: number, sweep?: number, flick?: number, th?: number, hip?: boolean) {
    sweep = sweep || 1.62;
    flick = flick || 1.1;
    th = th || 0.34;
    const NX = hip ? 16 : 12;
    const NZ = 16;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];

    function yAt(x: number, z: number) {
      const u = Math.abs(x) / (w / 2);
      const v = Math.abs(z) / (d / 2);
      if (hip) {
        const t2 = Math.max(u, v);
        return h * Math.pow(1 - t2, sweep!) + Math.pow(Math.min(u, v), 4) * t2 * t2 * flick!;
      }
      const t = v;
      const base = h * Math.pow(1 - t, sweep!);
      const edge = Math.pow(u, 6) * t * t * flick!;
      return base + edge;
    }

    for (let s = 0; s < 2; s++) {
      for (let j = 0; j <= NZ; j++) {
        const z = -d / 2 + d * (j / NZ);
        for (let i = 0; i <= NX; i++) {
          const x = -w / 2 + w * (i / NX);
          pos.push(x, yAt(x, z) - (s ? th : 0), z);
          uv.push(i / NX, j / NZ);
        }
      }
    }

    const per = (NX + 1) * (NZ + 1);
    function quad(a: number, b: number, c: number, e: number) {
      idx.push(a, b, c, c, b, e);
    }

    for (let j = 0; j < NZ; j++) {
      for (let i = 0; i < NX; i++) {
        const a = j * (NX + 1) + i;
        const b = a + 1;
        const c = a + (NX + 1);
        const e = c + 1;
        quad(a, c, b, e);
        quad(per + a, per + b, per + c, per + e);
      }
    }

    for (let i = 0; i < NX; i++) {
      const f0 = i, f1 = i + 1, b0 = per + i, b1 = per + i + 1;
      quad(f0, b0, f1, b1);
      const r0 = NZ * (NX + 1) + i, r1 = r0 + 1;
      quad(r0, r1, per + r0, per + r1);
    }
    for (let j = 0; j < NZ; j++) {
      const l0 = j * (NX + 1), l1 = (j + 1) * (NX + 1);
      quad(l0, l1, per + l0, per + l1);
      const g0 = l0 + NX, g1 = l1 + NX;
      quad(g0, per + g0, g1, per + g1);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  // World construction
  const STEP_N = 24;
  const STEP_RISE = 0.245;
  const STEP_RUN = 0.6;
  const STEP_Z0 = -9.5;
  const TERRACE_Y = STEP_N * STEP_RISE;
  const TERRACE_Z = STEP_Z0 - STEP_N * STEP_RUN;

  // Ground
  const gMesh = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), MAT.stoneD.clone());
  gMesh.material.color.setHex(0x1f242a);
  gMesh.rotation.x = -Math.PI / 2;
  WORLD.add(gMesh);

  // Gravel apron
  const ap = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 16),
    new THREE.MeshStandardMaterial({ map: stoneTex, color: 0x3f464d, roughness: 0.98, metalness: 0 })
  );
  ap.rotation.x = -Math.PI / 2;
  ap.position.set(0, 0.02, 2.4);
  WORLD.add(ap);

  // Steps
  const halfSteps = new THREE.Group();
  for (let i = 0; i < STEP_N; i++) {
    const w = lerp(14.4, 11.2, i / STEP_N);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, STEP_RISE, STEP_RUN + 0.04), MAT.stone);
    m.position.set(0, i * STEP_RISE + STEP_RISE / 2, STEP_Z0 - i * STEP_RUN);
    halfSteps.add(m);
  }

  // Cheek walls
  for (let s = -1; s <= 1; s += 2) {
    const len = STEP_N * STEP_RUN;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, len), MAT.stoneD);
    wall.position.set(s * 7.4, TERRACE_Y * 0.5, STEP_Z0 - len / 2);
    wall.rotation.x = -Math.atan2(TERRACE_Y, len);
    halfSteps.add(wall);
  }

  const terrace = new THREE.Mesh(new THREE.BoxGeometry(38, 0.9, 22), MAT.stone);
  terrace.position.set(0, TERRACE_Y - 0.45, TERRACE_Z - 10);
  halfSteps.add(terrace);
  WORLD.add(halfSteps);

  // Torii (Sanmon)
  const toriiGroup = new THREE.Group();
  const PH = 7.6, SPAN = 2.95, Z_TORII = -7.0;
  for (let s = -1; s <= 1; s += 2) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, PH, 18), MAT.verm);
    p.position.set(s * SPAN, PH / 2, Z_TORII);
    toriiGroup.add(p);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.58, 0.5, 16), MAT.stoneD);
    base.position.set(s * SPAN, 0.25, Z_TORII);
    toriiGroup.add(base);
  }

  const GOLD = new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 0.34, metalness: 0.72 });
  for (let b = -1; b <= 1; b += 2) {
    const collarLo = new THREE.Mesh(new THREE.CylinderGeometry(0.345, 0.4, 0.3, 18), GOLD);
    collarLo.position.set(b * SPAN, 0.78, Z_TORII);
    toriiGroup.add(collarLo);

    const collarHi = new THREE.Mesh(new THREE.CylinderGeometry(0.315, 0.325, 0.24, 18), GOLD);
    collarHi.position.set(b * SPAN, PH * 0.7, Z_TORII);
    toriiGroup.add(collarHi);

    for (let q = 0; q < 4; q++) {
      const prong = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.3, 6), GOLD);
      prong.position.set(
        b * SPAN + Math.sin(q * Math.PI / 2) * 0.33,
        PH * 0.7,
        Z_TORII + Math.cos(q * Math.PI / 2) * 0.33
      );
      prong.rotation.z = -Math.sin(q * Math.PI / 2) * 0.5;
      prong.rotation.x = Math.cos(q * Math.PI / 2) * 0.5;
      toriiGroup.add(prong);
    }
  }

  const nuki = new THREE.Mesh(new THREE.BoxGeometry(SPAN * 2 + 1.5, 0.44, 0.56), MAT.vermLit);
  nuki.position.set(0, PH * 0.74, Z_TORII);
  toriiGroup.add(nuki);

  const gz = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.05, 0.46), MAT.verm);
  gz.position.set(0, PH * 0.83, Z_TORII);
  toriiGroup.add(gz);

  const gzBand = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.16, 0.54), GOLD);
  gzBand.position.set(0, PH * 0.83, Z_TORII);
  toriiGroup.add(gzBand);

  const boss = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), GOLD);
  boss.position.set(0, PH * 0.83, Z_TORII + 0.26);
  toriiGroup.add(boss);

  const SEGS = 15;
  const LEN = SPAN * 2 + 2.6;
  const k_curve = 0.056;
  for (let i = 0; i < SEGS; i++) {
    const u = (i + 0.5) / SEGS - 0.5;
    const x = u * LEN;
    const y = PH * 0.93 + k_curve * x * x;
    const dy = 2 * k_curve * x;
    const seg = new THREE.Mesh(new THREE.BoxGeometry(LEN / SEGS + 0.05, 0.4, 0.86), MAT.vermLit);
    seg.position.set(x, y, Z_TORII);
    seg.rotation.z = Math.atan(dy);
    toriiGroup.add(seg);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(LEN / SEGS + 0.05, 0.22, 1.06), MAT.dark);
    cap.position.set(x, y + 0.3, Z_TORII);
    cap.rotation.z = Math.atan(dy);
    toriiGroup.add(cap);

    if (i === 0 || i === SEGS - 1) {
      const tip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.68, 1.14), GOLD);
      tip.position.set(x + (i ? 0.3 : -0.3), y + 0.16, Z_TORII);
      tip.rotation.z = Math.atan(dy);
      toriiGroup.add(tip);
    }
  }
  WORLD.add(toriiGroup);

  // Worship Halls
  function buildHall(o: { w: number; d: number; bh: number; rh: number; sweep: number; flick: number; win?: number }) {
    const g = new THREE.Group();
    const w = o.w, d = o.d, bh = o.bh;
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(w + 2.4, 1.1, d + 2.2), MAT.stone);
    plinth.position.y = 0.55;
    g.add(plinth);

    const body = new THREE.Mesh(new THREE.BoxGeometry(w, bh, d), MAT.wood);
    body.position.y = 1.1 + bh / 2;
    g.add(body);

    if (o.win) {
      const n = o.win;
      const gap = w / (n + 0.6);
      const ww = gap * 0.62;
      const wh = bh * 0.62;
      for (let i = 0; i < n; i++) {
        const sx = -w / 2 + gap * (i + 0.8);
        const sh = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), MAT.shoji);
        sh.position.set(sx, 1.1 + bh * 0.54, d / 2 + 0.06);
        g.add(sh);

        const sp = new THREE.Mesh(
          new THREE.PlaneGeometry(ww * 3.4, wh * 3.0),
          new THREE.MeshBasicMaterial({
            map: glowTex,
            color: 0xffa858,
            transparent: true,
            opacity: 0.16,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            fog: false,
            toneMapped: false,
          })
        );
        sp.position.set(sx, 1.1 + bh * 0.54, d / 2 + 0.1);
        g.add(sp);
      }
    }

    const r = new THREE.Mesh(roofGeo(w + 3.2, d + 2.8, o.rh, o.sweep, o.flick, 0.44), MAT.tile);
    r.position.y = 1.1 + bh;
    g.add(r);

    return g;
  }

  // Halls at three tiers
  const hMain = buildHall({ w: 22, d: 13, bh: 4.8, rh: 3.4, sweep: 1.55, flick: 1.25, win: 7 });
  hMain.position.set(0, TERRACE_Y, TERRACE_Z - 10);
  WORLD.add(hMain);

  const hSide = buildHall({ w: 12, d: 8.5, bh: 3.4, rh: 2.4, sweep: 1.6, flick: 0.9, win: 3 });
  hSide.position.set(16, TERRACE_Y + 1.2, TERRACE_Z - 7.5);
  hSide.rotation.y = -0.34;
  WORLD.add(hSide);

  const hDeep = buildHall({ w: 16, d: 10, bh: 4.2, rh: 2.8, sweep: 1.58, flick: 1.1, win: 5 });
  hDeep.position.set(-6, TERRACE_Y + 5.6, TERRACE_Z - 32);
  WORLD.add(hDeep);

  // Pagoda (Goju-no-to)
  function pagoda(x: number, y: number, z: number, storeys: number, baseW: number, storeyH: number) {
    const g = new THREE.Group();
    let top = 0;
    const pl = new THREE.Mesh(new THREE.BoxGeometry(baseW + 2.6, 1.2, baseW + 2.6), MAT.stone);
    pl.position.y = 0.6;
    g.add(pl);
    top += 1.2;

    for (let s = 0; s < storeys; s++) {
      const frac = s / storeys;
      const bw = baseW * (1 - frac * 0.38);
      const bh = storeyH * (1 - frac * 0.16);

      const b = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.72, bh, bw * 0.72), MAT.wood);
      b.position.y = top + bh / 2;
      g.add(b);

      const r = new THREE.Mesh(roofGeo(bw, bw, storeyH * 0.4, 1.72, bw * 0.16, 0.22, true), MAT.tile);
      r.position.y = top + bh;
      g.add(r);

      top += bh + storeyH * 0.3;
    }

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, storeyH * 1.5, 8), MAT.dark);
    mast.position.y = top + storeyH * 0.75;
    g.add(mast);

    for (let r = 0; r < 9; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3 - r * 0.021, 0.035, 6, 14), MAT.dark);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = top + storeyH * 0.3 + r * (storeyH * 0.088);
      g.add(ring);
    }

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.58, 8), MAT.dark);
    tip.position.y = top + storeyH * 1.56;
    g.add(tip);

    g.position.set(x, y, z);
    WORLD.add(g);
    return g;
  }
  pagoda(-20.0, TERRACE_Y + 0.6, TERRACE_Z - 15, 5, 7.0, 3.07);

  // Stone Lanterns
  const BILLBOARDS: THREE.Object3D[] = [];
  function lantern(x: number, y: number, z: number, s?: number) {
    const g = new THREE.Group();
    s = s || 1;
    const add = (m: THREE.Mesh, py: number) => {
      m.position.y = py;
      g.add(m);
      return m;
    };
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.54, 0.26, 10), MAT.stoneD), 0.13);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 1.45, 10), MAT.stone), 0.98);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.16, 10), MAT.stone), 1.78);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.56, 0.54), MAT.stoneD), 2.14);

    for (let f = 0; f < 4; f++) {
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.36), MAT.shoji);
      pl.position.set(Math.sin(f * Math.PI / 2) * 0.276, 2.14, Math.cos(f * Math.PI / 2) * 0.276);
      pl.rotation.y = f * Math.PI / 2;
      g.add(pl);
    }

    const roof = add(new THREE.Mesh(new THREE.ConeGeometry(0.66, 0.4, 4), MAT.stoneD), 2.62);
    roof.rotation.y = Math.PI / 4;
    add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), MAT.stoneD), 2.88);

    const bloom = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.2),
      new THREE.MeshBasicMaterial({
        map: glowTex,
        color: 0xffab5c,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: true,
        toneMapped: false,
      })
    );
    bloom.position.y = 2.14;
    g.add(bloom);
    BILLBOARDS.push(bloom);

    g.position.set(x, y, z);
    g.scale.setScalar(s);
    WORLD.add(g);
    return g;
  }

  for (let li = 0; li < STEP_N; li += 6) {
    const ly = li * STEP_RISE;
    const lz = STEP_Z0 - li * STEP_RUN;
    lantern(-6.5, ly, lz, 1);
    lantern(6.5, ly, lz, 1);
  }
  lantern(-9.5, TERRACE_Y, TERRACE_Z - 2, 1.25);
  lantern(9.5, TERRACE_Y, TERRACE_Z - 2, 1.25);
  lantern(-7.2, 0, 1.2, 1.1);
  lantern(7.2, 0, 1.2, 1.1);

  // Trees and maples
  const darkFoliage = new THREE.MeshBasicMaterial({
    map: foliageTex,
    transparent: true,
    color: 0x1c262a,
    depthWrite: false,
    fog: true,
  });
  const redFoliage = new THREE.MeshBasicMaterial({
    map: foliageTex,
    transparent: true,
    color: 0x8f1f1c,
    depthWrite: false,
    fog: true,
  });

  for (let i = 0; i < 58; i++) {
    const a = rand(-1.55, 1.55) - Math.PI / 2;
    const r = rand(46, 96);
    const s = rand(9, 22);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s * 1.25), darkFoliage);
    m.position.set(Math.cos(a) * r, rand(1, 7) + s * 0.42, Math.sin(a) * r - 20);
    WORLD.add(m);
    BILLBOARDS.push(m);
  }

  const CEDAR = new THREE.MeshStandardMaterial({ color: 0x0b1216, roughness: 1, metalness: 0 });
  for (let j = 0; j < 18; j++) {
    const side = j % 2 ? 1 : -1;
    const t = j / 18;
    const x = side * rand(17, 27);
    const z = lerp(-4, TERRACE_Z, t) + rand(-2, 2);
    const h = rand(6, 11);
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.3, h, 7), CEDAR);
    tr.position.set(x, h / 2, z);
    WORLD.add(tr);
    const cn = new THREE.Mesh(new THREE.ConeGeometry(rand(0.9, 1.6), rand(5, 8.5), 7), CEDAR);
    cn.position.set(x, h + 1.6, z);
    WORLD.add(cn);
  }

  const spots = [
    [-8.6, 0, -1.5],
    [9.2, 0, -2.2],
    [-11.5, 0, -8],
    [11.9, 0, -9.4],
    [-7.4, TERRACE_Y, TERRACE_Z + 1.5],
    [8.1, TERRACE_Y, TERRACE_Z + 0.5],
  ];
  for (let k = 0; k < spots.length; k++) {
    const p = spots[k];
    const hh = rand(3.4, 5.2);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.22, hh, 6), MAT.dark);
    trunk.position.set(p[0], p[1] + hh / 2, p[2]);
    WORLD.add(trunk);
    for (let c = 0; c < 4; c++) {
      const sz = rand(2.6, 4.4);
      const fm = new THREE.Mesh(new THREE.PlaneGeometry(sz, sz * 0.85), redFoliage);
      fm.position.set(p[0] + rand(-1.3, 1.3), p[1] + hh + rand(-0.4, 1.5), p[2] + rand(-1, 1));
      WORLD.add(fm);
      BILLBOARDS.push(fm);
    }
  }

  // Sky dome, stars, moon, mist
  const skyGrad = (() => {
    const c = cv(4, 256);
    const x = c.getContext('2d')!;
    const g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#03050a');
    g.addColorStop(0.4, '#0a0e17');
    g.addColorStop(0.62, '#141a24');
    g.addColorStop(0.8, '#1d2028');
    g.addColorStop(1, '#080b11');
    x.fillStyle = g;
    x.fillRect(0, 0, 4, 256);
    return toTex(c);
  })();

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(210, 32, 20),
    new THREE.MeshBasicMaterial({ map: skyGrad, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false })
  );
  dome.renderOrder = -30;
  SKY.add(dome);

  const STAR_N = 900;
  const starPos = new Float32Array(STAR_N * 3);
  for (let i = 0; i < STAR_N; i++) {
    const a = Math.random() * Math.PI * 2;
    const e = Math.acos(rand(0.05, 1));
    const r = 168;
    starPos[i * 3] = Math.sin(e) * Math.cos(a) * r;
    starPos[i * 3 + 1] = Math.cos(e) * r * 0.9 + 12;
    starPos[i * 3 + 2] = Math.sin(e) * Math.sin(a) * r;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      map: glowTex,
      size: 1.5,
      color: 0xbcd0f0,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      sizeAttenuation: true,
      toneMapped: false,
    })
  );
  stars.renderOrder = -20;
  SKY.add(stars);

  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(96, 96),
    new THREE.MeshBasicMaterial({
      map: glowTex,
      color: 0xc4404f,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    })
  );
  halo.position.set(31, 42, -104);
  SKY.add(halo);

  const moon = new THREE.Mesh(
    new THREE.PlaneGeometry(27, 27),
    new THREE.MeshBasicMaterial({ map: moonTex, transparent: true, depthWrite: false, fog: false, toneMapped: false })
  );
  moon.position.set(31, 42, -104);
  SKY.add(moon);

  for (let m = 0; m < 7; m++) {
    const mist = new THREE.Mesh(
      new THREE.PlaneGeometry(rand(50, 90), rand(10, 20)),
      new THREE.MeshBasicMaterial({
        map: glowTex,
        color: 0x1b2634,
        transparent: true,
        opacity: rand(0.16, 0.34),
        depthWrite: false,
        fog: false,
        toneMapped: false,
      })
    );
    mist.position.set(rand(-30, 30), rand(3, 14), rand(-70, -34));
    mist.renderOrder = -8;
    SKY.add(mist);
  }

  // Giant 3D Wordmark
  const WORD = new THREE.Group();
  scene.add(WORD);
  const WORD_MATS: THREE.MeshBasicMaterial[] = [];
  const WORD_D = 7.62;

  function buildWord() {
    if (WORD.children.length) return;
    const letters = ['Y', 'U', 'K', 'A', 'I'];
    const SPAN = 2.34;
    const Z = 6.0;
    const Y = 4.56;
    const PLANE = 2.2;
    for (let i = 0; i < letters.length; i++) {
      const S = 512;
      const c = cv(S, S);
      const x = c.getContext('2d')!;
      const cap = S * 0.52;
      const px = cap / 0.715;
      x.font = `500 ${px.toFixed(0)}px Onest, "Helvetica Neue", Helvetica, Arial, sans-serif`;
      x.textAlign = 'center';
      x.textBaseline = 'alphabetic';
      x.fillStyle = '#eaf1ea';
      x.fillText(letters[i], S / 2, S / 2 + cap / 2);
      const mat = new THREE.MeshBasicMaterial({
        map: toTex(c),
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        opacity: 1,
      });
      WORD_MATS.push(mat);
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(PLANE, PLANE), mat);
      pl.position.set((i - 2) * SPAN, Y, Z);
      pl.renderOrder = 6;
      WORD.add(pl);
    }
    layoutWord();
  }

  function layoutWord() {
    const n = WORD.children.length;
    if (!n) return;
    const half = Math.tan(fitFov(CAM[0].fov) * Math.PI / 360) * WORD_D;
    const span = Math.max(half * (W / H) * 1.8 / (n - 1), 0.42);
    const size = Math.min(half * 0.84, span * 1.62);
    for (let i = 0; i < n; i++) {
      const m = WORD.children[i];
      m.scale.setScalar(size / 2.2);
      m.position.x = (i - (n - 1) / 2) * span;
    }
  }

  if (doc.fonts && doc.fonts.ready) {
    const wordTimer = setTimeout(buildWord, 1400);
    doc.fonts.ready.then(() => {
      if (!WORD.children.length) {
        clearTimeout(wordTimer);
        buildWord();
      }
    });
  } else {
    buildWord();
  }

  // Weather: Leaves, Rain, Embers, Sparks
  const DUMMY = new THREE.Object3D();
  const LEAF_N = REDUCED ? 40 : 170;
  const leafMesh = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.46, 0.46),
    new THREE.MeshBasicMaterial({
      map: leafTex,
      transparent: true,
      alphaTest: 0.28,
      side: THREE.DoubleSide,
      fog: true,
      toneMapped: false,
    }),
    LEAF_N
  );
  leafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(leafMesh);

  interface LeafState {
    x: number; y: number; z: number; fall: number; sway: number; amp: number; ph: number;
    rx: number; ry: number; rz: number; sx: number; sy: number; sz: number; sc: number;
  }
  const LEAVES: LeafState[] = [];
  for (let l = 0; l < LEAF_N; l++) {
    LEAVES.push({
      x: rand(-26, 26), y: rand(0, 24), z: rand(-34, 15),
      fall: rand(0.55, 1.5), sway: rand(0.5, 1.6), amp: rand(0.5, 1.7), ph: rand(0, 6.28),
      rx: rand(0, 6.28), ry: rand(0, 6.28), rz: rand(0, 6.28),
      sx: rand(-1.4, 1.4), sy: rand(-1.9, 1.9), sz: rand(-1.2, 1.2),
      sc: rand(0.55, 1.5),
    });
  }

  const RAIN_N = REDUCED ? 0 : 1300;
  const rainPos = new Float32Array(RAIN_N * 6);
  interface RainState { x: number; y: number; z: number; v: number; len: number }
  const RAINS: RainState[] = [];
  for (let r0 = 0; r0 < RAIN_N; r0++) {
    RAINS.push({ x: rand(-34, 34), y: rand(0, 34), z: rand(-44, 18), v: rand(15, 27), len: rand(0.3, 0.85) });
  }
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.LineSegments(
    rainGeo,
    new THREE.LineBasicMaterial({ color: 0x9fb8dc, transparent: true, opacity: 0.15, fog: true })
  );
  if (RAIN_N) scene.add(rain);

  function pointField(n: number, col: number, size: number, opacity: number, twinkle?: boolean) {
    const p = new Float32Array(n * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    let c: Float32Array | null = null;
    if (twinkle) {
      c = new Float32Array(n * 3);
      for (let k = 0; k < n * 3; k++) c[k] = 1;
      g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    }
    const m = new THREE.Points(
      g,
      new THREE.PointsMaterial({
        map: glowTex,
        size,
        color: col,
        transparent: true,
        opacity,
        vertexColors: !!twinkle,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        fog: true,
        toneMapped: false,
      })
    );
    scene.add(m);
    return { mesh: m, arr: p, col: c, n, state: [] as any[] };
  }

  const EMB = pointField(REDUCED ? 50 : 200, 0xffc27a, 0.42, 0.85);
  for (let e0 = 0; e0 < EMB.n; e0++) {
    EMB.state.push({
      x: rand(-16, 16), y: rand(0, 12), z: rand(-30, 10),
      v: rand(0.16, 0.6), ph: rand(0, 6.28), am: rand(0.2, 1.1),
    });
  }

  const SPK = pointField(REDUCED ? 90 : 520, 0xeaf4ff, 0.34, 0.95, true);
  for (let s0 = 0; s0 < SPK.n; s0++) {
    SPK.state.push({
      x: rand(-26, 26), y: rand(0.5, 19), z: rand(-40, 10),
      v: rand(0.05, 0.3), ph: rand(0, 6.28), am: rand(0.3, 1.8), tw: rand(0.7, 2.1),
    });
  }

  function stepWeather(t: number, dt: number) {
    for (let i = 0; i < LEAF_N; i++) {
      const s = LEAVES[i];
      s.y -= s.fall * dt;
      if (s.y < -1.5) {
        s.y = rand(18, 26);
        s.x = rand(-26, 26);
        s.z = rand(-34, 15);
      }
      s.rx += s.sx * dt;
      s.ry += s.sy * dt;
      s.rz += s.sz * dt;
      DUMMY.position.set(
        s.x + Math.sin(t * s.sway + s.ph) * s.amp,
        s.y,
        s.z + Math.cos(t * s.sway * 0.7 + s.ph) * s.amp * 0.5
      );
      DUMMY.rotation.set(s.rx, s.ry, s.rz);
      DUMMY.scale.setScalar(s.sc);
      DUMMY.updateMatrix();
      leafMesh.setMatrixAt(i, DUMMY.matrix);
    }
    leafMesh.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < RAIN_N; i++) {
      const s = RAINS[i];
      s.y -= s.v * dt;
      if (s.y < -1) {
        s.y = rand(26, 38);
        s.x = rand(-34, 34);
        s.z = rand(-44, 18);
      }
      const o = i * 6;
      rainPos[o] = s.x;
      rainPos[o + 1] = s.y;
      rainPos[o + 2] = s.z;
      rainPos[o + 3] = s.x - s.len * 0.24;
      rainPos[o + 4] = s.y - s.len * 3.2;
      rainPos[o + 5] = s.z;
    }
    if (RAIN_N) rainGeo.attributes.position.needsUpdate = true;

    for (let i = 0; i < EMB.n; i++) {
      const s = EMB.state[i];
      s.y += s.v * dt;
      if (s.y > 15) {
        s.y = rand(-0.5, 1);
        s.x = rand(-16, 16);
        s.z = rand(-30, 10);
      }
      EMB.arr[i * 3] = s.x + Math.sin(t * 0.5 + s.ph) * s.am;
      EMB.arr[i * 3 + 1] = s.y;
      EMB.arr[i * 3 + 2] = s.z + Math.cos(t * 0.38 + s.ph) * s.am * 0.6;
    }
    EMB.mesh.geometry.attributes.position.needsUpdate = true;

    for (let i = 0; i < SPK.n; i++) {
      const s = SPK.state[i];
      s.y += s.v * dt * Math.sin(t * 0.3 + s.ph);
      SPK.arr[i * 3] = s.x + Math.sin(t * 0.22 + s.ph) * s.am;
      SPK.arr[i * 3 + 1] = s.y;
      SPK.arr[i * 3 + 2] = s.z + Math.cos(t * 0.19 + s.ph) * s.am;
      const f = 0.18 + 0.82 * Math.pow(0.5 + 0.5 * Math.sin(t * s.tw + s.ph * 3.1), 2.2);
      if (SPK.col) {
        SPK.col[i * 3] = SPK.col[i * 3 + 1] = SPK.col[i * 3 + 2] = f;
      }
    }
    SPK.mesh.geometry.attributes.position.needsUpdate = true;
    if (SPK.col) SPK.mesh.geometry.attributes.color.needsUpdate = true;
  }

  // Camera Rig
  type CamStation = { p: [number, number, number]; t: [number, number, number]; fov: number };
  const CAM: CamStation[] = [
    { p: [0.0, 4.05, 13.6], t: [0.0, 6.6, -18.0], fov: 36 }, // 00 hero
    { p: [-6.8, 2.1, 8.0], t: [1.4, 5.2, -16.0], fov: 52 }, // 01 sanmon
    { p: [4.6, 8.4, 4.5], t: [-1.2, 5.0, -26.0], fov: 34 }, // 02 gardens
    { p: [-7.5, 1.9, -3.5], t: [3.5, 9.5, -24.0], fov: 58 }, // 03 craft
    { p: [0.4, 5.2, -8.0], t: [0.0, 9.0, -28.0], fov: 50 }, // 04 afterlight
    { p: [0.0, 11.0, -17.0], t: [0.0, 5.0, -30.0], fov: 48 }, // 05 colophon
  ];

  const curveP = new THREE.CatmullRomCurve3(CAM.map((c) => V3(c.p)), false, 'catmullrom', 0.42);
  const curveT = new THREE.CatmullRomCurve3(CAM.map((c) => V3(c.t)), false, 'catmullrom', 0.42);
  const _p = new THREE.Vector3();
  const _t = new THREE.Vector3();

  function fitFov(fov: number) {
    const a = W / H, ref = 1.72;
    return a >= ref ? fov : fov * (1 + (ref - a) / ref * 0.52);
  }

  let scrollP = 0;
  let scrollTarget = 0;
  let mx = 0, my = 0, mxT = 0, myT = 0;

  function driveCamera() {
    const N = CAM.length - 1;
    const f = clamp(scrollP, 0, 1) * N;
    const i = clamp(Math.floor(f), 0, N - 1);
    const u = f - i;
    curveP.getPoint(clamp(scrollP, 0, 1), _p);
    curveT.getPoint(clamp(scrollP, 0, 1), _t);
    const fov = fitFov(lerp(CAM[i].fov, CAM[i + 1].fov, smooth(u)));

    const drift = 1 - clamp(scrollP * 1.6, 0, 0.78);
    _p.x += mx * 1.5 * drift;
    _p.y += my * 0.85 * drift;
    _t.x -= mx * 0.9 * drift;
    _t.y -= my * 0.5 * drift;

    camera.position.copy(_p);
    camera.lookAt(_t);
    if (Math.abs(camera.fov - fov) > 1e-3) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    const wo = (1 - smooth(clamp((scrollP - 0.012) / 0.1, 0, 1)) * 0.94) *
               (1 - smooth(clamp((scrollP - 0.13) / 0.09, 0, 1)));
    for (let k = 0; k < WORD_MATS.length; k++) {
      WORD_MATS[k].opacity = wo;
    }
    WORD.visible = wo > 0.004;
  }

  // Scissored Card Views
  const VIEW_DEFS = [
    { p: [-2.0, 1.6, -2.0] as [number, number, number], t: [0.0, 10.0, -34.0] as [number, number, number], fov: 40 }, // 0 approach
    { p: [4.2, 2.9, -9.5] as [number, number, number], t: [6.4, 2.9, -14.4] as [number, number, number], fov: 40 }, // 1 lantern court
    { p: [6.0, 1.5, 6.0] as [number, number, number], t: [26.0, 46.0, -100.0] as [number, number, number], fov: 32 }, // 2 wet court
    { p: [0.6, 3.4, -12.0] as [number, number, number], t: [0.0, 12.0, -40.0] as [number, number, number], fov: 26 }, // 3 hero peek
  ];

  interface ScissorView {
    cam: THREE.PerspectiveCamera;
    el: HTMLElement;
  }
  let VIEWS: ScissorView[] = [];

  function setupCardViews() {
    VIEWS = [];
    const elements = doc.querySelectorAll<HTMLElement>('[data-view]');
    elements.forEach((el) => {
      const idx = +(el.getAttribute('data-view') || '0');
      const d = VIEW_DEFS[idx];
      if (!d) return;
      const frame = el.querySelector<HTMLElement>('[data-frame]') || el;
      const c = new THREE.PerspectiveCamera(d.fov, 1.6, 0.3, 220);
      c.position.set(d.p[0], d.p[1], d.p[2]);
      const look = V3(d.t);
      c.userData = { home: c.position.clone(), look, push: 0, want: 0, ph: Math.random() * 6.28 };
      c.lookAt(look);
      VIEWS.push({ cam: c, el: frame });

      el.addEventListener('pointerenter', () => {
        c.userData.want = 1;
      });
      el.addEventListener('pointerleave', () => {
        c.userData.want = 0;
      });
    });
  }

  function renderViews(t: number) {
    if (!VIEWS.length) return;
    const vh = win.innerHeight;
    const vw = win.innerWidth;
    renderer.setScissorTest(true);

    for (let i = 0; i < VIEWS.length; i++) {
      const v = VIEWS[i];
      const r = v.el.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40 || r.width < 8 || r.height < 8) continue;
      const u = v.cam.userData;
      u.push += (u.want - u.push) * 0.07;
      const fwd = u.look.clone().sub(u.home).normalize();
      v.cam.position
        .copy(u.home)
        .addScaledVector(fwd, u.push * 1.5)
        .add(new THREE.Vector3(Math.sin(t * 0.22 + u.ph) * 0.22, Math.cos(t * 0.17 + u.ph) * 0.12, 0));
      v.cam.lookAt(u.look);
      v.cam.aspect = r.width / r.height;
      v.cam.updateProjectionMatrix();

      const x = r.left;
      const y = vh - r.bottom;
      const w = r.width;
      const h = r.height;
      renderer.setViewport(x, y, w, h);
      renderer.setScissor(x, y, w, h);
      renderer.clear(true, true, false);
      renderer.render(scene, v.cam);
    }

    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, vw, vh);
  }

  // Face billboards to camera
  function faceCamera() {
    for (let i = 0; i < BILLBOARDS.length; i++) {
      const m = BILLBOARDS[i];
      m.rotation.y = Math.atan2(camera.position.x - m.position.x, camera.position.z - m.position.z);
    }
  }

  // Render Loop
  let isRunning = true;
  let last = performance.now();
  const t0 = last;

  function tick(now: number) {
    if (!isRunning) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = (now - t0) / 1000;

    scrollP += (scrollTarget - scrollP) * (REDUCED ? 1 : 0.085);
    mx += (mxT - mx) * 0.055;
    my += (myT - my) * 0.055;

    driveCamera();
    faceCamera();
    stepWeather(t, dt);

    renderer.setViewport(0, 0, W, H);
    renderer.setScissorTest(false);
    renderer.clear(true, true, false);
    renderer.render(scene, camera);

    renderViews(t);

    requestAnimationFrame(tick);
  }

  // Resize handler
  function onResize() {
    W = win.innerWidth;
    H = win.innerHeight;
    DPR = Math.min(win.devicePixelRatio || 1, 1.85);
    renderer.setPixelRatio(DPR);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    layoutWord();
  }

  win.addEventListener('resize', onResize, { passive: true });
  requestAnimationFrame(tick);

  setTimeout(setupCardViews, 300);

  return {
    setScrollProgress: (p: number) => {
      scrollTarget = clamp(p, 0, 1);
    },
    setPointer: (x: number, y: number) => {
      mxT = (x / W - 0.5) * 2;
      myT = (y / H - 0.5) * 2;
    },
    destroy: () => {
      isRunning = false;
      win.removeEventListener('resize', onResize);
      renderer.dispose();
    },
  };
}
