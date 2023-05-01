"use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var rotationLocation = gl.getUniformLocation(program, "u_rotation");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  var translation = [100, 150];
  var rotation = [0, 1];
  var color = [Math.random(), Math.random(), Math.random(), 1];

  document.getElementById("Btn").onclick = function () {
    color = [Math.random(), Math.random(), Math.random(), 1];
    drawScene();  
    };

  drawScene();  

  // Setup a ui.
  webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
  webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value;
    var angleInRadians = angleInDegrees * Math.PI / 180;
    rotation[0] = Math.sin(angleInRadians);
    rotation[1] = Math.cos(angleInRadians);
    drawScene();
  }

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4fv(colorLocation, color);
    gl.uniform2fv(translationLocation, translation);
    gl.uniform2fv(rotationLocation, rotation);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 60;  // DHM에 삼각형 20개 3*20 = 60
    gl.drawArrays(primitiveType, offset, count);
  }
}

function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([

          // D부분 
          // left column
          0, 0,
          20, 0,
          0, 150,
          0, 150,
          20, 0,
          20, 150,

          // middle_top rung
          20, 0,
          20, 30,
          60, 75,
          60, 75,
          20, 30,
          40, 75,

          // middle_bottom rung
          20, 150,
          20, 120,
          60, 75,
          60, 75,
          20, 120,
          40, 75,

          // H부분 
          // left column
          80, 0,
          100, 0,
          80, 150,
          80, 150,
          100, 0,
          100, 150,

          // right column
          140, 0,
          160, 0,
          140, 150,
          140, 150,
          160, 0,
          160, 150,

          // middle rung
          100, 60,
          140, 60,
          100, 90,
          100, 90,
          140, 60,
          140, 90,

          // M부분 
          // left column
          180, 0,
          200, 0,
          180, 150,
          180, 150,
          200, 0,
          200, 150,

          // right column
          250, 0,
          270, 0,
          250, 150,
          250, 150,
          270, 0,
          270, 150,

          // middle_left rung
          200, 0,
          200, 30,
          225, 90,
          225, 90,
          200, 30,
          225, 120,

          // middle_left rung
          225, 90,
          225, 120,
          250, 0,
          250, 0,
          225, 120,
          250, 30,
      ]),
      gl.STATIC_DRAW);
}

main();
