import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const createOrbit = (radius, hovered) => {
  const curve = new THREE.EllipseCurve(
    0, 0, radius * 1.2, radius, 0, 2 * Math.PI, false, 0
  );
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(p.x, 0, p.y))
  );

  const material = new THREE.LineBasicMaterial({
    color: hovered ? 'aqua' : 'grey',
    linewidth: 2,
  });

  return <line geometry={geometry} material={material} />;
};

const RotatingPlanet = ({ radius, size, color, speed, name, onSelect, selected }) => {
  const ref = useRef();
  const groupRef = useRef();
  const angle = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [planetSpeed, setPlanetSpeed] = useState(speed);

  useEffect(() => {
    if (selected?.name === name && selected.setSpeed !== setPlanetSpeed) {
      selected.setSpeed = setPlanetSpeed;
    }
  }, [selected]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += 0.02;
    angle.current += planetSpeed * delta;
    const x = radius * 1.2 * Math.cos(angle.current);
    const z = radius * Math.sin(angle.current);
    if (groupRef.current) groupRef.current.position.set(x, 0, z);
  });

  const handlePlanetClick = (e) => {
    e.stopPropagation();
    onSelect({
      name,
      speed: planetSpeed,
      setSpeed: setPlanetSpeed,
      resetSpeed: () => setPlanetSpeed(speed),
    });
  };

  return (
    <>
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handlePlanetClick}
      >
        {createOrbit(radius, hovered || selected?.name === name)}
      </group>

      <group ref={groupRef}>
        <mesh
          ref={ref}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handlePlanetClick}
        >
          <sphereGeometry args={[size]} />
          <meshStandardMaterial
            color={color}
            emissive={(hovered || selected?.name === name) ? 'white' : 'black'}
            emissiveIntensity={(hovered || selected?.name === name) ? 0.4 : 0}
          />
          {(hovered || selected?.name === name) && (
            <Html center distanceFactor={10} position={[0, size + 1.5, 0]}>
              <div style={{
                fontSize: '80px',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}>
                {name}
              </div>
            </Html>
          )}
        </mesh>
      </group>
    </>
  );
};

const Sun = () => (
  <mesh>
    <sphereGeometry args={[2]} />
    <meshStandardMaterial emissive="gold" emissiveIntensity={2} color="orange" />
  </mesh>
);

// Individual Planets (forward props for control)
const Mercury = (props) => <RotatingPlanet name="Mercury" radius={4} size={0.3} color="gray" speed={1.6} {...props} />;
const Venus = (props) => <RotatingPlanet name="Venus" radius={6} size={0.5} color="burlywood" speed={1.17} {...props} />;
const Earth = (props) => <RotatingPlanet name="Earth" radius={8.5} size={0.5} color="blue" speed={1} {...props} />;
const Mars = (props) => <RotatingPlanet name="Mars" radius={11} size={0.4} color="red" speed={0.8} {...props} />;
const Jupiter = (props) => <RotatingPlanet name="Jupiter" radius={15} size={1.2} color="orange" speed={0.43} {...props} />;
const Saturn = (props) => <RotatingPlanet name="Saturn" radius={19} size={1.0} color="goldenrod" speed={0.32} {...props} />;
const Uranus = (props) => <RotatingPlanet name="Uranus" radius={23} size={0.7} color="lightblue" speed={0.22} {...props} />;
const Neptune = (props) => <RotatingPlanet name="Neptune" radius={27} size={0.7} color="royalblue" speed={0.18} {...props} />;

const PlanetSystem = () => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (!e.target.closest('.planet-gui')) setSelected(null);
    };
    window.addEventListener('pointerdown', handleOutside);
    return () => window.removeEventListener('pointerdown', handleOutside);
  }, []);

  return (
    <>
      <Sun />
      <Mercury selected={selected} onSelect={setSelected} />
      <Venus selected={selected} onSelect={setSelected} />
      <Earth selected={selected} onSelect={setSelected} />
      <Mars selected={selected} onSelect={setSelected} />
      <Jupiter selected={selected} onSelect={setSelected} />
      <Saturn selected={selected} onSelect={setSelected} />
      <Uranus selected={selected} onSelect={setSelected} />
      <Neptune selected={selected} onSelect={setSelected} />

      {selected && (
        <Html fullscreen>
          <div
            className="planet-gui"
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              background: 'rgba(0,0,0,0.9)',
              color: 'white',
              padding: '30px',
              borderRadius: '16px',
              width: '300px',
              fontSize: '18px',
              boxShadow: '0 0 20px rgba(0,255,255,0.6)',
              zIndex: 1000,
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
              {selected.name} Control Panel
            </div>
            <div>
              Speed: <strong>{selected.speed.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.01"
              value={selected.speed}
              onChange={(e) => selected.setSpeed(parseFloat(e.target.value))}
              style={{ width: '100%', margin: '15px 0' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={selected.resetSpeed}
                style={{
                  backgroundColor: '#00aaff',
                  color: 'white',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{
                  backgroundColor: 'crimson',
                  color: 'white',
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Html>
      )}
    </>
  );
};

export { PlanetSystem };
