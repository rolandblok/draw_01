/**
 * 
 */
 class PlasmaLines extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1()
        this.poles = []


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'plasma_depth').onChange(function (v) { cvs.draw() }).min(2).step(1).max(9)
        this.gui_folder_draw_options.add(this, 'plasma_scale').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'pole_scale').onChange(function (v) { cvs.draw() }).min(1)
        
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1() {
        this.kader = false
        this.R1 = this.wh_min * 0.15
        this.plasma_depth = 7
        this.plasma_scale = 240
        this.pole_scale = 1000
        this.plasma = new Plasma(1<<this.plasma_depth)

    }

    mouse(p, x,y){
        if ((x > this.Left) && (x < (this.Right)) && (y > this.Top) && (y < this.Bottom)) {
            let new_pole = new MyPole(x,y,this.pole_scale)
            this.poles.push(new_pole)
        } 
        cvs.draw()
    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let pl_size = 1 << this.plasma_depth
        if (pl_size != this.plasma.size) {
            this.plasma = new Plasma(pl_size)
        }

        let no_vertices = 0

        // if (true) {
        //     p.beginShape()
        //     for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += p.TWO_PI / 100) {
        //                 // DEBUG sinus
        //                 let V = this.my_circle_sinus(this.R1, theta)
        //                 this.vertex_middle(p, V[0], V[1])
        //                 no_vertices ++
        //     }
        //     p.endShape()
        // }

        let latest_height = new LatestHeight()
        for (let py= pl_size -1; py >= 0 ; py --) {
            let shape_active = true
            p.beginShape()
            for (let px = 0; px < pl_size; px ++) {
                let pix_x = this.Left + px * this.w / (pl_size-1)
                let pix_y = this.Top + py * this.h / (pl_size-1)

                let pl = this.plasma.get_value_at(px, py)

                let y_pole = 0
                for (let pole of this.poles) {
                    y_pole += pole.get_val(pix_x, pix_y)
                }

                let vx = pix_x
                let vy = pix_y - (pl-0.5)*this.plasma_scale - y_pole

                if (latest_height.check_vis_and_add_point(vx, vy)) {
                    if (!shape_active) {
                        p.beginShape()
                        shape_active = true
                    }
                    p.curveVertex(vx, vy)
                    // p.vertex(vx, vy)
                    no_vertices ++
                } else {
                    if(shape_active) {
                        p.endShape()
                        shape_active = false
                    }
                }
            }
            if (shape_active) {
                p.endShape()
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

class MyPole {

    constructor(x,y, s) {
        this.px = x
        this.py = y
        this.s = s
    }
    get_val(x,y) {
        let dx = this.px - x
        let dy = this.py - y
        let noemer = Math.sqrt(dx*dx + dy*dy)
        if (Math.abs(noemer) < FLOATING_POINT_ACCURACY) {
            noemer = FLOATING_POINT_ACCURACY
        }

        return -this.s/noemer

    }
}