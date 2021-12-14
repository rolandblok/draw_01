
class manipul_lines {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')

        this.lines = []

        this.setting1()

        this.draw_max = 1000000

        this.gui_folder_draw_options.add(this, 'no_lines').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.gui_folder_draw_options.add(this, 'mag_scale').onChange(function (v) { cvs.draw() }).min(0.001).step(0.001)
        this.kader = true
        this.kader_width = 10
        this.gui_folder_draw_options.add(this,'kader').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this,'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(10)
        this.gui_folder_draw_options.add(this,'randseed').onChange(function (v) { cvs.draw() }).step(1)

        this.loop_t = 0;
        this.loop = false
        this.gui_folder_draw_options.add(this,'loop').onChange(function (v) { cvs.draw() })
        this.loop_speed = 0.1
        this.gui_folder_draw_options.add(this,'loop_speed').onChange(function (v) { cvs.draw() }).min(0.01).step(.01).listen()

        this.capture_on = false
        this.gui_folder_draw_options.add(this,'capture_this')
        

        this.gui_folder_defaults = this.gui_folder_draw_options.addFolder('defaults')
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()


        this.capturer = new CCapture({
            framerate: 5,
            format: "png",
            name: "movie",
            quality: 100,
            verbose: true,
          });
    
    }

    capture_this() {
        // https://stubborncode.com/posts/how-to-export-images-and-animations-from-p5-js/
        if (!this.capture_on) {
            cvs.resizeCanvas(1024,1024)  // https://stackoverflow.com/questions/48036719/p5-js-resize-canvas-height-when-div-changes-height
            this.capture_on = true
            this.capturer.start()
            this.loop = true
            cvs.draw()
        }
        // ffmpeg -framerate 60  -i %07d.png -vf format=yuv420p movie.mp4
    }

    mouse(p, x,y){
        console.log("roland")
        for(const my_line of this.lines) {
            my_line.magnet(p, x, y)
        }
        cvs.draw()
    }

    close() {
        this.gui.removeFolder('wave wave draw options')
    }
    setting1() {
        this.discretizatie = 100
        this.no_lines = 100
        this.mag_scale = 0.1
        this.randseed = 0
        cvs.draw()

    }

    
    draw_plus() {
        this.draw_max += 10
        cvs.draw()
    }
    draw_min() {
        this.draw_max -= 10
        if (this.draw_max < 1) {
            this.draw_max = 1
        }
        cvs.draw()
    }


    draw(p) {
        let no_vertices = 0
        let w = p.width
        let h = p.height
        let Left = 0
        let Middle = h / 2
        let Right = h

        if (this.loop) { 
            p.loop() 
        } else {
            p.noLoop()
        } 

        if (p.isLooping()) {
            this.loop_t ++
        }

        if (this.no_lines != this.lines.length){
            this.lines = []
            // need to think how to connect this to GUI
            for (let li = 0; li < this.no_lines; li ++) {
                let dy = 1 / (this.no_lines-1)
                let my_line = new mySegLine(this, 0, dy*li, 1, dy*li)
                this.lines.push(my_line)
            }
        }

        p.clear()
        p.stroke([255,255,255]) 
        p.fill([255,255,255])
        p.rect(0,0,w,h)                 // make sure there is no transparant: movies will fail

        p.stroke([0,0,0]) 
        p.noFill()
        if (this.kader) {
            p.rect(this.kader_width, this.kader_width, Right-2*this.kader_width, h-2*this.kader_width)
        }

        p.randomSeed(this.randseed)

        for (const my_line of this.lines) {
            no_vertices += my_line.draw(p)
        }


        // DEBUG
        if (false) {
            p.beginShape()
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += 0.1) {
                        // DEBUG sinus
                        let X = this.my_circle_sinus(100, theta)
                        let x2 = Middle + X[0] 
                        let y2 = Middle + X[1]
                        p.vertex(x2,y2)
                        no_vertices ++
            }
            p.endShape()
        }

        if (this.capture_on) {
            this.capturer.capture(cvs.canvas)
            if (this.loop_t * this.loop_speed > p.TWO_PI) {
                this.capturer.stop()
                this.capturer.save()
                this.loop = false
                p.noLoop()
                this.capture_on = false
                p.resize(window.innerWidth, window.innerHeight)
            }
        }


        return no_vertices
    }

    

    /**
     * sinus circle around zero, radius R, sinus extra scale S, sinus freq and phi
     * @param {*} R 
     * @param {*} S 
     * @param {*} freq 
     * @param {*} phi 
     * @returns 
     */
    my_circle_sinus(R, phi) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y
        x = R * Math.sin(phi)
        y = R * Math.cos(phi)
        return [x,y]
    }
}

class mySegLine {
    constructor(parent, x1,y1,x2,y2,discretizatie) {
        this.parent = parent
        this.points = []
        let dx = (x2-x1) / this.parent.discretizatie
        let dy = (y2-y1) / this.parent.discretizatie
        for (let pi = 0; pi <= this.parent.discretizatie; pi++) {            
            let V = Array(2)
            V[X] = x1 + dx * pi
            V[Y] = y1 + dy * pi
            this.points.push(V)
        }
    }

    draw(p) {
        let no_vertices = 0
        p.beginShape()
        for (const point of this.points) {  
            let w = p.height - 2*this.parent.kader_width
            let h = p.height - 2*this.parent.kader_width
            let x = this.parent.kader_width + w*point[X]
            let y = this.parent.kader_width + h*point[Y]
            p.vertex(x, y)
            no_vertices ++
        }
        p.endShape()
        return no_vertices
    }

    magnet(p,x,y) {
        let sign = (p.mouseButton === 'left')? -1 : 1
        let Vr = Array(2)
        Vr[X] = (x - this.parent.kader_width) / (p.height-2*this.parent.kader_width)
        Vr[Y] = (y - this.parent.kader_width) / (p.height-2*this.parent.kader_width)
        for (let i = 0; i < this.points.length; i++) {  
            let point = this.points[i]
            let dist2 = dist_sqr2(point,Vr)
            if (dist2 > FLOATING_POINT_ACCURACY){
                let sc = 0.01* this.parent.mag_scale / (1+dist2)
                if (sc < 1) {
                    let n = normalize2(sub2(point,Vr))
                    let d = scale2(n, sc)
                    this.points[i][X] += sign*d[X]
                    this.points[i][Y] += sign*d[Y]
                } else {
                    this.points[i][X] = Vr[X]
                    this.points[i][Y] = Vr[Y]
                }
            }
        }
    }
}
