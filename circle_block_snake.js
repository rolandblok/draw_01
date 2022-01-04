class circle_block_snake  extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        super('circle block snake options',gui, xywh, sub_gui)


        this.R = 190
        this.gui_folder_draw_options.add(this, 'R').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.R2 = 225
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.no_blocks = 150
        this.gui_folder_draw_options.add(this, 'no_blocks').onChange(function (v) { cvs.draw() }).min(1).step(1)
        this.discretizatie = 50
        this.gui_folder_draw_options.add(this, 'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(1)
        this.rotate = true
        this.gui_folder_draw_options.add(this, 'rotate').onChange(function (v) { cvs.draw() })
        this.angle = 1.96
        this.gui_folder_draw_options.add(this, 'angle').onChange(function (v) { cvs.draw() }).step(0.01)
        this.sinus_snake = true
        this.gui_folder_draw_options.add(this, 'sinus_snake').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.open()


    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p, fgc, bgc)

        let no_vertices = 0

        let my_rot
        if (this.rotate) {
            my_rot = rot2(this.angle)
        } else {
            my_rot = rot2(0)
        }
        // Move to starting point (theta = 0)
        p.beginShape()
        
        let step_size = 1 / (4*this.no_blocks * this.discretizatie)
        for (let theta = 0; theta <= 1; theta += step_size) {
            let x_offset = 0
            if (this.sinus_snake) {
                x_offset =  this.R*p.sin(theta*p.TWO_PI)
            } else {

                let rel_y = 4*theta 
                if (rel_y < 2 ) {
                    x_offset = this.R*p.sqrt(2*rel_y - rel_y*rel_y )
                } else {
                    rel_y -= 2
                    x_offset = -this.R*p.sqrt(2*rel_y - rel_y*rel_y )
                } 
            }

            let blo = this.my_block(theta*this.no_blocks - FLOATING_POINT_ACCURACY)
            blo = transform2(blo, my_rot)
            let sph = this.my_circle(theta*this.no_blocks - FLOATING_POINT_ACCURACY)
            
            let x =  x_offset + theta * blo[0] + (1-theta)*sph[0]
            // let x = Middle + this.R*p.sin(theta) + this.R*p.sin(theta*this.no_circles-p.PI)

            let y_offset   = 2*this.R * (1-2*theta)
            let y =  y_offset + theta * blo[1] + (1-theta)*sph[1]

            this.vertex_middle(p, x,y)
            no_vertices ++

        }
        p.endShape()


        return no_vertices
    }

    my_block( phase) {
        let x,y
        phase = phase % 1
        if (phase < 1/4) {
            let p = 4* phase
            x = -0.5 + p
            y = -0.5
        } else if (phase < 1/2) {
            let p = 4*(phase - 1/4)
            x = 0.5
            y = -0.5 + p
        } else if (phase < 3/4) {
            let p = 4*(phase - 0.5)
            x = 0.5 - p
            y = 0.5
        } else if (phase < 1) {
            let p = 4*(phase-3/4)
            x = -0.5
            y = 0.5 - p
        }
        return [1.47*this.R2*x,1.47*this.R2*y]
    }
    
    my_circle(phi) {
        let x,y
        x = this.R2 * Math.sin(2*Math.PI*phi)
        y = this.R2 * Math.cos(2*Math.PI*phi)
        return [x,y]
    }

}
