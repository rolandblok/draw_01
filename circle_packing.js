
/**
 * 
 */
 class circle_packing extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1()


        this.gui_folder_draw_options.add(this, 'Rmin').onChange(function (v) { cvs.draw() }).min(10).step(1).max(this.wh_min*0.5)
        this.gui_folder_draw_options.add(this, 'Rmax').onChange(function (v) { cvs.draw() }).min(10).step(1).max(this.wh_min*0.5)
        this.gui_folder_draw_options.add(this, 'no_circles').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.gui_folder_draw_options.add(this, 'max_tries').onChange(function (v) { cvs.draw() }).min(10).step(100)
        this.gui_folder_draw_options.add(this, 'hatch_min').onChange(function (v) { cvs.draw() }).min(2).step(1)
        this.gui_folder_draw_options.add(this, 'hatch_max').onChange(function (v) { cvs.draw() }).min(2).step(1)
        this.gui_folder_draw_options.add(this, 'draw_circumferences').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this, 'draw_hatches').onChange(function (v) { cvs.draw() })

        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'fill_area')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

        this.circles = []
        this.fill_area()

    }
    
    setting1() {
        this.Rmax = 100
        this.Rmin = 20
        this.no_circles = 100
        this.max_tries = 1000
        this.hatch_min = 4
        this.hatch_max = 10
        this.draw_circumferences = true
        this.draw_hatches = true
        this.kader = false

    }
    

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0
        
        for (const c of this.circles) {
            no_vertices += c.draw(p, this.draw_circumferences, this.draw_hatches)
        }



        return no_vertices
    }


    fill_area() {
        this.circles = []

        // create a random grid
        let P = []
        for (let xi = this.Left + this.Rmin; xi < this.Right - this.Rmin; xi ++) {
            for (let yi = this.Left + this.Rmin; yi < this.Right - this.Rmin; yi ++) {
                P.push([xi,yi])
            }
        }
        shuffle(P)

        // create ordered radii, big to small
        let rs = []
        for (let ri = 0; ri < this.no_circles; ri ++) {
            rs.push(this.Rmin + (this.Rmax - this.Rmin) * Math.random() )
        }
        rs.sort()
        rs.reverse()

        // create the circles
        for (let ci = 0; ci < this.no_circles; ci++) {
            let tries = 0
            while (tries < this.max_tries) {
                let c = new MyCircle(P[ci], rs[ci])

                c.addHatches(this.hatch_min + Math.random() * (this.hatch_max - this.hatch_min), 0.5*Math.PI*Math.random())

                if (c.inside(this.Left, this.Right, this.Top, this.Bottom)) {
                    this.circles.push(c)
                    break
                }
                tries ++
            }
        }
        cvs.draw()
    }



}

class MyCircle {
    constructor(V, R) {
        this.x = V[X]
        this.y = V[Y]
        this.R = R
        this.hatches = []
    }

    draw(p, draw_circumference = true, draw_hatches=false) {
        let no_vertices
        if (draw_circumference) {
            p.beginShape()
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += p.TWO_PI / 100) {
                // DEBUG sinus
                let V = this.pointOn(theta)
                p.vertex(V[X], V[Y])
                no_vertices ++
            }
            p.endShape()
        }

        if (draw_hatches) {
            for (const h of this.hatches) {
                p.beginShape()
                p.vertex(h[0][X], h[0][Y])
                p.vertex(h[1][X], h[1][Y])
                no_vertices += 2
                p.endShape()
            }
        }

        return no_vertices
    }


    pointOn(phi) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x = this.x + this.R * Math.sin(phi)
        let y = this.y + this.R * Math.cos(phi)
        return [x,y]
    }

    inside(l,r,t,b) {
        if ( (this.x > (l + this.R)) && (this.x < (r - this.R)) && 
             (this.y > (t + this.R)) && (this.y < (b - this.R))    ) {
                 return true
             } else {
                 return false
             }
    }

    addHatches(spacing, rotation) {
        let rot = rot2(rotation)
        let R2 = this.R * this.R
        this.hatches = []
        // hatch[hatch_nr][line]
        // line[0] = point1, line[1] = point2
        for (let px = spacing/2; px < this.R; px += spacing) {
            let py = Math.sqrt( R2 - px * px)
            let lines = Array(2)
            lines[0] = Array(2)
            lines[1] = Array(2)
            lines[0][0] = [px, py]
            lines[0][1] = [px, -py]
            lines[1][0] = [-px, py]
            lines[1][1] = [-px, -py]
            for(let li = 0; li < 2; li++) {

                for(let pi = 0; pi < 2; pi++) {
                    lines[li][pi] = transform2(lines[li][pi], rot)

                    lines[li][pi][X] = lines[li][pi][X] + this.x
                    lines[li][pi][Y] = lines[li][pi][Y] + this.y
                }
                this.hatches.push(lines[li])
            }
        }
    }
}