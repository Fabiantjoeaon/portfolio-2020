import React, { useCallback, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import glslify from "glslify";
import { Canvas, useThree, useFrame } from "react-three-fiber";
import { useGesture } from "react-use-gesture";
import { useWindowSize, useRouteActive } from "../../hooks";

import { useSpring, animated as a, config } from "@react-spring/three";
import { clamp, sleep } from "../../utils";

import vert from "./vert.glsl";
import frag from "./frag.glsl";

function Plane({
  shouldMove = false,
  shouldTransition,
  divisor,
  z,
  hasColor,
  FBMDivider = 0.86875,
  path,
}) {
  const { camera } = useThree();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const defaultCameraZ = camera.position.z;
  const mesh = useRef();

  const isActiveOnHome = useRouteActive(path, "/");

  const [{ pos }, setPlanePos] = useSpring(() => ({
    pos: [0, shouldTransition ? -2 : 0, z],
    config: {
      friction: 126,
    },
  }));

  const [{ opacity }, setPlaneOpacity] = useSpring(() => ({
    opacity: shouldTransition ? 0 : 1,
    config: {
      mass: 4,
      friction: 200,
      tension: 100,
      precision: 0.001,
    },
  }));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFBMDivider: { value: FBMDivider },
      uHasColor: { value: hasColor ? 1 : 0 },
      uAlpha: {
        value: opacity?.value || shouldTransition ? 0 : 1,
      },
    }),
    []
  );

  useEffect(() => {
    async function animate() {
      if (isActiveOnHome) {
        await sleep(600);
        setPlanePos({
          pos: [0, 0, z],
        });
        await sleep(600);
        await sleep();
        setPlaneOpacity({
          opacity: 1,
        });
      } else {
        setPlaneOpacity({
          opacity: 0,
        });
        setPlanePos({
          pos: [mesh.current.position.x, mesh.current.position.y - 2, z - 10],
        });
      }
    }

    shouldTransition && animate();
  }, [isActiveOnHome]);

  const handler = useCallback(
    ({ xy: [cx, cy], previous: [px, py], memo = [0, 0] }) => {
      if (!shouldMove) return;

      const newX =
        memo && memo.length
          ? clamp(((memo[0] + cx - px) / 150) * -1, -2, 2)
          : clamp(((cx - px) / 150) * -1, 0, 2);
      const newY =
        memo && memo.length
          ? clamp(((memo[1] + cy - py) / 150) * -1, -2, 2)
          : clamp(((cy - py) / 150) * -1, 0, 2);

      setPlanePos({ pos: [newX, newY, z] });
      return [newX, newY];
    },
    [pos, setPlanePos]
  );

  useGesture({ onMove: handler }, { domTarget: window });

  const planeDimensions = useMemo(() => {
    const distance = defaultCameraZ - z;
    const aspect = windowWidth / windowHeight;

    const vFov = (camera.fov * Math.PI) / 180;
    const planeHeight = 2 * Math.tan(vFov / 2) * distance;
    const planeWidth = planeHeight * aspect;

    if (mesh.current) {
      mesh.current.geometry.verticesNeedUpdate = true;
      mesh.current.geometry.uvsNeedUpdate = true;
    }

    return [planeWidth / divisor, planeHeight / divisor];
  }, [windowWidth, windowHeight, defaultCameraZ]);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.material.uniforms["uAlpha"].value = shouldTransition
        ? opacity?.get() || 0
        : 1;

      mesh.current.material.uniforms["uTime"].value = clock.elapsedTime / 7;
    }
  });

  return (
    <a.mesh ref={mesh} position={pos}>
      <planeGeometry
        args={[...planeDimensions, 64, 64]}
        attach="geometry"
      ></planeGeometry>
      <shaderMaterial
        attach="material"
        uniforms={uniforms}
        vertexShader={glslify(vert)}
        fragmentShader={glslify(frag)}
      ></shaderMaterial>
    </a.mesh>
  );
}

export function Background({ path }) {
  return (
    <StyledCanvas>
      <Plane
        divisor={1.2}
        path={path}
        shouldTransition
        shouldMove
        hasColor
        z={0}
      ></Plane>
      <Plane divisor={1} z={-1} path={path} FBMDivider={2.96875}></Plane>
      {/* <EffectComposer>
        <Noise opacity={0.05} />
      </EffectComposer> */}
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
