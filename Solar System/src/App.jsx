import { Canvas } from '@react-three/fiber';
import { OrbitControls,Sparkles } from '@react-three/drei';
import{Sun,Mercury,Venus,Earth,Mars,Jupiter,Saturn,Uranus,Neptune} from './Components/Planets.jsx';

const App = () => {
  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 10, 50], fov: 75 }}
    >
      <OrbitControls enableZoom enablePan enableRotate />
      <ambientLight intensity={10}/>
      <color attach="background" args={['black']} />
        <Sparkles
        count={30000}                    
        scale={[2000, 2000, 2000]}      
        size={50}                      
        speed={0.01}                    
        noise={0.3}
        color="white"
      />
      <Sun />
      <Mercury />
      <Venus />
      <Earth />
      <Mars />
      <Jupiter />
      <Saturn />
      <Uranus />
      <Neptune />
    </Canvas>
  );
};

export default App;
