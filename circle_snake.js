class circle_snake extends Drawer{

    constructor(gui, xywh, sub_gui = '') {
        super('circle snake options', gui, xywh, sub_gui)

        this.R = 180
        this.gui_folder_draw_options.add(this, 'R').onChange(function (v) { cvs.draw() }).min(10)
        this.no_circles = 100
        this.gui_folder_draw_options.add(this, 'no_circles').onChange(function (v) { cvs.draw() }).min(1)
        this.discretizatie = 0.001
        this.gui_folder_draw_options.add(this, 'discretizatie').onChange(function (v) { cvs.draw() }).min(0.00001)
        this.sinus_snake = true
        this.gui_folder_draw_options.add(this, 'sinus_snake').onChange(function (v) { cvs.draw() })


        this.Dx = 0
        this.gui_folder_draw_options.add(this, 'Dx').onChange(function (v) { cvs.draw() }).step(1).listen()
        this.Dy = 0
        this.gui_folder_draw_options.add(this, 'Dy').onChange(function (v) { cvs.draw() }).step(1).listen()
        this.z = 1
        this.gui_folder_draw_options.add(this, 'z').onChange(function (v) { cvs.draw() }).step(0.1).min(0.1).listen()


        if(sub_gui === ' 0_0'){
            this.gui_folder_defaults.open()
            this.gui_folder_draw_options.open()
        }

    }

    mouse(p, x,y){
        this.Dx =  (x - this.Middle_x)
        this.Dy =  (y - this.Middle_y)
        cvs.draw()
    }
    mousewheel(p, x,y,count){
        let c = super.mousewheel(p,x,y,count)
        this.z += c
        cvs.draw()

    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p, fgc, bgc)

        let no_vertices = 0

        // Move to starting point (theta = 0)
        p.beginShape()
        let shape_started = true
        
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


            let x = x_offset + this.R*p.sin(theta*this.no_circles-p.PI)
            // let x = Middle + this.R*p.sin(theta) + this.R*p.sin(theta*this.no_circles-p.PI)
            let y_offset   = 2*this.R * (1-2*theta/p.TWO_PI)
            let y = y_offset + this.R*p.cos(theta*this.no_circles+p.PI)


            let V = [x,y]
            let V2 = this.zoom_offset(V)
            let Vm = this.move_middle(V2)

            if ((Vm[X] > this.Left) && (Vm[X] < this.Right) && 
                (Vm[Y] > this.Top)  && (Vm[Y] < this.Bottom)) {
                if (!shape_started) {
                    p.beginShape()
                    shape_started = true
                } 
                this.vertex_middle(p,V2[X],V2[Y])
                no_vertices ++
            } else {
                if (shape_started) {
                    p.endShape()
                    shape_started = false
                } 
            }
        }
      
        if (shape_started) p.endShape()
        return no_vertices
    }

    zoom_offset(V) {
        let Vn = [0,0]
        Vn[X] = this.z*(V[X] - this.Dx)
        Vn[Y] = this.z*(V[Y] - this.Dy)
        return Vn
    }

}

