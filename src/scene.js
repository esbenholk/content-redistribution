import React from "react";
import * as THREE from "three";
// import { Canvas, useThree, useRender } from "react-three-fiber";

export default function Scene() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "Anonymous";

    const groundImage = textureLoader.load(
        "https://66.media.tumblr.com/b265c4dcf76d0ac0eca5eb914f663b78/tumblr_p5i9u7cVAz1x4yo1vo1_400.png"
    );

    // useRender(() => {});
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
            <meshBasicMaterial attach="material" map={groundImage} />
        </mesh>
    );
}
