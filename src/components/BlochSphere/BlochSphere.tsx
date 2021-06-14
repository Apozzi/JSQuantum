import React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './BlochSphere.css';

const THREE = require("three-js")();

export default class BlochSphere extends React.Component<{
  isActivated : boolean,
  width: string,
  height: string,
  controls: boolean,
  realValue: number,
  imaginaryValue: number
}> {
  private mount: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  
  createACircle() {
    var radius   = 1,
    segments = 64,
    material = new THREE.LineBasicMaterial( { color: 0xffffff } ),
    geometry = new THREE.CircleGeometry( radius, segments );
    geometry.vertices.shift();
    return new THREE.Line( geometry, material );
  }

  createALine(x?: number, y?: number, z?:number) {
    const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    const geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 
        x ? x : 0,
        y ? y : 0,
        z ? z : 0
      )
    );
    return new THREE.Line( geometry, material );
  }

  createAText(message: string, font: any) {
    const geometry = new THREE.TextGeometry( message, {
      font: font,
      size: .07,
      height: 0,
    } );
    const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    const text =  new THREE.Mesh( geometry, material );
    return text;
  } 

  renderThreeJSCanvas() {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera( window.innerWidth / - 800, window.innerWidth / 800, 
      window.innerHeight / 800, window.innerHeight / - 800, 0.01, 1000 );
    const renderer = new THREE.WebGLRenderer( { alpha: true } );
    if (!this.props.width.includes("%") && !this.props.height.includes("%")) 
      renderer.setSize( parseInt(this.props.width), parseInt(this.props.height) );
    else 
      renderer.setSize( window.innerWidth, window.innerHeight );
    this.mount.current!.appendChild( renderer.domElement );
    const firstCircle = this.createACircle();
    const secondCircle = this.createACircle();
    const thirdCircle = this.createACircle();
    const realValueRadians = this.props.realValue * Math.PI;
    const imaginaryValueRadians = this.props.imaginaryValue * Math.PI + Math.PI/ 2;
    const x = Math.cos(imaginaryValueRadians);
    const y = Math.cos(realValueRadians) * Math.sin(imaginaryValueRadians);
    const z = Math.sin(realValueRadians) * Math.sin(imaginaryValueRadians);
    const line = this.createALine(x, y, z );
    secondCircle.rotation.x = Math.PI / 2;
    thirdCircle.rotation.y = Math.PI / 2;
    const loader = new THREE.FontLoader();
    loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', (font: any) => {
      const firstText = this.createAText("l0>", font);
      firstText.position.y = 1.1;
      const secondText = this.createAText("l1>", font);
      secondText.position.y = -1.1;
      if (this.props.controls) {
        scene.add(firstText);
        scene.add(secondText);
      }
    } );
    scene.add( firstCircle );
    scene.add( secondCircle );
    scene.add( thirdCircle );
    scene.add( line );
    camera.position.z = 5;
    camera.isOrthographicCamera = true;
    camera.position.x = 1;
    camera.position.y = 1;
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.update();
    controls.enabled = this.props.controls;
    const animate = () => {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      if (renderer.domElement) {
        renderer.domElement.style.width = this.props.width;
        renderer.domElement.style.height = this.props.height;
      }
    };

    animate();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.mount.current && this.props.isActivated) {
        this.renderThreeJSCanvas();
      }
    }, 300);
  }

  render() {
    return (
      <div className="bloch-sphere-view--canvas_center" ref={this.mount} />
    )
  }

}