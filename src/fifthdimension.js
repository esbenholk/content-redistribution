import React, { useEffect, useRef } from "react";
import * as THREE from "three";

import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import Drunktoggle from "./drunktoggle";
var camera, scene, renderer, controls;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let start = true;
let newscale = true;
let drunk = false;
let boxes = [];

export default function FifthDimension(props) {
    const images = props.images;
    useEffect(() => {
        if (start) {
            document.addEventListener("click", function() {
                controls.lock();
            });
        }
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);
    }, []);

    useEffect(() => {
        const canvases = document.getElementsByTagName("canvas");
        if (canvases.length > 1) {
            canvases[0].parentNode.removeChild(canvases[0]);
            // for (var i = 0; i < canvases.length; i++) {
            //
            // }
            //
        }
    }, [images]);

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
    const canvasReference = useRef();
    const init = () => {
        //set up textureloader for url texture placement
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = "Anonymous";
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.y = 40;
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xff7ffc, 100, 200);
        let light = new THREE.HemisphereLight(0xeeeeff, 0x16f9e8, 0.75);
        light.position.set(0.5, 1, 0.75);
        scene.add(light);

        controls = new PointerLockControls(camera, document.body);
        scene.add(controls.getObject());

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        //Create a PointLight and turn on shadows for the light
        var pointlight = new THREE.PointLight(0xffffff, 1, 100);
        pointlight.position.set(0, 10, 0);
        pointlight.castShadow = true;
        pointlight.shadow.mapSize.width = 512; // default
        pointlight.shadow.mapSize.height = 512; // default
        pointlight.shadow.camera.near = 0.5; // default
        pointlight.shadow.camera.far = 500; // default false
        scene.add(pointlight);

        let ground = new THREE.PlaneGeometry(2000, 2000, 100, 100);
        ground.rotateX(-Math.PI / 2);

        let groundImage = textureLoader.load(
            "https://66.media.tumblr.com/b265c4dcf76d0ac0eca5eb914f663b78/tumblr_p5i9u7cVAz1x4yo1vo1_400.png"
        );

        let groundMaterial = new THREE.MeshBasicMaterial({
            map: groundImage
        });
        var floor = new THREE.Mesh(ground, groundMaterial);
        floor.receiveShadow = true;
        scene.add(floor);

        // objects

        var boxGeometry = new THREE.BoxGeometry(50, 50, 50);
        for (let i = 0; i < images.images.length; i++) {
            let boxImage;
            boxImage = textureLoader.load(images.images[i].url);
            let boxMaterial = new THREE.MeshBasicMaterial({
                flatShading: true,
                map: boxImage
            });
            let box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
            // box.position.y = Math.floor(Math.random() * 20) * 2;
            box.position.y = 20;
            box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
            box.castShadow = true;
            boxes.push(box);
            scene.add(box);
        }
        //

        canvasReference.current.appendChild(renderer.domElement);
        window.addEventListener("resize", onWindowResize, false);
    };
    const replace = () => {
        if (newscale == true) {
            scene.fog = new THREE.Fog(0x81c8f3, 100, 200);
            for (let i = 0; i < boxes.length; i++) {
                boxes[i].position.y = Math.floor(Math.random() * 20 - 10) * 30;
                boxes[i].position.x = Math.floor(Math.random() * 20 - 10) * 20;
                boxes[i].position.z = Math.floor(Math.random() * 20 - 10) * 30;
                boxes[i].scale.set(2, 2, 2);
            }
            newscale = false;
        } else {
            scene.fog = new THREE.Fog(0xff7ffc, 100, 200);
            for (let i = 0; i < boxes.length; i++) {
                boxes[i].position.x = Math.floor(Math.random() * 20 - 10) * 20;
                boxes[i].position.y = 20;
                boxes[i].position.z = Math.floor(Math.random() * 20 - 10) * 20;
                boxes[i].scale.set(1, 1, 1);
                boxes[i].rotation.y = 0;
                boxes[i].rotation.x = 0;
            }
            newscale = true;
        }
    };
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const animate = () => {
        requestAnimationFrame(animate);

        if (drunk == true) {
            for (var i = 0; i < boxes.length; i++) {
                boxes[i].rotation.y += 0.002;
                boxes[i].rotation.x += 0.002;
            }
        }

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
    if (props.images) {
        init();
        animate();
    }
    const drunkAnimation = () => {
        if (drunk == false) {
            drunk = true;
        } else {
            drunk = false;
        }
    };

    return (
        <div>
            <div className="canvasreference" ref={canvasReference}></div>
            <Drunktoggle replace={replace} drunkAnimation={drunkAnimation} />
        </div>
    );
}
