


class wave_circle {

    constructor(gui) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave circle draw options')
        this.settings = []
        this.settings.line_width = 13 
        this.gui_folder_draw_options.add(this.settings,'line_width').onChange(function(v){draw()}).min(3)
        this.gui_folder_draw_options.open()
      
    }

    close() {
        this.gui.removeFolder('wave circle draw options')
    }

    draw() {

        let w = window.innerWidth
        let h = window.innerHeight
        let Left = 0
        let Middle = h / 2
        let Right = h

        clear()
        stroke([0, 0, 0])  // BLACK

        let R = 0.5 * h / 1.2

        // SINS
        strokeWeight(1)
        for (let y = 0; y < h; y += this.settings.line_width) {

            if ((y > (h / 2 - R)) && (y < (h / 2 + R))) {
                let z = h / 2 - y
                beginShape()
                let ll = sqrt(R * R - z * z)
                let left = Middle - ll
                let right = Middle + ll
                let width = 2 * ll
                // lines
                line(Left, y, left, y)
                line(right, y, Right, y)

                // waves
                let freq = round(random(1, 15))
                for (let x = left; x < right; x++) {
                    let S = y + 0.4 * this.settings.line_width * sin(TWO_PI * (x - left) * freq / width)
                    vertex(x, S)
                }
                endShape()
            } else {
                // lines
                line(Left, y, Right, y)
            }
        }
        return
    }
}
