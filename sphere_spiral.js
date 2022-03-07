
/**
 * 
 */
 class sphere_spiral extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1()


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'ph1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'ph2').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'ph3').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'path_length').listen()
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1() {
        this.R1 = this.wh_min * 0.45
        this.R2 = this.wh_min * 0.05
        this.ph1 = 1
        this.ph2 = 1
        this.ph3 = 1

        this.path_length = 0

    }
    

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0
        this.path_length = 0 




        if (true) {
            p.beginShape()
            let V_pref = null
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += p.TWO_PI / 1000) {
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
    my_circle_sinus(R1, phi) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y,z
        x = R1 * Math.sin(phi) * Math.cos(5*phi)
        y = R1 * Math.cos(phi) * Math.sin(5*phi)
        z = R1 * Math.cos(phi)
        return [x,y]
    }
}

