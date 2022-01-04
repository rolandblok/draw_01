
class circle_lines  extends Drawer{

    constructor(gui, xywh, sub_gui = '') {
        super('cirlce lines options',gui, xywh, sub_gui)


        this.setting1()


        this.ph1_MAX = 4* Math.PI
        this.ph1_end_MAX = 8*  Math.PI
        this.ph2_MAX = 4* Math.PI
        this.ph2_end_MAX = 8* Math.PI
        this.no_lines_MAX = 500

        this.gui_folder_draw_options.add(this, 'no_lines').onChange(function (v) { cvs.draw() }).min(10).step(1).listen()
        this.gui_folder_draw_options.add(this, 'ph1').onChange(function (v) { cvs.draw() }).min(0).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph1_end').onChange(function (v) { cvs.draw() }).min(0.1).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph2').onChange(function (v) { cvs.draw() }).min(0).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph2_end').onChange(function (v) { cvs.draw() }).min(0.1).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'R1_perc').onChange(function (v) { cvs.draw() }).min(10).step(1)
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


        let c_ph1 = this.ph1
        let c_ph2 = this.ph2
        let R = this.R1_perc * this.wh_min / 200
        let step_ph1 = (this.ph1_end - this.ph1)/this.no_lines
        let step_ph2 = (this.ph2_end - this.ph2)/this.no_lines
        for (let i = 0; i < this.no_lines; i ++){
            p.beginShape()


            let x =  R * p.sin(i*step_ph1 + this.ph1)
            let y =  R * p.cos(i*step_ph1 + this.ph1)
            this.vertex_middle(p, x, y)
            no_vertices ++

            x = R * p.sin(i*step_ph2 + this.ph2)
            y = R * p.cos(i*step_ph2 + this.ph2)
            this.vertex_middle(p, x, y)
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

