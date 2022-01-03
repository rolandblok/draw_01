
/**
 * 
 */
 class csg extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "csg"
        super(name, gui, xywh, sub_gui)

        this.setting1()
        this.minus_shapes = []


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'no_lines').onChange(function (v) { cvs.draw() }).min(1)
        this.gui_folder_draw_options.add(this, 'Rmin').onChange(function (v) { cvs.draw() }).min(1)
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1() {
        this.R1 = this.w * 0.05
        this.R2 = this.w * 0.45
        this.Rmin = this.w * 0.1
        this.no_lines  = 100

    }
    
    mouse(p, x,y){
        if ((x > this.Left) && (x < (this.Right)) && (y > this.Top) && (y < this.Bottom)) {
            let minus_circle = new MinusCircle(x,y,this.Rmin)
            this.minus_shapes.push(minus_circle)
        } 
        cvs.draw()
    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0

        for (let line = 0; line < this.no_lines; line++){
            let R = this.R1 + line*(this.R2 - this.R1 ) / this.no_lines

            let shape_active = true
            p.beginShape()
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += p.TWO_PI / 1000) {
                // DEBUG sinus
                let V = this.move_middle(this.my_circle_sinus(R, theta))
                let in_csg = false
                for (let minus_shape of this.minus_shapes) {
                    if (minus_shape.inside(V[X], V[Y])) {
                        in_csg = true
                    }
                }

                if (!in_csg) {
                    if (!shape_active) {
                        p.beginShape()
                        shape_active = true
                    }
                    p.vertex(V[X], V[Y])
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

class MinusCircle {

    constructor(x,y,R){
        this.x = x
        this.y = y
        this.R = R
        this.R2 = R*R
    }
    inside(x,y) {
        let dx = this.x - x
        let dy = this.y - y


        return dx*dx + dy*dy < this.R2
        
    }
}

