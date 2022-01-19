class Plasma {
    constructor(size) {
        this.size = size;
        this.map = this.create_2d_map(size);
        this.create();
        this.normalise();
    }

    create() {
        this.map[0][0] = 0.5

        var order_val = 1;
        var order_offset = 1;
        
        while (order_val < this.size)
        {
           var x_ribe = this.size/order_val;
           var y_ribe = this.size/order_val;
           for (var x = 0; x < order_val; x++)
           {
              for (var y = 0; y < order_val; y++)
              {
                this.mapCreateSquare(x*x_ribe, y*y_ribe, x_ribe, y_ribe, order_offset);
              }
           }
           
           for (var x = 0; x < order_val; x++)
           {
              for (var y = 0; y < order_val; y++)
              {
                this.mapCreateRib(x_ribe*(2*x+1)/2, y_ribe*y         , x_ribe/2, order_offset);
                this.mapCreateRib(x_ribe*x,         y_ribe*(2*y+1)/2 , y_ribe/2, order_offset);
              }
           }
         
           order_val *= 2;   
           //order_offset += 0.9*order_offset;  
           order_offset *= 2;
        }
    }

    normalise() {
        var max = 0;
        var min = 1;
        for (var x = 0; x < this.size; x++)
        {
           for (var y = 0; y < this.size; y++)
           {
               var value = this.map[x][y];
               max = value > max ? value : max;
               min = value < min ? value : min;
           }
        }

        var delta = max - min;
        for (var x = 0; x < this.size; x++)
        {
           for (var y = 0; y < this.size; y++)
           {
               this.map[x][y] = (this.map[x][y] - min)/delta;
           }
        }
    }

    mapCreateSquare(x, y, width, height,order_offset)
    {
       var h = (this.map[ x            ][ y             ] + 
                this.map[ x            ][(y+height)%this.size] + 
                this.map[(x+width)%this.size][ y             ] + 
                this.map[(x+width)%this.size][(y+height)%this.size]   )/4.0;
                       
       var noise = (Math.random() - 0.5)/(1.0 * order_offset);
    
       this.map[x + width/2][y + height/2] = (h + noise);
    }

    mapCreateRib(x, y, r, order_offset) {
        var height = (this.map[this.makeIndex(x-r)][this.makeIndex(y  )] + 
        this.map[this.makeIndex(x+r)][this.makeIndex(y  )] + 
        this.map[this.makeIndex(x  )][this.makeIndex(y-r)] + 
        this.map[this.makeIndex(x  )][this.makeIndex(y+r)]   )/4.0;
       
        var noise = (Math.random() - 0.5)/(1.4*order_offset);

        this.map[x][y] = (height + noise);
    }

    makeIndex(x)
    {
        return (this.size + x)%this.size;
    }
    
    create_2d_map(size) {
        var map = []

        for (var i = 0; i < size; i++) { 
            map[i] = [];
        }

        return map;
    }

    get_value_at(x, y) {
        return this.map[x][y];
    }
    //get the value on a normed xy scale 
    get_value_at_normed_xy(x, y) {
        x = Math.floor(x * this.size)
        y = Math.floor(y * this.size)
        return this.map[x][y];
    }

}