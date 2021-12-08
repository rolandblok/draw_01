
class read_json {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')

        this.setting_test()
        this.draw_max = 1000000

        this.gui_folder_draw_options.add(this, 'file_name').listen()
        this.kader = true
        this.gui_folder_draw_options.add(this,'kader').onChange(function (v) { cvs.draw() }).listen()
        this.gui_folder_draw_options.add(this,'z_as_hoogtekaart').onChange(function (v) { cvs.draw() }).listen()
        this.gui_folder_draw_options.add(this,'z_scale').onChange(function (v) { cvs.draw() }).min(0.00).step(0.0001).listen()
        this.gui_folder_draw_options.add(this,'draw_max').onChange(function (v) { cvs.draw() }).min(2).step(1)
        this.gui_folder_draw_options.add(this,'do_centre_and_scale').listen()
        this.gui_folder_draw_options.add(this,'load_json')
        this.gui_folder_defaults = this.gui_folder_draw_options.addFolder('defaults')
        this.gui_folder_defaults.add(this, 'setting_test')
        this.gui_folder_defaults.add(this, 'setting_hoogtekaart')
        this.gui_folder_defaults.open()
        this.gui_folder_draw_options.open()



    }

    load_done(request, my_obj) {
        return function() {
            console.log("load done")
            let my_data = request.responseText;
            my_obj.my_data = JSON.parse(my_data)

            if (my_obj.do_centre_and_scale) {
                my_obj.centre_and_scale();
            }


            cvs.draw()
        }
    }

    load_json() {
        console.log("load start")
        let  request = new XMLHttpRequest();
        //  request.open('GET', 'http://192.168.1.241:8080/coordinates?x='+coord.x+"&y="+coord.y+"&z="+zoom+"&r="+radius);
        request.open('GET', this.file_name);
        request.onload = this.load_done(request, this )
        request.send();
  
  
    }

    setting_test() {
        this.my_data = []
        this.file_name = "data/data.json"
        this.z_as_hoogtekaart = false;
        this.do_centre_and_scale = false
        this.z_scale = 1
        this.load_json()
    }
    setting_hoogtekaart() {
        this.my_data = []
        this.file_name = "data/hoogtekaart.json"
        this.z_as_hoogtekaart = true;
        this.do_centre_and_scale = true
        this.z_scale = 0.01
        this.load_json()
        
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

        let latest_height = new LatestHeight()

        if (this.my_data.length > 0) {
            for (let my_shape of this.my_data) {
                let shape_active = true
                p.beginShape()
                for (let my_vertex of my_shape) {
                    let y_vertex = 0
                    if (this.z_as_hoogtekaart) {
                        if (my_vertex[Z] < 0)  { 
                            p.stroke([0, 0, 255]) 
                        } else {
                            p.stroke([0, 0, 0]) 
                        }
                        y_vertex  = my_vertex[Y] - this.z_scale*my_vertex[Z]

                        if (latest_height.check_vis_and_add_point(my_vertex[X], y_vertex)) {
                            if (!shape_active) {
                                p.beginShape()
                                shape_active = true
                            }
                            p.vertex( my_vertex[X],  y_vertex)
                            no_vertices ++
                            if (no_vertices > this.draw_max) {
                                p.endShape()
                                return no_vertices
                            }
                        } else {
                            p.endShape()
                            shape_active = false
                        }
                    } else {
                        p.vertex( my_vertex[X],  my_vertex[Y])
                        no_vertices ++
                        if (no_vertices > this.draw_max) {
                            p.endShape()
                            return no_vertices
                        }
                    }
                }
                if (shape_active) {
                    p.endShape()
                }
            }
        }

        if (false) {
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


    centre_and_scale() {
        if (this.my_data.length > 0) {
            let x_min = this.my_data[0][0][0]
            let x_max = x_min
            let y_min = this.my_data[0][1][0]
            let y_max = y_min
            for (const shape of this.my_data) {
                for (const V of shape) {
                    if (V[0] < x_min ) x_min = V[0]
                    if (V[0] > x_max ) x_max = V[0]
                    if (V[1] < y_min ) y_min = V[1]
                    if (V[1] > y_max ) y_max = V[1]
                }
            }

            let scale_x = window.innerHeight / (x_max - x_min) 
            let scale_y = window.innerHeight / (y_max - y_min)
            scale_x = 0.9*Math.min(scale_x, scale_y)
            scale_y = scale_x

            var new_shapes = []
            for (const shape of this.my_data) {
                let new_shape = []
                for (const V of shape) {
                    let new_V = Array(3)
                    new_V[0] = 0.05 * window.innerHeight + (V[0] - x_min) * scale_x
                    new_V[1] = 0.95 * window.innerHeight - (V[1] - y_min) * scale_y
                    if (V.length == 3) new_V[2] = V[2]
                    new_shape.push(new_V)
                }
                new_shape.reverse()
                new_shapes.push(new_shape)
            }
            new_shapes.reverse()
            this.my_data = new_shapes
        }


        cvs.draw() 
        return
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


class LatestHeight {
    constructor(){
        this.ys = {} // dict with height (y) values. Index : x,  Resolution : pixel. 
    }

    check_vis_and_add_point(Px, Py) {
        let vis = false
        let x = Px.toFixed(3)
        if (this.ys[x]) {  // check if exists
            if (Py <= this.ys[x]) {
                this.ys[x] = Py
                vis = true
            } 
        } else { // doesn't exist : add
            this.ys[x] = Py
            vis = true
        }
        return vis
    }
}
