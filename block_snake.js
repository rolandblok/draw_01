class block_snake {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')


        this.R = 200
        this.gui_folder_draw_options.add(this, 'R').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.R2 = 320
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.no_blocks = 100
        this.gui_folder_draw_options.add(this, 'no_blocks').onChange(function (v) { cvs.draw() }).min(1).step(1)
        this.discretizatie = 10
        this.gui_folder_draw_options.add(this, 'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(1)
        this.rotate = false
        this.gui_folder_draw_options.add(this, 'rotate').onChange(function (v) { cvs.draw() })
        this.angle = Math.PI/4
        this.gui_folder_draw_options.add(this, 'angle').onChange(function (v) { cvs.draw() }).step(0.01)
        this.sinus_snake = true
        this.gui_folder_draw_options.add(this, 'sinus_snake').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.open()


    }

    close() {
        this.gui.removeFolder('wave wave draw options')
    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        let no_vertices = 0
        let w = window.innerWidth
        let h = window.innerHeight
        let Left = 0
        let Middle = h / 2
        let Right = h

        let my_rot
        if (this.rotate) {
            my_rot = rot2(this.angle)
        } else {
            my_rot = rot2(0)
        }
        
        p.clear()
        if (p.type === 'SCREEN') {
            p.stroke(bgc) 
            p.fill(bgc)
            p.rect(0,0,w,h)                 // make sure there is no transparant: movies will fail
        }
        p.stroke(fgc) 
        p.noFill()

        // Move to starting point (theta = 0)
        p.beginShape()

        
        // https://www.generativehut.com/post/a-step-by-step-guide-to-making-art-with-observable
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
            let x = Middle + x_offset + this.R2*blo[0]
            // let x = Middle + this.R*p.sin(theta) + this.R*p.sin(theta*this.no_circles-p.PI)
            let y_offset   = 2*this.R * (1-2*theta)
            let y = Middle + y_offset + this.R2*blo[1]
            p.vertex(x,y)
            no_vertices ++

        }
        p.endShape()

        // p.beginShape()
        // for (let theta = 0; theta < 1; theta += 1/8) {
        //             // DEBUG TRIANGLES
        //             let blo = this.my_block(theta - FLOATING_POINT_ACCURACY)
        //             let X = transform2(blo, my_rot)
        //             let x2 = Middle*(1 + X[0] )
        //             let y2 = Middle*(1 + X[1] )
        //             p.vertex(x2,y2)
        //             no_vertices ++
        // }
        // p.endShape()

        return no_vertices
    }

    my_block(phase) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
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
        return [x,y]
    }

}
