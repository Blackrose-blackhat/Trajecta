"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls, Environment, RoundedBox } from "@react-three/drei";

const CUBE_SIZE = 1;
const GAP = 0.05;
const RADIUS = 0.1; // The radius of the rounded edges

function CubePiece({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={position}>
      {/* Use RoundedBox from drei to create a cube with rounded corners */}
      <RoundedBox
        args={[CUBE_SIZE - GAP, CUBE_SIZE - GAP, CUBE_SIZE - GAP]} // dimensions
        radius={RADIUS} // radius of the rounded corners
        smoothness={10} // number of segments for smoothness
      >
        <meshPhysicalMaterial
          color="black"
          metalness={0.2}
          roughness={0}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
          reflectivity={1}
          envMapIntensity={0.7}
        />
      </RoundedBox>
    </mesh>
  );
}

function RubiksCube() {
  const groupRef = useRef<THREE.Group>(null);
  const [rotations, setRotations] = useState<
    Array<{ axis: "x" | "y" | "z"; layer: number; angle: number }>
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotations((current) => {
        const newRotations = current.filter((r) => r.angle < Math.PI / 2);
        if (newRotations.length < 3) {
          const axis = ["x", "y", "z"][Math.floor(Math.random() * 3)] as
            | "x"
            | "y"
            | "z";
          const layer = Math.floor(Math.random() * 3) - 1;
          newRotations.push({ axis, layer, angle: 0 });
        }
        return newRotations;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
    setRotations((current) =>
      current.map((r) => ({
        ...r,
        angle: Math.min(r.angle + delta * Math.PI, Math.PI / 2),
      })),
    );
  });

  const positions: [number, number, number][] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        positions.push([x, y, z]);
      }
    }
  }

  return (
    <group ref={groupRef}>
      {positions.map((position, index) => {
        const [x, y, z] = position;
        const rotationData = rotations.find(
          (r) =>
            (r.axis === "x" && x === r.layer) ||
            (r.axis === "y" && y === r.layer) ||
            (r.axis === "z" && z === r.layer),
        );

        return (
          <group key={index} position={position}>
            <group
              rotation={
                rotationData
                  ? [
                      rotationData.axis === "x" ? rotationData.angle : 0,
                      rotationData.axis === "y" ? rotationData.angle : 0,
                      rotationData.axis === "z" ? rotationData.angle : 0,
                    ]
                  : [0, 0, 0]
              }
            >
              <CubePiece position={[0, 0, 0]} />
            </group>
          </group>
        );
      })}
    </group>
  );
}

export default function Component() {
  return (
    <div className="w-1/2 h-screen z-10 md:block hidden ">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ alpha: true }} // Enable transparency
      >
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        <RubiksCube />
        <OrbitControls enableZoom={false} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
