import React from 'react';
import './HSVView.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ColorUtils from '../../../../utils/ColorUtils';

const THREE = require("three-js")();
const math = require('mathjs');

export default class HSVView extends React.Component<{
  isActivated : boolean,
  width: string,
  height: string,
  controls: boolean,
  qubitsVector: number[]
}> {
  private mount: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  
  createACube(width: number, height: number, lenght: number, x: number, y: number, z: number, color: any) {
    const geometry = new THREE.BoxGeometry( width, height, lenght );
    const material = new THREE.MeshBasicMaterial( {color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(x, y, z);
    return cube;
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

  getHueValueFromQubit(qubit: any) : number {
    const realValue = math.re(qubit);
    const imaginaryValue = math.im(qubit);
    let hue = 0;
    if (realValue >=  0)
      hue = math.atan(imaginaryValue / realValue);
    else
      hue = math.atan(imaginaryValue / realValue) + Math.PI;
    return hue / (2 * Math.PI);
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
    


    const loader = new THREE.FontLoader();
    loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', (font: any) => {
      const firstText = this.createAText("l0>", font);
      firstText.position.y = 1.1;
      const secondText = this.createAText("l1>", font);
      secondText.position.y = -1.1;
      if (this.props.controls) {

      }
    } );

    let offsetX = 0.5;
    let offsetY = 0.5;
    let columnSize = Math.sqrt(this.props.qubitsVector.length);
    if (columnSize !== Math.ceil(columnSize)) {
      columnSize = Math.ceil(Math.sqrt(this.props.qubitsVector.length * 2));
      offsetY = 0.15;
    };
    const flatHeight = 0.014 / columnSize;
    const distanceBetweenCubes = 1.54 / columnSize;
    const zoomSize = 1.4 / columnSize;
    let ix = 0;
    let iy = 0; 
    for (let qubit of this.props.qubitsVector) {
      if ((ix - 1) % columnSize === (columnSize - 1)) {
        iy++;
        ix = 0;
      }
      const qubitPercentage = math.abs(math.pow(qubit, 2));
      const height = flatHeight * (200*qubitPercentage);
      let color = 0x808080;
      if (qubitPercentage !== 0) {
        const rgb = ColorUtils.hsvToRgb(this.getHueValueFromQubit(qubit) + 1.15, 1, 1);
        color = ColorUtils.rgbToHexNumber(rgb.r, rgb.g, rgb.b);
      }
      const cube = this.createACube(
          zoomSize,
          height,
          zoomSize, 
          distanceBetweenCubes*ix - offsetX, 
          height/2, 
          distanceBetweenCubes*iy - offsetY,
          color);
      var edges = new THREE.EdgesHelper( cube, 0x000000);
      edges.material.linewidth = 10;
      scene.add(edges);
      scene.add(cube);
      ix++;
    }

    camera.position.z = 10;
    camera.isOrthographicCamera = true;
    camera.position.x = 10;
    camera.position.y = 10;
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.enabled = this.props.controls;
    controls.update();
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
    <div>
      <img className="hsv-view--color_line" src="/images/hsvcolorline.png"></img>
      <div className="hsv-view--labels_color_line"> 
        <div className="hsv-view--label_color_line">-</div>
        <div className="hsv-view--label_color_line">i</div>
        <div className="hsv-view--label_color_line">+</div>
        <div className="hsv-view--label_color_line">-i</div>
        <div className="hsv-view--label_color_line">-</div>
      </div>
      <div className="hsv-view--canvas_center" ref={this.mount} />
    </div>
    )
  }

}