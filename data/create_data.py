#!/usr/bin/env python3

import math
import numpy as np
import json



def my_circle(R) :
    my_shape = []
    for i in np.arange(0, math.pi, 0.1):
        x = R* math.sin(i)
        y = R* math.cos(i)
        X = (x,y)
        my_shape.append(X)
        # print(str(i) + "  " + str(X))
    return my_shape



my_shapes = []

for R in range(100,200, 20):
    circle_ = my_circle(R)
    my_shapes.append(circle_)
    # print(my_shapes)


with open('data.json', 'w') as f:
    json.dump(my_shapes, f, indent=2)