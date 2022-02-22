
/**
 * 
 */
 class stairs extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "stairs"
        super(name, gui, xywh, sub_gui)

        this.setting1()


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'depth').onChange(function (v) { cvs.draw() }).min(0).step(1)
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'path_length').listen()
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1() {
        this.R1 = this.wh_min * 0.15
        this.path_length = 0
        this.depth = 1

    }
    

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0
        this.path_length = 0 

        console.log("rikabd" + String(this.depth))
        this.create_plus_square(p, [this.Middle_x, this.Middle_y], this.w/2, this.depth)

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

    // https://cdn.inchcalculator.com/wp-content/uploads/2020/12/unit-circle-chart.png
    create_plus_square(p, center, ribbe, depth) {
        console.log(" " + String(depth) + " c: " + String(center) + " r: " + String(ribbe))
        if (depth > 0 ) {
            depth -= 1
            ribbe = 0.5* ribbe
            let center_n = new Array(2)
            center_n[X] = center[X]
            center_n[Y] = center[Y] - ribbe
            this.create_plus_square(p, center_n, ribbe, depth)
            center_n[X] = center[X] + ribbe
            center_n[Y] = center[Y] + 0.5 * ribbe
            this.create_plus_square(p, center_n, ribbe, depth)
            center_n[X] = center[X] - ribbe
            center_n[Y] = center[Y] + 0.5 * ribbe
            this.create_plus_square(p, center_n, ribbe, depth)
            

        } else {
            p.line(center[X], center[Y], center[X] + ribbe, center[Y] - ribbe/2 )
            p.line(center[X], center[Y], center[X] - ribbe, center[Y] - ribbe/2 )
            p.line(center[X], center[Y], center[X], center[Y] + ribbe)
        }
    }
    create_min_square(p, center, ribbe, depth) {
        console.log(" " + String(depth) + " c: " + String(center) + " r: " + String(ribbe))
        if (depth > 0 ) {
        } else {
            p.line(center[X], center[Y], center[X] + ribbe, center[Y] + ribbe/2 )
            p.line(center[X], center[Y], center[X] - ribbe, center[Y] + ribbe/2 )
            p.line(center[X], center[Y], center[X], center[Y] - ribbe)
        }
}
