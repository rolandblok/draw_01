


class wave_circle extends Drawer{

    constructor(gui, xywh, sub_gui = '') {
        super('wave wave draw options',gui, xywh, sub_gui)

        this.line_width = 13 
        this.gui_folder_draw_options.add(this,'line_width').onChange(function(v){ cvs.draw()}).min(3)
        this.gui_folder_draw_options.open()
      
    }



    draw(p, fgc = [0,0,0], bgc = [255,255,255]) {
        super.draw(p, fgc, bgc)

        let no_vertices = 0

        let R = 0.5 * this.h / 1.2

        // SINS
        p.strokeWeight(1)
        for (let yl = this.Top; yl < this.Bottom; yl += this.line_width) {

            if ((yl > (this.h / 2 - R)) && (yl < (this.h / 2 + R))) {
                let z = this.h / 2 - yl
                p.beginShape()
                let ll = p.sqrt(R * R - z * z)
                let left = this.Middle_x - ll
                let right = this.Middle_y + ll
                let width = 2 * ll
                // lines
                p.line(this.Left, yl, left, yl)
                p.line(right, yl, this.Right, yl)

                // waves
                let freq = p.round(p.random(1, 15))
                for (let xl = left; xl < right; xl++) {
                    let S = yl + 0.4 * this.line_width * p.sin(p.TWO_PI * (xl - left) * freq / width)
                    p.vertex(xl, S)
                    no_vertices ++
                }
                p.endShape()
            } else {
                // lines
                p.line(this.Left, yl, this.Right, yl)
                no_vertices += 2
            }
        }
        return no_vertices
    }
}
