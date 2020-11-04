const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

/*Event Listener*/
addEventListener('mousemove', mouseMoveHandler)
addEventListener('resize' , resizeHandler)


function mouseMoveHandler(e) {
    mouse.x = e.clientX
    mouse.y = e.clientY
}

//helper
function getDist(x1,x2,y1,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
}

// Object
class Person{
    constructor(x,y,radius,color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update(){

        this.draw()
    }
}



class PersonOne extends Person {
    update(){
        this.x=mouse.x;
        this.y=mouse.y;
        this.draw()
    }
}


let angle = 0
class Line{
    constructor(x,y,speed,height) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.height= height;
    }
    draw(){
        let x1 = this.x + (Math.cos(angle)*this.height);
        let y1 = this.y + (Math.sin(angle)*this.height);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2,canvas.height);
        ctx.lineTo(x1,y1);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath();
    }
    update(){
        if(angle>Math.PI*2 || angle<0){
            this.speed = -this.speed;
        }
        angle+=this.speed
        this.draw()
    }
}




const personOne = new PersonOne(canvas.width/2,canvas.height/2, 10,'#999');
const line = new Line(0,0,1,canvas.height)
line.draw()

// animation
function animate() {
        requestAnimationFrame(animate)
        ctx.clearRect(0,0,canvas.width,canvas.height)
        personOne.update();
        line.update()
}
//animate();

// resize
function resizeHandler(e) {
    canvas.width = innerWidth
    canvas.height = innerHeight
}



