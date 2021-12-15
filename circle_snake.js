class circle_snake {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')


        this.R = 180
        this.gui_folder_draw_options.add(this, 'R').onChange(function (v) { cvs.draw() }).min(10)
        this.no_circles = 100
        this.gui_folder_draw_options.add(this, 'no_circles').onChange(function (v) { cvs.draw() }).min(1)
        this.discretizatie = 0.001
        this.gui_folder_draw_options.add(this, 'discretizatie').onChange(function (v) { cvs.draw() }).min(0.0001)
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
        p.stroke(bgc) 
        p.fill(bgc)
        p.rect(0,0,w,h)                 // make sure there is no transparant: movies will fail

        p.stroke(fgc) 
        p.noFill()

        // Move to starting point (theta = 0)
        p.beginShape()
        
        // https://www.generativehut.com/post/a-step-by-step-guide-to-making-art-with-observable

        for (let theta = 0; theta <= p.TWO_PI*(1+p.PI/this.no_circles); theta += this.discretizatie) {
            let x_offset = 0
            if (this.sinus_snake) {
                x_offset =  this.R*p.sin(theta)
            } else {

                let rel_y = 4*theta / (p.TWO_PI*(1+p.PI/this.no_circles))
                if (rel_y < 2 ) {
                    x_offset = this.R*p.sqrt(2*rel_y - rel_y*rel_y )
                } else {
                    rel_y -= 2
                    x_offset = -this.R*p.sqrt(2*rel_y - rel_y*rel_y )
                } 
            }


            let x = Middle + x_offset + this.R*p.sin(theta*this.no_circles-p.PI)
            // let x = Middle + this.R*p.sin(theta) + this.R*p.sin(theta*this.no_circles-p.PI)
            let y_offset   = 2*this.R * (1-2*theta/p.TWO_PI)
            let y = Middle + y_offset + this.R*p.cos(theta*this.no_circles+p.PI)
            p.vertex(x,y)
            no_vertices ++

        }
      
        p.endShape()
        return no_vertices
    }

}
