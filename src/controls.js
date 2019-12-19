import React, { useState, useRef } from "react";
import * as THREE from "three";
import { extend, useThree, useRender } from "react-three-fibers";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
// import { Canvas, useThree, useRender } from "react-three-fiber";

extend({ PointerLockControls });
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let start = true;

export default function Controls() {
    const controlsRef = useRef();
    const { camera, gl } = useThree();

    useRender(() => {
        controlsRef.current.update();
    });
    return <PointerLockControls args={[camera, gl]} ref={controlsRef} />;
}
