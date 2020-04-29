var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var shape_array: Array<iShape> = new Array<iShape>();
var shape: iShape;
var hole: iShape;
var cSize = 10;
// const foodname = document.getElementById("num1")! as HTMLInputElement;
// var cCount = foodname.value
// let foodName = document.getElementById('cCount');
// let result: Number = parseInt(<string>foodname);
// console.log(+foodname.value);
var cCount = 300;
var accplaceholder: number[];
var mousex = 0;
var mousey = 0;



function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,1000,1000);
    
    for ( var i:number = 0; i < shape_array.length; i++) {
        [shape.accx, shape.accy] = [0, 0];
        shape = shape_array[i];
        [shape.accx, shape.accy] = canvas_gravity(shape,5000);
        for ( var j:number = 0; j < shape_array.length; j++) {
            if (i != j){
                [shape.accx, shape.accy] = repulsion(shape_array[j].x,shape_array[j].y,shape.x, shape.y, shape.accx,shape.accy, 10000);
            }
        }
        if (Distance(shape.x,shape.y,mousex,mousey) <= 200){
            [shape.accx, shape.accy] = repulsion_for_mouse(mousex,mousey,shape.x, shape.y, shape.accx, shape.accy, 500000);
            shape.color = "red";
        }
        else{
            shape.color = "blue";
        }
        [shape.velx,shape.vely] =  add(shape.velx,shape.vely,shape.accx,shape.accy);
        if (mag(shape.velx,shape.vely) > 4){
            [shape.velx,shape.vely] = div(shape.velx,shape.vely,mag(shape.velx,shape.vely));
            [shape.velx,shape.vely] = mul(shape.velx,shape.vely,4);
        }
        [shape.x,shape.y] =  add(shape.x,shape.y,shape.velx*1,shape.vely*1);

        shape.draw();
    }    
}

window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    // var cCount = parseFloat(document.getElementById("cCount"));
    ctx = canvas.getContext("2d");
    canvas.addEventListener("mousemove",mouseDown,false);
    CirclePasting();
    gameLoop();
}

function mouseDown(event: MouseEvent): void {
     mousex = event.x - canvas.offsetLeft + window.pageXOffset;
     mousey = event.y - canvas.offsetTop + window.pageYOffset;
}


function canvas_gravity(target: iShape, G: number){ // cia gravitacija
    var bordersx: Array<number>;
    var bordersy: Array<number>;
    bordersx = [target.x,target.x,0,canvas.width];
    bordersy = [0,canvas.height, target.y, target.y]
    for (var i = 0; i < 4; i++){
        var direction = repulsion(bordersx[i], bordersy[i], target.x, target.y,target.accx, target.accy,G);
        [target.accx,target.accy] = add(target.accx,target.accy,direction[0],direction[1]);
    }
    return([target.accx,target.accy]);
}
function repulsion_for_mouse(targetx: number, targety: number, moverx: number, movery: number, accx: number, accy: number, G: number){ // repulsija
    // if (Distance(targetx,targety,moverx,movery) <= 200){
        var direction = sub(targetx, targety, moverx, movery);
        var r = mag(direction[0],direction[1]);
        r = r*r;
        var magnitude = -G/r;
        direction = div(direction[0],direction[1],r);
        direction = mul(direction[0],direction[1],magnitude);
        [accx,accy] = add(direction[0],direction[1],accx,accy)
    // }
    return([accx,accy]);
}

function repulsion(targetx: number, targety: number, moverx: number, movery: number, accx: number, accy: number, G: number){ // repulsija
    if (Distance(targetx,targety,moverx,movery) <= 150){
        var direction = sub(targetx, targety, moverx, movery);
        var r = mag(direction[0],direction[1]);
        r = r*r;
        var magnitude = -G/r;
        direction = div(direction[0],direction[1],r);
        direction = mul(direction[0],direction[1],magnitude);
        [accx,accy] = add(direction[0],direction[1],accx,accy)
    }
    return([accx,accy]);
}

function add(u1: number, u2: number, v1: number, v2: number){
    return([u1+v1,u2+v2]);
}
function sub(u1: number, u2: number, v1: number, v2: number){
    return([u1-v1,u2-v2]);
}
function Distance(x1: number, y1:number, x2:number, y2:number){
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt( a*a + b*b );
}
function mag(u1: number, u2: number){
    return(Math.sqrt(u1*u1+u2*u2));
}
function div(u1: number, u2: number, n: number ){
    return([u1/n, u2/n]);
}
function mul(u1: number, u2: number, n: number ){
    return([u1*n,u2*n]);
}
function RandomINC(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
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
            console.log("per daug rutuliu, netelpa");
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