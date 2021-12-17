class spirograph extends Drawer {

    constructor(gui, xywh, sub_gui)  {
        super('spirograph',gui, xywh, sub_gui)

        this.R = 280
        this.gui_folder_draw_options.add(this, 'R').onChange(function (v) { cvs.draw() }).min(10)
        this.r = 29
        this.gui_folder_draw_options.add(this, 'r').onChange(function (v) { cvs.draw() }).min(1)
        this.l = 11
        this.gui_folder_draw_options.add(this, 'l').onChange(function (v) { cvs.draw() }).min(1)
        this.theta_end = 141
        this.gui_folder_draw_options.add(this, 'theta_end').onChange(function (v) { cvs.draw() }).min(1)

        this.gui_folder_draw_options.open()


    }


    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p, fgc, bgc)
        let no_vertices = 0
       
        let x, y, theta;

        
        // Move to starting point (theta = 0)
        p.beginShape()
        
        let k = this.r / this.R
        for (theta = 0; theta <= this.theta_end; theta += 0.01) {
            // https://en.wikipedia.org/wiki/Spirograph
            x = this.R * ((1-k)*p.cos(theta) + this.l*k*p.cos(((1-k)*theta/k)))
            y = this.R * ((1-k)*p.sin(theta) + this.l*k*p.sin(((1-k)*theta/k)))
            this.vertex_middle(p, x,y)
            no_vertices++
        }
      
        p.endShape()
        return no_vertices
    }

}
