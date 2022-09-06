import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";


export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
    }

    setModel() {
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Group) {
                child.children.forEach((groupchild) => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                })
            }

            if (child.name === "Aquarium") {
                child.children[0].material = new THREE.MeshPhysicalMaterial();
                child.children[0].material.roughness = 0;
                child.children[0].material.color.set(0xffffff);
                child.children[0].material.ior = 2.33;
                child.children[0].material.transmission = 1;
                child.children[0].material.opacity = 1;

            }
            if (child.name === "Shelves") {
                child.children[48].material = new THREE.MeshPhysicalMaterial();
                child.children[48].material.roughness = 0;
                child.children[48].material.color.set(0x8DE8E8);
                child.children[48].material.ior = 2.3;
                child.children[48].material.transmission = 1;
                child.children[48].material.opacity = 1;

            }

            if (child.name === "Mini_Floor") {
                child.position.x = 0;
                child.position.z = 5;
            }

            if (child.name === "Mailbox" ||
                child.name === "Leaves" ||
                child.name === "Grass" ||
                child.name === "Dirt" ||
                child.name === "Tree" ||
                child.name === "Apples" ||
                child.name === "FirstFloor" ||
                child.name === "SecondFloor" ||
                child.name === "ThirdFloor"
            ) {
                child.scale.set(0, 0, 0);
            }
            if (child.name === "Cube") {
                child.scale.set(5, 5, 5);
                child.position.set(0, 5, 0);
                child.rotation.y = Math.PI / -4;
            }

    });


        //Fish Tank Light
        const width = .7;
        const height = .5;
        const intensity = 2;
        const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
        rectLight.position.set(5.98828, 5.5, 1.6);
        rectLight.rotation.x = -Math.PI / 2;
        rectLight.rotation.z = -Math.PI / 4;

        //Gameboy Light
        const gamewidth = .15;
        const gameheight = .15;
        const gameintensity = 5;
        const gameLight = new THREE.RectAreaLight(0x69D952, gameintensity, gamewidth, gameheight);
        gameLight.position.set(-5.13667, 11.5, 0.45);
        gameLight.rotation.z = -Math.PI / 2;
        gameLight.rotation.y = -Math.PI / 12;

        //Earth Light

        const earthwidth = .15;
        const earthheight = .15;
        const earthintensity = 2.5;
        const earthLight = new THREE.RectAreaLight(0xFFFEB5, earthintensity, earthwidth, earthheight);
        earthLight.position.set(-7.75, 4.5, 1);
        earthLight.rotation.z = -Math.PI / 4;
        earthLight.rotation.x = -Math.PI / 2;

        this.actualRoom.add(rectLight);
        this.actualRoom.add(gameLight);
        this.actualRoom.add(earthLight);

        this.roomChildren["rectLight"] = rectLight;
        this.roomChildren["gameLight"] = gameLight;
        this.roomChildren["earthLight"] = earthLight;

        //const rectLightHelper = new RectAreaLightHelper(rectLight);

        //rectLight.add(rectLightHelper);
        // gameLight.add(rectLightHelper);
        //earthLight.add(rectLightHelper);



        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.17, 0.17, 0.17);
    }

    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.actualRoom);
        console.log(this.room);
        this.swim = this.mixer.clipAction(this.room.animations[14]);
        this.fly = this.mixer.clipAction(this.room.animations[15]);

        this.fly.play();
        this.swim.play();
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.05;
        });
    }

    resize() { }

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualRoom.rotation.y = this.lerp.current;

        this.mixer.update(this.time.delta * 0.0009);
    }
}
