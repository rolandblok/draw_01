
/**
 * 
 */
 class circle_packing extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1(false)

        this.hatch_modes = ['LINES', 'CIRCLES']

        this.gui_folder_draw_options.add(this, 'Rmin').onChange(function (v) { cvs.draw() }).min(5).step(1).max(this.wh_min*0.5)
        this.gui_folder_draw_options.add(this, 'Rmax').onChange(function (v) { cvs.draw() }).min(10).step(1).max(this.wh_min*0.5)
        this.gui_folder_draw_options.add(this, 'no_circles').onChange(function (v) { cvs.draw() }).min(10).step(1).listen()
        this.gui_folder_draw_options.add(this, 'max_tries').onChange(function (v) { cvs.draw() }).min(10).step(100)
        this.gui_folder_draw_options.add(this, 'hatch_min').onChange(function (v) { cvs.draw() }).min(2).step(1)
        this.gui_folder_draw_options.add(this, 'hatch_max').onChange(function (v) { cvs.draw() }).min(2).step(1)
        this.gui_folder_draw_options.add(this, 'plasma_depth').onChange(function (v) { cvs.draw() }).min(2).step(1).max(9)
        this.gui_folder_draw_options.add(this, 'plasma_min_height').onChange(function (v) { cvs.draw() }).min(0).step(0.1).max(1)
        this.gui_folder_draw_options.add(this, 'draw_circumferences').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this, 'draw_hatches').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this, 'hatch_mode', this.hatch_modes).onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this, 'rand_seed').onChange(function (v) { cvs.draw() }).listen()

        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'fill_area_seeded')
        this.gui_folder_defaults.add(this, 'fill_area_random')
        this.gui_folder_defaults.add(this, 'optimize_path')
        this.gui_folder_defaults.add(this, 'draw_path').onChange(function (v) { cvs.draw() })
        this.gui_folder_defaults.add(this, 'path_optimized').listen()
        this.gui_folder_defaults.add(this, 'path_length').listen()
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()


    }
    
    setting1(redraw=true) {
        this.Rmax = 70
        this.Rmin = 5
        this.no_circles = 300
        this.max_tries = 1000
        this.hatch_min = 10
        this.hatch_max = 2
        this.plasma_depth = 7
        this.plasma_min_height = 0.5
        this.draw_circumferences = true
        this.draw_hatches = true
        this.hatch_mode = 'CIRCLES'
        this.kader = false
        this.path_optimized = false
        this.path_length = 0
        this.draw_path = false
        this.rand_seed = 0
        this.fill_area_seeded(redraw)

    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let ver_dist = this.salesman_vertices.draw(p, this.draw_path)

        this.path_length = ver_dist[1]
        return ver_dist[0]
    }

    fill_area_random() {
        this.rand_seed = Math.floor( Math.random()*10000)
        this.fill_area_seeded(true)
    }

    optimize_path() {
        this.salesman_vertices.optimizePath()
        this.path_optimized = true
        cvs.draw()

    }

    fill_area_seeded(redraw = true) {
        cvs.randomSeed(this.rand_seed)
        this.circles = []
        this.path_optimized = false

        let my_plasma = new Plasma(1 << this.plasma_depth)

        // create a (random) grid
        // let grid = {}
        // for (let xi = this.Left + this.Rmin; xi < this.Right - this.Rmin; xi +=1) {
        //     for (let yi = this.Top + this.Rmin; yi < this.Bottom - this.Rmin; yi +=1) {
        //         let p = [xi,yi]
        //         grid[stringDex(p)] = p
        //     }
        // }
        //shuffle(grid)


        this.circles = []
        let fails = 0
        while (fails < this.max_tries) {
            // let keys = Object.keys(grid)
            // let ri   = Math.floor(keys.length * Math.random())
            // let ki   = keys[ri]
            // let p = grid[ki];
            // let x = p[X]
            // let y = p[Y]
            let xran = cvs.random()
            let yran = cvs.random()
            let x = Math.floor(this.Left + (this.Right - this.Left) * xran)
            let y = Math.floor(this.Top + (this.Bottom - this.Top) * yran)
            let x_01 = xran
            let y_01 = yran
            let pl_val = my_plasma.get_value_at_normed_xy(x_01, y_01)
            if ( pl_val < this.plasma_min_height) {
                fails ++
                continue
            }

            let distances = this.circles.map(c => Math.sqrt((c.c[X]-x)**2 + (c.c[Y]-y)**2 ) - c.R)
            distances.push(x-this.Left)
            distances.push(this.Right - x)
            distances.push(y-this.Top)
            distances.push(this.Bottom - y)
            distances.push(this.Rmax)

            let radius = Math.min(...distances)

            if (radius < this.Rmin) {
                // delete grid[ki]
                fails++
                continue
            } else {
                let new_circle = new MyCircle([x, y], radius)
                this.circles.push(new_circle)

                // line hatches
                let hatch_frac = (pl_val-this.plasma_min_height)/(1-this.plasma_min_height)
                let hatch_spacing = this.hatch_min + hatch_frac * (this.hatch_max - this.hatch_min)
                new_circle.addHatchLines(hatch_spacing, 0.5*Math.PI*cvs.random())

                // circle hatches
                let centre_offset = [0.7*radius*Math.random(),0]
                let rot = rot2(2*Math.PI*cvs.random())
                centre_offset = transform2(centre_offset, rot)
                new_circle.addHatchCircles(hatch_spacing, centre_offset)

                fails = 0

            }
        }
        this.no_circles = this.circles.length

        // pre draw the whole thing
        this.salesman_vertices = new SalesmanVerticesNodeSet()
        for (const c of this.circles) {
            c.draw(this.salesman_vertices, this.draw_circumferences, this.draw_hatches, this.hatch_mode)
        }

        if(redraw) {
            cvs.draw()
        }
    }



}

class MyCircle {
    constructor(V, R) {
        this.c = [...V]
        this.R = R
        this.hatches_lines = []
        this.hatch_circles = []
    }

    draw(salesman_vertices, draw_circumference = true, draw_hatches=false, draw_hatch_mode='LINES') {
        let no_vertices = 0


        if (draw_circumference) {
            // p.beginShape()
            salesman_vertices.beginShape()
            for (let theta = 0; theta <= 2*Math.PI + FLOATING_POINT_ACCURACY; theta +=  2*Math.PI / 100) {
                // DEBUG sinus
                let V = this.pointOn(theta)
                salesman_vertices.addVertex(V[X], V[Y])
                // p.vertex(V[X], V[Y])
                // no_vertices ++
            }
            // p.endShape()
        }

        if (draw_hatches) {
            if (draw_hatch_mode==='LINES') {
                for (const h of this.hatch_lines) {
                    salesman_vertices.beginShape()
                    salesman_vertices.addVertex(h[0][X], h[0][Y])
                    salesman_vertices.addVertex(h[1][X], h[1][Y])
                } 
            } else if (draw_hatch_mode === 'CIRCLES')
                for (const hc of this.hatch_circles) {
                    salesman_vertices.beginShape()
                    for (let theta = 0; theta <= 2*Math.PI + FLOATING_POINT_ACCURACY; theta +=  2*Math.PI / 100) {
                        let V = new Array(2)
                        V[X] = hc.c[X] + hc.R * Math.sin(theta)
                        V[Y] = hc.c[Y] + hc.R * Math.cos(theta)
                        salesman_vertices.addVertex(V[X], V[Y])
                    }
                } 
        }

        return no_vertices
    }

    pointOn(phi) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let p = new Array(2)
        p[X] = this.c[X] + this.R * Math.sin(phi)
        p[Y] = this.c[Y] + this.R * Math.cos(phi)
        return p
    }

    insideBox(l,r,t,b) {
        if ( (this.c[X] > (l + this.R)) && (this.c[X] < (r - this.R)) && 
             (this.c[Y] > (t + this.R)) && (this.c[Y] < (b - this.R))    ) {
                 return true
             } else {
                 return false
             }
    }

    addHatchLines(spacing, rotation) {
        let rot = rot2(rotation)
        let R2 = this.R * this.R
        this.hatch_lines = []
        let no_hatches = Math.floor(2*this.R / spacing)
        let hatch_start_px = -spacing * (no_hatches/2 - 0.5)
        for (let hi = 0; hi < no_hatches; hi++) {
            let px = hatch_start_px + hi*spacing
            let py = Math.sqrt( R2 - px * px)
            let sign = hi%2?1:-1

            let hatch = Array(2)
            hatch[0] = [px, sign*py]
            hatch[1] = [px, -sign*py]
            for(let pi = 0; pi < 2; pi++) {
                hatch[pi] = transform2(hatch[pi], rot)

                hatch[pi][X] = hatch[pi][X] + this.c[X]
                hatch[pi][Y] = hatch[pi][Y] + this.c[Y]
            }
            this.hatch_lines.push(hatch)
        }
    }

    addHatchCircles(spacing, centre_offset) {
        this.hatch_circles = []
        let no_hatch_circles = Math.floor(this.R / spacing) + 1
        spacing = len2(centre_offset) / (no_hatch_circles - 1)
        let dir_n = normalize2(centre_offset)
        dir_n = sub2([0,0], dir_n)

        for (let hci = 1; hci < no_hatch_circles-1; hci++) {
            let R = hci * this.R / (no_hatch_circles-1)
            let centre = add2(centre_offset,scale2(dir_n, hci*spacing))
            centre = add2(centre, this.c)
            let circle = {}
            circle.R = R
            circle.c = centre
            this.hatch_circles.push(circle)
        }

    }

    overlaps(other_circle) {
        let dx = this.c[X] - other_circle[X]
        let dy = this.c[Y] - other_circle[Y]
        let distance2 = dx*dx + dy*dy
        let distance2_r = (this.R + other_circle.R)**2
        return distance2 < distance2_r
    }

    circleDist(c) {
        return Math.sqrt((this.c[X]-c[X])**2 + (this.c[Y]-c[Y])**2) 
    }
    
    distPoint(P) {
        return Math.sqrt((this.c[X]-P[X])**2 + (this.c[Y]-P[Y])**2)
    }
    
    getInternalIntGrid() {
        let grid = []
        let keys = []
        let li = Math.floor(this.c[X] - this.R)
        let ri = Math.ceil(this.c[X] + this.R)
        let ti = Math.floor(this.c[Y] - this.R)
        let bi = Math.ceil(this.c[Y] + this.R)

        for (let xi = li; xi <= ri; xi++) {
            for (let yi = ti; yi <= bi; yi++) {
                let p = [xi,yi]
                if (this.distPoint(p) < this.R) {
                    grid.push(p)
                    keys.push(stringDex(p))
                }
            }
        }
        return grid, keys
    }

}
