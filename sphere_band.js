
class sphere_band extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        super('sphere band options', gui, xywh, sub_gui)

        this.setting1()

        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10).listen()
        this.gui_folder_draw_options.add(this,'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(10).listen()
        this.gui_folder_draw_options.add(this,'phase_1').onChange(function (v) { cvs.draw() }).min(.1).step(0.1).listen()
        this.gui_folder_draw_options.add(this,'no_lines').onChange(function (v) { cvs.draw() }).min(1).step(1).listen()
        this.gui_folder_draw_options.add(this,'line_offset').onChange(function (v) { cvs.draw() }).min(0.1).step(.1).listen()
        this.gui_folder_draw_options.add(this,'max_rand_scale_x').onChange(function (v) { cvs.draw() }).min(0.1).step(.1).listen()
        this.gui_folder_draw_options.add(this,'max_rand_scale_y').onChange(function (v) { cvs.draw() }).min(0.1).step(.1).listen()
        this.gui_folder_draw_options.add(this,'randseed').onChange(function (v) { cvs.draw() }).step(1)
        this.gui_folder_draw_options.add(this,'quadr_rando').onChange(function (v) { cvs.draw() }).listen()

        this.loop_t = 0;
        this.loop = false
        this.gui_folder_draw_options.add(this,'loop').onChange(function (v) { cvs.draw() })
        this.loop_speed = 0.1
        this.gui_folder_draw_options.add(this,'loop_speed').onChange(function (v) { cvs.draw() }).min(0.01).step(.01).listen()

        this.capture_on = false
        this.gui_folder_draw_options.add(this,'capture_this')
        
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'setting2')
        if(sub_gui === ' 0_0'){
            this.gui_folder_defaults.open()
            this.gui_folder_draw_options.open()
        }


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
        //  d:\ffmpeg\bin\ffmpeg -framerate 60  -i %07d.png -vf format=yuv420p movie.mp4
        // ffmpeg -framerate 60  -i %07d.png -vf format=yuv420p movie.mp4
    }


    setting1() {
        this.discretizatie = 1000
        this.R1 = 180
        this.phase_1 = 55
        this.no_lines = 18
        this.line_offset = 3.5
        this.max_rand_scale_x = 4.5
        this.max_rand_scale_y = 4.5
        this.randseed = 0
        this.quadr_rando = false
        cvs.draw()

    }
    setting2() {
        this.discretizatie = 1000
        this.phase_1 = 30
        this.no_lines = 22
        this.line_offset = 3.7
        this.max_rand_scale_x = 3.9
        this.max_rand_scale_y = 4.5
        this.randseed = 0
        this.quadr_rando = true
        cvs.draw()

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

        p.randomSeed(this.randseed)

        let y_edge_offset = 100
        let y_range = this.h - 2 * y_edge_offset
        for (let l = 0; l < this.no_lines; l++) {

            p.beginShape()
            let rand_offset = 0
            for (let i = 0; i < this.discretizatie; i ++) {
                let y = y_edge_offset + y_range * i / this.discretizatie
                let norm_i = i / this.discretizatie

                let rando = 0.5 * norm_i 
                if (this.quadr_rando)
                rando = rando * norm_i
                rand_offset += p.random(-rando, rando)

                let x  = 0.5 * y_range * p.sin ( p.PI * norm_i) * p.sin(this.phase_1 * norm_i - this.loop_t *this.loop_speed)
                p.vertex(this.Middle_x + x+ rand_offset* this.max_rand_scale_x,
                         y + l * this.line_offset + rand_offset* this.max_rand_scale_y )
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


