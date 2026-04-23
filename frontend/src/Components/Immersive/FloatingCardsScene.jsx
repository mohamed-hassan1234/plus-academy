import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera, RoundedBox, Text } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Noise } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function MouseRig({ groupRef }) {
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * -0.12,
      0.045
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.16,
      0.045
    );
  });

  return null;
}

function FloatingPanel({ item, index, total, progressRef }) {
  const panelRef = useRef(null);
  const angle = (Math.PI * 2 * index) / total;
  const layer = index % 3;

  useFrame((state) => {
    if (!panelRef.current) {
      return;
    }

    const progress = progressRef.current;
    const time = state.clock.elapsedTime;
    const orbit = angle + progress * Math.PI * 1.65 + time * 0.08;
    const radius = 2.15 + layer * 0.22;
    const y = Math.sin(orbit * 1.2 + index) * 0.45 + (layer - 1) * 0.36;
    const z = Math.cos(orbit) * 0.72 + (layer - 1) * 0.32;
    const x = Math.sin(orbit) * radius;

    panelRef.current.position.set(x, y, z);
    panelRef.current.rotation.x = Math.sin(time * 0.35 + index) * 0.16 + progress * 0.35;
    panelRef.current.rotation.y = -orbit + Math.PI / 2 + Math.sin(time * 0.22 + index) * 0.16;
    panelRef.current.rotation.z = Math.sin(time * 0.28 + index * 0.8) * 0.08;
  });

  return (
    <Float speed={0.7 + index * 0.03} rotationIntensity={0.12} floatIntensity={0.2}>
      <group ref={panelRef}>
        <RoundedBox args={[1.7, 1.05, 0.055]} radius={0.055} smoothness={6}>
          <meshPhysicalMaterial
            color="#FFFFFF"
            transparent
            opacity={0.58}
            roughness={0.18}
            metalness={0.08}
            transmission={0.22}
            thickness={0.18}
            clearcoat={0.55}
            clearcoatRoughness={0.18}
          />
        </RoundedBox>
        <RoundedBox args={[1.76, 1.11, 0.025]} radius={0.065} smoothness={6}>
          <meshBasicMaterial color="#00A99D" transparent opacity={0.08} />
        </RoundedBox>
        <Text
          position={[-0.66, 0.24, 0.05]}
          maxWidth={1.25}
          fontSize={0.12}
          lineHeight={1.05}
          color="#0B3D73"
          anchorX="left"
          anchorY="middle"
        >
          {item.title}
        </Text>
        <Text
          position={[-0.66, -0.02, 0.055]}
          maxWidth={1.24}
          fontSize={0.064}
          lineHeight={1.25}
          color="#315b82"
          anchorX="left"
          anchorY="middle"
        >
          {item.description}
        </Text>
        {item.meta ? (
          <Text
            position={[-0.66, -0.36, 0.06]}
            maxWidth={1.28}
            fontSize={0.058}
            color="#00A99D"
            anchorX="left"
            anchorY="middle"
          >
            {item.meta}
          </Text>
        ) : null}
      </group>
    </Float>
  );
}

function CardParticles() {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const count = 140;
    const array = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const a = Math.sin(index * 17.45) * 4321.21;
      const b = Math.sin(index * 9.13) * 9876.54;
      const c = Math.sin(index * 31.7) * 2468.31;
      array[index * 3] = (a - Math.floor(a) - 0.5) * 5.4;
      array[index * 3 + 1] = (b - Math.floor(b) - 0.5) * 2.6;
      array[index * 3 + 2] = (c - Math.floor(c) - 0.5) * 2.8;
    }

    return array;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.035;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00A99D" size={0.018} transparent opacity={0.62} />
    </points>
  );
}

function FloatingCardsWorld({ items, progressRef }) {
  const groupRef = useRef(null);

  return (
    <>
      <color attach="background" args={["#FFFFFF"]} />
      <PerspectiveCamera makeDefault position={[0, 0.12, 5.4]} fov={44} />
      <MouseRig groupRef={groupRef} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[1.8, 2.5, 3.2]} intensity={2.2} color="#FFFFFF" />
      <pointLight position={[-2.5, 1.4, 2.2]} intensity={1.6} color="#00A99D" />
      <CardParticles />
      <group ref={groupRef}>
        {items.map((item, index) => (
          <FloatingPanel
            key={`${item.title}-${index}`}
            item={item}
            index={index}
            total={items.length}
            progressRef={progressRef}
          />
        ))}
      </group>
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.55} luminanceThreshold={0.18} luminanceSmoothing={0.55} />
        <DepthOfField focusDistance={0.035} focalLength={0.035} bokehScale={1.35} />
        <Noise opacity={0.018} />
      </EffectComposer>
    </>
  );
}

function FloatingCardsScene({ items, className = "" }) {
  const wrapperRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top 82%",
      end: "bottom 18%",
      scrub: 0.9,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={wrapperRef} className={`floating-cards-scene ${className}`.trim()}>
      <Canvas
        dpr={[1, 1.45]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <FloatingCardsWorld items={items} progressRef={progressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default FloatingCardsScene;
