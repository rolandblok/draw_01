class circle_sinus extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        super('circle sinus options',gui, xywh, sub_gui)

        this.setting1()
        console.log(this.xywh)

        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(0).step(1).listen()
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() }).min(10).step(1).listen()
        this.gui_folder_draw_options.add(this, 'S1').onChange(function (v) { cvs.draw() }).min(0).step(1).listen()
        this.gui_folder_draw_options.add(this, 'S2').onChange(function (v) { cvs.draw() }).min(0).step(1).listen()
        this.gui_folder_draw_options.add(this, 'freq').onChange(function (v) { cvs.draw() }).min(1).step(1).listen()
        this.gui_folder_draw_options.add(this, 'delay').onChange(function (v) { cvs.draw() }).min(0).step(.001).listen()
        this.gui_folder_draw_options.add(this, 'spiral').onChange(function (v) { cvs.draw() }).listen()
        this.gui_folder_draw_options.add(this, 'no_revelations').onChange(function (v) { cvs.draw() }).min(1).step(1).listen()
        this.gui_folder_draw_options.add(this, 'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(1).listen()
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'setting2')
        this.gui_folder_defaults.add(this, 'setting3')
        this.gui_folder_defaults.add(this, 'setting4')
        this.gui_folder_defaults.add(this, 'setting5')
        this.gui_folder_defaults.add(this, 'rando')
        if(sub_gui === ' 0_0'){
            this.gui_folder_draw_options.open()
            this.gui_folder_defaults.open()
        }

    }

    setting1() {
        this.kader = false
        this.R1 = 104  * this.wh_min / 1260
        this.R2 = 500  * this.wh_min / 1260
        this.S1 = 30  * this.wh_min / 1260
        this.S2 = 60  * this.wh_min / 1260
        this.freq = 11
        this.delay = 0.008
        this.spiral = true
        this.no_revelations = 83
        this.discretizatie = 1250
        cvs.draw() 
    }
    setting2() {
        this.R1 = 122  * this.wh_min / 1260
        this.R2 = 500  * this.wh_min / 1260
        this.S1 = 31  * this.wh_min / 1260
        this.S2 = 60  * this.wh_min / 1260
        this.freq = 11
        this.delay = 0.016
        this.no_revelations = 57
        this.discretizatie = 1250
        cvs.draw() 
    }
    setting3() {
        this.R1 = 74  * this.wh_min / 1260
        this.R2 = 500  * this.wh_min / 1260
        this.S1 = 7  * this.wh_min / 1260
        this.S2 = 78  * this.wh_min / 1260
        this.freq = 15
        this.delay = 0.016
        this.no_revelations = 57
        this.discretizatie = 1250
        cvs.draw() 
    }
    setting4() {
        this.R1 = 277  * this.wh_min / 1260
        this.R2 = 400  * this.wh_min / 1260
        this.S1 = 35  * this.wh_min / 1260
        this.S2 = 31  * this.wh_min / 1260
        this.freq = 7
        this.delay = 0.015
        this.no_revelations = 93
        this.discretizatie = 1250
        cvs.draw() 
    }
    setting5() {
        this.R1 = 100  * this.wh_min / 1260
        this.R2 = 586  * this.wh_min / 1260
        this.S1 = 35  * this.wh_min / 1260
        this.S2 = 19  * this.wh_min / 1260
        this.freq = 3
        this.delay = 0.129
        this.no_revelations = 41
        this.discretizatie = 1250
        cvs.draw() 
    }
    rando() {
        this.R1 = Math.random() * 300  * this.wh_min / 1260
        this.R2 = Math.random() * 500  * this.wh_min / 1260
        this.S1 = Math.random() * 100  * this.wh_min / 1260
        this.S2 = Math.random() * 100  * this.wh_min / 1260
        this.freq = Math.floor(Math.random() * 50)
        this.delay = Math.random()*0.05
        this.no_revelations = Math.random()*100
        this.discretizatie = 1250
        cvs.draw() 
    }

    key(key) {
        super.key(key)
        if ((key === 'r') && this.selected) {
            this.rando()
        }
    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p, fgc, bgc)

        let no_vertices = 0

        // Move to starting point (theta = 0)

   
        



        if (!this.spiral) {
            let R = this.R1
            let S = this.S1

            let R_step = (this.R2 - this.R1)/ this.no_revelations
            let S_step = (this.S2 - this.S1)/ this.no_revelations
            for (let rev = 0; rev <= this.no_revelations; rev++) {
                p.beginShape()
                for (let phi = 0; phi <= p.TWO_PI + FLOATING_POINT_ACCURACY; phi += p.TWO_PI/this.discretizatie) {
                    let X = this.my_circle_sinus(R, S, phi, rev*this.delay )
                    let x2 = X[0] 
                    let y2 = X[1]
                    this.vertex_middle(p, x2,y2)
                    no_vertices ++
                }
                S += S_step
                R += R_step
                p.endShape()
            }
        } else {
            let R = this.R1
            let S = this.S1
            let phi = 0
            let rev = 0
            let no_steps = this.discretizatie * this.no_revelations
            let R_ustep = (this.R2 - this.R1)/ no_steps
            let S_ustep = (this.S2 - this.S1)/ no_steps
            let phi_ustep = p.TWO_PI / this.discretizatie
            let rev_ustep = this.delay / this.discretizatie
            p.beginShape()
            for (let step = 0; step < no_steps; step ++) {
                let X = this.my_circle_sinus(R, S, phi, rev )
                let x2 = X[0] 
                let y2 = X[1]
                this.vertex_middle(p, x2,y2)
                no_vertices ++
                S += S_ustep
                R += R_ustep
                phi += phi_ustep
                rev += rev_ustep
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
    my_circle_sinus(R, S, phi, phase) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y
        R = R + S* Math.sin(this.freq*phi)
        x = R * Math.sin(phi + phase)
        y = R * Math.cos(phi + phase)
        return [x,y]
    }

}
