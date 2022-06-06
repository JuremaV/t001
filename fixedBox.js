const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if(!webgl){throw new Error("WebGL not supported!" );}
webgl.clearColor(1.0,0.0,1.0,1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);
//
webgl.enable(webgl.DEPTH_TEST);

// 1st Uncomment this session to rotate along z-axis
var u = 0.25

var blackBox = new Float32Array([

  -u,u, u,u, -u,-u,
  
  -u,-u, u,u, u,-u,

  0.0, 0.0, 0.0, //1.0,
  0.0, 0.0, 0.0, //1.0,
  0.0, 0.0, 0.0, //1.0,

  0.0, 0.0, 0.0, //1.0,
  0.0, 0.0, 0.0, //1.0,
  0.0, 0.0, 0.0 //1.0

]);

// 2nd Uncomment this session to translate
/*var blackBox = new Float32Array([

    -1,0, 0,0, -1,-1,
    
    -1,-1, 0,0, 0,-1,

    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,

    0.0, 0.0, 0.0, //1.0,
    0.0, 0.0, 0.0, //1.0,
    0.0, 0.0, 0.0 //1.0

]);*/

const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, blackBox, webgl.STATIC_DRAW);

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vertexShader,
    `attribute vec2 pos;
    attribute vec4 colours;
    uniform float xshift;
    uniform float yshift;
    uniform float r;
    uniform float g;
    uniform float b;
    uniform float a;
    uniform float o;
    varying vec4 vcolours;
    
    void main() { 
      
       //Translation
      gl_Position = vec4(pos,0,1) + vec4(xshift,yshift,0,0);

      //Rotation along the z-Axis //Comment this session to translate
        gl_Position.x = cos(o)*pos.x -sin(o)*pos.y;
        gl_Position.y = sin(o)*pos.x +cos(o)*pos.y;
        gl_Position.z = 0.0;
        gl_Position.w = 1.0; //x/w 

        vcolours = vec4(r,g,b,a);
      }`);
webgl.compileShader(vertexShader);
    if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)){
    console.error("ERROR compile vertex shader!", webgl.getShaderInfoLog(vertexShader)); }

const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fragmentShader,
        `precision mediump float;
        varying vec4 vcolours;
        void main() { gl_FragColor = vcolours;}` );
 webgl.compileShader(fragmentShader);
     if (!webgl.getShaderParameter(fragmentShader, webgl.COMPILE_STATUS)){
    console.error("ERROR compile fragment shader!", webgl.getShaderInfoLog(fragmentShader)); }

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);

const positionLocation = webgl.getAttribLocation(program, `pos`);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

webgl.useProgram(program);

let xs = 0.0;
let ys = 0.0;
let r = 0.0;
let g = 0.0;
let b = 0.0;
let a = 1.0;
let angle = 0.001;
let incr = 0.001;
let bDecr = false;

document.onkeydown = function (event) {
    switch (event.key) {
      case "x": //x-axis RIGHT
        xs += 0.01;
        break;
      case "z": //x-axis LEFT
        xs -= 0.01;
        break;
      case "y": //y-axis UP
        ys += 0.01;
        break;
      case "t": //y-axis DOWN
        ys -= 0.01;
        break;
      case "r": //increase in red colour
        r += 0.01;
        break;
      case "e": //decrease in red colour
        r -= 0.01;
        break;
      case "g": //increase in green colour
        g += 0.01;
        break;
      case "f": //decrease in green colour
        g -= 0.01;
        break;
      case "b": //increase in blue colour
        b += 0.01;
        break;
      case "v": //decrease in blue colour
        b -= 0.01;
        break;
      case "a": //increase in transparency
        a -= 0.01;
        break;
      case "q": //decrease in transparency
        a += 0.01;
        break; 
      case "j": //routate once anticlockwise z-axis
        angle += 0.01; //1.0
        break;
      case "k": //routate once counterclockwise z-axis
        angle -= 0.01; //1.0
        break; 

    }
}

draw();
function draw(){

 webgl.clear(webgl.COLOR_BUFFER_BIT); 
 webgl.uniform1f(webgl.getUniformLocation(program, `xshift`), xs); 
 webgl.uniform1f(webgl.getUniformLocation(program, `yshift`), ys); 
 webgl.uniform1f(webgl.getUniformLocation(program, `r`), r); 
 webgl.uniform1f(webgl.getUniformLocation(program, `g`), g); 
 webgl.uniform1f(webgl.getUniformLocation(program, `b`), b); 
 webgl.uniform1f(webgl.getUniformLocation(program, `a`), a); 
 webgl.uniform1f(webgl.getUniformLocation(program, `o`), angle);
webgl.drawArrays(webgl.TRIANGLES, 0, 6);
//angle +=0.01; 
 if (angle > 0.001) bDecr = true; 
 if (angle < -0.001) bDecr = false;  
 window.requestAnimationFrame(draw);
} 