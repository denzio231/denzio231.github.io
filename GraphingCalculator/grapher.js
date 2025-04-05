var c = document.getElementById("graph");
var mathInputContainer = document.getElementById("mathInputContainer");
var ctx = c.getContext("2d");
var expression = '';
var scale = 1;
var temp_scale=1;
var offsetX = 0;
var offsetY = 0;
var tX = 0;
var tY = 0;
var last_e;
var ts = 0;
var holding = false;
var funcDict = new Map();
function renderAxes(){
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = `rgb(0,0,0)`
    originX = c.width/2+offsetX;
    originY = c.height/2+offsetY;
    ctx.beginPath();
    ctx.moveTo(originX,0);
    ctx.lineTo(originX,c.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,originY);
    ctx.lineTo(c.width,originY);
    ctx.stroke();
}
function floorToNearest(n,x){
    return Math.floor(n/x)*x;
}
function ceilToNearest(n,x){
    return Math.ceil(n/x)*x;
}
function renderGrid(){
    ctx.font = "24px serif";
    var gap = ceilToNearest(100/scale,1);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgb(82, 82, 82)`
    originX = c.width/2+offsetX;
    originY = c.height/2+offsetY;
    for(let x = floorToNearest(translateX(0),gap);x<=floorToNearest(translateX(c.width),gap);x+=gap){
        ctx.beginPath();
        ctx.moveTo(x*scale+originX,0);
        ctx.lineTo(x*scale+originX,c.height);
        ctx.fillStyle = "black";
        ctx.fillText(x, x*scale+originX, originY-10);
        ctx.stroke();
    }
    for(let y = floorToNearest(translateY(c.height),gap);y<=floorToNearest(translateY(0),gap);y+=gap){
        ctx.beginPath();
        ctx.moveTo(0,originY-y*scale);
        ctx.lineTo(c.width,originY-y*scale);
        if(y!=0){
            ctx.fillStyle = "black";
            ctx.fillText(y, originX, originY-y*scale);
        }
        ctx.stroke();
    }
}
function renderFunction(){
    originX = c.width/2+offsetX;
    originY = c.height/2+offsetY;
    var cloneDict = new Map(funcDict);
    let roots = [];
    let intercepts = [];
    for (const [key, func] of funcDict.entries()) {
        cloneDict.delete(key);
        ctx.beginPath();
        ctx.strokeStyle = `rgb(255,0,0)`
        var initialY = func.evaluate({x:-originX/scale});
        var sign = Math.sign(initialY);
        ctx.moveTo(0,originY-initialY*scale);
        if(sign == 0){
            roots.push(-originX/scale);
        }
        let lastX = -originX/scale;
        let lastY = initialY;
        ctx.lineWidth = 3;
        for (let x=1;x<=c.width;x++){
            funcX = x-originX;
            var fX = funcX/scale;
            funcY = func.evaluate({x:fX});
            for (const [k, cloneFunc] of cloneDict.entries()) {
                nextY = func.evaluate({x:(funcX+1)/scale});
                cloneY = cloneFunc.evaluate({x:(fX)});
                cloneNextY = cloneFunc.evaluate({x:(funcX+1)/scale});
                let a = (cloneNextY>nextY);
                let b = (cloneY>funcY);
                if(a!=b){
                    let dx = 1/scale;
                    let m1 = (nextY-funcY)/dx;
                    let m2 = (cloneNextY-cloneY)/dx;
                    let intercept = (-m2*fX+cloneY+m1*fX-funcY)/(m1-m2);
                    let interceptY = m1*(intercept-fX)+funcY;
                    intercepts.push([intercept,interceptY]);
                }
            }
            if(sign!=Math.sign(funcY)){
                if(sign==0){
                    roots.push(fX);
                }
                else{
                    let intercept = -lastY*((lastX-fX)/(lastY-funcY))+lastX;
                    roots.push(intercept);
                }
            }
            lastX = fX;
            lastY = funcY;
            sign = Math.sign(funcY);
            ctx.lineTo(x,originY-funcY*(scale));
        }
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black"
    }
    for(let i = 0;i<roots.length;i++){
        ctx.beginPath();
        ctx.arc(roots[i]*scale+originX, originY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
    }
    for(let i = 0;i<intercepts.length;i++){
        ctx.beginPath();
        ctx.arc(intercepts[i][0]*scale+originX, originY-intercepts[i][1]*scale, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.stroke();
    }
}
function translateX(x){
    originX = c.width/2+offsetX;
    return (x-originX)/scale;
}
function translateY(y){
    originY = c.height/2+offsetY;
    return (originY-y)/scale;
}
function adjustOffset(zoomEvent){
    originX = c.width/2+offsetX;
    originY = c.height/2+offsetY;
    if(zoomEvent){
        mouseX = translateX(zoomEvent.x);
        mouseY = translateY(zoomEvent.y);
        newOriginX = zoomEvent.x-temp_scale*mouseX;
        newOriginY = zoomEvent.y+temp_scale*mouseY;
        offsetX = newOriginX-c.width/2;
        offsetY = newOriginY-c.height/2;
        scale = temp_scale;
    }
}
function render(zoomEvent){
    ctx.clearRect(0, 0, c.width, c.height);
    adjustOffset(zoomEvent)
    renderAxes();
    renderGrid();
    try{
        renderFunction();
    }
    catch(SyntaxError){}
}

function resizeCanvas(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    render();
}
window.addEventListener("resize", resizeCanvas);
c.addEventListener('mousedown', function(e) {
    last_e=e;
    tX = offsetX;
    tY = offsetY;
    holding = true;
})
c.addEventListener('mouseup', function(e) {
    holding = false;
})
c.addEventListener('mousemove', function(e) {
    if(holding){
        ctx.clearRect(0, 0, c.width, c.height);
        offsetX = tX+e.x-last_e.x;
        offsetY = tY+e.y-last_e.y;
        render(e);
    }
})
c.addEventListener("wheel",function(e){
    temp_scale = scale*((1.0005)**(-e.deltaY));
    render(e);
})
function inputBoxWrapper(box){
    return function(){
        expression = box.value;
        try{
            let func = math.compile(expression);
            funcDict.set(box,func);
        }
        catch(SyntaxError){
            funcDict.set(box,null);
            return;
        }
        render();
    }
}
function createMathInput(){
    var inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.className = "mathInput";
    mathInputContainer.appendChild(inputBox);
    inputBox.onkeydown =  function(e){
        if(e.code == 'Enter'){
            createMathInput();
        }
    }
    inputBox.addEventListener("input",inputBoxWrapper(inputBox));
    inputBox.focus();
}
createMathInput();
resizeCanvas();