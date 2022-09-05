
/**
 * 
 */
 class umbrella extends Drawer {

    constructor(gui, xywh, sub_gui = '') {
        let name = "Templeet"
        super(name, gui, xywh, sub_gui)

        this.setting1(false)


        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(10).step(1)
        this.gui_folder_draw_options.add(this, 'no_umbrellas').onChange(function (v) { cvs.draw() }).min(1).step(1)
        this.gui_folder_draw_options.add(this, 'chopped').onChange(function (v) { cvs.draw() }).listen()
        this.gui_folder_draw_options.add(this, 'rain_dist').onChange(function (v) { cvs.draw() }).listen().min(2)
        this.gui_folder_draw_options.add(this, 'min_length').onChange(function (v) { cvs.draw() }).listen().min(0)
        this.gui_folder_draw_options.add(this, 'max_length').onChange(function (v) { cvs.draw() }).listen().min(0)
        this.gui_folder_draw_options.add(this, 'min_open').onChange(function (v) { cvs.draw() }).listen().min(0)
        this.gui_folder_draw_options.add(this, 'max_open').onChange(function (v) { cvs.draw() }).listen().min(0)
        this.gui_folder_draw_options.add(this, 'rotation').onChange(function (v) { cvs.draw() }).listen().step(0.1)
        this.gui_folder_draw_options.add(this, 'draw_rain').onChange(function (v) { cvs.draw() }).listen()
        this.gui_folder_draw_options.add(this, 'up_down_drawing').onChange(function (v) { cvs.draw() }).listen()
        this.gui_folder_draw_options.add(this, 'draw_umbrellas').onChange(function (v) { cvs.draw() }).listen()
        this.gui_folder_defaults.add(this, 'setting1')
        this.gui_folder_defaults.add(this, 'setting2')
        this.gui_folder_defaults.add(this, 'regen')
        this.gui_folder_defaults.add(this, 'path_length').listen()
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()

    }
    
    setting1(redraw = true) {
        this.R1 = 40
        this.kader=false
        this.path_length = 0
        this.no_umbrellas = 20
        this.chopped = false
        this.rain_dist = 7
        this.min_length = 5
        this.max_length = 25
        this.min_open = 100
        this.max_open = 120
        this.rotation = 0
        this.draw_rain = true
        this.up_down_drawing = false;
        this.up_down = false;
        this.draw_umbrellas = true;
        this.regen(redraw)


    }
    
    setting2(redraw = true) {
        this.R1 = 40
        this.kader=false
        this.path_length = 0
        this.no_umbrellas = 20
        this.chopped = true
        this.rain_dist = 3
        this.min_length = 5
        this.max_length = 25
        this.min_open = 20
        this.max_open = 120
        this.draw_rain = true;
        this.draw_umbrellas = true;
        this.regen(redraw)
    }

    regen(redraw = true) {
        this.my_umbrellas = []
        let total_tries = 100
        for (let i = 0; i < this.no_umbrellas; i++) {
            let C = [2*this.R1 + Math.random() * (this.w-4*this.R1),  2*this.R1 + Math.random() * (this.h-4*this.R1)]
            let new_umbrella = new MyUmbrella(C, this.R1)
            let overlap = false
            for (let my_umbrella of this.my_umbrellas) {
                if (my_umbrella.overlaps(new_umbrella)) {
                    i--
                    overlap = true
                    break
                } 
            }
            if (!overlap) {
                this.my_umbrellas.push(new_umbrella)
            }

            total_tries --
            if (total_tries <0) {
                break
            }
        }

        this.my_rain = new Rain(this.my_umbrellas, this.w, this.h, this)

        if (redraw) {
            cvs.draw()
        }

    }
    

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p ,fgc,bgc)

        let no_vertices = 0
        this.path_length = 0 

        if (this.draw_rain)
            this.my_rain.up_down_drawing = this.up_down_drawing
            this.my_rain.draw(p)

        if (this.draw_umbrellas) {
            for (let my_umbrella of this.my_umbrellas) {
                my_umbrella.rotation = this.rotation
                no_vertices += my_umbrella.draw(p)
            }
        }

        return no_vertices
    }




}

class Rain {
    constructor(umbrellas, width, height, settings) {
        this.up_down_drawing = false
        let rain_lines = []
        for (let x = 1; x < width; x += settings.rain_dist ) {
            let my_line = new MyLine([x,10], [x,height])
            let closest_hitpoint = undefined
            for (let umbrella of umbrellas) {
                let hitpoint = umbrella.hit(my_line)
                if (hitpoint != undefined) {
                    if ((closest_hitpoint == undefined) || (hitpoint.labda < closest_hitpoint.labda)) {
                        closest_hitpoint = hitpoint
                    }
                }
            } 
            if (closest_hitpoint != undefined) {
                my_line = new MyLine([x,10], closest_hitpoint.position)
            }
            rain_lines.push(my_line)
        }

        this.rain_lines = []
        if (settings.chopped) {
            for (let rain_line of rain_lines) {

                let line_length = rain_line.get_length()
                let min_length_labda = settings.min_length / line_length
                let max_length_labda = settings.max_length / line_length
                let min_open_labda = settings.min_open / line_length
                let max_open_labda = settings.max_open / line_length
                let ls = Math.random()*(max_open_labda + max_length_labda)/2
                let le = ls + min_length_labda +  Math.random()*(max_length_labda - min_length_labda)
                while (le < 1) {
                    let start = rain_line.evaluate(ls)
                    let end = rain_line.evaluate(le)
                    this.rain_lines.push(new MyLine(start, end))
                    ls = le + min_open_labda + Math.random()*(max_open_labda - min_open_labda)
                    le = ls + min_length_labda + Math.random()*(max_length_labda - min_length_labda)
                }
            }
        } else {
            this.rain_lines = rain_lines
        }

    }

    draw(p){
        let no_vertices = 0
        let up_down = true
        for (let line of this.rain_lines) {
            if (up_down) {
                no_vertices += line.draw(p)
            } else {
                no_vertices += line.draw(p, this.up_down_drawing)
            }
            up_down = !up_down
            no_vertices += 2
        }
        return no_vertices
    }

}

class MyUmbrella {
    constructor(C,R, rot=0) {
        this.C = [...C]
        this.R = R
        this.rotation = rot
        this.bound_sphere = new MySphere(C,R)

    }
    draw(p) {
        let no_vertices = 0;
        // p.push()
        // p.translate(this.C[0],this.C[1])
        // p.rotate(this.rotation)
        let C = this.C
        // C = [0,0]
        let R = this.R
        p.beginShape()
        no_vertices += this.my_circle_from_to(p, C,R,0,p.PI,this.rotation, false)
        no_vertices += this.my_circle_from_to(p, [C[X]-R*2/3, C[Y]], R/3,p.PI,0,this.rotation, false)
        no_vertices += this.my_circle_from_to(p, C,R/3,p.PI,0,this.rotation, false)
        no_vertices += this.my_circle_from_to(p, [C[X]+R*2/3, C[Y]], R/3,p.PI,0,this.rotation, false)
        p.endShape()
        p.beginShape()
        p.vertex(C[X], C[Y] - R/3)
        p.vertex(C[X], C[Y] + R-R/6)
        no_vertices += 2
        no_vertices += this.my_circle_from_to(p, [C[X]+R/6, C[Y]+R-R/6], R/6,p.PI, p.TWO_PI,this.rotation, false)
        p.endShape()
        // p.pop()
        

        return no_vertices;    
    }

    overlaps(umbrella) {
        let dx = this.C[X] - umbrella.C[X]
        let dy = this.C[Y] - umbrella.C[Y]
        let distance2 = dx*dx + dy*dy
        let distance2_r = (this.R + umbrella.R)**2
        return distance2 < distance2_r
    }

    hit(line) {
        return this.bound_sphere.hit(line)
        
    }

    /**
     * sinus circle around zero, radius R, sinus extra scale S, sinus freq and phi
     * @param {*} R 
     * @param {*} S 
     * @param {*} freq 
     * @param {*} phi 
     * @returns 
     */
    my_circle_sinus(C, R, phi) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        let x,y
        x = C[X] + R * Math.cos(phi)
        y = C[Y] - R * Math.sin(phi)
        return [x,y]
        }   

    my_circle_from_to(p, C,R,phi_start, phi_end, rotation, do_begin_end_shape=true) {
        let no_vertices = 0;
        if (do_begin_end_shape) p.beginShape()
        let V_pref = null
        let no_steps = 100
        let step = (phi_end - phi_start) / no_steps
        let theta = phi_start
        while (no_steps >= 0) {
            let V = this.my_circle_sinus(C, R, theta)
            p.vertex(V[0], V[1])

            theta += step;
            no_steps --;

            no_vertices ++

            if (V_pref !== null) {
                this.path_length += len2(sub2(V, V_pref))
            }
            V_pref = V
        }
        if (do_begin_end_shape) p.endShape()
        return no_vertices;
    }

    
}