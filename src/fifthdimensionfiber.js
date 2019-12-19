import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useRender } from "react-three-fiber";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { socket } from "./sockets";
import { useSelector } from "react-redux";

////variable scene componenets

console.log("santity check fiber");
let camera, scene, renderer, controls;
let raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let start = true;

export function Scene() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "Anonymous";
    let ground = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    ground.rotateX(-Math.PI / 2);

    let groundImage = textureLoader.load(
        "https://66.media.tumblr.com/b265c4dcf76d0ac0eca5eb914f663b78/tumblr_p5i9u7cVAz1x4yo1vo1_400.png"
    );
    return (
        <mesh rotateX={[-Math.PI / 2]}>
            <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
            <meshBasicMaterial attach="material" map={groundImage} />
        </mesh>
    );
}
export function Boxes() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "Anonymous";
    const images = useSelector(state => {
        console.log("in redux state: state.image", state.image);
        return state && state.image;
    });
    var boxGeometry = new THREE.BoxGeometry(50, 50, 50);
    let boxArray = [];
    for (let i = 0; i < images.images.length; i++) {
        let boxImage;
        boxImage = textureLoader.load(images.images[i].url);
        let boxMaterial = new THREE.MeshBasicMaterial({
            flatShading: true,
            map: boxImage
        });
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = Math.floor(Math.random() * 20 - 10) * 10;
        box.position.y = Math.floor(Math.random() * 20);
        box.position.z = Math.floor(Math.random() * 20 - 10) * 10;
    }
    return (
        <mesh rotateX={[-Math.PI / 2]}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshBasicMaterial attach="material" color="green" />
        </mesh>
    );
}
export default function FifthDimension(props) {
    useEffect(() => {
        if (start) {
            document.addEventListener("click", function() {
                controls.lock();
            });
        }

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);
    }, []);

    const onKeyUp = event => {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };
    const onKeyDown = event => {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;
        }
    };

    const init = () => {
        //set up textureloader for url texture placement

        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.y = 40;
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xff7ffc, 30, 70);
        var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
        light.position.set(0.5, 1, 0.75);
        scene.add(light);
        controls = new PointerLockControls(camera, document.body);
        scene.add(controls.getObject());

        // raycaster = new THREE.Raycaster(
        //     new THREE.Vector3(),
        //     new THREE.Vector3(0, -1, 0),
        //     0,
        //     10
        // );

        // objects

        //

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        //
        window.addEventListener("resize", onWindowResize, false);
    };
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const animate = () => {
        requestAnimationFrame(animate);

        // raycaster.ray.origin.copy(controls.getObject().position);
        // raycaster.ray.origin.y -= 10;
        // var intersections = raycaster.intersectObjects(objects);
        function createControls() {
            var time = performance.now();
            var delta = (time - prevTime) / 1000;
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize(); // this ensures consistent movements in all directions
            if (moveForward || moveBackward)
                velocity.z -= direction.z * 400.0 * delta;
            if (moveLeft || moveRight)
                velocity.x -= direction.x * 400.0 * delta;

            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);
            controls.getObject().position.y += velocity.y * delta; // new behavior
            if (controls.getObject().position.y < 10) {
                velocity.y = 0;
                controls.getObject().position.y = 10;
                canJump = true;
            }
            prevTime = time;
        }
        createControls();
        renderer.render(scene, camera);
    };

    init();
    animate();

    return (
        <Canvas>
            <Scene />
            <Boxes />
        </Canvas>
    );
}
