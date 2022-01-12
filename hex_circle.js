
/**
 * 
 */
 class hex_circle extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1()

        this.ph1_MAX = 4* Math.PI
        this.ph1_end_MAX = 8*  Math.PI
        this.ph2_MAX = 4* Math.PI
        this.ph2_end_MAX = 8* Math.PI
        this.no_lines_MAX = 500

        this.gui_folder_draw_options.add(this, 'no_lines').onChange(function (v) { cvs.draw() }).min(10).step(1).listen()
        this.gui_folder_draw_options.add(this, 'ph1').onChange(function (v) { cvs.draw() }).min(0).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph1_end').onChange(function (v) { cvs.draw() }).min(0.1).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph2').onChange(function (v) { cvs.draw() }).min(0).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'ph2_end').onChange(function (v) { cvs.draw() }).min(0.1).step(0.01).listen()
        this.gui_folder_draw_options.add(this, 'R1_perc').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.gui_folder_draw_options.add(this,'discretizatie').onChange(function (v) { cvs.draw() }).min(1).step(10)
        this.gui_folder_draw_options.add(this,'randseed').onChange(function (v) { cvs.draw() }).step(1)


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'rando')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1() {
        this.R1 = this.wh_min * 0.15

        this.discretizatie = 100
        this.no_lines = 200
        this.R1_perc = 90
        this.ph1 = 0
        this.ph1_end = 5
        this.ph2 = Math.PI
        this.ph2_end = 2*Math.PI

        this.randseed = 0
        cvs.draw()

    }
    rando() {
        this.ph1 = Math.random() * this.ph1_MAX
        this.ph1_end = Math.random() *this.ph1_end_MAX
        this.ph2 = Math.random() * this.ph2_MAX
        this.ph2_end = Math.random() * this.ph2_end_MAX
        this.no_lines = 20 + Math.random()*this.no_lines_MAX

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

        let c_ph1 = this.ph1
        let c_ph2 = this.ph2
        let R = this.R1_perc * this.wh_min / 200
        let step_ph1 = (this.ph1_end - this.ph1)/this.no_lines
        let step_ph2 = (this.ph2_end - this.ph2)/this.no_lines
        for (let i = 0; i < this.no_lines; i ++){
            p.beginShape()


            let phi1 = i*step_ph1 + this.ph1
            let V1 = this.my_circle_sinus(R, phi1)
            this.vertex_middle(p, V1[X], V1[Y])
            no_vertices ++

            let phi2 = i*step_ph2 + this.ph2
            let V2 = this.my_circle_sinus(R, phi2)
            this.vertex_middle(p, V2[X], V2[Y])
            no_vertices ++

            p.endShape()
        }

        p.randomSeed(this.randseed)


        if (true) {
            let A = Math.PI * this.R1 * this.R1
            let xagon = new Xagon(A, 5)
            p.beginShape()
            for (let ph = 0; ph <= 1 + FLOATING_POINT_ACCURACY; ph += 0.01) {
                        // DEBUG xagon
                        let V = xagon.getXY(ph)
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


