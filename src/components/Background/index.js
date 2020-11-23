import React, { useRef, useMemo } from "react";
import styled from "styled-components";
import glslify from "glslify";
import { Canvas, useThree, useFrame } from "react-three-fiber";
import * as THREE from "three";
import { useWindowSize } from "../../hooks";

import vert from "./vert.glsl";
import frag from "./frag.glsl";

function Plane() {
  const { camera } = useThree();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const defaultCameraZ = camera.position.z;
  const planeZ = 0;
  const mesh = useRef();

  const planeDimensions = useMemo(() => {
    const distance = defaultCameraZ - planeZ;
    const aspect = windowWidth / windowHeight;

    const vFov = (camera.fov * Math.PI) / 180;
    const planeHeight = 2 * Math.tan(vFov / 2) * distance;
    const planeWidth = planeHeight * aspect;
    const planeDivisor = 1.1;

    // if(mesh.current) mesh.current.geometry.update

    return [planeWidth / planeDivisor, planeHeight / planeDivisor];
  }, [windowWidth, windowHeight, defaultCameraZ]);

  useFrame(({ clock }) => {
    if (mesh.current)
      mesh.current.material.uniforms["uTime"].value = clock.elapsedTime / 5;
  });

  return (
    <mesh ref={mesh} position={[0, 0, planeZ]}>
      <planeGeometry
        args={[...planeDimensions, 64, 64]}
        attach="geometry"
      ></planeGeometry>
      <shaderMaterial
        attach="material"
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={glslify(vert)}
        fragmentShader={glslify(frag)}
      ></shaderMaterial>
    </mesh>
  );
}

export function Background() {
  return (
    <StyledCanvas>
      <Plane></Plane>
    </StyledCanvas>
  );
}

const StyledCanvas = styled(Canvas)`
  position: fixed !important;
  top: 0;

  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
`;
