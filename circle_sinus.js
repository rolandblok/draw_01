class circle_sinus {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')

        this.setting1()

        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(0).step(1).listen()
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() }).min(10).step(1).listen()
        this.gui_folder_draw_options.add(this, 'S1').onChange(function (v) { cvs.draw() }).min(0).step(1).listen()
        this.gui_folder_draw_options.add(this, 'S2').onChange(function (v) { cvs.draw() }).min(0).step(1).listen()
        this.gui_folder_draw_options.add(this, 'freq').onChange(function (v) { cvs.draw() }).min(1).step(1).listen()
        this.gui_folder_draw_options.add(this, 'delay').onChange(function (v) { cvs.draw() }).min(0).step(.001).listen()
        this.gui_folder_draw_options.add(this, 'no_revelations').onChange(function (v) { cvs.draw() }).min(1).step(1).listen()
        this.gui_folder_draw_options.add(this, 'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(1).listen()
        this.kader = true
        this.gui_folder_draw_options.add(this, 'kader').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this, 'setting1')
        this.gui_folder_draw_options.add(this, 'setting2')
        this.gui_folder_draw_options.add(this, 'setting3')
        this.gui_folder_draw_options.add(this, 'setting4')
        this.gui_folder_draw_options.add(this, 'setting5')
        this.gui_folder_draw_options.add(this, 'rando')
        this.gui_folder_draw_options.open()


    }

    setting1() {
        this.R1 = 104
        this.R2 = 500
        this.S1 = 30
        this.S2 = 60
        this.freq = 11
        this.delay = 0.008
        this.no_revelations = 83
        this.discretizatie = 250
        cvs.draw() 
    }
    setting2() {
        this.R1 = 122
        this.R2 = 500
        this.S1 = 31
        this.S2 = 60
        this.freq = 11
        this.delay = 0.016
        this.no_revelations = 57
        this.discretizatie = 250
        cvs.draw() 
    }
    setting3() {
        this.R1 = 74
        this.R2 = 500
        this.S1 = 7
        this.S2 = 78
        this.freq = 15
        this.delay = 0.016
        this.no_revelations = 57
        this.discretizatie = 250
        cvs.draw() 
    }
    setting4() {
        this.R1 = 277
        this.R2 = 400
        this.S1 = 35
        this.S2 = 31
        this.freq = 7
        this.delay = 0.015
        this.no_revelations = 93
        this.discretizatie = 250
        cvs.draw() 
    }
    setting5() {
        this.R1 = 100
        this.R2 = 586
        this.S1 = 35
        this.S2 = 19
        this.freq = 3
        this.delay = 0.129
        this.no_revelations = 41
        this.discretizatie = 250
        cvs.draw() 
    }
    rando() {
        this.R1 = Math.random() * 300
        this.R2 = Math.random() * 500
        this.S1 = Math.random() * 100
        this.S2 = Math.random() * 100
        this.freq = Math.floor(Math.random() * 50)
        this.delay = Math.random()*0.05
        this.no_revelations = Math.random()*100
        this.discretizatie = 250
        cvs.draw() 
    }




    close() {
        this.gui.removeFolder('wave wave draw options')
    }

    draw(p) {
        let no_vertices = 0
        let w = window.innerWidth
        let h = window.innerHeight
        let Left = 0
        let Middle = h / 2
        let Right = h

        
        p.clear()
        p.stroke([0, 0, 0])  // BLACK
        if (this.kader) {
            p.rect(10, 10, Right-20, h-20)
        }
        p.noFill()

        // Move to starting point (theta = 0)

        let R = this.R1
        let S = this.S1
        let no_steps = this.discretizatie * this.no_revelations
        let R_step = (this.R2 - this.R1)/ this.no_revelations
        let S_step = (this.S2 - this.S1)/ this.no_revelations

        // https://www.generativehut.com/post/a-step-by-step-guide-to-making-art-with-observable
        for (let rev = 0; rev <= this.no_revelations; rev++) {
            p.beginShape()
            for (let phi = 0; phi <= p.TWO_PI + FLOATING_POINT_ACCURACY; phi += p.TWO_PI/this.discretizatie) {

                let X = this.my_circle_sinus(R, S, phi, rev*this.delay )
                let x2 = Middle + X[0] 
                let y2 = Middle + X[1]
                p.vertex(x2,y2)
                no_vertices ++
            }
            S += S_step
            R += R_step
            p.endShape()
        }

        if (false) {
            p.beginShape()
            for (let theta = 0; theta < p.TWO_PI; theta += 0.1) {
                        // DEBUG sinus
                        let X = this.my_circle_sinus(this.R1, theta)
                        let x2 = Middle + X[0] 
                        let y2 = Middle + X[1]
                        p.vertex(x2,y2)
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
    my_circle_sinus(R, S, phi, phase) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y
        R = R + S* Math.sin(this.freq*phi)
        x = R * Math.sin(phi + phase)
        y = R * Math.cos(phi + phase)
        return [x,y]
    }

}
