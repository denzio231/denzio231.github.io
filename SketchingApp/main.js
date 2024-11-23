const sketch = document.getElementById("Sketch");
const ctx = sketch.getContext("2d");
var down = false;
var prevX = 0;
var prevY = 0;
var funcPoints = [];
function bresenham(x0, y0, x1, y1){
    var dx = x1 - x0;
    var dy = y1 - y0;

    var xsign;
    if(dx>0){
        xsign = 1;
    }
    else{
        xsign = -1;
    }
    if(dy>0){
        ysign = 1;
    }
    else{
        ysign = -1;
    }

    var dx = Math.abs(dx);
    var dy = Math.abs(dy);
    var xx;
    var xy;
    var yx;
    var yy;
    if (dx > dy){
        xx = xsign;
        xy = 0;
        yx = 0;
        yy = ysign;
        xx, xy, yx, yy = xsign, 0, 0, ysign;
    }
    else{
        var buff = dy;
        dy = dx;
        dx = buff;
        xx = 0;
        xy = ysign;
        yx = xsign;
        yy = 0;
    }

    D = 2*dy - dx;
    y = 0;
    var points = []
    for (let x = 0; x < dx+1; x++){
        points.push([x0 + x*xx + y*yx, y0 + x*xy + y*yy]);
        if(D >= 0)
            y += 1;
            D -= 2*dx;
        D += 2*dy;
    }
    return points;
}
sketch.onmousedown = function(e){
    prevX = e.clientX;
    prevY = e.clientY;
    down = true;
    funcPoints = [];
}
sketch.onmouseup = function() {
    down = false;
}
sketch.onmousemove = function(e){
    var offsetX = sketch.offsetLeft;
    var offsetY = sketch.offsetTop;
    if (down){
        var points = bresenham(prevX-offsetX, prevY-offsetY,e.clientX-offsetX, e.clientY-offsetY);
        if(e.clientX>prevX){
            for(let i = 0;i<points.length;i++){
                funcPoints.push(points[i])
            }
        }
        ctx.moveTo(prevX-offsetX, prevY-offsetY);
        ctx.lineTo(e.clientX-offsetX, e.clientY-offsetY);
        ctx.stroke();
        prevX = e.clientX;
        prevY = e.clientY;
    }

}