import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Edges, Float, PerspectiveCamera, shaderMaterial, Stars } from "@react-three/drei";
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, Noise } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const HologramMaterial = shaderMaterial(
  {
    time: 0,
    colorA: new THREE.Color("#009B8F"),
    colorB: new THREE.Color("#009B8F"),
  },
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      float scan = sin((vUv.y + time * 0.22) * 42.0) * 0.5 + 0.5;
      float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      vec3 color = mix(colorA, colorB, scan);
      float alpha = 0.32 + rim * 0.5 + scan * 0.12;
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ HologramMaterial });

function MouseCameraRig() {
  const { pointer } = useThree();

  useFrame((state) => {
    const activeCamera = state.camera;
    activeCamera.position.x = THREE.MathUtils.lerp(activeCamera.position.x, pointer.x * 0.75, 0.045);
    activeCamera.position.y = THREE.MathUtils.lerp(activeCamera.position.y, pointer.y * 0.45 + 0.3, 0.045);
    activeCamera.lookAt(0, 0, 0);
  });

  return null;
}

function HolographicRings() {
  const groupRef = useRef(null);
  const materials = useRef([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.18;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.15;
    }

    materials.current.forEach((material) => {
      if (material) {
        material.time = state.clock.elapsedTime;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((item) => (
        <mesh key={item} rotation={[Math.PI / 2 + item * 0.28, item * 0.38, 0]}>
          <torusGeometry args={[1.35 + item * 0.36, 0.012, 24, 180]} />
          <hologramMaterial
            ref={(material) => {
              materials.current[item] = material;
            }}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function LightBeams() {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.05;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.42) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0.15, 0.08, -1.25]} rotation={[0.15, -0.08, 0]}>
      {[-0.85, 0, 0.85].map((x, index) => (
        <mesh key={x} position={[x, 0.05, 0]} rotation={[0, 0, index === 1 ? 0 : x * 0.12]}>
          <coneGeometry args={[0.38, 3.6, 32, 1, true]} />
          <meshBasicMaterial
            color="#009B8F"
            transparent
            opacity={0.055}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function BookObject({ position, rotation }) {
  return (
    <Float speed={1.2} rotationIntensity={0.28} floatIntensity={0.32}>
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[0.75, 0.08, 0.48]} />
          <meshStandardMaterial color="#151A19" metalness={0.2} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.055, 0.02]}>
          <boxGeometry args={[0.72, 0.025, 0.44]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#009B8F" emissiveIntensity={0.08} />
        </mesh>
      </group>
    </Float>
  );
}

function DiplomaScrollObject({ position }) {
  return (
    <Float speed={1.18} rotationIntensity={0.24} floatIntensity={0.28}>
      <group position={position} rotation={[0.1, -0.35, 0.14]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.68, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.28} metalness={0.04} />
        </mesh>
        <mesh position={[0, -0.02, 0.01]} rotation={[0.05, 0, 0]}>
          <planeGeometry args={[0.72, 0.42, 12, 2]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#009B8F"
            emissiveIntensity={0.08}
            roughness={0.36}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0.18, -0.18, 0.025]}>
          <torusGeometry args={[0.07, 0.011, 16, 40]} />
          <meshStandardMaterial color="#009B8F" emissive="#009B8F" emissiveIntensity={0.34} />
        </mesh>
      </group>
    </Float>
  );
}

function CapObject({ position }) {
  return (
    <Float speed={1.05} rotationIntensity={0.32} floatIntensity={0.35}>
      <group position={position} rotation={[0.2, -0.45, 0.16]}>
        <mesh>
          <boxGeometry args={[0.72, 0.05, 0.72]} />
          <meshStandardMaterial color="#111716" emissive="#009B8F" emissiveIntensity={0.18} metalness={0.35} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.36, 0.17, 0.36]} />
          <meshStandardMaterial color="#151A19" metalness={0.25} roughness={0.22} />
        </mesh>
        <mesh position={[0.42, -0.05, 0.42]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#009B8F" emissive="#009B8F" emissiveIntensity={1.4} />
        </mesh>
      </group>
    </Float>
  );
}

function CertificateObject({ position }) {
  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.28}>
      <group position={position} rotation={[0.05, 0.45, -0.08]}>
        <mesh>
          <boxGeometry args={[0.54, 0.72, 0.025]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#009B8F" emissiveIntensity={0.04} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.2, 0.02]}>
          <boxGeometry args={[0.32, 0.035, 0.018]} />
          <meshStandardMaterial color="#009B8F" emissive="#009B8F" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, -0.12, 0.02]}>
          <torusGeometry args={[0.08, 0.012, 16, 48]} />
          <meshStandardMaterial color="#151A19" emissive="#009B8F" emissiveIntensity={0.18} />
        </mesh>
      </group>
    </Float>
  );
}

function ScreenObject({ position, rotation }) {
  return (
    <Float speed={0.95} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[0.78, 0.48, 0.03]} />
          <meshStandardMaterial color="#111716" emissive="#009B8F" emissiveIntensity={0.22} metalness={0.4} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <boxGeometry args={[0.62, 0.28, 0.012]} />
          <meshStandardMaterial color="#009B8F" emissive="#009B8F" emissiveIntensity={0.65} transparent opacity={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

function HologramPanel({ position, rotation, title, bars }) {
  return (
    <Float speed={0.72} rotationIntensity={0.16} floatIntensity={0.24}>
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[1.62, 0.96, 0.035]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#009B8F"
            emissiveIntensity={0.08}
            metalness={0.12}
            opacity={0.72}
            roughness={0.18}
            transparent
          />
          <Edges color="#009B8F" />
        </mesh>

        <mesh position={[-0.46, 0.22, 0.035]}>
          <boxGeometry args={[0.46, 0.035, 0.012]} />
          <meshStandardMaterial color="#151A19" emissive="#009B8F" emissiveIntensity={0.08} />
        </mesh>

        <mesh position={[0.34, 0.22, 0.035]}>
          <boxGeometry args={[0.54, 0.035, 0.012]} />
          <meshStandardMaterial color="#009B8F" emissive="#009B8F" emissiveIntensity={0.34} />
        </mesh>

        {bars.map((height, index) => (
          <mesh
            key={`${title}-${height}-${index}`}
            position={[-0.52 + index * 0.21, -0.28 + height / 2, 0.045]}
          >
            <boxGeometry args={[0.09, height, 0.018]} />
            <meshStandardMaterial color={index % 2 === 0 ? "#009B8F" : "#151A19"} emissive="#009B8F" emissiveIntensity={0.08} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function ParticleField() {
  const pointsRef = useRef(null);
  const positions = useMemo(() => {
    const count = 360;
    const array = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const seedA = Math.sin(index * 12.9898) * 43758.5453;
      const seedB = Math.sin(index * 78.233) * 24634.6345;
      const seedC = Math.sin(index * 37.719) * 13582.2467;
      array[index * 3] = (seedA - Math.floor(seedA) - 0.5) * 7.6;
      array[index * 3 + 1] = (seedB - Math.floor(seedB) - 0.5) * 4.7;
      array[index * 3 + 2] = (seedC - Math.floor(seedC) - 0.5) * 5.7;
    }

    return array;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#009B8F" size={0.034} sizeAttenuation transparent opacity={0.88} />
    </points>
  );
}

function HeroWordHalo() {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    groupRef.current.rotation.y = elapsed * 0.12;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.18) * 0.12;
    groupRef.current.position.y = Math.sin(elapsed * 0.34) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0.02, 0.12, 0.35]} scale={1.55}>
      <mesh rotation={[0.25, -0.48, 0.12]}>
        <torusKnotGeometry args={[1.2, 0.018, 220, 14, 2, 3]} />
        <meshBasicMaterial
          color="#009B8F"
          transparent
          opacity={0.72}
          depthTest={false}
          depthWrite={false}
          fog={false}
        />
      </mesh>

      <mesh rotation={[0.45, 0.22, -0.18]}>
        <icosahedronGeometry args={[1.62, 2]} />
        <meshBasicMaterial
          color="#151A19"
          transparent
          opacity={0.34}
          wireframe
          depthTest={false}
          depthWrite={false}
          fog={false}
        />
      </mesh>

      <mesh position={[0.56, -0.18, 0.2]} rotation={[Math.PI / 2, 0.18, 0.28]}>
        <torusGeometry args={[1.08, 0.01, 18, 180]} />
        <meshBasicMaterial
          color="#009B8F"
          transparent
          opacity={0.68}
          depthTest={false}
          depthWrite={false}
          fog={false}
        />
      </mesh>
    </group>
  );
}

function AcademyIntroGroup({ basePosition = [0, 0, 0], baseScale = 1 }) {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const intro = THREE.MathUtils.smoothstep(elapsed, 0.1, 2.4);
    groupRef.current.position.x = basePosition[0];
    groupRef.current.position.y = basePosition[1] + THREE.MathUtils.lerp(-0.72, 0, intro);
    groupRef.current.position.z = basePosition[2];
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.92 * baseScale, 1.16 * baseScale, intro));
    groupRef.current.rotation.y = Math.sin(elapsed * 0.12) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <LightBeams />
      <ParticleField />
      <HolographicRings />
      <HologramPanel
        position={[-1.2, 0.18, -0.92]}
        rotation={[0.04, 0.42, -0.05]}
        title="skills"
        bars={[0.22, 0.42, 0.28, 0.58, 0.36]}
      />
      <HologramPanel
        position={[1.08, -0.2, -1.04]}
        rotation={[0.02, -0.48, 0.06]}
        title="career"
        bars={[0.5, 0.32, 0.62, 0.4, 0.7]}
      />
      <BookObject position={[-1.75, -0.85, 0.1]} rotation={[0.2, 0.65, -0.25]} />
      <BookObject position={[1.72, 0.9, -0.35]} rotation={[0.3, -0.72, 0.28]} />
      <CapObject position={[0.95, -0.72, 0.55]} />
      <CertificateObject position={[-1.22, 0.92, 0.1]} />
      <DiplomaScrollObject position={[1.28, 0.28, 0.22]} />
      <ScreenObject position={[0.03, 1.25, -0.75]} rotation={[0.12, -0.2, 0]} />
      <ScreenObject position={[1.9, -0.05, -0.85]} rotation={[-0.04, -0.58, 0.08]} />
    </group>
  );
}

function SceneObjects({ variant = "default" }) {
  const isHero = variant === "hero";

  return (
    <>
      <color attach="background" args={["#FFFFFF"]} />
      <fog attach="fog" args={["#FFFFFF", 3, 8]} />
      <PerspectiveCamera makeDefault position={isHero ? [0, 0.18, 3.7] : [0, 0.35, 4.6]} fov={isHero ? 36 : 42} />
      <MouseCameraRig />
      <ambientLight intensity={0.35} />
      <pointLight position={[2.5, 2.2, 2.7]} color="#009B8F" intensity={3} />
      <pointLight position={[-2.8, -1.4, 2]} color="#009B8F" intensity={1.9} />
      <Stars radius={7} depth={4} count={360} factor={1.5} saturation={0} fade speed={0.45} />
      {isHero ? <HeroWordHalo /> : null}
      <AcademyIntroGroup
        basePosition={isHero ? [0.34, -0.08, 0] : [0, 0, 0]}
        baseScale={isHero ? 1.48 : 1}
      />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.9} luminanceThreshold={0.12} luminanceSmoothing={0.5} />
        <DepthOfField focusDistance={0.04} focalLength={0.035} bokehScale={1.2} />
        <ChromaticAberration offset={[0.0007, 0.0007]} />
        <Noise opacity={0.018} />
      </EffectComposer>
    </>
  );
}

function AcademyScene({ className = "", variant = "default" }) {
  return (
    <div className={`academy-scene ${className}`.trim()}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <SceneObjects variant={variant} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default AcademyScene;
