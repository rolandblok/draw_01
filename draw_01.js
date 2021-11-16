//little script using processing.

var uniqueID = (function() {
  var id = 0; // This is the private persistent value
  // The outer function returns a nested function that has access
  // to the persistent value.  It is this nested function we're storing
  // in the variable uniqueID above.
  return function() { return id++; };  // Return and increment
})(); // Invoke the outer function after defining it.


var stats = new Stats();
document.body.appendChild(this.stats.dom);
stats.showPanel(0)  // 0: fps, 1: ms, 2: mb, 3+: custom

var gui = new dat.GUI();
var settings = []
var setup_done = false

// =================
// ===setup=========
// =================
function setup() {
  // createCanvas(400,400)
  //createCanvas(window.innerWidth, window.innerHeight)
  createCanvas(window.innerWidth, window.innerHeight,SVG)
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

  var gui_folder_draw = gui.addFolder('draw options')

  // gui_folder_frustrum.open()
  var gui_folder_draw_options = gui.addFolder('draw_options')
  settings.line_width = 40 
  gui_folder_draw_options.add(settings,'line_width').onChange(function(v){draw()}).min(3)
  gui_folder_draw_options.open()

  gui.add(settings, 'downloadSvg')
  settings.lines_drawn = 0
  gui.add(settings, 'lines_drawn').listen()

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

function draw() {
  if (!setup_done) return
  
  stats.begin();

  dt_ms = millis() - last_time_ms
  last_time_ms = millis()
  
  let w = window.innerWidth
  let h = window.innerHeight
  let Left = 0
  let Middle = h/2
  let Right = h

  clear()
  stroke([0,0,0])  // BLACK

  let R =  0.5* h / 1.2
  
  // SINS
  strokeWeight(1)
  for (let y = 0; y < h; y += settings.line_width) {

    if ((y > (h/2-R)) && (y < (h/2+R))){
      let z = h/2 - y
      beginShape()
      let ll = sqrt(R*R - z*z)
      let left = Middle-ll
      let right = Middle+ll
      let width = 2*ll
      // lines
      line (Left, y, left, y)
      line (right, y, Right, y)
      
      // waves
      let freq = round(random(1,15))
      for ( let x = left; x <right; x ++) {
        let S = y + 0.4 * settings.line_width * sin(TWO_PI * (x-left)*freq/width )
        vertex(x,S)
      }
      endShape()
    } else {
      // lines
      line (Left, y, Right, y)
    }
  }

  stats.end();

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
