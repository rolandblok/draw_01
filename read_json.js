class read_json {

    constructor(gui,cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')

        this.setting1()

        this.gui_folder_draw_options.add(this, 'R1').onChange(function (v) { cvs.draw() }).min(0).step(1).listen()
        this.gui_folder_draw_options.add(this, 'file_name')
        this.kader = true
        this.gui_folder_draw_options.add(this,'load_start')
        this.gui_folder_draw_options.open()



    }

    load_done(request, my_obj) {
        return function() {
            console.log("load done")
            let my_data = request.responseText;
            my_obj.my_data = JSON.parse(my_data)
            cvs.draw()
        }
    }

    load_start() {
        console.log("load start")
        let  request = new XMLHttpRequest();
        //  request.open('GET', 'http://192.168.1.241:8080/coordinates?x='+coord.x+"&y="+coord.y+"&z="+zoom+"&r="+radius);
        request.open('GET', this.file_name);
        request.onload = this.load_done(request, this )
        request.send();
  
  
    }

    setting1() {
        this.R1 = 104
        this.my_data = []
        this.file_name = "data/data.json"
        
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

        if (this.my_data.length > 0) {
            for (let my_shape of this.my_data) {
                p.beginShape()
                for (let my_vertex of my_shape) {
                    p.vertex(Middle + my_vertex[0], Middle + my_vertex[1])
                    no_vertices ++
                }
                p.endShape()
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
