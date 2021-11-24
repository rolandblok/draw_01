


class wave_circle {

    constructor(gui, cvs) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave circle draw options')
        this.settings = []
        this.settings.line_width = 13 
        this.gui_folder_draw_options.add(this.settings,'line_width').onChange(function(v){ cvs.draw()}).min(3)
        this.gui_folder_draw_options.open()
      
    }

    close() {
        this.gui.removeFolder('wave circle draw options')
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

        let R = 0.5 * h / 1.2

        // SINS
        p.strokeWeight(1)
        for (let y = 0; y < h; y += this.settings.line_width) {

            if ((y > (h / 2 - R)) && (y < (h / 2 + R))) {
                let z = h / 2 - y
                p.beginShape()
                let ll = p.sqrt(R * R - z * z)
                let left = Middle - ll
                let right = Middle + ll
                let width = 2 * ll
                // lines
                p.line(Left, y, left, y)
                p.line(right, y, Right, y)

                // waves
                let freq = p.round(p.random(1, 15))
                for (let x = left; x < right; x++) {
                    let S = y + 0.4 * this.settings.line_width * p.sin(p.TWO_PI * (x - left) * freq / width)
                    p.vertex(x, S)
                    no_vertices ++
                }
                p.endShape()
            } else {
                // lines
                p.line(Left, y, Right, y)
                no_vertices += 2
            }
        }
        return no_vertices
    }
}
