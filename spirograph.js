class spirograph {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')


        this.R = 175
        this.gui_folder_draw_options.add(this, 'R').onChange(function (v) { cvs.draw() }).min(10)
        this.r = 29
        this.gui_folder_draw_options.add(this, 'r').onChange(function (v) { cvs.draw() }).min(1)
        this.l = 11
        this.gui_folder_draw_options.add(this, 'l').onChange(function (v) { cvs.draw() }).min(1)
        this.theta_end = 141
        this.gui_folder_draw_options.add(this, 'theta_end').onChange(function (v) { cvs.draw() }).min(1)

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

        let x, y, theta;

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
        
        let k = this.r / this.R
        for (theta = 0; theta <= this.theta_end; theta += 0.01) {
            // https://en.wikipedia.org/wiki/Spirograph
            x = Middle + this.R * ((1-k)*p.cos(theta) + this.l*k*p.cos(((1-k)*theta/k)))
            y = Middle + this.R * ((1-k)*p.sin(theta) + this.l*k*p.sin(((1-k)*theta/k)))
            p.vertex(x,y)
            no_vertices++
        }
      
        p.endShape()
        return no_vertices
    }

}
