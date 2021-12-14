//little script using processing.
var uniqueID = (function() {
  var id = 0; // This is the private persistent value
  // The outer function returns a nested function that has access
  // to the persistent value.  It is this nested function we're storing
  // in the variable uniqueID above.
  return function() { return id++; };  // Return and increment
})(); // Invoke the outer function after defining it.


// var stats = new Stats();
// document.body.appendChild(this.stats.dom);
// stats.showPanel(0)  // 0: fps, 1: ms, 2: mb, 3+: custom

var gui = new dat.GUI();
var settings = []
settings.draw_modes  = ['none', 'wave_circle', 'wave_wave', 'spirograph','circle_snake', 
                        'triangle_snake','block_snake', 'circle_sinus', 'read_json', 'sphere_band']
settings.draw_mode = settings.draw_modes[settings.draw_modes.length-2]
gui.add(settings, 'draw_mode', settings.draw_modes).onChange(function(v){set_draw_mode()})
var setup_done = false

dat.GUI.prototype.removeFolder = function(name) {
  var folder = this.__folders[name];
  if (!folder) {
    return;
  }
  folder.close();
  this.__ul.removeChild(folder.domElement.parentNode);
  delete this.__folders[name];
  this.onResize();
}

addEventListener("resize", this.resize, false);
window.addEventListener("focus", function(event) { console.log( "window has focus"); paused = false }, false);
window.addEventListener("blur", function(event) { console.log( "window lost focus");paused = true }, false);

settings.downloadSvg=()=> {
  console.log("save")
  svg.save_canvas()
}

gui.add(settings, 'downloadSvg')
settings.no_vertices = 0
gui.add(settings, 'no_vertices').listen()

let sketch = function(p) {
  p.setup = function () {
    // createCanvas(400,400)
    if (p.type === "SCREEN") {
      canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    } else if (p.type === "SVG") {
      canvas_SVG = p.createCanvas(window.innerWidth, window.innerHeight, p.SVG)
    }
    // https://github.com/zenozeng/p5.js-svg/
    // https://makeyourownalgorithmicart.blogspot.com/2018/03/creating-svg-with-p5js.html
    // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
    
    p.noLoop();

    set_draw_mode()
    setup_done = true
  }

  p.draw = function () {
    if (!setup_done) return
    

    if (current_drawer != 0) {
      settings.no_vertices = current_drawer.draw(p)
    }
  }

  p.save_canvas = function() {
    if (p.type === "SVG") {
      console.log("save")
      p.draw()
      p.save()
    }
  }
  p.keyPressed = function(event) {
    console.log("key " + event.key)
    if (event.key === 'p') {
      console.log('p')
    } else if (event.key === '=') {
      current_drawer.draw_plus()
    } else if (event.key === '-') {
      current_drawer.draw_min()
    }
  
  }
  

}

var cvs = new p5(sketch, "canvas" )
cvs.type = "SCREEN"
var svg = new p5(sketch, "hidden_div")
svg.type = "SVG"


var current_drawer = 0
function set_draw_mode() {
  if (current_drawer != 0) {
    current_drawer.close()
  }
  if (settings.draw_mode == 'none') { 
    current_drawer = 0
  } else if (settings.draw_mode == 'wave_circle') {
    current_drawer = new wave_circle(gui,cvs)
  } else if (settings.draw_mode == 'wave_wave') {
    current_drawer = new wave_wave(gui,cvs)
  } else if (settings.draw_mode == 'spirograph') {
    current_drawer = new spirograph(gui,cvs)
  } else if (settings.draw_mode == 'circle_snake') {
    current_drawer = new circle_snake(gui,cvs)
  } else if (settings.draw_mode == 'triangle_snake'){
    current_drawer = new triangle_snake(gui,cvs)
  } else if (settings.draw_mode == 'block_snake'){
    current_drawer = new block_snake(gui,cvs)
  } else if (settings.draw_mode == 'circle_sinus'){
    current_drawer = new circle_sinus(gui,cvs)
  } else if (settings.draw_mode == 'read_json'){
    current_drawer = new read_json(gui,cvs)
  } else if (settings.draw_mode == 'sphere_band'){
    current_drawer = new sphere_band(gui,cvs)
  }

  cvs.draw()
}




// =================
// ===MOUSE n KEYS=======
// =================
function mouseDragged(event) {
  RM = random(20,100)
} 
function mousePressed(event) {
  mouseDragged(event)
}


function resize() {
  console.log("resize")
  cvs.resizeCanvas(window.innerWidth, window.innerHeight)
  cvs.draw()

}
