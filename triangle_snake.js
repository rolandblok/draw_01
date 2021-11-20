class triangle_snake {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')


        this.R = 180
        this.gui_folder_draw_options.add(this, 'R').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.no_circles = 100
        this.gui_folder_draw_options.add(this, 'no_circles').onChange(function (v) { cvs.draw() }).min(1).step(1)
        this.discretizatie = 0.0001
        this.gui_folder_draw_options.add(this, 'discretizatie').onChange(function (v) { cvs.draw() }).min(0.00001).step(0.00001)
        this.sinus_snake = true
        this.gui_folder_draw_options.add(this, 'sinus_snake').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.open()


    }

    close() {
        this.gui.removeFolder('wave wave draw options')
    }

    draw(p) {

        let w = window.innerWidth
        let h = window.innerHeight
        let Left = 0
        let Middle = h / 2
        let Right = h

        p.clear()
        p.stroke([0, 0, 0])  // BLACK
        p.noFill()

        // Move to starting point (theta = 0)
        p.beginShape()
        
        // https://www.generativehut.com/post/a-step-by-step-guide-to-making-art-with-observable

        for (let theta = 0; theta <= 1; theta += this.discretizatie) {
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
            let tria = this.my_triangle(theta*this.no_circles)
            let x = Middle + x_offset + this.R*tria[0]
            // let x = Middle + this.R*p.sin(theta) + this.R*p.sin(theta*this.no_circles-p.PI)
            let y_offset   = 2*this.R * (1-2*theta)
            let y = Middle + y_offset + this.R*tria[1]
            p.vertex(x,y)

        }
      
        p.endShape()
        return
    }

    my_triangle(phase) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y
        phase = phase % 3
        if (phase < 1/3) {
            let p = 3* phase
            x = p
            y = 0
        } else if (phase < 2/3) {
            let p = 3*(phase - 1/3)
            x =  (1  - 0.5 * p)
            y = 0.86602540378443864676372317075294 * p   // sqrt(3)/2
        } else if (phase < 1) {
            let p = 3*(phase - 2/3)
            x = (-0.5 * this.p)
            y = 0.86602540378443864676372317075294 * (1- p)   // sqrt(3)/2
        }
        x = x-0.5
        y = y - 0.28867513459481288225457439025098 // 0.5*sqrt(1/3)
        return [x,y]
    }

}
