
class read_json extends Drawer{

    constructor(gui, xywh, sub_gui = '') {
        super('read json options',gui, xywh, sub_gui)

        this.setting_test()
        this.draw_max = 1000000
        this.do_average_per_pixel = true

        this.map_level = 'all'
        this.no_endShapes = 0

        this.gui_folder_draw_options.add(this, 'no_endShapes').listen()
        this.gui_folder_draw_options.add(this, 'file_name').listen()
        this.gui_folder_draw_options.add(this,'z_as_hoogtekaart').onChange(function (v) { cvs.draw() }).listen()
        this.gui_folder_draw_options.add(this, 'map_level', ['all','negative','positive','two_colors']).onChange(function (v) { cvs.draw() })
        this.gui_folder_draw_options.add(this,'z_scale').onChange(function (v) { cvs.draw() }).min(0.00).step(0.0001).listen()
        this.gui_folder_draw_options.add(this,'draw_max').onChange(function (v) { cvs.draw() }).min(2).step(1)
        this.gui_folder_draw_options.add(this,'do_average_per_pixel').listen()
        this.gui_folder_draw_options.add(this,'do_centre_and_scale').listen()
        this.gui_folder_draw_options.add(this,'load_json')
        this.gui_folder_defaults.add(this, 'setting_test')
        this.gui_folder_defaults.add(this, 'setting_hoogtekaart')
        if(sub_gui === ' 0_0'){
            this.gui_folder_defaults.open()
            this.gui_folder_draw_options.open()
        }

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
        this.file_name = "data/hoogtekaart25.json"
        this.z_as_hoogtekaart = true;
        this.do_centre_and_scale = true
        this.z_scale = 0.01
        this.kader = false

        this.load_json()
        
    }
    
    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p, fgc, bgc)

        let no_vertices = 0

        let no_draws = 1
        let org_map_level = this.map_level.slice()
        let active_map_level = this.map_level.slice()
        if (this.map_level === 'two_colors') {
            active_map_level = 'negative'.slice()
            p.stroke([0,0,255])
            no_draws = 2
        }
        if (active_map_level === 'negative')
            p.stroke([0,0,255])

        this.no_endShapes = 0
        while (no_draws > 0 ) {
            let latest_height = new LatestHeight()
            if (this.my_data.length > 0) {
                for (let my_shape of this.my_data) {
                    let shape_active = true
                    p.beginShape()
                    for (let my_vertex of my_shape) {
                        let y_vertex = 0
                        let map_level_draw = true
                        if (this.z_as_hoogtekaart) {
                            if ((my_vertex[Z] < 0) && (active_map_level === 'positive' )  ||
                                (my_vertex[Z] > 0) && (active_map_level === 'negative' )     ) { 
                                    map_level_draw = false
                            }

                            y_vertex  = my_vertex[Y] - this.z_scale*my_vertex[Z]

                            if ((map_level_draw) && (latest_height.check_vis_and_add_point(my_vertex[X], y_vertex))) {
                                if (!shape_active) {
                                    p.beginShape()
                                    shape_active = true
                                }
                                p.vertex( my_vertex[X],  y_vertex)
                                no_vertices ++
                                if (no_vertices > this.draw_max) {
                                    p.endShape()
                                    this.no_endShapes++
                                    return no_vertices
                                }
                            } else {
                                if(shape_active) {
                                    p.endShape()
                                    shape_active = false
                                }
                            }
                        } else {
                            p.vertex( my_vertex[X],  my_vertex[Y])
                            no_vertices ++
                            if (no_vertices > this.draw_max) {
                                p.endShape()
                                this.no_endShapes++
                                return no_vertices
                            }
                        }
                    }
                    if (shape_active) {
                        p.endShape()
                        this.no_endShapes++
                    }
                }
            }

            no_draws --
            if(org_map_level === 'two_colors') {
                active_map_level = 'positive'.slice()
                p.stroke(fgc)
            }
        }

        return no_vertices
    }


    centre_and_scale() {
        if (this.my_data.length > 0) {

            // find the min and max values
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

            // move the image, within the border. Reverse y plane
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

            // average the x values per pixel to prevent save mega files
            if (this.do_average_per_pixel) {
                var new_shapes_av = []
                for (const shape of new_shapes) {
                    let new_shape_sums_dict = {}         // store in dict, so we can sum all values with same x
                    for (const V of shape) {
                        let x_fl = Math.floor(V[0])      // make an index of the x floored
                        if (x_fl in new_shape_sums_dict) {  // if it already exists: add
                            if (V.length == 3) new_shape_sums_dict[x_fl][Z] += V[Z]
                            new_shape_sums_dict[x_fl][4] = new_shape_sums_dict[x_fl][4] + 1
                        } else {                            // this key is new: make a new one
                            new_shape_sums_dict[x_fl] = new Array(4).fill(0) // we will store the sum and count (item 4)
                            new_shape_sums_dict[x_fl][X] = V[X]
                            new_shape_sums_dict[x_fl][Y] = V[Y]
                            if (V.length == 3) new_shape_sums_dict[x_fl][Z] = V[Z]
                            new_shape_sums_dict[x_fl][4] = 1
                        }
                    }

                    // we now have the summed V's, let's average them (it has to be two loops, otherwise I will miss the last items.)
                    let new_shape_av = []
                    for (const i in new_shape_sums_dict) {
                        let new_V_av = new Array(3)
                        new_V_av[0] =  new_shape_sums_dict[i][0] 
                        new_V_av[1] =  new_shape_sums_dict[i][1] 
                        new_V_av[2] =  new_shape_sums_dict[i][2] / new_shape_sums_dict[i][4] 
                        new_shape_av.push(new_V_av)
                    }

                    new_shapes_av.push(new_shape_av)
                }
                this.my_data = new_shapes_av
            }
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
        let x = Px.toFixed()
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
