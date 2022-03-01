
/**
 * 
 */
 class sphere3d extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1()


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10).listen()
        this.gui_folder_draw_options.add(this, 'Rx').onChange(function (v) { cvs.draw() }).step(0.1).listen()
        this.gui_folder_draw_options.add(this, 'Ry').onChange(function (v) { cvs.draw() }).step(0.1).listen()
        this.gui_folder_draw_options.add(this, 'Rz').onChange(function (v) { cvs.draw() }).step(0.1).listen()
        this.gui_folder_draw_options.add(this, 'tria_scale').onChange(function (v) { cvs.draw() }).step(0.1).listen()
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'path_length').listen()

        this.loop_t = 0;
        this.loop_r_scale_d = 1;
        this.loop_tria_scale_d = 1;
        this.loop = false
        this.gui_folder_draw_options.add(this,'loop').onChange(function (v) { cvs.draw() })
        this.loop_speed = 0.1
        this.gui_folder_draw_options.add(this,'loop_speed').onChange(function (v) { cvs.draw() }).min(0.01).step(.01).listen()

        this.capture_on = false
        this.gui_folder_draw_options.add(this,'capture_this')

        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

        this.capturer = new CCapture({
            framerate: 5,
            format: "png",
            name: "movie",
            quality: 100,
            verbose: true,
          });
    

    }

    capture_this() {
        // https://stubborncode.com/posts/how-to-export-images-and-animations-from-p5-js/
        if (!this.capture_on) {
            cvs.resizeCanvas(800,800)  // https://stackoverflow.com/questions/48036719/p5-js-resize-canvas-height-when-div-changes-height
            this.capture_on = true
            this.capturer.start()
            this.loop = true
            cvs.draw()
        }
        //  d:\ffmpeg\bin\ffmpeg -framerate 60  -i %07d.png -vf format=yuv420p movie.mp4
        // ffmpeg -framerate 60  -i %07d.png -vf format=yuv420p movie.mp4
    }
    
    setting1() {
        this.R1 = this.wh_min * 0.40
        this.Rx = 0
        this.Ry = 0
        this.Rz = 0
        this.kader = false
        this.tria_scale = 0.9
        this.path_length = 0

    }
    

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0

        if (this.loop) { 
            p.loop() 
        } else {
            p.noLoop()
        } 
        
        if (p.isLooping()) {
            this.loop_t ++
        }

        this.R1 += 1*this.loop_r_scale_d
        if (this.R1 > this.w/2) {
            this.loop_r_scale_d = -1
        } else if (this.R1 < this.w/4) {
            this.loop_r_scale_d = 1
        }
        this.tria_scale += 0.01*this.loop_tria_scale_d
        if (this.tria_scale > 1) {
            this.loop_tria_scale_d = -1
        } else if (this.tria_scale < 0.2) {
            this.loop_tria_scale_d = 1
        }
        this.Rx = this.loop_t * 2 * Math.PI/1000
        this.Ry = this.loop_t * 2 * Math.PI/500
        this.Rz = this.loop_t * 2 * Math.PI/250

        let mts = new MyTriangulatedSphere([this.w/2,this.h/2,0], this.R1, this.Rx,this.Ry,this.Rz, 1)
        mts.tria_scale(this.tria_scale)
        mts.draw(p)

        if (this.capture_on) {
            this.capturer.capture(cvs.canvas)
            if (this.loop_t > 100) {
                this.capturer.stop()
                this.capturer.save()
                this.loop = false
                p.noLoop()
                this.capture_on = false
                p.resize(window.innerWidth, window.innerHeight)
            }
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
}

class MyTriangulatedSphere {
    constructor (p,R,Rx,Ry,Rz,devisions) {
        // https://www.opengl.org.ru/docs/pg/0208.html
        let X=.525731112119133606 
        let Z=.850650808352039932
        
        let vdata = [    //[12][3] 
        [-X, 0.0, Z], [X, 0.0, Z], [-X, 0.0, -Z], [X, 0.0, -Z],    
        [0.0, Z, X], [0.0, Z, -X], [0.0, -Z, X], [0.0, -Z, -X],    
        [Z, X, 0.0], [-Z, X, 0.0], [Z, -X, 0.0], [-Z, -X, 0.0] 
        ];
        let tindices = [ //s[20][3]
        [0,4,1], [0,9,4], [9,5,4], [4,5,8], [4,8,1],    
        [8,10,1], [8,3,10], [5,3,8], [5,2,3], [2,7,3],    
        [7,10,3], [7,6,10], [7,11,6], [11,0,6], [0,1,6], 
        [6,1,10], [9,0,11], [9,11,2], [9,2,5], [7,2,11] ];
        
        this.triangles = []
        for (let i = 0; i < 20; i++) {    
            /* color information here */ 
            let t1 = tindices[i][0]
            let v1 =  vdata[t1]
            let t2 = tindices[i][1]
            let v2 =  vdata[t2]
            let t3 = tindices[i][2]
            let v3 =  vdata[t3]
            let sub_triangles = this.subdivide( v1,v2,v3, devisions)
            this.triangles = this.triangles.concat(sub_triangles)
            // triangles.push(new MyTriangle( v1, v2, v3 ))
        }

        let MRx = rot3x(Rx)
        let MRy = rot3y(Ry)
        let MRz = rot3z(Rz)
        for (let t of this.triangles) {
            t.transform3(MRz)
            t.transform3(MRy)
            t.transform3(MRx)
            t.scale(R)
            t.translate(p)
        }
    }

    subdivide(v1,v2,v3, depth) {
        let triangles = []
        if (depth == 0) {
            triangles.push(new MyTriangle( v1, v2, v3 ))
            return triangles
        }
        for (let i = 0; i < 3; i++) {
            let v12 = normalize3(add3(v1,v2))
            let v23 = normalize3(add3(v2,v3))
            let v31 = normalize3(add3(v3,v1))

            triangles = triangles.concat(this.subdivide( v1,v12,v31, depth - 1))
            triangles = triangles.concat(this.subdivide( v2,v23,v12, depth - 1))
            triangles = triangles.concat(this.subdivide( v3,v31,v23, depth - 1))
            triangles = triangles.concat(this.subdivide( v12,v23,v31, depth - 1))
            return triangles
        }
    }

    tria_scale(S) {
        for (let t of this.triangles) {
            t.center_scale(S)
        }
    }

    draw(p) {
        for (let t of this.triangles) {
            t.draw(p)
        }
    }
}


class MyTriangle {
    constructor (p1,p2,p3) {
        this.NO_POINTS = 3

        this.lines = Array(this.NO_POINTS)
        this.lines[0] = new MyLine(p1, p2)
        this.lines[1] = new MyLine(p2, p3)
        this.lines[2] = new MyLine(p3, p1)
        this.det_normal()

    }
    scale(S) {
        for (let my_line of this.lines) {
            my_line.scale(S)
        }
    }
    center_scale(S) {
        let center = new Array(3).fill(0)
        for (const l of this.lines) {
            center[X] += l.p[0][X]/3
            center[Y] += l.p[0][Y]/3
            center[Z] += l.p[0][Z]/3
        }
        for (const l of this.lines) {
            l.center_scale(S, center)
        }


    }
    transform3(M) {
        for (let my_line of this.lines) {
            my_line.transform3(M)
        }
        this.det_normal()
    }
    translate(t) {
        for (let my_line of this.lines) {
            my_line.translate(t)
        }
    }
    det_normal() {
        this.normal = normal3(this.lines[0].p[0],this.lines[1].p[0],this.lines[2].p[0])
    }


    /**
     * calculate intersection triangle with line.
     * 
     * @param {*} line 
     * @returns v3: point of intersection, NaN if no interserction
     */
    linePlaneIntersect(line_arg) {
        // https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
        let p0 = this.lines[0].p[0]
        let l0 = line_arg.p[0]
        let l = line_arg.get_direction()
        let teller = dot3(sub3(p0, l0), this.normal)
        let noemer = dot3(l,this.normal)
        if (Math.abs(noemer) > FLOATING_POINT_ACCURACY ) {
            let d = teller / noemer
            let p = add3(l0, scale3(l, d))
            if (insideTriangleXY(this.lines[0].p[0],this.lines[1].p[0],this.lines[2].p[0], p)) {
                return p
            }
        }
        return NaN
    }

    /**
     * check if line overlaps (from top view) this triangle
     *  // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
     *  @returns
     *     [] array with all intersection points, empty if none.
     */
    lineMyLinesIntersect(line_arg) {
        let p = []
        for (let cur_line in this.lines) {
            res = cur_line.intersectionXY(line_arg)
            if ( res != NaN) {
                p.push(res)
            }
        }
        return p
    }

    light(l) {
        let shading = dot3(this.normal, l)
        if (shading > 0) {
            this.shading = shading
        } else {
            this.shading = 0;
        }

    }

    project(M4) {
        for (let my_line of this.lines) {
            my_line.project(M4)
        }
        this.det_normal()

    }

    getLinesCopy() {
        let my_lines = []
        for (let my_line of this.lines) {
            let copy  = my_line.get_copy()
            my_lines = my_lines.concat(copy)
        }
        return my_lines
    }

    draw(p) {
        let lines_drawn = 0

        if (this.normal[2]<0){  // only draw fronts
            for (let my_line of this.lines) {
                lines_drawn +=  my_line.draw(p)
            }
        }
        return lines_drawn 
    }
}

