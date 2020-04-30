var canvas;
var ctx;
var shape_array = new Array();
var shape;
var cSize = 10;
var cCount = 300;
var Distancing_factor = 2;
var Mouse_distancing_factor = 50;
var Mouse_effect_radius = 200;
var Tadpoles_effect_radius = 150;
var Peak_velocity = 4;
var Border_distancing_factor = 0.5;
var placeholder;
var mousex = 0;
var mousey = 0;
function gameLoop() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1280, 720);
    for (var i = 0; i < shape_array.length; i++) {
        _a = [0, 0], shape.accx = _a[0], shape.accy = _a[1];
        shape = shape_array[i];
        _b = canvas_gravity(shape, Border_distancing_factor * 10000), shape.accx = _b[0], shape.accy = _b[1];
        for (var j = 0; j < shape_array.length; j++) {
            if (i != j) {
                _c = repulsion(shape_array[j].x, shape_array[j].y, shape.x, shape.y, shape.accx, shape.accy, Distancing_factor * 10000), shape.accx = _c[0], shape.accy = _c[1];
            }
        }
        if (Distance(shape.x, shape.y, mousex, mousey) <= Mouse_effect_radius) {
            _d = repulsion_for_mouse(mousex, mousey, shape.x, shape.y, shape.accx, shape.accy, Mouse_distancing_factor * 10000), shape.accx = _d[0], shape.accy = _d[1];
            shape.color = "red";
        }
        else {
            shape.color = "blue";
        }
        _e = [shape.velx + shape.accx, shape.vely + shape.accy], shape.velx = _e[0], shape.vely = _e[1];
        if (mag(shape.velx, shape.vely) > Peak_velocity) {
            placeholder = mag(shape.velx, shape.vely);
            _f = [shape.velx / placeholder, shape.vely / placeholder], shape.velx = _f[0], shape.vely = _f[1];
            _g = [shape.velx * Peak_velocity, shape.vely * Peak_velocity], shape.velx = _g[0], shape.vely = _g[1];
        }
        _h = [shape.x + shape.velx, shape.y + shape.vely], shape.x = _h[0], shape.y = _h[1];
        shape.draw();
    }
}
window.onload = function () {
    canvas = document.getElementById('cnvs');
    ctx = canvas.getContext("2d");
    var button1 = document.getElementById("1");
    var button2 = document.getElementById("2");
    var button3 = document.getElementById("3");
    var button4 = document.getElementById("4");
    var button5 = document.getElementById("5");
    var button6 = document.getElementById("6");
    var button7 = document.getElementById("7");
    button1.addEventListener("click", function () {
        var cConst = document.getElementById("cCount");
        cCount = +cConst.value;
        shape_array = [];
        CirclePasting();
    }, false);
    button2.addEventListener("click", function () {
        var cConst = document.getElementById("cDistaning_factor");
        Distancing_factor = +cConst.value;
    }, false);
    button3.addEventListener("click", function () {
        var cConst = document.getElementById("cMouse_distancing");
        Mouse_distancing_factor = +cConst.value;
    }, false);
    button4.addEventListener("click", function () {
        var cConst = document.getElementById("cMouse_effect_radius");
        Mouse_effect_radius = +cConst.value;
    }, false);
    button5.addEventListener("click", function () {
        var cConst = document.getElementById("cTadpoles_effect_radius");
        Tadpoles_effect_radius = +cConst.value;
    }, false);
    button6.addEventListener("click", function () {
        var cConst = document.getElementById("cPeak_velocity");
        Peak_velocity = +cConst.value;
    }, false);
    button7.addEventListener("click", function () {
        var cConst = document.getElementById("cBorder_distancing_factor");
        Border_distancing_factor = +cConst.value;
    }, false);
    CirclePasting();
    canvas.addEventListener("mousemove", mouseDown, false);
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
        _a = [target.accx + direction[0], target.accy + direction[1]], target.accx = _a[0], target.accy = _a[1];
    }
    return ([target.accx, target.accy]);
}
function repulsion_for_mouse(targetx, targety, moverx, movery, accx, accy, G) {
    var _a;
    var direction = [targetx - moverx, targety - movery];
    var r = mag(direction[0], direction[1]);
    r = r * r;
    var magnitude = -G / r;
    direction = [direction[0] / r, direction[1] / r];
    direction = [direction[0] * magnitude, direction[1] * magnitude];
    _a = [accx + direction[0], accy + direction[1]], accx = _a[0], accy = _a[1];
    return ([accx, accy]);
}
function repulsion(targetx, targety, moverx, movery, accx, accy, G) {
    var _a;
    if (Distance(targetx, targety, moverx, movery) <= Tadpoles_effect_radius) {
        var direction = [targetx - moverx, targety - movery];
        var r = mag(direction[0], direction[1]);
        r = r * r;
        var magnitude = -G / r;
        direction = [direction[0] / r, direction[1] / r];
        direction = [direction[0] * magnitude, direction[1] * magnitude];
        _a = [accx + direction[0], accy + direction[1]], accx = _a[0], accy = _a[1];
    }
    return ([accx, accy]);
}
function Distance(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}
function mag(u1, u2) {
    return (Math.sqrt(u1 * u1 + u2 * u2));
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
            alert("there is just to much tadpoles sweetheart, turn it down a notch");
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
