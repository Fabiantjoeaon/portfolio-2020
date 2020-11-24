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
  hasColor = false,
  FBMDivider = 0.86875,
  path,
}) {
  const { camera } = useThree();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const defaultCameraZ = camera.position.z;
  const mesh = useRef();

  const isActiveOnHome = useRouteActive(path, "/");

  const [{ pos }, setPlanePos] = useSpring(() => ({
    pos: [0, shouldTransition ? -1 : 0, z],
    config: {
      friction: 126,
    },
  }));

  const [{ opacity }, setPlaneOpacity] = useSpring(() => ({
    opacity: shouldTransition ? 0 : 1,
  }));

  const [{ colorTransform }, setColorTransform] = useSpring(() => ({
    colorTransform: !hasColor ? 0 : 1,
  }));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFBMDivider: { value: FBMDivider },
      uHasColor: {
        value: colorTransform?.get(),
      },
      uAlpha: {
        value: opacity?.get() || shouldTransition ? 0 : 1,
      },
    }),
    []
  );

  useEffect(() => {
    console.log("HERE", isActiveOnHome);
    async function animate() {
      if (isActiveOnHome) {
        if (shouldTransition) {
          await sleep(600);
          setPlanePos({
            pos: [0, 0, z],
          });
          await sleep(600);
          setPlaneOpacity({
            opacity: 1,
            config: {
              mass: 3,
              friction: 500,
              tension: 200,
              precision: 0.001,
            },
          });
        }
        if (!hasColor) setColorTransform({ colorTransform: 0 });
      } else {
        if (shouldTransition) {
          setPlaneOpacity({
            opacity: 0,
            config: {
              mass: 1.5,
              friction: 180,
              tension: 200,
              precision: 0.001,
            },
          });
          setPlanePos({
            pos: [mesh.current.position.x, mesh.current.position.y - 1, z],
            config: {
              mass: 4,
              friction: 200,
              tension: 100,
              precision: 0.001,
            },
          });
        }
        if (!hasColor) {
          await sleep(2000);
          setColorTransform({ colorTransform: 1 });
        }
      }
    }

    animate();
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
      if (!hasColor) {
        mesh.current.material.uniforms[
          "uHasColor"
        ].value = colorTransform?.get();
      }

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
        divisor={1.4}
        path={path}
        shouldTransition
        shouldMove
        hasColor
        z={0}
      ></Plane>
      <Plane
        divisor={1}
        z={-5}
        path={path}
        hasColor={false}
        FBMDivider={2.96875}
      ></Plane>
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
