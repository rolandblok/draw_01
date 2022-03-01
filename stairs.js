
/**
 * 
 */
 class stairs extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "stairs"
        super(name, gui, xywh, sub_gui)

        this.setting1()


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'depth').onChange(function (v) { cvs.draw() }).min(0).step(1)
        this.gui_folder_draw_options.add(this, 'method', ['cube', 'line']).onChange(function (v) { cvs.draw() })
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'path_length').listen()
        this.gui_folder_defaults.add(this, 'randofset').onChange(function (v) { cvs.draw() }).listen()
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1() {
        this.R1 = this.wh_min * 0.15
        this.path_length = 0
        this.depth = 5
        this.kader = false
        this.randofset = 0.0
        this.method = 'cube'

    }
    

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0
        this.path_length = 0 

        if (this.depth >  8)
            this.depth = 8
        if (this.method === 'cube') {
            this.create_blok_square(p, [this.Middle_x, this.Middle_y], this.w, this.depth)
        } else {
            this.create_min_square(p, [this.Middle_x, this.Middle_y], this.w, this.depth)
        }

        if (false) {
            p.beginShape()
            let V_pref = null
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += p.TWO_PI / 100) {
                        // DEBUG sinus
                        let V = this.my_circle_sinus(this.R1, theta)
                        this.vertex_middle(p, V[0], V[1])
                        no_vertices ++

                        if (V_pref !== null) {
                            this.path_length += len2(sub2(V, V_pref))
                        }
                        V_pref = V
            }
            p.endShape()
        }

        return no_vertices
    }


    /**
     * sinus circle around zero, radius R, sinus extra scale S, sinus freq and phi
     * @param {*} R 
     * @param {*} S 
     * @param {*} freq 
     * @param {*} phi 
     * @returns 
     */
    my_circle_sinus(R, phi) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y
        x = R * Math.sin(phi)
        y = R * Math.cos(phi)
        return [x,y]
    }

    create_blok_square(p, center, ribbe, depth) {
        if ((Math.random( ) * depth)  < this.randofset/100) {
            depth = 0
        }
        if (depth > 0) {
            ribbe /= 2
        }
        let A = [center[X],         center[Y]]
        let B = [center[X] - ribbe, center[Y] - ribbe/2]
        let C = [center[X],         center[Y] - ribbe]
        let D = [center[X] + ribbe, center[Y] - ribbe/2]
        let E = [center[X] + ribbe, center[Y] + ribbe/2]
        let F = [center[X],         center[Y] + ribbe]
        let G = [center[X] - ribbe, center[Y] + ribbe/2]
        if (depth > 0) {
            depth -= 1
            let BB = [center[X] - ribbe*2, center[Y] - ribbe]
            this.create_blok_square(p, BB, ribbe, depth)
            this.create_blok_square(p, C, ribbe, depth)
            this.create_blok_square(p, E, ribbe, depth)
            this.create_blok_square(p, G, ribbe, depth)
        } else if (depth == 0) {
            p.line(A[X], A[Y], B[X], B[Y] )
            p.line(A[X], A[Y], D[X], D[Y] )
            p.line(A[X], A[Y], F[X], F[Y] )

            p.beginShape()
            p.vertex(B[X], B[Y])
            p.vertex(C[X], C[Y])
            p.vertex(D[X], D[Y])
            p.vertex(E[X], E[Y])
            p.vertex(F[X], F[Y])
            p.vertex(G[X], G[Y])
            p.vertex(B[X], B[Y])
            p.endShape()

        }
    }

    // https://cdn.inchcalculator.com/wp-content/uploads/2020/12/unit-circle-chart.png
    create_plus_square(p, center, ribbe, depth) {
        if ((Math.random( ) * depth)  < this.randofset) {
            depth = 0
        }
        if (depth > 0) {
            ribbe /= 2
        }
        let A = [center[X],         center[Y]]
        let B = [center[X] - ribbe, center[Y] - ribbe/2]
        let C = [center[X],         center[Y] - ribbe]
        let D = [center[X] + ribbe, center[Y] - ribbe/2]
        let E = [center[X] + ribbe, center[Y] + ribbe/2]
        let F = [center[X],         center[Y] + ribbe]
        let G = [center[X] - ribbe, center[Y] + ribbe/2]

        if (depth > 0 ) {
            depth -= 1         
            ribbe /=1.1

            // this.create_plus_square(p, A, ribbe/2, depth-1)
            
            this.create_plus_square(p, C, ribbe, depth)
            this.create_plus_square(p, E, ribbe, depth)
            this.create_plus_square(p, G, ribbe, depth)

            this.create_min_square(p, B, ribbe, depth)
            this.create_min_square(p, D, ribbe, depth)
            this.create_min_square(p, F, ribbe, depth)
        } else {
            p.line(A[X], A[Y], B[X], B[Y] )
            p.line(A[X], A[Y], D[X], D[Y] )
            p.line(A[X], A[Y], F[X], F[Y] )
        }
    }

    create_min_square(p, center, ribbe, depth) {
        if ((Math.random( ) * depth)  < this.randofset) {
            depth = 0
        }
        if (depth > 0) {
            ribbe /= 2
        }
        let A = [center[X],         center[Y]]
        let B = [center[X] - ribbe, center[Y] - ribbe/2]
        let C = [center[X],         center[Y] - ribbe]
        let D = [center[X] + ribbe, center[Y] - ribbe/2]
        let E = [center[X] + ribbe, center[Y] + ribbe/2]
        let F = [center[X],         center[Y] + ribbe]
        let G = [center[X] - ribbe, center[Y] + ribbe/2]
        if (depth > 0 ) {
            depth -= 1
            // this.create_min_square(p, A, ribbe, depth)
            ribbe /=1.1
            this.create_plus_square(p, B, ribbe, depth)
            this.create_center_square(p, C, ribbe, depth)
            this.create_plus_square(p, D, ribbe, depth)

            this.create_center_square(p, E, ribbe, depth)
            this.create_plus_square(p, F, ribbe, depth)
            this.create_center_square(p, G, ribbe, depth)

        } else {
            p.line(A[X], A[Y], C[X], C[Y] )
            p.line(A[X], A[Y], E[X], E[Y] )
            p.line(A[X], A[Y], G[X], G[Y] )
            
        }
    }
    create_center_square(p, center, ribbe, depth) {
        if ((Math.random( ) * depth)  < this.randofset) {
            depth = 0
        }
        if (depth > 0) {
            ribbe /= 2
        }
        let A = [center[X],         center[Y]]
        let B = [center[X] - ribbe, center[Y] - ribbe/2]
        let C = [center[X],         center[Y] - ribbe]
        let D = [center[X] + ribbe, center[Y] - ribbe/2]
        let E = [center[X] + ribbe, center[Y] + ribbe/2]
        let F = [center[X],         center[Y] + ribbe]
        let G = [center[X] - ribbe, center[Y] + ribbe/2]
        if (depth > 0 ) {
            depth -= 1
            ribbe /=1.1

            // this.create_min_square(p, A, ribbe, depth)
            this.create_center_square(p, B, ribbe, depth)
            this.create_min_square(p, C, ribbe, depth)
            this.create_center_square(p, D, ribbe, depth)

            this.create_min_square(p, E, ribbe, depth)
            this.create_center_square(p, F, ribbe, depth)
            this.create_min_square(p, G, ribbe, depth)
        } else {
            p.line(A[X], A[Y], B[X], B[Y] )
            p.line(A[X], A[Y], D[X], D[Y] )
            p.line(A[X], A[Y], F[X], F[Y] )

            p.line(A[X], A[Y], C[X], C[Y] )
            p.line(A[X], A[Y], E[X], E[Y] )
            p.line(A[X], A[Y], G[X], G[Y] )
            
        }
    }


}
