class triangle_snake {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')


        this.R = 200
        this.gui_folder_draw_options.add(this, 'R').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.R2 = 380
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.no_triangles = 100
        this.gui_folder_draw_options.add(this, 'no_triangles').onChange(function (v) { cvs.draw() }).min(1).step(1)
        this.discretizatie = 10
        this.gui_folder_draw_options.add(this, 'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(1)
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
        let step_size = 1 / (3*this.no_triangles * this.discretizatie)
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
            let tria = this.my_triangle(theta*this.no_triangles - FLOATING_POINT_ACCURACY)
            let x = Middle + x_offset + this.R2*tria[0]
            // let x = Middle + this.R*p.sin(theta) + this.R*p.sin(theta*this.no_circles-p.PI)
            let y_offset   = 2*this.R * (1-2*theta)
            let y = Middle + y_offset + this.R2*tria[1]
            p.vertex(x,y)
            no_vertices ++

        }
        p.endShape()

        // p.beginShape()
        // for (let theta = 0; theta < 1; theta += 1/6) {
        //             // DEBUG TRIANGLES
        //             let tria2 = this.my_triangle(theta - FLOATING_POINT_ACCURACY)
        //             let x2 = Middle*(1 + tria2[0] )
        //             let y2 = Middle*(1 + tria2[1] )
        //             p.vertex(x2,y2)
        //             no_vertices ++
        // }
        // p.endShape()

        return no_vertices
    }

    my_triangle(phase) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y
        phase = phase % 1
        if (phase < 1/3) {
            let p = 3* phase
            x = p
            y = 0
        } else if (phase < 2/3) {
            let p = 3*(phase - 1/3)
            x = 1  - 0.5 * p
            y = 0.86602540378443864676372317075294 * p   // sqrt(3)/2
        } else if (phase <= 1) {
            let p = 3*(phase - 2/3)
            x = 0.5 - 0.5 * p
            y = 0.86602540378443864676372317075294 * (1- p)   // sqrt(3)/2
        }
        x = x - 0.5
        y = y - 0.4 
        return [x,y]
    }

}
