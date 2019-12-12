import React, { Component, useEffect, useRef } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { socket } from "./sockets";
import { useSelector } from "react-redux";

////variable scene componenets

console.log("santity check");
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

export default class FifthDimension extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }
    componentDidMount() {
        // const images = useSelector(state => {
        //     return state && state.images;
        // });
        console.log(
            "images arrived in fifthdimension component from state",
            images
        );
        this.init();
        this.animate();

        if (start) {
            document.addEventListener("click", function() {
                controls.lock();
            });
        }

        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
    }

    onKeyUp(event) {
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
    }
    onKeyDown(event) {
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
    }
    init() {
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
        scene.fog = new THREE.Fog(0xff7ffc, 100, 500);
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
        function createfloor() {
            let ground = new THREE.PlaneGeometry(2000, 2000, 100, 100);
            ground.rotateX(-Math.PI / 2);

            let groundImage = textureLoader.load(
                "https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=440&h=220&q=60"
            );
            let groundMaterial = new THREE.MeshBasicMaterial({
                map: groundImage
            });
            var floor = new THREE.Mesh(ground, groundMaterial);
            scene.add(floor);
        }
        createfloor();

        // objects
        var boxGeometry = new THREE.BoxGeometry(20, 20, 20);
        let boxImage = textureLoader.load(
            "https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=440&h=220&q=60"
        );
        for (let i = 0; i < 5; i++) {
            let boxMaterial = new THREE.MeshBasicMaterial({
                flatShading: true,
                map: boxImage
            });
            var box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.x = Math.floor(Math.random() * 20 - 10) * 10;
            box.position.y = Math.floor(Math.random() * 20);
            box.position.z = Math.floor(Math.random() * 20 - 10) * 10;
            scene.add(box);
        }
        //

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        //
        window.addEventListener("resize", this.onWindowResize, false);
    }
    onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    animate() {
        requestAnimationFrame(this.animate);

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
    }

    render() {
        return <div></div>;
    }
}
