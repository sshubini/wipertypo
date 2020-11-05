const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth
canvas.height = innerHeight

/*Event Listener*/
addEventListener('resize' , resizeHandler)


//helper
function getDist(x1,x2,y1,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
}

function getAngle(x1,y1,x2,y2){
    const width = x1-x2;
    const height = y1-y2;
    const radian = Math.atan2(height,width);
    const angle = 180 - (radian*180/Math.PI)
    return angle.toFixed(0)
}


let centerX = canvas.width/2
let centerY = canvas.height
let radian = 0
let lineAngle=0;
let circleAngle=0;
let rightFlag = false;

// Object
class Ball{
    constructor(x,y,speed,centerRadius) {
        this.x = x;
        this.y = y;
        this.speed=speed;
        this.centerRadius = centerRadius;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2, false)
        ctx.fill();
        ctx.closePath();
    }
    update(){
        circleAngle = getAngle(centerX,centerY,this.x,this.y)
        if(Math.abs(circleAngle-lineAngle)<2){
            this.x = centerX+(Math.cos(-radian)*this.centerRadius);
            this.y = centerY+(Math.sin(-radian)*this.centerRadius);
            if(!rightFlag){
                //this.x += 1;
                //this.y += 1;
            }else{
                //this.x -= 1
                //this.y += 1
            }
        }else{

        }
      
        this.y+=this.speed;
        this.draw()
    }
}


class Line{
    constructor(x,y,speed,height) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.height= height;
    }
    draw(){
        ctx.lineWidth = 10
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x1,this.y1);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }
    update(){
        if(radian<0||radian>Math.PI){
            this.speed = -this.speed;
            rightFlag = !rightFlag
        }
        this.x1 = this.x + (Math.cos(-radian)*this.height);
        this.y1 = this.y + (Math.sin(-radian)*this.height);
        radian+=this.speed
        lineAngle = (radian*180/Math.PI).toFixed(0);
        this.draw()
    }
}

let x,y,speed,centerRadius;
let ballArr=[]
for(let i =0; i<50;i++){
    x = Math.floor(Math.random()*canvas.width)
    y = 0;
    speed = Math.floor(Math.random()*2.5)+0.5
    centerRadius = Math.floor(Math.sqrt(Math.pow(centerX-x,2)+Math.pow(centerY-y,2)))
    const ball = new Ball(x,y,speed,centerRadius)
    ballArr.push(ball)
    console.log(ball)
}

let line = new Line(centerX,centerY,0.01,canvas.width/2)
// animation
function animate() {
        requestAnimationFrame(animate)
        ctx.clearRect(0,0,canvas.width,canvas.height)
        for(let i =0; i<50;i++){
            ballArr[i].update();
        }
        line.update()
}
animate();

// resize
function resizeHandler(e) {
    canvas.width = innerWidth
    canvas.height = innerHeight
    init();
}

function init(){
    centerX = canvas.width/2;
    centerY = canvas.height;
    line = new Line(centerX,centerY,0.01,canvas.width/2)
    ballArr=[];
    for(let i =0; i<50;i++){
        x = Math.floor(Math.random()*canvas.width)
        y = 0;
        speed = Math.floor(Math.random()*2.5)+0.5
        centerRadius = Math.floor(Math.sqrt(Math.pow(centerX-x,2)+Math.pow(centerY-y,2)))
        const ball = new Ball(x,y,speed,centerRadius)
        ballArr.push(ball)
    }
}

