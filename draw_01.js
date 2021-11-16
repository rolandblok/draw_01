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
settings.draw_modes = ['none', 'wave_circle']
settings.draw_mode = settings.draw_modes[1]
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

// =================
// ===setup=========
// =================
function setup() {
  // createCanvas(400,400)
  createCanvas(window.innerWidth, window.innerHeight)
  // createCanvas(window.innerWidth, window.innerHeight,SVG)
  // https://github.com/zenozeng/p5.js-svg/
  // https://makeyourownalgorithmicart.blogspot.com/2018/03/creating-svg-with-p5js.html
  // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  
  noLoop();
  addEventListener("resize", this.resize, false);
  
  window.addEventListener("focus", function(event) { console.log( "window has focus"); paused = false }, false);
  window.addEventListener("blur", function(event) { console.log( "window lost focus");paused = true }, false);
  



  settings.downloadSvg=()=>
  {
      let svgElement = document.getElementsByTagName('svg')[0];
      let svg = svgElement.outerHTML;
      let file = new Blob([svg], { type: 'plain/text' });
      let a = document.createElement("a"), url = URL.createObjectURL(file);
  
      a.href = url;
      a.download = 'exported.svg';    
      document.body.appendChild(a);
      a.click();
  
      setTimeout(function() 
      {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }


  gui.add(settings, 'downloadSvg')
  settings.lines_drawn = 0
  gui.add(settings, 'lines_drawn').listen()

  set_draw_mode()
  setup_done = true

}

// =================
// ===draw==========
// =================
var last_time_ms = 0
var dirs = [-1, 1]

function CS(x,y) {
  return center2dscreen(window.innerWidth, window.innerHeight, [x,y])
}


var drawer = 0
function set_draw_mode() {
  if (drawer != 0) {
    drawer.close()
  }
  if (settings.draw_mode == 'none') { 
    drawer = 0
  } else if (settings.draw_mode == 'wave_circle') {
    drawer = new wave_circle(gui)
  }

  draw()
}

function draw() {
  if (!setup_done) return
  
  // stats.begin();

  dt_ms = millis() - last_time_ms
  last_time_ms = millis()
  
  if (drawer != 0) {
    drawer.draw()
  }

  // stats.end();

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
function keyPressed(event) {
  console.log("key " + event.key)
  if (event.key === 'p') {
    console.log('p')
  } 

}


function resize() {
  console.log("resize")
  resizeCanvas(window.innerWidth, window.innerHeight)
  settings.aspect = window.innerWidth / window.innerHeight
  draw()

}
