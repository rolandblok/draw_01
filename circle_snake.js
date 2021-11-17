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

        for (let theta = 0; theta <= p.TWO_PI*(1+p.PI/this.no_circles); theta += this.discretizatie) {
            let x = Middle + this.R*p.sin(theta) + this.R*p.sin(theta*this.no_circles-p.PI)
            let y_offset   = 2*this.R * (1-2*theta/p.TWO_PI)
            let y = Middle + y_offset + this.R*p.cos(theta*this.no_circles+p.PI)
            p.vertex(x,y)

        }
      
        p.endShape()
        return
    }

}
