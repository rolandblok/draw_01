
class manipul_lines extends Drawer{

    constructor(gui, xywh, sub_gui = '') {
        super('manipul lines options',gui, xywh, sub_gui)

        this.lines = []

        this.setting1()

        this.gui_folder_draw_options.add(this, 'no_lines').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.gui_folder_draw_options.add(this, 'mag_scale').onChange(function (v) { cvs.draw() }).min(0.001).step(0.001)
        this.kader = true
        this.kader_width = 10
        this.gui_folder_draw_options.add(this,'kader').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this,'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(10)
        this.gui_folder_draw_options.add(this,'randseed').onChange(function (v) { cvs.draw() }).step(1)
        this.regen = true
        this.gui_folder_draw_options.add(this,'regen').onChange(function (v) { cvs.draw() }).listen()
        

        this.gui_folder_defaults.add(this, 'setting1')
        if(sub_gui === ' 0_0'){
            this.gui_folder_defaults.open()
            this.gui_folder_draw_options.open()
        }
    
    }


    mouse(p, x,y){
        console.log("roland")
        for(const my_line of this.lines) {
            my_line.magnet(p, x, y)
        }
        cvs.draw()
    }

    setting1() {
        this.discretizatie = 100
        this.no_lines = 100
        this.mag_scale = 0.1
        this.randseed = 0
        this.regen = true
        cvs.draw()

    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p, fgc, bgc)

        let no_vertices = 0

        if (this.regen || (this.no_lines != this.lines.length)) {
            this.regen = false
            this.lines = []
            // need to think how to connect this to GUI
            for (let li = 0; li < this.no_lines; li ++) {
                let dy = 1 / (this.no_lines-1)
                let my_line = new mySegLine(this, 0, dy*li, 1, dy*li)
                this.lines.push(my_line)
            }
        }

        p.randomSeed(this.randseed)

        for (const my_line of this.lines) {
            no_vertices += my_line.draw(p)
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

class mySegLine {
    constructor(parent, x1,y1,x2,y2,discretizatie) {
        this.parent = parent
        this.points = []
        let dx = (x2-x1) / this.parent.discretizatie
        let dy = (y2-y1) / this.parent.discretizatie
        for (let pi = 0; pi <= this.parent.discretizatie; pi++) {            
            let V = Array(2)
            V[X] = x1 + dx * pi
            V[Y] = y1 + dy * pi
            this.points.push(V)
        }
    }

    draw(p) {
        let no_vertices = 0
        p.beginShape()
        for (const point of this.points) {  
            let w = p.height - 2*this.parent.kader_width
            let h = p.height - 2*this.parent.kader_width
            let x = this.parent.kader_width + w*point[X]
            let y = this.parent.kader_width + h*point[Y]
            p.vertex(x, y)
            no_vertices ++
        }
        p.endShape()
        return no_vertices
    }

    magnet(p,x,y) {
        let sign = (p.mouseButton === 'left')? -1 : 1
        let Vr = Array(2)
        Vr[X] = (x - this.parent.kader_width) / (p.height-2*this.parent.kader_width)
        Vr[Y] = (y - this.parent.kader_width) / (p.height-2*this.parent.kader_width)
        for (let i = 0; i < this.points.length; i++) {  
            let point = this.points[i]
            let dist2 = dist_sqr2(point,Vr)
            if (dist2 > FLOATING_POINT_ACCURACY){
                let sc = 0.01* this.parent.mag_scale / (1+dist2)
                if (sc < 1) {
                    let n = normalize2(sub2(point,Vr))
                    let d = scale2(n, sc)
                    this.points[i][X] += sign*d[X]
                    this.points[i][Y] += sign*d[Y]
                } else {
                    this.points[i][X] = Vr[X]
                    this.points[i][Y] = Vr[Y]
                }
            }
        }
    }
}
