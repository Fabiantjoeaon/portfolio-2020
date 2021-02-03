import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useContext,
} from "react";
import * as THREE from "three";
import styled from "styled-components";
import glslify from "glslify";
import { useSpring, animated as a, config } from "@react-spring/three";
import { Canvas, useThree, useFrame } from "react-three-fiber";
import { useGesture } from "react-use-gesture";

import { mobileBreakpoint } from "../styled/media";
import { theme } from "../styled/theme";
import { useWindowSize, useRouteActive, usePrevious } from "../../hooks";
import { clamp, sleep } from "../../utils";
import { useStore } from "../../BackgroundColorStore";

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
  loadingDone = false,
}) {
  const { camera } = useThree();
  const [scrolled, setScrolled] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const defaultCameraZ = camera.position.z;
  const mesh = useRef();

  const [color, colorKey, setColor] = useStore(state => [
    state.color,
    state.key,
    state.setColor,
  ]);
  const { value, intensity } = color;

  const threeColor = new THREE.Color();

  const isActiveOnHome = useRouteActive(path, "/");
  const prevScrolled = usePrevious(scrolled);

  const [{ bgColor }] = useSpring(
    {
      bgColor: value,
      config: {
        mass: 2,
        friction: 90,
        tension: 240,
        precision: 0.001,
      },
    },
    [value]
  );
  const [{ bgIntensity }] = useSpring(
    {
      bgIntensity: intensity,
      config: { precision: 0.001 },
    },
    [intensity]
  );

  useEffect(() => {
    function handleScroll() {
      const shouldScroll = document.documentElement.scrollTop > 150;
      if ((scrolled && !shouldScroll) || (!scrolled && shouldScroll)) {
        if (shouldScroll) setColor("default");
        else setColor(path.replace("/projects/", "").replaceAll("-", "_"));

        setScrolled(shouldScroll);
      }
    }

    if (!shouldTransition) window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const [{ pos }, setPlanePos] = useSpring(() => ({
    pos: [0, shouldTransition ? -2 : 0, z],
    config: {
      friction: 200,
      tenstion: 180,
      mass: 5,
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
        value: opacity?.get(),
      },
      uMouse: {
        value: new THREE.Vector2(0, 0),
      },
      uShouldTransition: {
        value: shouldTransition ? 1 : 0,
      },
      uBackgroundColor: {
        value: threeColor.set(value),
      },
      uUseColor: {
        value: 0,
      },
    }),
    []
  );

  useEffect(() => {
    // TODO: Make this more manage-able
    async function animate() {
      if (isActiveOnHome) {
        setColor("default");
        if (shouldTransition) {
          await sleep(loadingDone ? 600 : theme.initialLoadingTime + 2000);
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
            },
          });
        }
        if (!hasColor) {
          setColorTransform({
            colorTransform: 0,
            config: {
              mass: 2,
              friction: 150,
              tension: 180,
            },
          });
        }
      } else {
        if (shouldTransition) {
          setPlaneOpacity({
            opacity: 0,
            config: {
              mass: 4,
              friction: 100,
              tension: 180,
            },
          });
          setPlanePos({
            pos: [mesh.current.position.x, mesh.current.position.y - 1, z],
            config: {
              mass: 4,
              friction: 200,
              tension: 100,
            },
          });
        }
        if (!hasColor) {
          //TODO: Remove delay!
          await sleep(prevScrolled === scrolled ? 1500 : 0);
          setColorTransform({
            colorTransform: scrolled ? 0 : 1,
            config: {
              mass: 2,
              friction: 150,
              tension: 180,
            },
          });
        }
      }
    }

    animate();
  }, [isActiveOnHome, scrolled]);

  const moveDivider = shouldMove ? 400 : 1000;
  const dragDivider = shouldMove ? 170 : 250;

  const handler = useCallback(
    ({
      xy: [cx, cy],
      previous: [px, py],
      memo = [0, 0],
      movement,
      moving,
      dragging,
      delta,
      down,
    }) => {
      // if (!shouldMove) return;
      const [dX, dY] = delta;
      const [mX, mY] = movement;
      const madeDistance = dX > 0 || dY > 0;
      let [newX, newY] = memo;

      if (moving && !dragging && madeDistance) {
        newX += clamp(((cx - px) / moveDivider) * -1, 0, 2);
        newY += clamp((cy - py) / moveDivider, 0, 2);
      } else if (dragging) {
        newX += ((cx - px) / dragDivider) * -1;
        newY += (cy - py) / dragDivider;
      }

      setPlanePos({
        pos: [newX, newY, z],
      });

      return [newX, newY];
    },
    [pos, setPlanePos]
  );

  useGesture(
    { onMove: handler, onDrag: handler },
    { domTarget: window, drag: { threshold: 10 } }
  );

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
    const heightClip = aspect < 0.9 && shouldTransition ? aspect : 0;
    const widthClip = aspect > 1.8 && shouldTransition ? aspect : 0;

    return [
      planeWidth / divisor.width,
      planeHeight / divisor.height + heightClip,
    ];
  }, [windowWidth, windowHeight, defaultCameraZ]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;

    const p = pos?.get();
    mesh.current.material.uniforms["uMouse"].value.x = p[0];
    mesh.current.material.uniforms["uMouse"].value.y = p[1];

    mesh.current.material.uniforms["uTime"].value = clock.elapsedTime / 7;

    if (!hasColor)
      mesh.current.material.uniforms["uHasColor"].value = colorTransform?.get();
    if (shouldTransition)
      mesh.current.material.uniforms["uAlpha"].value = opacity?.get();

    mesh.current.material.uniforms["uUseColor"].value = bgIntensity?.get();
    mesh.current.material.uniforms["uBackgroundColor"].value = threeColor.set(
      bgColor?.get()
    );

    // console.log(mesh.current.material.uniforms["uUseColor"].value);
    // console.log(mesh.current.material.uniforms["uBackgroundColor"].value);
  });

  return (
    <a.mesh
      ref={mesh}
      position={[
        0,
        shouldTransition && windowWidth < mobileBreakpoint ? -0.2 : 0,
        z,
      ]}
    >
      <planeGeometry
        args={[...planeDimensions, 2, 2]}
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

export function Background({ path, loadingDone }) {
  return (
    <StyledCanvas
      gl={{
        antialias: false,
        powerPreference: "low-power",
        debug: { checkShaderErrors: true },
      }}
    >
      <Plane
        divisor={{ width: 1.32, height: 1.4 }}
        path={path}
        shouldTransition
        shouldMove
        hasColor
        loadingDone={loadingDone}
        z={0}
      ></Plane>
      <Plane
        divisor={{ width: 1, height: 1 }}
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
