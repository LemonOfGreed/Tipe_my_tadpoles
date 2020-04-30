var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var shape_array: Array<iShape> = new Array<iShape>();
var shape: iShape;
var cSize = 10;
var cCount: number = 300;
var Distancing_factor: number = 2;
var Mouse_distancing_factor: number = 50;
var Mouse_effect_radius: number = 200;

var Tadpoles_effect_radius: number = 150;
var Peak_velocity: number = 4;
var Border_distancing_factor: number = 0.5;

var placeholder: number; 

var mousex = 0;
var mousey = 0;



function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,1280,720);
    for ( var i:number = 0; i < shape_array.length; i++) {
        [shape.accx, shape.accy] = [0, 0];
        shape = shape_array[i];
        [shape.accx, shape.accy] = canvas_gravity(shape,Border_distancing_factor*10000);
        for ( var j:number = 0; j < shape_array.length; j++) {
            if (i != j){
                [shape.accx, shape.accy] = repulsion(shape_array[j].x,shape_array[j].y,shape.x, shape.y, shape.accx,shape.accy, Distancing_factor*10000);
            }
        }
        if (Distance(shape.x,shape.y,mousex,mousey) <= Mouse_effect_radius){
            [shape.accx, shape.accy] = repulsion_for_mouse(mousex,mousey,shape.x, shape.y, shape.accx, shape.accy, Mouse_distancing_factor*10000);
            shape.color = "red";
        }
        else{
            shape.color = "blue";
        }
        [shape.velx,shape.vely] = [shape.velx + shape.accx,shape.vely + shape.accy];
        if (mag(shape.velx,shape.vely) > Peak_velocity){
            placeholder = mag(shape.velx,shape.vely);
            [shape.velx,shape.vely] = [shape.velx/placeholder,shape.vely/placeholder];
            [shape.velx,shape.vely] = [shape.velx*Peak_velocity,shape.vely*Peak_velocity];
        }
        [shape.x,shape.y] = [shape.x + shape.velx,shape.y + shape.vely];
        shape.draw();
    }    
}

window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    ctx = canvas.getContext("2d");
    const button1 = document.getElementById("1");
    const button2 = document.getElementById("2");
    const button3 = document.getElementById("3");
    const button4 = document.getElementById("4");
    const button5 = document.getElementById("5");
    const button6 = document.getElementById("6");
    const button7 = document.getElementById("7");
    button1.addEventListener("click",function() {
        const cConst = document.getElementById("cCount")! as HTMLInputElement;
        cCount = +cConst.value;
        shape_array = [];
        CirclePasting();
    },false);
    button2.addEventListener("click",function() {
        const cConst = document.getElementById("cDistaning_factor")! as HTMLInputElement;
        Distancing_factor = +cConst.value;
    },false)
    button3.addEventListener("click",function() {
        const cConst = document.getElementById("cMouse_distancing")! as HTMLInputElement;
        Mouse_distancing_factor = +cConst.value;
    },false)
    button4.addEventListener("click",function() {
        const cConst = document.getElementById("cMouse_effect_radius")! as HTMLInputElement;
        Mouse_effect_radius = +cConst.value;
    },false)
    button5.addEventListener("click",function() {
        const cConst = document.getElementById("cTadpoles_effect_radius")! as HTMLInputElement;
        Tadpoles_effect_radius = +cConst.value;
    },false)
    button6.addEventListener("click",function() {
        const cConst = document.getElementById("cPeak_velocity")! as HTMLInputElement;
        Peak_velocity = +cConst.value;
    },false)
    button7.addEventListener("click",function() {
        const cConst = document.getElementById("cBorder_distancing_factor")! as HTMLInputElement;
        Border_distancing_factor = +cConst.value;
    },false)
    CirclePasting();
    canvas.addEventListener("mousemove",mouseDown,false);
    gameLoop();
}

function mouseDown(event: MouseEvent): void {
     mousex = event.x - canvas.offsetLeft + window.pageXOffset;
     mousey = event.y - canvas.offsetTop + window.pageYOffset;
}


function canvas_gravity(target: iShape, G: number){
    var bordersx: Array<number>;
    var bordersy: Array<number>;
    bordersx = [target.x,target.x,0,canvas.width];
    bordersy = [0,canvas.height, target.y, target.y]
    for (var i = 0; i < 4; i++){
        var direction = repulsion(bordersx[i], bordersy[i], target.x, target.y,target.accx, target.accy,G);
        [target.accx,target.accy] = [target.accx + direction[0],target.accy + direction[1]]
    }
    return([target.accx,target.accy]);
}
function repulsion_for_mouse(targetx: number, targety: number, moverx: number, movery: number, accx: number, accy: number, G: number){
        var direction = [targetx - moverx, targety - movery];
        var r = mag(direction[0],direction[1]);
        r = r*r;
        var magnitude = -G/r;
        direction = [direction[0]/r,direction[1]/r];
        direction = [direction[0]*magnitude,direction[1]*magnitude];
        [accx,accy] = [accx + direction[0],accy + direction[1]];
    return([accx,accy]);
}

function repulsion(targetx: number, targety: number, moverx: number, movery: number, accx: number, accy: number, G: number){ // repulsija
    if (Distance(targetx,targety,moverx,movery) <= Tadpoles_effect_radius){
        var direction = [targetx - moverx, targety - movery];
        var r = mag(direction[0],direction[1]);
        r = r*r;
        var magnitude = -G/r;
        direction = [direction[0]/r,direction[1]/r];
        direction = [direction[0]*magnitude,direction[1]*magnitude];
        [accx,accy] = [accx + direction[0],accy + direction[1]];
    }
    return([accx,accy]);
}

function Distance(x1: number, y1:number, x2:number, y2:number){
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt( a*a + b*b );
}
function mag(u1: number, u2: number){
    return(Math.sqrt(u1*u1+u2*u2));
}
function RandomINC(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function CirclePasting(): void{
    var protection = 0;
    while (shape_array.length < cCount) {
        shape = new cCircle(RandomINC(cSize+1, canvas.width-cSize), RandomINC(cSize+1, canvas.height-cSize), cSize);
        var overlapping = false;
        for (var i = 0; i < shape_array.length; i++){
            var d = Distance(shape.x, shape.y, shape_array[i].x, shape_array[i].y)
            if (d < shape.radius + shape_array[i].radius){
                overlapping = true;
                break;
            }
        }
        protection += 1;
        if (protection > cCount*5){
            alert("there is just to much tadpoles sweetheart, turn it down a notch");
            break;
        }
        if (!overlapping){
            shape.velx = (Math.random() * (1 - (-1)) + (-1));
            shape.vely = (Math.random() * (1 - (-1)) + (-1));
            shape_array.push(shape);
        }
    }
}

interface iShape {
    draw(): void;
    vely: number;
    velx: number;
    accx: number;
    accy: number;
    x: number;
    y: number;
    radius: number;
    color: string;
    lineWidth: number;
}
class cCircle implements iShape {
    public velx: number = 0;
    public vely: number = 0;
    public x: number = 0;
    public y: number = 0;
    public accx: number = 0;
    public accy: number = 0;
    public radius: number = 10;
    public lineWidth: number = 2;
    public color: string = "blue";
    constructor (x:number, y:number, radius: number, velx: number = 0, vely: number = 0,accy: number = 0 , accx: number = 0, color: string = "blue", line_width: number = 2){
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
    public draw = (): void => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore(); 
    }
}