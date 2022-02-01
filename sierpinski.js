/**
 * 
 */
 class sierpinski extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "sierpinski"
        super(name, gui, xywh, sub_gui)

        this.setting1()

        this.rot60 = rot2(Math.PI / 3)
        this.rot60m = rot2(-Math.PI / 3)


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'depth').min(1).step(1).max(15).onChange(function (v) { cvs.draw() })
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'path_length').listen()
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1() {
        this.R1 = this.wh_min * 0.15
        this.depth = 10
        this.path_length = 0
        this.kader = false

    }
    

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0
        this.path_length = 0 

        this.dir = [2*this.w/Math.pow(2, this.depth),0]
        this.pos = [this.Middle_x, this.Bottom]
        p.beginShape()
        p.vertex(this.pos[X], this.pos[Y])
        no_vertices += this.sier_x(p, +1, this.depth)
        p.endShape()

        if (false) {
            p.beginShape()
            let V_pref = null
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += p.TWO_PI / 100) {
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

    sier_draw(p, sign) {
        if (sign > 0) 
            this.dir = transform2(this.dir, this.rot60)
        else 
            this.dir = transform2(this.dir, this.rot60m)
        this.pos = add2(this.pos, this.dir)
        p.vertex(this.pos[X], this.pos[Y])      
        return 1
    }
    sier_x(p, sign, depth) {
        let no_vertices = 0
        depth --
        if (depth == 0) {
            no_vertices += this.sier_draw(p, sign)
        } else {
            no_vertices += this.sier_y(p, sign, depth)
            no_vertices += this.sier_x(p, +1, depth)
            no_vertices += this.sier_y(p, +1, depth)
        }
        return no_vertices
    }
    sier_y(p, sign, depth) {
        let no_vertices = 0
        depth --
        if (depth == 0) {
            no_vertices += this.sier_draw(p, sign)
        } else {
            no_vertices += this.sier_x(p, sign, depth)
            no_vertices += this.sier_y(p, -1, depth)
            no_vertices += this.sier_x(p, -1, depth)
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

