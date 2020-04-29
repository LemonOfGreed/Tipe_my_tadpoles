var canvas;
var ctx;
var shape_array = new Array();
var shape;
var hole;
var cSize = 10;
// const foodname = document.getElementById("num1")! as HTMLInputElement;
// var cCount = foodname.value
// let foodName = document.getElementById('cCount');
// let result: Number = parseInt(<string>foodname);
// console.log(+foodname.value);
var cCount = 300;
var accplaceholder;
var mousex = 0;
var mousey = 0;
function gameLoop() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1000, 1000);
    for (var i = 0; i < shape_array.length; i++) {
        _a = [0, 0], shape.accx = _a[0], shape.accy = _a[1];
        shape = shape_array[i];
        _b = canvas_gravity(shape, 5000), shape.accx = _b[0], shape.accy = _b[1];
        for (var j = 0; j < shape_array.length; j++) {
            if (i != j) {
                _c = repulsion(shape_array[j].x, shape_array[j].y, shape.x, shape.y, shape.accx, shape.accy, 10000), shape.accx = _c[0], shape.accy = _c[1];
            }
        }
        if (Distance(shape.x, shape.y, mousex, mousey) <= 200) {
            _d = repulsion_for_mouse(mousex, mousey, shape.x, shape.y, shape.accx, shape.accy, 500000), shape.accx = _d[0], shape.accy = _d[1];
            shape.color = "red";
        }
        else {
            shape.color = "blue";
        }
        _e = add(shape.velx, shape.vely, shape.accx, shape.accy), shape.velx = _e[0], shape.vely = _e[1];
        if (mag(shape.velx, shape.vely) > 4) {
            _f = div(shape.velx, shape.vely, mag(shape.velx, shape.vely)), shape.velx = _f[0], shape.vely = _f[1];
            _g = mul(shape.velx, shape.vely, 4), shape.velx = _g[0], shape.vely = _g[1];
        }
        _h = add(shape.x, shape.y, shape.velx * 1, shape.vely * 1), shape.x = _h[0], shape.y = _h[1];
        shape.draw();
    }
}
window.onload = function () {
    canvas = document.getElementById('cnvs');
    // var cCount = parseFloat(document.getElementById("cCount"));
    ctx = canvas.getContext("2d");
    canvas.addEventListener("mousemove", mouseDown, false);
    CirclePasting();
    gameLoop();
};
function mouseDown(event) {
    mousex = event.x - canvas.offsetLeft + window.pageXOffset;
    mousey = event.y - canvas.offsetTop + window.pageYOffset;
}
function canvas_gravity(target, G) {
    var _a;
    var bordersx;
    var bordersy;
    bordersx = [target.x, target.x, 0, canvas.width];
    bordersy = [0, canvas.height, target.y, target.y];
    for (var i = 0; i < 4; i++) {
        var direction = repulsion(bordersx[i], bordersy[i], target.x, target.y, target.accx, target.accy, G);
        _a = add(target.accx, target.accy, direction[0], direction[1]), target.accx = _a[0], target.accy = _a[1];
    }
    return ([target.accx, target.accy]);
}
function repulsion_for_mouse(targetx, targety, moverx, movery, accx, accy, G) {
    var _a;
    // if (Distance(targetx,targety,moverx,movery) <= 200){
    var direction = sub(targetx, targety, moverx, movery);
    var r = mag(direction[0], direction[1]);
    r = r * r;
    var magnitude = -G / r;
    direction = div(direction[0], direction[1], r);
    direction = mul(direction[0], direction[1], magnitude);
    _a = add(direction[0], direction[1], accx, accy), accx = _a[0], accy = _a[1];
    // }
    return ([accx, accy]);
}
function repulsion(targetx, targety, moverx, movery, accx, accy, G) {
    var _a;
    if (Distance(targetx, targety, moverx, movery) <= 150) {
        var direction = sub(targetx, targety, moverx, movery);
        var r = mag(direction[0], direction[1]);
        r = r * r;
        var magnitude = -G / r;
        direction = div(direction[0], direction[1], r);
        direction = mul(direction[0], direction[1], magnitude);
        _a = add(direction[0], direction[1], accx, accy), accx = _a[0], accy = _a[1];
    }
    return ([accx, accy]);
}
function add(u1, u2, v1, v2) {
    return ([u1 + v1, u2 + v2]);
}
function sub(u1, u2, v1, v2) {
    return ([u1 - v1, u2 - v2]);
}
function Distance(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}
function mag(u1, u2) {
    return (Math.sqrt(u1 * u1 + u2 * u2));
}
function div(u1, u2, n) {
    return ([u1 / n, u2 / n]);
}
function mul(u1, u2, n) {
    return ([u1 * n, u2 * n]);
}
function RandomINC(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
function CirclePasting() {
    var protection = 0;
    while (shape_array.length < cCount) {
        shape = new cCircle(RandomINC(cSize + 1, canvas.width - cSize), RandomINC(cSize + 1, canvas.height - cSize), cSize);
        var overlapping = false;
        for (var i = 0; i < shape_array.length; i++) {
            var d = Distance(shape.x, shape.y, shape_array[i].x, shape_array[i].y);
            if (d < shape.radius + shape_array[i].radius) {
                overlapping = true;
                break;
            }
        }
        protection += 1;
        if (protection > cCount * 5) {
            console.log("per daug rutuliu, netelpa");
            break;
        }
        if (!overlapping) {
            shape.velx = (Math.random() * (1 - (-1)) + (-1));
            shape.vely = (Math.random() * (1 - (-1)) + (-1));
            shape_array.push(shape);
        }
    }
}
var cCircle = /** @class */ (function () {
    function cCircle(x, y, radius, velx, vely, accy, accx, color, line_width) {
        var _this = this;
        if (velx === void 0) { velx = 0; }
        if (vely === void 0) { vely = 0; }
        if (accy === void 0) { accy = 0; }
        if (accx === void 0) { accx = 0; }
        if (color === void 0) { color = "blue"; }
        if (line_width === void 0) { line_width = 2; }
        this.velx = 0;
        this.vely = 0;
        this.x = 0;
        this.y = 0;
        this.accx = 0;
        this.accy = 0;
        this.radius = 10;
        this.lineWidth = 2;
        this.color = "blue";
        this.draw = function () {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = _this.color;
            ctx.lineWidth = _this.lineWidth;
            ctx.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
        };
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velx = velx;
        this.vely = vely;
        this.accx = accx;
        this.accy = accy;
        this.color = color;
        this.lineWidth = line_width;
    }
    return cCircle;
}());
