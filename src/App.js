import * as THREE from 'three'
import { useState, useRef, useEffect } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, Clone, AccumulativeShadows, RandomizedLight, Html, Text, Effects, Environment, Center } from '@react-three/drei'
import { WaterPass, GlitchPass } from 'three-stdlib'
import { ControlledInput } from './ControlledInput'

extend({ WaterPass, GlitchPass })

export default function App() {

  const [comentarios, comentariosSet] = useState(['Welcome. How can I help you?']);
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    setTimeout(() => setThinking(false), 2000);
  });


  const onSendHandle = comentario => {
    comentariosSet(old => [...old, comentario]);

    setThinking(true);
    setTimeout(() => setThinking(false), 2000);

    return true;
  };

  return (


    // eventPrefix="client" to get client instead of offset coordinates
    // offset would reset xy to 0 when hovering the html overlay
    <>
      <Canvas eventPrefix="client" shadows camera={{ position: [1, 0.5, 10] }}>
        <color attach="background" args={['#f0f0f']} />
        <ambientLight intensity={1} color={"#bdefff"} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} castShadow />
        <pointLight position={[-10, 0, -10]} intensity={2} />
        <ItemsCanvas onSend={onSendHandle} />
        <Environment preset="city" />
        <Postpro />
        <Rig />
      </Canvas>
      <Comentarios lista={comentarios} thinking={thinking} />
    </>
  )
}

function Comentarios(props) {
  const items = props.lista.map((element, key) => <li style={{ listStyleType: 'none' }} key={key}>{element}</li>);



  return (
    <div style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }}>

      <ul >
        {items}
      </ul>
      <hr />
      {props.thinking &&
        <img alt="spinner" src="https://www.furla.com/on/demandware.static/Sites-furla-au-Site/-/default/dw474b7f30/images/loader.gif" width="80" />}
    </div>

  );
}

function ItemsCanvas(props) {
  const [backText, backTextSet] = useState('type here');

  return (
    <>
      <Input position={[0.4, 0, 0]} text={backText} onChange={backTextSet} onSend={props.onSend} />
      <group position={[0, -1, -2]}>
        <Model />
        <Sphere scale={0.25} position={[-3, 0, 2]} />
        <Sphere scale={0.25} position={[-4, 0, -2]} />
        <Sphere scale={0.65} position={[3.5, 0, -2]} />
        <Text position={[0, 4, -10]} fontSize={2}>
          {backText}
          <meshStandardMaterial color="#aaa" toneMapped={false} />
        </Text>
        <AccumulativeShadows temporal frames={100} alphaTest={0.8} scale={12}>
          <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[2.5, 5, -10]} />
        </AccumulativeShadows>
      </group>
    </>
  )
}

function Postpro() {
  const ref = useRef()
  useFrame((state) => (ref.current.time = state.clock.elapsedTime * 3))
  return (
    <Effects>
      <waterPass ref={ref} factor={0.1} />
      <glitchPass />
    </Effects>
  )
}

function Rig({ vec = new THREE.Vector3() }) {
  useFrame((state) => {
    state.camera.position.lerp(vec.set(1 + state.pointer.x, 0.5, 3), 0.01)
    state.camera.lookAt(0.3, 0, 0)
  })
}

function Sphere(props) {
  return (
    <Center top {...props}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial />
      </mesh>
    </Center>
  )
}

function Model(props) {
  const { scene } = useGLTF('./model.glb')

  const boxRef = useRef();

  useFrame(() => {
    //boxRef.current.rotation.y += 0.05;
    boxRef.current.rotation.z += 0.05;
  });

  return (
    <Center ref={boxRef} top rotation={[-Math.PI / 2, 0, 0]}>
      <Clone castShadow receiveShadow object={scene} scale={1.55} />
    </Center>
  )
}

function Input(props) {
  const [text, setText] = useState(props.text)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter');

      props.onSend(text) && setText("");
      props.onChange && props.onChange("");
    }
  };

  return (
    <group {...props}>
      <Text position={[-1.2, -0.022, 0]} anchorX="0px" font="/Inter-Regular.woff" fontSize={0.335} letterSpacing={-0.0}>
        {text}
        <meshStandardMaterial color="black" />
      </Text>
      <mesh position={[0, -0.022, 0]} scale={[2.5, 0.48, 1]}>
        <planeGeometry />
        <meshBasicMaterial transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <Html transform>
        <ControlledInput
          type={text}
          onChange={(e) => {
            setText(e.target.value)
            props.onChange && props.onChange(e.target.value)
          }}
          value={text}
          onKeyDown={handleKeyDown}
          autofocus
        />
      </Html>
    </group>
  )
}
