import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const createOrbit = (radius) => {
  const curve = new THREE.EllipseCurve(
    0, 0, radius, radius, 0, 2 * Math.PI, false, 0
  );
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(p.x, 0, p.y))
  );
  return (
    <line geometry={geometry}>
      <lineBasicMaterial attach="material" color="grey" linewidth={1} />
    </line>
  );
};

const RotatingPlanet = ({ radius, size, color, speed }) => {
  const ref = useRef();
  const groupRef = useRef();
  let angle = useRef(0);

  useFrame((_, delta) => {
    // Rotation on its axis
    if (ref.current) ref.current.rotation.y += 0.02;

    // Revolution around the Sun
    angle.current += speed * delta;
    const x = radius * Math.cos(angle.current);
    const z = radius * Math.sin(angle.current);
    if (groupRef.current) groupRef.current.position.set(x, 0, z);
  });

  return (
    <>
      {createOrbit(radius)}
      <group ref={groupRef}>
        <mesh ref={ref}>
          <sphereGeometry args={[size]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </>
  );
};

const Sun = () => {
  return (
    <mesh>
      <sphereGeometry args={[2]} />
      <meshStandardMaterial emissive="gold" emissiveIntensity={2} color="orange" />
    </mesh>
  );
};

const Mercury = () => <RotatingPlanet radius={4} size={0.3} color="gray" speed={1.6} />;
const Venus = () => <RotatingPlanet radius={6} size={0.5} color="burlywood" speed={1.17} />;
const Earth = () => <RotatingPlanet radius={8.5} size={0.5} color="blue" speed={1} />;
const Mars = () => <RotatingPlanet radius={11} size={0.4} color="red" speed={0.8} />;
const Jupiter = () => <RotatingPlanet radius={15} size={1.2} color="orange" speed={0.43} />;
const Saturn = () => <RotatingPlanet radius={19} size={1.0} color="goldenrod" speed={0.32} />;
const Uranus = () => <RotatingPlanet radius={23} size={0.7} color="lightblue" speed={0.22} />;
const Neptune = () => <RotatingPlanet radius={27} size={0.7} color="royalblue" speed={0.18} />;

export { Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune };