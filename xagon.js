
/**
 * 
 */
 class xagon_draw extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1()


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'n').onChange(function (v) { cvs.draw() }).min(2).step(1)
        this.gui_folder_draw_options.add(this, 'no_xagons').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_draw_options.add(this, 'discretisatie').onChange(function (v) { cvs.draw() }).min(2).step(1)
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1() {
        this.R1 = this.wh_min * 0.1
        this.R2 = this.wh_min * 0.4
        this.no_xagons = 10
        this.n = 5
        this.discretisatie = 40

    }
    


    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0


        for(let R = this.R1; R <= this.R2 + FLOATING_POINT_ACCURACY; R += (this.R2-this.R1) / this.no_xagons) {
            let A = Math.PI * R * R
            let xagon = new Xagon(A, this.n)
            p.beginShape()
            let step = 1 / this.n
            for (let ph = 0; ph <= 1 + FLOATING_POINT_ACCURACY; ph += step) {
                        // DEBUG xagon
                        let V = xagon.getXY(ph)
                        this.vertex_middle(p, V[0], V[1])
                        no_vertices ++
            }
            p.endShape()
        }

        if (true) {
            p.beginShape()
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += p.TWO_PI / 100) {
                        // DEBUG sinus
                        let V = this.my_circle_sinus(this.R2, theta)
                        this.vertex_middle(p, V[0], V[1])
                        no_vertices ++
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
}



class Xagon {
    // https://en.wikipedia.org/wiki/Apothem
    constructor(A, n) {
        this.A = A  // area
        this.n = n  // # sidez
        this.a = Math.sqrt((A / n) * Math.tan((Math.PI / (2 * n)) * (n - 2)))
        this.s = 2 * A / (n * this.a)
    }

    /**
     * Get the xy position, where phase is from 0 --> 1 (full 'circle')
     * @param {*} phase 
     */
    getXY(phase) {
        phase = phase % this.n
        let steps = phase * this.n 
        let steps_full = Math.floor(steps)
        let steps_rem = steps - steps_full

        let x = -this.s/2
        let y = -this.a
        let cur_angle = 0
        for (let step = 0; step < steps_full; step ++) {
            let x_dir = Math.cos(cur_angle)
            let y_dir = Math.sin(cur_angle)
            x += x_dir * this.s
            y += y_dir * this.s

            cur_angle += 2 * Math.PI / this.n

        }

        let x_dir = Math.cos(cur_angle)
        let y_dir = Math.sin(cur_angle)
        x += x_dir * this.s * steps_rem
        y += y_dir * this.s * steps_rem

        return [x,y]
    }
}

