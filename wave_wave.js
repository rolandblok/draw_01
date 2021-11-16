


class wave_wave {

    constructor(gui) {
        this.gui = gui
        this.gui_folder_draw_options = gui.addFolder('wave wave draw options')
        this.settings = []
        this.settings.line_width = 8
        this.gui_folder_draw_options.add(this.settings, 'line_width').onChange(function (v) { draw() }).min(3)
        this.settings.sin_scale = 2
        this.gui_folder_draw_options.add(this.settings, 'sin_scale').onChange(function (v) { draw() }).min(0.1)
        this.settings.ph_scale = 13
        this.gui_folder_draw_options.add(this.settings, 'ph_scale').onChange(function (v) { draw() }).min(0.1)
        this.settings.ph_period_scale = 0.9
        this.gui_folder_draw_options.add(this.settings, 'ph_period_scale').onChange(function (v) { draw() }).min(0)
        this.settings.ph_scale2 = 32
        this.gui_folder_draw_options.add(this.settings, 'ph_scale2').onChange(function (v) { draw() }).min(0.1)
        this.settings.ph_period_scale2 = 8.7
        this.gui_folder_draw_options.add(this.settings, 'ph_period_scale2').onChange(function (v) { draw() }).min(0)
        this.gui_folder_draw_options.open()

    }

    close() {
        this.gui.removeFolder('wave wave draw options')
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
        noFill()
        for (let y = -20; y < h+20; y += this.settings.line_width) {
            let ph_offset = this.settings.ph_scale*sin(PI*0.001*this.settings.ph_period_scale*y)
            let ph_offset2 = this.settings.ph_scale2*sin(PI*0.001*this.settings.ph_period_scale2*y)
            beginShape()
            for (let x = Left; x < Right; x+=10) {
                let S = y + this.settings.sin_scale * this.settings.line_width * sin(TWO_PI * 0.01* (x+ph_offset+ph_offset2))
                vertex(x, S)

            }
            endShape()
        }
    }
    return

}
