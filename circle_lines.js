
class circle_lines {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')

        this.setting1()

        this.draw_max = 1000000

        this.ph1_MAX = 4* Math.PI
        this.ph1_end_MAX = 8*  Math.PI
        this.ph2_MAX = 4* Math.PI
        this.ph2_end_MAX = 8* Math.PI
        this.no_lines_MAX = 500

        this.gui_folder_draw_options.add(this, 'no_lines').onChange(function (v) { cvs.draw() }).min(10).step(1).listen()
        this.gui_folder_draw_options.add(this, 'ph1').onChange(function (v) { cvs.draw() }).min(0).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph1_end').onChange(function (v) { cvs.draw() }).min(0.1).step(0.1).listen()
        this.gui_folder_draw_options.add(this, 'ph2').onChange(function (v) { cvs.draw() }).min(0).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph2_end').onChange(function (v) { cvs.draw() }).min(0.1).step(0.1).listen()
        this.gui_folder_draw_options.add(this, 'R1_perc').onChange(function (v) { cvs.draw() }).min(10).step(1)
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
        this.gui_folder_defaults.add(this, 'setting2')
        this.gui_folder_defaults.add(this, 'rando')
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
        console.log("mouse")
        cvs.draw()
    }

    close() {
        this.gui.removeFolder('wave wave draw options')
    }
    setting1() {
        this.discretizatie = 100
        this.no_lines = 200
        this.R1_perc = 90
        this.ph1 = 0
        this.ph1_end = 5
        this.ph2 = Math.PI
        this.ph2_end = 2*Math.PI

        this.randseed = 0
        cvs.draw()

    }
    setting2() {
        this.discretizatie = 100
        this.no_lines = 200
        this.R1_perc = 90
        this.ph1 = 3.25
        this.ph1_end = 6.2
        this.ph2 = 5.71
        this.ph2_end = 12.1

        this.randseed = 0
        cvs.draw()

    }
    rando() {
        this.ph1 = Math.random() * this.ph1_MAX
        this.ph1_end = Math.random() *this.ph1_end_MAX
        this.ph2 = Math.random() * this.ph2_MAX
        this.ph2_end = Math.random() * this.ph2_end_MAX
        this.no_lines = 20 + Math.random()*this.no_lines_MAX

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


    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
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

        p.clear()
        if (p.type === 'SCREEN') {
            p.stroke(bgc) 
            p.fill(bgc)
            p.rect(0,0,w,h)                 // make sure there is no transparant: movies will fail
        }
        p.stroke(fgc) 
        p.noFill()
        
        if (this.kader) {
            p.rect(this.kader_width, this.kader_width, Right-2*this.kader_width, h-2*this.kader_width)
        }

        let c_ph1 = this.ph1
        let c_ph2 = this.ph2
        let R = this.R1_perc * h / 200
        let step_ph1 = (this.ph1_end - this.ph1)/this.no_lines
        let step_ph2 = (this.ph2_end - this.ph2)/this.no_lines
        for (let i = 0; i < this.no_lines; i ++){
            p.beginShape()


            let x = Middle + R * p.sin(i*step_ph1 + this.ph1)
            let y = Middle + R * p.cos(i*step_ph1 + this.ph1)
            p.vertex(x,y)
            no_vertices ++

            x = Middle + R * p.sin(i*step_ph2 + this.ph2)
            y = Middle + R * p.cos(i*step_ph2 + this.ph2)
            p.vertex(x,y)
            no_vertices ++

            p.endShape()
        }

        p.randomSeed(this.randseed)

        
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
