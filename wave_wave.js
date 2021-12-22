


class wave_wave extends Drawer{

    constructor(gui, xywh, sub_gui = '') {
        super('wave_wave options',gui, xywh, sub_gui)

        this.line_width = 8
        this.gui_folder_draw_options.add(this, 'line_width').onChange(function (v) { cvs.draw() }).min(3)
        this.sin_scale = 2
        this.gui_folder_draw_options.add(this, 'sin_scale').onChange(function (v) { cvs.draw() }).min(0.1)
        this.ph_scale = 13
        this.gui_folder_draw_options.add(this, 'ph_scale').onChange(function (v) { cvs.draw() }).min(0.1)
        this.ph_period_scale = 0.9
        this.gui_folder_draw_options.add(this, 'ph_period_scale').onChange(function (v) { cvs.draw() }).min(0)
        this.ph_scale2 = 32
        this.gui_folder_draw_options.add(this, 'ph_scale2').onChange(function (v) { cvs.draw() }).min(0.1)
        this.ph_period_scale2 = 8.7
        this.gui_folder_draw_options.add(this, 'ph_period_scale2').onChange(function (v) { cvs.draw() }).min(0)
        this.main_phase = 10
        this.gui_folder_draw_options.add(this, 'main_phase').onChange(function (v) { cvs.draw() }).min(0)
        this.gui_folder_draw_options.open()


    }

    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p, fgc, bgc)

        let no_vertices = 0

        let R = 0.5 * this.h / 1.2

        // SINS
        p.strokeWeight(1)
        p.noFill()
        for (let y = this.Top-20; y < this.Bottom+20; y += this.line_width) {
            let ph_offset = this.ph_scale*p.sin(p.PI*0.001*this.ph_period_scale*y)
            let ph_offset2 = this.ph_scale2*p.sin(p.PI*0.001*this.ph_period_scale2*y)
            p.beginShape()
            for (let x = this.Left; x < this.Right; x+=10) {
                let S = y + this.sin_scale * this.line_width * p.sin(p.TWO_PI * this.main_phase*0.001* (x+ph_offset+ph_offset2))
                p.vertex(x, S)
                no_vertices++

            }
            p.endShape()
        }
        return no_vertices
    }

}
