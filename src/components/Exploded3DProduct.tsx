import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Eye, Move3d, RotateCw } from 'lucide-react';

interface Exploded3DProductProps {
  explosionFactor?: number; // 0 (assembled) to 1 (fully exploded)
  onExplosionChange?: (val: number) => void;
}

export const Exploded3DProduct: React.FC<Exploded3DProductProps> = ({
  explosionFactor: externalExplosionFactor,
  onExplosionChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [internalExplosion, setInternalExplosion] = useState(0.85);
  const explosion = externalExplosionFactor ?? internalExplosion;

  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Mouse parallax refs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    currentMount.appendChild(renderer.domElement);

    // Lighting Studio
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const goldPointLight = new THREE.PointLight(0xc4a35a, 2.5, 20);
    goldPointLight.position.set(-5, -5, 5);
    scene.add(goldPointLight);

    const bluePointLight = new THREE.PointLight(0x38bdf8, 2.0, 20);
    bluePointLight.position.set(5, 5, 8);
    scene.add(bluePointLight);

    // Group holding the 5 exploded product layers
    const productGroup = new THREE.Group();
    scene.add(productGroup);

    // Common dimensions
    const layerWidth = 4.2;
    const layerHeight = 5.2;
    const cornerRadius = 0.4;

    // Helper to create rounded rectangle shape
    const createRoundedRect = (w: number, h: number, r: number) => {
      const shape = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      return shape;
    };

    const roundedShape = createRoundedRect(layerWidth, layerHeight, cornerRadius);

    // Layers configuration
    // Layer 5 (back): PRODUCT outer shell
    // Layer 4: MECHANICAL gears & frame
    // Layer 3: ELECTRONICS copper PCB & components
    // Layer 2: EMBEDDED green circuit traces & chips
    // Layer 1 (front): SOFTWARE translucent UI elements
    const layersData: Array<{
      id: number;
      label: string;
      title: string;
      color: number;
      baseZ: number;
      maxOffsetZ: number;
      meshGroup: THREE.Group;
    }> = [];

    // --- LAYER 5: PRODUCT OUTER SHELL (Back) ---
    const layer5Group = new THREE.Group();
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f5,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const shellExtrude = new THREE.ExtrudeGeometry(roundedShape, {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    const shellMesh = new THREE.Mesh(shellExtrude, shellMat);
    shellMesh.position.z = -0.15;
    layer5Group.add(shellMesh);

    // Decorative camera bump & logo
    const bumpGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const bumpMat = new THREE.MeshStandardMaterial({ color: 0x1a3c2f, roughness: 0.1 });
    const bumpMesh = new THREE.Mesh(bumpGeo, bumpMat);
    bumpMesh.rotation.x = Math.PI / 2;
    bumpMesh.position.set(-1.2, 1.6, -0.2);
    layer5Group.add(bumpMesh);

    layersData.push({
      id: 5,
      label: '01 / PRODUCT',
      title: 'White Matte Outer Enclosure',
      color: 0xfaf8f5,
      baseZ: -2.2,
      maxOffsetZ: -2.8,
      meshGroup: layer5Group,
    });

    // --- LAYER 4: MECHANICAL STRUCTURAL FRAME & GEARS ---
    const layer4Group = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.3,
      transparent: true,
      opacity: 0.92,
    });

    // Frame ring
    const frameExtrude = new THREE.ExtrudeGeometry(roundedShape, {
      depth: 0.12,
      bevelEnabled: false,
    });
    const frameMesh = new THREE.Mesh(frameExtrude, frameMat);
    layer4Group.add(frameMesh);

    // Mechanical gears & brackets
    for (let i = 0; i < 4; i++) {
      const gearGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16);
      const gearMat = new THREE.MeshStandardMaterial({ color: 0xc4a35a, metalness: 0.9, roughness: 0.2 });
      const gearMesh = new THREE.Mesh(gearGeo, gearMat);
      gearMesh.rotation.x = Math.PI / 2;
      gearMesh.position.set((i % 2 === 0 ? 1 : -1) * 1.1, (i < 2 ? 1 : -1) * 1.4, 0.1);
      layer4Group.add(gearMesh);
    }

    layersData.push({
      id: 4,
      label: '02 / MECHANICAL',
      title: 'Silver Metallic Frame & Mounting Brackets',
      color: 0x94a3b8,
      baseZ: -1.1,
      maxOffsetZ: -1.4,
      meshGroup: layer4Group,
    });

    // --- LAYER 3: ELECTRONICS PCB & CAPACITORS ---
    const layer3Group = new THREE.Group();
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Copper/gold tone PCB
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const pcbGeo = new THREE.PlaneGeometry(layerWidth - 0.2, layerHeight - 0.2);
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    layer3Group.add(pcbMesh);

    // Capacitors and resistors grid
    for (let x = -1.4; x <= 1.4; x += 0.7) {
      for (let y = -1.8; y <= 1.8; y += 0.9) {
        if (Math.random() > 0.3) {
          const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16);
          const capMat = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? 0xc4a35a : 0x1a3c2f,
            metalness: 0.8,
          });
          const capMesh = new THREE.Mesh(capGeo, capMat);
          capMesh.rotation.x = Math.PI / 2;
          capMesh.position.set(x, y, 0.12);
          layer3Group.add(capMesh);
        }
      }
    }

    layersData.push({
      id: 3,
      label: '03 / ELECTRONICS',
      title: 'Gold/Copper PCB Traces & Passive Components',
      color: 0xc4a35a,
      baseZ: 0,
      maxOffsetZ: 0,
      meshGroup: layer3Group,
    });

    // --- LAYER 2: EMBEDDED SYSTEM CHIPS & TRACES ---
    const layer2Group = new THREE.Group();
    const embedPcbMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Green circuit board
      roughness: 0.4,
      metalness: 0.2,
      transparent: true,
      opacity: 0.92,
    });
    const embedPcbGeo = new THREE.PlaneGeometry(layerWidth - 0.1, layerHeight - 0.1);
    const embedPcbMesh = new THREE.Mesh(embedPcbGeo, embedPcbMat);
    layer2Group.add(embedPcbMesh);

    // Microchips
    const chipGeo = new THREE.BoxGeometry(1.2, 1.2, 0.15);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
    const chipMesh = new THREE.Mesh(chipGeo, chipMat);
    chipMesh.position.set(0, 0.4, 0.1);
    layer2Group.add(chipMesh);

    const mcuGeo = new THREE.BoxGeometry(0.8, 0.8, 0.12);
    const mcuMesh = new THREE.Mesh(mcuGeo, chipMat);
    mcuMesh.position.set(0.9, -1.2, 0.08);
    layer2Group.add(mcuMesh);

    layersData.push({
      id: 2,
      label: '04 / EMBEDDED',
      title: 'Green Circuit Traces, ESP32/STM32 Microchips',
      color: 0x15803d,
      baseZ: 1.1,
      maxOffsetZ: 1.4,
      meshGroup: layer2Group,
    });

    // --- LAYER 1: SOFTWARE INTERFACE GLOW (Front) ---
    const layer1Group = new THREE.Group();
    const uiGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.85,
      opacity: 0.88,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.2,
    });
    const uiGlassGeo = new THREE.PlaneGeometry(layerWidth, layerHeight);
    const uiGlassMesh = new THREE.Mesh(uiGlassGeo, uiGlassMat);
    layer1Group.add(uiGlassMesh);

    // Floating UI wireframe elements
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.5, 1.8, 0.05),
      new THREE.Vector3(1.5, 1.8, 0.05),
      new THREE.Vector3(1.5, 0.8, 0.05),
      new THREE.Vector3(-1.5, 0.8, 0.05),
      new THREE.Vector3(-1.5, 1.8, 0.05),
    ]);
    const lineMesh = new THREE.Line(lineGeo, lineMat);
    layer1Group.add(lineMesh);

    layersData.push({
      id: 1,
      label: '05 / SOFTWARE',
      title: 'Translucent Cyan UI Interface & Digital Nodes',
      color: 0x38bdf8,
      baseZ: 2.2,
      maxOffsetZ: 2.8,
      meshGroup: layer1Group,
    });

    // Add all layer groups to main productGroup
    layersData.forEach((layer) => {
      productGroup.add(layer.meshGroup);
    });

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.4;
      mouseRef.current.targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Rotate group slightly
      if (autoRotate) {
        productGroup.rotation.y += 0.005;
      } else {
        productGroup.rotation.y = mouseRef.current.x * 0.8;
      }
      productGroup.rotation.x = mouseRef.current.y * 0.5 + 0.15;

      // Apply Z-axis exploded translation based on explosion factor
      layersData.forEach((layer) => {
        const targetZ = layer.baseZ + layer.maxOffsetZ * explosion;
        layer.meshGroup.position.z += (targetZ - layer.meshGroup.position.z) * 0.1;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate, explosion]);

  const layersInfo = [
    { id: 1, name: '05 / SOFTWARE', tag: 'UI & Cloud Logic', color: '#38BDF8' },
    { id: 2, name: '04 / EMBEDDED', tag: 'Microcontroller & Firmware', color: '#15803D' },
    { id: 3, name: '03 / ELECTRONICS', tag: 'PCB & Sensors', color: '#C4A35A' },
    { id: 4, name: '02 / MECHANICAL', tag: 'Cad Frame & Gears', color: '#94A3B8' },
    { id: 5, name: '01 / PRODUCT', tag: 'Matte Outer Enclosure', color: '#FAF8F5' },
  ];

  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[620px] flex flex-col justify-between items-center group">
      {/* WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" />

      {/* Floating Layer Tag Badges on Right */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-2.5">
        {layersInfo.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveLayer(item.id)}
            onMouseLeave={() => setActiveLayer(null)}
            className={`px-3 py-1.5 rounded-xl border transition-all duration-300 text-[10px] font-semibold tracking-wider uppercase flex items-center gap-2 backdrop-blur-md ${
              activeLayer === item.id
                ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F] scale-105 shadow-md'
                : 'bg-[#FAF8F5]/80 text-[#5C6B60] border-[#E8E2D9] hover:bg-[#1A3C2F] hover:text-[#FAF8F5]'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Bottom Floating Interactive Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF8F5]/90 backdrop-blur-md border border-[#E8E2D9] shadow-lg">
        {/* Explosion Range Slider */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Layers className="w-4 h-4 text-[#1A3C2F]" />
          <span className="text-[11px] font-bold tracking-wider text-[#1A3C2F] uppercase whitespace-nowrap">
            Explode 3D:
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explosion}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setInternalExplosion(val);
              if (onExplosionChange) onExplosionChange(val);
            }}
            className="w-full sm:w-32 h-1.5 bg-[#E8E2D9] rounded-lg appearance-none cursor-pointer accent-[#1A3C2F]"
          />
          <span className="text-[11px] font-mono text-[#5C6B60] min-w-[36px]">
            {Math.round(explosion * 100)}%
          </span>
        </div>

        {/* Auto Rotate Toggle & 3D Hint */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              autoRotate
                ? 'bg-[#1A3C2F] text-[#FAF8F5] border-[#1A3C2F]'
                : 'bg-[#FAF8F5] text-[#5C6B60] border-[#E8E2D9] hover:text-[#1A3C2F]'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
            <span>Orbit</span>
          </button>

          <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#5C6B60] pl-2 border-l border-[#E8E2D9]">
            <Move3d className="w-3.5 h-3.5 text-[#C4A35A]" /> Drag to Inspect
          </span>
        </div>
      </div>
    </div>
  );
};
