
/**
 * 
 */
 class phase_circle extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "phase_circle"
        super(name, gui, xywh, sub_gui)

        this.setting1(false)


        this.gui_folder_draw_options.add(this, 'path_length').listen()
        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'delay').onChange(function (v) { cvs.draw() }).step(0.01)
        this.gui_folder_draw_options.add(this, 'cir_01_start').onChange(function (v) { cvs.draw() }).listen().step(0.1)
        this.gui_folder_draw_options.add(this, 'cir_01_end').onChange(function (v) { cvs.draw() }).listen().step(0.1)
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'setting2')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1(redraw = true) {
        this.R1 = this.wh_min * 0.45
        this.path_length = 0
        this.delay = 1.5;
        this.cir_01_start = 0
        this.cir_01_end   = 70

        if (redraw) cvs.draw()
    }
    setting2(redraw = true) {
        this.R1 = this.wh_min * 0.45
        this.path_length = 0
        this.delay = 1.66;
        this.cir_01_start = -4.8
        this.cir_01_end   = 171.3

        if (redraw) cvs.draw()
    }
    
    

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0
        this.path_length = 0 

        if (true) {
            p.beginShape()
            let V_pref = null
            for (let theta = this.cir_01_start; theta <= this.cir_01_end + FLOATING_POINT_ACCURACY; theta += p.TWO_PI / 100) {
                        // DEBUG sinus
                        let V = this.my_circle_sinus(this.R1, theta)
                        this.vertex_middle(p, V[0], V[1])
                        no_vertices ++

                        if (V_pref !== null) {
                            this.path_length += len2(sub2(V, V_pref))
                        }
                        V_pref = V
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
        y = R * Math.cos(this.delay*phi)
        return [x,y]
    }
}

