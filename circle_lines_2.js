
class circle_lines_2  extends Drawer{

    constructor(gui, xywh, sub_gui = '') {
        super('cirlce lines 2 options',gui, xywh, sub_gui)


        this.setting1()


        this.ph1_MAX = 4* Math.PI
        this.ph1_end_MAX = 8*  Math.PI
        this.ph2_delay_MAX = 10
        this.no_lines_MAX = 500

        this.gui_folder_draw_options.add(this, 'no_lines').onChange(function (v) { cvs.draw() }).min(10).step(1).listen()
        this.gui_folder_draw_options.add(this, 'ph1').onChange(function (v) { cvs.draw() }).min(0).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph1_end').onChange(function (v) { cvs.draw() }).min(0.1).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph2_delay').onChange(function (v) { cvs.draw() }).min(0).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'R1_perc').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.gui_folder_draw_options.add(this, 'R2_perc').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.gui_folder_draw_options.add(this,'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(10)
        this.gui_folder_draw_options.add(this,'randseed').onChange(function (v) { cvs.draw() }).step(1)

        this.loop_t = 0;
        this.loop = false
        this.gui_folder_draw_options.add(this,'loop').onChange(function (v) { cvs.draw() })
        this.loop_speed = 0.1
        this.gui_folder_draw_options.add(this,'loop_speed').onChange(function (v) { cvs.draw() }).min(0.01).step(.01).listen()

        this.capture_on = false
        this.gui_folder_draw_options.add(this,'capture_this')
        

        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'mars_aarde')
        this.gui_folder_defaults.add(this, 'setting3')
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

    
    setting1() {
        this.kader = 0
        this.discretizatie = 100
        this.no_lines = 700
        this.R1_perc = 90
        this.R2_perc = 50
        this.ph1 = 0
        this.ph1_end = 12*Math.PI
        this.ph2_delay = 2

        this.randseed = 0
        cvs.draw()

    }
    mars_aarde() {
        this.discretizatie = 100
        this.no_lines = 700
        this.R1_perc = 90
        this.R2_perc = this.R1_perc/(1.5)
        this.ph1 = 0
        this.ph1_end = 47.83
        this.ph2_delay = 686.971/365.0

        this.randseed = 0
        cvs.draw()

    }
    setting3() {
        this.kader = 0
        this.discretizatie = 100
        this.no_lines = 700
        this.R1_perc = 90
        this.R2_perc = 50
        this.ph1 = 0
        this.ph1_end = 10.47
        this.ph2_delay = 4.18

        this.randseed = 0
        cvs.draw()

    }
    rando() {
        this.ph1 = Math.random() * this.ph1_MAX
        this.ph1_end = Math.random() *this.ph1_end_MAX
        this.ph2_delay = Math.random() * this.ph2_delay_MAX
        this.no_lines = 20 + Math.random()*this.no_lines_MAX

        cvs.draw() 
    }

    key(key) {
        super.key(key)
        if ((key === 'r') && this.selected) {
            this.rando()
        }
    }
    
    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p, fgc, bgc)
        let no_vertices = 0

        if (this.loop) { 
            p.loop() 
        } else {
            p.noLoop()
        } 

        if (p.isLooping()) {
            this.loop_t ++
        }


        let R = this.R1_perc * this.wh_min / 200
        let R2 = this.R2_perc * this.wh_min / 200

        let my_xagon = new Xagon(Math.PI*R*R, 5)

        let step_ph1 = (this.ph1_end - this.ph1)/this.no_lines
        let step_ph2 = step_ph1*this.ph2_delay
        for (let i = 0; i < this.no_lines; i ++){
            p.beginShape()

            let V = new Array(2)
            if (true){
                V[X] =  R * p.sin(i*step_ph1 + this.ph1)
                V[Y] =  R * p.cos(i*step_ph1 + this.ph1)
            } else {
                V = my_xagon.getXY((i*step_ph1 + this.ph1)/(p.TWO_PI))
            }
            this.vertex_middle(p, V[X], V[Y])
            no_vertices ++

            V[X] = R2 * p.sin(i*step_ph2)
            V[Y] = R2 * p.cos(i*step_ph2)
            this.vertex_middle(p, V[X], V[Y])
            no_vertices ++

            p.endShape()
        }

        p.randomSeed(this.randseed)

        
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

}    

