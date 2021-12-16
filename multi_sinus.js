
class multi_sinus {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')



        this.setting1(false)

        this.draw_max = 1000000

        this.R1 = 180
        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this, 'R2').onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this, 'no_lines').onChange(function (v) { cvs.draw() }).min(10).listen()
        this.gui_folder_draw_options.add(this,'no_sinusus').onChange(function (v) { cvs.draw() }).min(1). step(1).listen()
        this.gui_folder_draw_options.add(this,'sinus_scale').onChange(function (v) { cvs.draw() }).min(1). step(0.1).listen()
        this.gui_folder_draw_options.add(this, 'S_scale1').onChange(function (v) { cvs.draw() }).listen().min(0).step(0.1)
        this.gui_folder_draw_options.add(this, 'S_scale2').onChange(function (v) { cvs.draw() }).listen().min(0).step(0.1)
        this.gui_folder_draw_options.add(this,'delay_scale').onChange(function (v) { cvs.draw() }).min(0). step(0.1).listen()
        this.gui_folder_draw_options.add(this,'tilt_scale1').onChange(function (v) { cvs.draw() }).step(0.01).listen()
        this.gui_folder_draw_options.add(this,'tilt_scale2').onChange(function (v) { cvs.draw() }).step(0.01).listen()
        this.gui_folder_draw_options.add(this,'h_scale').onChange(function (v) { cvs.draw() }).step(0.01).listen()
        
        this.kader = true
        this.gui_folder_draw_options.add(this,'kader').onChange(function (v) { cvs.draw() }).listen()

        this.gui_folder_draw_options.add(this,'discretizatie').onChange(function (v) { cvs.draw() }).listen().min(10). step(10)
        this.gui_folder_draw_options.add(this,'randseed').onChange(function (v) { cvs.draw() }).step(1).listen()


        this.gui_folder_defaults = this.gui_folder_draw_options.addFolder('defaults')
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'setting2')
        this.gui_folder_defaults.add(this, 'setting3')
        this.gui_folder_defaults.add(this, 'rando')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()



    }
    mouse(p, x,y){
    }

    close() {
        this.gui.removeFolder('wave wave draw options')
    }
    setting1(draw_now=true) {
        this.R1 = window.innerHeight * 0.15
        this.R2 = window.innerHeight * 0.45
        this.R3 = window.innerHeight * 0.1
        this.no_lines = 125
        this.discretizatie = 250
        this.randseed = 0
        this.no_sinusus = 250
        this.sinus_scale = 5
        this.delay_scale = 8 * Math.PI
        this.tilt_scale1 = 1
        this.tilt_scale2 = 0.5
        this.S_scale1 = 1
        this.S_scale2 = 1
        this.h_scale = 0

        if(draw_now) cvs.draw()
    }
    setting2() {
        this.R1 = window.innerHeight * 0.15
        this.R2 = window.innerHeight * 0.45
        this.R3 = window.innerHeight * 0.1
        this.no_lines = 105
        this.discretizatie = 250
        this.randseed = 32
        this.no_sinusus = 14
        this.sinus_scale = 6.7
        this.delay_scale = 14.8
        cvs.draw()
    }
    setting3() {
        this.R1 = window.innerHeight * 0.15
        this.R2 = window.innerHeight * 0.45
        this.R3 = window.innerHeight * 0.1
        this.no_lines = 93
        this.discretizatie = 250
        this.randseed = 15
        this.no_sinusus = 46
        this.sinus_scale = 5.3
        this.delay_scale = 17.2
        cvs.draw()
    }
    rando() {
        this.no_lines = 20 + Math.random() * 100
        this.randseed = Math.floor(Math.random() *100)
        this.no_sinusus = 10 + Math.floor(100*Math.random())
        this.sinus_scale = 20*Math.random()
        this.delay_scale = 8*Math.PI*Math.random()
        cvs.draw()
    }
    
    draw_plus() {
        this.draw_max += 10
        cvs.draw()
    }
    draw_min() {
        this.draw_max -= 10
        if (this.draw_max < 1) {
            this.draw_max = 1
        }
        cvs.draw()
    }


    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        let no_vertices = 0
        let w = window.innerWidth
        let h = window.innerHeight
        let Left = 0
        let Middle = h / 2
        let Right = h

        p.clear()
        p.stroke(bgc) 
        p.fill(bgc)
        p.rect(0,0,w,h)                 // make sure there is no transparant: movies will fail

        p.stroke(fgc) 
        p.noFill()
        
        if (this.kader) {
            p.rect(10, 10, Right-20, h-20)
        }

        p.randomSeed(this.randseed)

        let Ss_and_Phases_and_Freqs_and_Delays = []
        for(let i = 0; i< this.no_sinusus; i++) {
            Ss_and_Phases_and_Freqs_and_Delays[i] = Array(4)
            Ss_and_Phases_and_Freqs_and_Delays[i][0] = p.random() * this.R1 * this.sinus_scale / this.no_sinusus
            Ss_and_Phases_and_Freqs_and_Delays[i][1] = p.random() * p.TWO_PI
            Ss_and_Phases_and_Freqs_and_Delays[i][2] = 1+ p.floor(p.random() * 10)
            Ss_and_Phases_and_Freqs_and_Delays[i][3] = p.random() * this.delay_scale / (this.no_lines)
        }

        let h_step   = h/2 * this.h_scale / this.no_lines
        let h_offset = h_step * this.no_lines / 2
        
        for(let l_no = 0; l_no < this.no_lines; l_no++){
            let R = this.R1  + l_no * (this.R2 - this.R1) / this.no_lines
            let tilt_scale = this.tilt_scale1 + l_no * (this.tilt_scale2 - this.tilt_scale1) / this.no_lines
            let S_scale = this.S_scale1 + l_no * (this.S_scale2 - this.S_scale1) / this.no_lines
            for(let i = 0; i< this.no_sinusus; i++) {
                Ss_and_Phases_and_Freqs_and_Delays[i][1] += Ss_and_Phases_and_Freqs_and_Delays[i][3]
            }
            p.beginShape()
            for (let phi = 0; phi <= p.TWO_PI + FLOATING_POINT_ACCURACY; phi += (p.TWO_PI/this.discretizatie)) {


                let V = this.my_circle_sinusus(R, Ss_and_Phases_and_Freqs_and_Delays, phi, S_scale = S_scale, tilt_scale = tilt_scale)
                p.vertex(Middle + V[X], Middle + V[Y] - h_offset + l_no * h_step)
                no_vertices ++
            }
            p.endShape()
        }

        if (false) {
            p.beginShape()
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += 0.1) {
                        // DEBUG sinus
                        let V = this.my_circle_sinus(this.R1, theta)
                        let x2 = Middle + V[0] 
                        let y2 = Middle + V[1]
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
    my_circle_sinus(R, phi) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y
        x = R * Math.sin(phi)
        y = R * Math.cos(phi)
        return [x,y]
    }

    /**
     * sinus circle around zero, radius R, sinus extra scale S, sinus freq and phi
     * @param {*} R 
     * @param {*} S 
     * @param {*} freq 
     * @param {*} phi 
     * @returns 
     */
    my_circle_sinusus(R,Ss_and_Phases_and_Freqs, phi, S_scale, tilt_scale) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let Rsum = R
        for (let S_and_Phase_and_freq of Ss_and_Phases_and_Freqs){
            let S = S_scale * S_and_Phase_and_freq[0]
            let phase = S_and_Phase_and_freq[1]
            let freq = S_and_Phase_and_freq[2]
            Rsum += S* Math.sin(freq*phi + phase)
        } 
        let x,y
        x = Rsum * Math.sin(phi)
        y = Rsum * Math.cos(phi) * tilt_scale
        return [x,y]

    }
}


