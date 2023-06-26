import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertex from "./shader/vertex.glsl"
import fragment from "./shader/fragment.glsl"
import dat from "dat.gui";
import t from '../img/day.png'

export default class Sketch {
    constructor(opstions) {
        this.scene = new THREE.Scene();

        this.container = opstions.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xeeeeee, 1);

        this.container.appendChild(this.renderer.domElement);


        let frustumSize = 1.0;
        let aspect = 1.0;
        this.camera = new THREE.OrthographicCamera(frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000);
        this.camera.position.set(0.0, 0.0, 2.0);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;

        this.isPlaying = true;

        this.addObjects();
        this.resize();
        this.render();
        this.setupResize();
        this.settings();
    }

    settings() {
        let that = this;
        this.settings = {
            progress: 0,
        };

        this.gui = new dat.GUI();
        this.gui.add(this.settings, "progress", 0.0, 1.0, 0.01);
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        // image cover
        this.imageAspect = 853/1280;
        let a1, a2;
        if(this.height/this.width>this.imageAspect){
            a1 = (this.width/this.height) * this.imageAspect;
            a2 = 1.0;
        }else{
            a1 = 1.0;
            a2 = (this.height/this.width) * this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        this.camera.updateProjectionMatrix();
    }

    addObjects() {
        let that = this;

        let tt = new THREE.TextureLoader().load(t);
        tt.minFilter = THREE.NearestFilter;

        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: 'f', value: 0 },
                progress: { type: 'f', value: 0 },
                texture1: { type: 't', value: tt },
                resolution: { type: 'v4', value: new THREE.Vector4() },
            },
            // wireframe: true,
            // transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.geometry = new THREE.PlaneGeometry(1.0, 1.0, 1.0, 1.0);

        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
    }

    addLight(){
        const light1 = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(0.5, 0.0, 0.866)
        this.scene.add(light2);
    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.render();
        }
    }

    render() {
        if (!this.isPlaying) return;
        this.time += 0.05;

        this.material.uniforms.time.value = this.time;
        this.material.uniforms.progress.value = this.settings.progress;

        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}