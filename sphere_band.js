
class sphere_band {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')



        this.setting1()

        this.draw_max = 1000000

        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10).listen()
        this.kader = true
        this.gui_folder_draw_options.add(this,'kader').onChange(function (v) { cvs.draw() }).listen()
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
        

        this.gui_folder_defaults = this.gui_folder_draw_options.addFolder('defaults')
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'setting2')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()



    }

    close() {
        this.gui.removeFolder('wave wave draw options')
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
        let w = window.innerWidth
        let h = window.innerHeight
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
        p.stroke([0,0,0]) 
        p.noFill()
        if (this.kader) {
            p.rect(10, 10, Right-20, h-20)
        }

        p.randomSeed(this.randseed)

        let y_edge_offset = 100
        let y_range = h - 2 * y_edge_offset
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
                p.vertex(x+Middle +  rand_offset* this.max_rand_scale_x,
                         y + l * this.line_offset + rand_offset* this.max_rand_scale_y )
            }
            p.endShape()
        }

        if (false) {
            p.beginShape()
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += 0.1) {
                        // DEBUG sinus
                        let X = this.my_circle_sinus(this.R1, theta)
                        let x2 = Middle + X[0] 
                        let y2 = Middle + X[1]
                        p.vertex(x2,y2)
                        no_vertices ++
            }
            p.endShape()
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


