
/**
 * 
 */
 class sphere_spiral extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1()

        this.gui_folder_draw_options.add(this, 'discretizatie').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'R_spiral').onChange(function (v) { cvs.draw() }).min(0)
        this.gui_folder_draw_options.add(this, 'spiral_density').onChange(function (v) { cvs.draw() }).min(1)
        this.gui_folder_draw_options.add(this, 'phx').onChange(function (v) { cvs.draw() }).min(0).step(1)
        this.gui_folder_draw_options.add(this, 'phy').onChange(function (v) { cvs.draw() }).min(0).step(1)
        this.gui_folder_draw_options.add(this, 'phz').onChange(function (v) { cvs.draw() }).min(1).step(1)
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'path_length').listen()
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1() {
        this.discretizatie = 10000
        this.R1 = this.wh_min * 0.45
        this.R2 = this.wh_min * 0.05
        this.R_spiral = 10
        this.spiral_density = 300
        this.phx = 3
        this.phy = 2
        this.phz = 1

        this.path_length = 0

    }
    

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0
        this.path_length = 0 


        p.beginShape()
        let V_pref = null
        for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += p.TWO_PI / this.discretizatie) {

            let V = [this.R1,0,0]
            V[X] = this.R1 + this.R_spiral*Math.cos(theta*this.spiral_density)
            V[Z] =           this.R_spiral*Math.sin(theta*this.spiral_density)

            let Rz = rot3z(this.phz*theta)
            V = transform3(V, Rz)

            let Rm = rot3(this.phx*theta, this.phy*theta, 0 )
            V = transform3(V, Rm)

            this.vertex_middle(p, V[0], V[1])
            no_vertices ++

            if (V_pref !== null) {
                this.path_length += len2(sub2(V, V_pref))
            }
            V_pref = V
        }
        p.endShape()

        return no_vertices
    }

    
}

