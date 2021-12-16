
class TEMPLEET {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')



        this.setting1()

        this.draw_max = 1000000

        this.R1 = 180
        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10)
        this.kader = true
        this.gui_folder_draw_options.add(this,'kader').onChange(function (v) { cvs.draw() }).listen()

        this.gui_folder_defaults = this.gui_folder_draw_options.addFolder('defaults')
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()



    }

    close() {
        this.gui.removeFolder('wave wave draw options')
    }
    setting1() {
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
        if (p.type === 'SCREEN') {
            p.stroke(bgc) 
            p.fill(bgc)
            p.rect(0,0,w,h)                 // make sure there is no transparant: movies will fail
        }
        p.stroke(fgc) 
        p.noFill()
        
        if (this.kader) {
            p.rect(10, 10, Right-20, h-20)
        }


        if (true) {
            p.beginShape()
            for (let theta = 0; theta <= p.TWO_PI + FLOATING_POINT_ACCURACY; theta += 0.1) {
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
    my_circle_sinus(R, phi) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y
        x = R * Math.sin(phi)
        y = R * Math.cos(phi)
        return [x,y]
    }
}


