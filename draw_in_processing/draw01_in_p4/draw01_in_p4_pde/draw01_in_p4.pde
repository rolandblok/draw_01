import processing.svg.*;


float FLOATING_POINT_ACCURACY = 1.0e-5;


CirclePacking cpack;

void setup() {
  //size(800, 800, SVG, "filename.svg");
  size(1600,800);
  cpack = new CirclePacking();
}

void draw() {
  clear();
  background(255);
  // Draw something good here
  cpack.draw();

  // Exit the program
  println("Finished.");
  //exit();
}




/**
 * 
 */
 class CirclePacking  {
   ArrayList<MyCircle> my_circles ;
   float Rmax, Rmin, no_circles, max_tries, missing_perc;
   boolean hatch_rand_center;

    CirclePacking() {
        my_circles = new ArrayList<MyCircle>();
         Rmax = 70;
        Rmin = 5;
        no_circles = 300;
        max_tries = 1000;
        hatch_rand_center = true;
        missing_perc = 0;

        this.fill_area_seeded();
    }



    void draw() {
      color fgc = color(0,0,0);
      color bgc = color(255,255,255);
      for (MyCircle c : my_circles) {
        
        c.draw();
      }
    }

    

    void fill_area_seeded() {
        float fails = 0;
        while (fails < this.max_tries) {
            // let keys = Object.keys(grid)
            // let ri   = Math.floor(keys.length * Math.random())
            // let ki   = keys[ri]
            // let p = grid[ki];
            // let x = p.x
            // let y = p.y
            float xran = random(1);
            float yran = random(1);
            float x = floor(width * xran);
            float y = floor(height * yran);
            float x_01 = xran;
            float y_01 = yran;
            //float pl_val = my_plasma.get_value_at_normed_xy(x_01, y_01)
            //if ( pl_val < this.plasma_min_height) {
            //    fails ++
            //    continue
            //}

            FloatList distances = new FloatList ();
            for (MyCircle c : my_circles) {
              
              float d = sqrt((c.c.x-x)*(c.c.x-x) + (c.c.y-y)*(c.c.y-y) ) - c.R;
              distances.append(d);
            }
            distances.append(x);
            distances.append(width - x);
            distances.append(y);
            distances.append(height - y);
            distances.append(Rmax);

            float radius = distances.min();

            if (radius < Rmin) {
                fails++;
                continue;
            } else {
                MyCircle new_circle = new MyCircle(new PVector(x, y), radius);
                my_circles.add(new_circle);
            }
        }
    }



}

class MyCircle {
    PVector c;
    float R;
    
    MyCircle(PVector V, float R) {
        this.c = V;
        this.R = R;
    }

    void draw() {
      float missing_frac = 0;

        if (random(1) > (missing_frac)) {
            beginShape();
            for (float theta = 0; theta <= (TWO_PI + FLOATING_POINT_ACCURACY); theta +=  TWO_PI / 100) {
                // DEBUG sinus
                PVector V = this.pointOn(theta);
                vertex(V.x, V.y);
            }
             endShape() ;
        }

    }

    PVector pointOn(float  phi) {
        // https://upload.wikimedia.org/wikipedia/commons/4/4c/Unit_circle_angles_color.svg
        PVector p = new PVector();
        p.x = this.c.x + this.R * sin(phi);
        p.y = this.c.y + this.R * cos(phi);
        return p;
    }

    boolean insideBox(float l,float r,float t,float b) {
        if ( (this.c.x > (l + this.R)) && (this.c.x < (r - this.R)) && 
             (this.c.y > (t + this.R)) && (this.c.y < (b - this.R))    ) {
                 return true;
             } else {
                 return false;
             }
    }


    boolean overlaps(MyCircle other_circle) {
        float  dx = this.c.x - other_circle.c.x;
        float  dy = this.c.y - other_circle.c.y;
        float  distance2 = dx*dx + dy*dy;
        float  distance2_r = (this.R + other_circle.R)*(this.R + other_circle.R);
        return distance2 < distance2_r;
    }

    float  circleDist(PVector c) {
        return sqrt((this.c.x-c.x)*(this.c.x-c.x) + (this.c.y-c.y)*(this.c.y-c.y)) ;
    }
    
    float distPoint(PVector P) {
        return sqrt((this.c.x-P.x)*(this.c.x-P.x) + (this.c.y-P.y)*(this.c.y-P.y));
    }

}
