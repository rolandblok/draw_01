
/**
 * 
 */
 class circle_packing extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1(false)

        this.hatch_modes = ['LINES', 'ZIGZAG']

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
        this.hatch_mode = 'LINES'
        this.kader = false
        this.path_optimized = false
        this.draw_path = false
        this.rand_seed = 0
        this.fill_area_seeded(redraw)

    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0

        no_vertices += this.salesman_vertices.draw(p, this.draw_path)

        return no_vertices
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

            let distances = this.circles.map(c => Math.sqrt((c.x-x)**2 + (c.y-y)**2 ) - c.R)
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

                let hatch_frac = (pl_val-this.plasma_min_height)/(1-this.plasma_min_height)
                if (this.hatch_mode == 'LINES') {
                    new_circle.addHatches(this.hatch_min + hatch_frac * (this.hatch_max - this.hatch_min), 0.5*Math.PI*cvs.random())
                } 

                fails = 0

                // let r_grid,r_keys = new_circle.getInternalIntGrid()
                // for (const kr of r_keys) {
                //     delete grid[kr]
                // }

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
        this.x = V[X]
        this.y = V[Y]
        this.R = R
        this.hatches = []
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
                for (const h of this.hatches) {
                    // p.beginShape()
                    salesman_vertices.beginShape()
                    salesman_vertices.addVertex(h[0][X], h[0][Y])
                    salesman_vertices.addVertex(h[1][X], h[1][Y])
                    // p.vertex(h[0][X], h[0][Y])
                    // p.vertex(h[1][X], h[1][Y])
                    // no_vertices += 2
                    // p.endShape()
                } 
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

    insideBox(l,r,t,b) {
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
        // this.hatches.sort(function(a,b){return a[]})
        // for (const h of this.hatches) {
        //     for (const p of h) {

        //     }
        // }

    }

    overlaps(other_circle) {
        let dx = this.x - other_circle.x
        let dy = this.y - other_circle.y
        let distance = dx*dx + dy*dy
        let distance_r = (this.R + other_circle.R)**2
        return distance < distance_r

    }

    circleDist(c) {
        return Math.sqrt((this.c.x-c.x)**2 + (this.y-c.y)**2) 
    }
    
    distPoint(P) {
        return Math.sqrt((this.x-P[X])**2 + (this.y-P[Y])**2)
    }
    
    getInternalIntGrid() {
        let grid = []
        let keys = []
        let li = Math.floor(this.x - this.R)
        let ri = Math.ceil(this.x + this.R)
        let ti = Math.floor(this.y - this.R)
        let bi = Math.ceil(this.y + this.R)

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
