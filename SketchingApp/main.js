const sketch = document.getElementById("Sketch");
const ctx = sketch.getContext("2d");
var down = false;
var prevX = 0;
var prevY = 0;
sketch.width = window.innerWidth
sketch.height = window.innerHeight

sketch.onmousedown = function(e){
    prevX = e.clientX;
    prevY = e.clientY;
    down = true;
}
sketch.onmouseup = function() {
    down = false;
}
sketch.onmousemove = function(e){
    var offsetX = sketch.offsetLeft;
    var offsetY = sketch.offsetTop;
    if (down){
        ctx.moveTo(prevX-offsetX, prevY-offsetY);
        ctx.lineTo(e.clientX-offsetX, e.clientY-offsetY);
        ctx.stroke();
        prevX = e.clientX;
        prevY = e.clientY;
    }

}