import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";


export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach(child => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;

            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;

        GSAP.registerPlugin(ScrollTrigger);

        this.setSmoothScroll();
        this.setScrollTrigger();

    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.5,
            disableRaf: true,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }

    setSmoothScroll() {
        this.asscroll = this.setupASScroll();
    }
    
    setScrollTrigger() {
        ScrollTrigger.matchMedia({
            //Desktop
            "(min-width: 969px)": () => {
                // console.log("fired desktop");

                this.room.scale.set(0.17, 0.17, 0.17);
                this.camera.orthographicCamera.position.set(0, 6.5, 10);
                this.room.position.set(0, 0, 0);
                // First section -----------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        //markers: true,
                    },
                }).to(this.camera.orthographicCamera.position, {
                    x: -2.5,
                });


                // Second section -----------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.camera.orthographicCamera.position, {
                    y: 6.5,
                    x: 2.5,
                });

                // Third section -----------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.camera.orthographicCamera.position, {
                    y: 6.5,
                    x: -2.5,
                    z: 10
                });
            },
            // Mobile
            "(max-width: 968px)": () => {
                // console.log("fired mobile");

                // Resets
                this.room.scale.set(0.07, 0.07, 0.07);
                this.room.position.set(0, 0, 0);
                this.rectLight.width = 0.05;
                this.rectLight.height = 0.05;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);

                // First section -----------------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.room.scale, {
                    x: 0.11,
                    y: 0.11,
                    z: 0.11,
                });

                // Second section -----------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                })
                

                // Third section -----------------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                });
            },
            all: () => {
                this.sections = document.querySelectorAll(".section");
                this.sections.forEach((section) => {
                    this.progressWrapper =
                        section.querySelector(".progress-wrapper");
                    this.progressBar = section.querySelector(".progress-bar");

                    if (section.classList.contains("right")) {
                        GSAP.to(section, {
                            borderTopLeftRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            },
                        });
                    } else {
                        GSAP.to(section, {
                            borderTopRightRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomRightRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            },
                        });
                    }
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        },
                    });
                });

                // All animations
                // First section -----------------------------------------
                this.firstCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                // Second section -----------------------------------------
                this.secondCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                })
                    .to(
                        this.circleSecond.scale,
                        {
                            x: 3,
                            y: 3,
                            z: 3,
                        },
                        "same"
                    );

                // Third section -----------------------------------------
                this.thirdCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                    },
                }).to(this.circleThird.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                //Box Minimize 
                this.firstPartTimeline= new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "center center",
                    },
                })

                // Mini Platform Animations
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "center center",
                    },
                });

                //animations
                this.room.children.forEach(child=>{
                    if(child.name ==="Mini_Floor"){
                        this.first = GSAP.to(child.position, {
                            x: -3.75,
                            z: 8.75,
                            ease: "back.out(2)",
                            duration: 0.3,
                        });
                    }
                    if(child.name ==="Mailbox"){
                        this.eleventh = GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .3,
                        });
                    }

                    if(child.name ==="FirstFloor"){
                        this.third = GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .3,
                        });
                    }
                    if(child.name ==="SecondFloor"){
                        this.fourth =GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .3,
                        });
                    }
                    if(child.name ==="ThirdFloor"){
                        this.second = GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .3,
                        });
                    }
                    if(child.name ==="Grass"){
                        this.fifth = GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .3,
                        });
                    }
                    if(child.name ==="Dirt"){
                        this.sixth = GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .3,
                        });
                    }
                    if(child.name ==="Tree"){
                        this.seventh = GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .3,
                        });
                    }
                    if(child.name ==="Apple"){
                        this.eighth= GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .3,
                        });
                    }
                    if(child.name ==="Leaves"){
                        this.ninth= GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .3,
                        });
                    }
                    if(child.name ==="Apples"){
                        this.tenth=GSAP.to(child.scale, {
                            x: 1,
                            z: 1,
                            y: 1,
                            ease: "back.out(2)",

                            duration: .2,
                        });
                    }if(child.name ==="Cube"){
                            this.first = GSAP.to(child.scale, {
                                x:0,
                                y:0,
                                z:0,
                                ease: "sine",
                                duration: .5,
                            })
                        }
                });
                this.firstPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.eleventh, );
                this.secondPartTimeline.add(this.second);
                this.secondPartTimeline.add(this.third);
                this.secondPartTimeline.add(this.fourth);
                this.secondPartTimeline.add(this.fifth,"-=0.2");
                this.secondPartTimeline.add(this.sixth,"-=0.2");
                this.secondPartTimeline.add(this.seventh,"-=0.2");
                this.secondPartTimeline.add(this.eighth,"-=0.2");
                this.secondPartTimeline.add(this.ninth,"-=0.2");
                this.secondPartTimeline.add(this.tenth);
                
            },

        });
    }


    resize() {

    }

    update() {
    }
}
