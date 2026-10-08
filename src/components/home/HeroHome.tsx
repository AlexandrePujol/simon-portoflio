import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { spartan } from "../molecules/Layout";

import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { Power4, gsap } from "gsap";
import { motion } from "motion/react";

import { ease } from "@/utils/store";
import { useWindowSize } from "@/hooks";

import AnimatedLetters from "../atoms/AnimLetters";
import { useLoadingContext } from "@/context/LoadingContext";

import { CustomCanvas } from "@components/three";
import TouchTexture from "../three/TouchTexture";
import vertexShader from "@shaders/HomePhotoShader/vertex.glsl";
import fragmentShader from "@shaders/HomePhotoShader/fragment.glsl";

const HeroPhoto = () => {
  // setting up the values
  const [photoData, setPhotoData] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const touchTexture = useMemo<any>(
    () => new TouchTexture(false, 128, 60, 0.2),
    []
  );

  const { isLoaded, setLoadedRatio } = useLoadingContext();
  const introTl = useRef<GSAPTimeline | null>(null);
  const { height, width } = useWindowSize();
  const meshRef = useRef<any>();
  const geometryRef = useRef<any>();
  const shaderRef = useRef<any>();

  // loading the texture
  const [texture, displacementMap] = useLoader(
    THREE.TextureLoader,
    ["/assets/photos/home/00_ACCUEIL.jpeg", "/assets/disp/disp1.jpg"],
    () => {
      setTimeout(() => {
        setLoadedRatio((prev) => prev + 0.5);
      }, 2000);
    }
  );

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uDisplacement: { value: displacementMap },
      uTextureSize: {
        value: new THREE.Vector2(texture.image.width, texture.image.height),
      },
      uQuadSize: {
        value: new THREE.Vector2(photoData.width, photoData.height),
      },
      uTouchTexture: { value: touchTexture.texture },
      uMappedMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uProgress: { value: 0 },
      uRadius: { value: 0.07 },
      uIntensity: { value: 0.02 },
      uIntro: { value: 0 },
    }),
    []
  );

  const handleMouseMove = (e: THREE.Vector2) => {
    touchTexture.addTouch(e);
  };

  // updating the uniforms and photoData
  useFrame(({ mouse }) => {
    const mappedMouse = new THREE.Vector2(
      THREE.MathUtils.mapLinear(mouse.x, -1, 1, 0, 1),
      THREE.MathUtils.mapLinear(mouse.y, -1, 1, 0, 1)
    );

    const photoDiv = document.getElementById("hero-photo");
    const rect = photoDiv?.getBoundingClientRect();

    if (!rect) return;
    if (height && width) {
      const x = rect?.left - width / 2 + rect?.width / 2;
      const y = -rect?.top + height / 2 - rect?.height / 2;

      setPhotoData({
        x,
        y,
        height: rect?.height,
        width: rect.width,
      });
    }

    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uMappedMouse.value = mappedMouse;
    shaderRef.current.uniforms.uQuadSize.value = new THREE.Vector2(
      photoData.width,
      photoData.height
    );

    if (!touchTexture) return;
    touchTexture.update();
    handleMouseMove(mappedMouse);
  });

  // intro anim - gsap part
  useEffect(() => {
    introTl.current = gsap.timeline();

    introTl.current
      .to(shaderRef.current.uniforms.uIntro, {
        delay: 0.7,
        value: 1,
        duration: 1.5,
        ease: Power4.easeOut,
      })
      .to(
        shaderRef.current.uniforms.uProgress,
        {
          value: 1,
        },
        "<40%"
      );

    introTl.current.pause();

    return () => {
      if (introTl.current) {
        introTl.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    // waiting for the texture to be loaded to trigger the anim
    if (!isLoaded) return;
    introTl.current?.play();
  }, [isLoaded]);

  return (
    <mesh ref={meshRef} position={[photoData.x, photoData.y, 0]}>
      <planeGeometry
        ref={geometryRef}
        args={[photoData.width, photoData.height, 32, 32]}
      />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <CustomCanvas>
      <HeroPhoto />
    </CustomCanvas>
  );
};

export const HeroHome = () => {
  const { isLoaded } = useLoadingContext();

  return (
    <>
      <div className="hidden sm:block h-[var(--fullScreen)] z-10 fixed top-0 left-0 right-0 ">
        <Scene />
      </div>
      <div className="h-[calc(var(--fullScreen)-1.5rem)] flex flex-col justify-between gap-6 pt-10 pb-10">
        <div
          data-scroll
          data-scroll-speed="0.2"
          id="hero-photo"
          className="h-full relative opacity-100 cursor-none pointer-events-auto sm:opacity-0"
        >
          <Image
            alt="house in a green field"
            src="/assets/photos/home/00_ACCUEIL.jpeg"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="sm:flex justify-between items-end gap-6">
          {/* wait until isLoaded is true to trigger the anim */}

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={!isLoaded ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
            transition={{ ease: "easeOut", delay: 0.15 }}
            className="hidden md:block pb-1 flex-1 "
          >
            Through photography, I aim to isolate elements from their primary{" "}
            <br className="lg:hidden xl:block" />
            function in order to reveal their aesthetic dimension.
          </motion.h2>
          <h1
            className={`${spartan.className}  text-end flex-1 md:flex-none text-2xl align-bottom leading-none sm:flex-1 sm:text-[48px] lg:text-[64px]`}
          >
            <AnimatedLetters
              string="SIMON EYCHENNE"
              delay={0.5}
              start={isLoaded}
              rotate={15}
              duration={1}
              y={100}
              stagger={0.01}
              ease={ease}
            />
          </h1>
        </div>
      </div>
    </>
  );
};
