const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth
canvas.height = innerHeight

/*Event Listener*/
addEventListener('resize' , resizeHandler)


//helper
    function getDist(x1,y1,x2,y2){
        return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
    }

    function getAngle(x1,y1,x2,y2){
        const width = x1-x2;
        const height =y1-y2;
        const radian = Math.atan2(height,width);
        const angle = 180 - (radian*180/Math.PI)
        return angle.toFixed(0)
    }

    function rotate(velocity, angle) {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };

        return rotatedVelocities;
    }

    function resolveCollision(particle, otherParticle) {
        const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
        const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;

        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding particles
            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

            // Store mass in var for better readability in collision equation
            const m1 = particle.mass;
            const m2 = otherParticle.mass;

            // Velocity before equation
            const u1 = rotate(particle.velocity, angle);
            const u2 = rotate(otherParticle.velocity, angle);

            // Velocity after 1d collision equation
            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

            // Final velocity after rotating axis back to original location
            const vFinal1 = rotate(v1, -angle);
            const vFinal2 = rotate(v2, -angle);

            // Swap particle velocities for realistic bounce effect
            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;

            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
        }
    }



let centerX = canvas.width/2
let centerY = canvas.height
let radian = 0
let lineAngle=0;
let circleAngle=0;
let rightFlag = false;

// Object
class Ball{
    constructor(x,y,speed,centerRadius,text) {
        this.x = x;
        this.y = y;
        this.speed=speed;
        this.centerRadius = centerRadius;

        this.text = text;
        this.mass =1;
        this.velocity = {
            x: Math.random()-0.5,
            y: Math.random()-0.5
        }
    }

    draw(){
        ctx.lineWidth = 1
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2, false);
        ctx.strokeStyle = '#f9f9f9';
        ctx.stroke();
        ctx.fillStyle = '#e9e9e9';
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.font = "small-caps bold 32px arial";
        ctx.fillText(this.text,this.x,this.y);
        ctx.closePath();
    }
    update(ballArr){
        circleAngle = getAngle(centerX,centerY,this.x,this.y)
        this.centerRadius = getDist(this.x,this.y,centerX,centerY)

        if(Math.abs(circleAngle-lineAngle)<2 && this.centerRadius < canvas.height){
            if(this.y>canvas.height-50){
                this.y += this.speed;

            }else{
                this.x = centerX+(Math.cos(-radian)*this.centerRadius);
                this.y = centerY+(Math.sin(-radian)*this.centerRadius);
            }
        }else{
            this.y+=this.speed;
            if(this.y>canvas.height+15){
                this.x = Math.floor(Math.random()*canvas.width);
                this.y = Math.floor(Math.random()*-canvas.height);
            }
        }

        for (let i=0;i<ballArr.length;i++){
            if(getDist(this.x,this.y,ballArr[i].x,ballArr[i].y)-30<0){
                resolveCollision(this,ballArr[i])
            }
        }

        this.x +=this.velocity.x;
        this.y +=this.velocity.y;
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
        rightFlag?
            ctx.moveTo(this.x-20,this.y):
            ctx.moveTo(this.x+20,this.y);
        ctx.lineTo(this.x1,this.y1);
        ctx.strokeStyle = '#999';
        ctx.stroke();
        ctx.closePath();
    }
    update(){
        if(radian<0||radian>Math.PI){
            this.speed = -this.speed;
            rightFlag = !rightFlag
        }
        rightFlag?
            this.x1 = this.x-20 + (Math.cos(-radian)*this.height):
            this.x1 = this.x+20 + (Math.cos(-radian)*this.height)
        this.y1 = this.y + (Math.sin(-radian)*this.height);
        radian+=this.speed
        lineAngle = (radian*180/Math.PI).toFixed(0);
        this.draw()
    }
}

let x,y,speed,centerRadius,text;
let ballArr=[]
const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
for(let i =0; i<100;i++){
    x = Math.floor(Math.random()*canvas.width)
    y = Math.floor(Math.random()*-canvas.height);
    speed = 1//Math.round(Math.random()*2.5)+0.2
    centerRadius = 0;
    text=alphabet[Math.floor(Math.random()*alphabet.length)];
    if(i!==0){
        for (let j=0;j<ballArr.length;j++){
            if(getDist(x,y,ballArr[j].x,ballArr[j].y)-30<0){
                x = Math.floor(Math.random()*canvas.width);
                y = Math.floor(Math.random()*-canvas.height);
                j=-1
            }
        }
    }
    const ball = new Ball(x,y,speed,centerRadius,text)
    ballArr.push(ball)
}

let line = new Line(centerX,centerY,0.01,canvas.width/2)
// animation
function animate() {
        requestAnimationFrame(animate)
        ctx.clearRect(0,0,canvas.width,canvas.height)
        for(let i =0; i<100;i++){
            ballArr[i].update(ballArr);
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
        centerRadius = Math.floor(Math.sqrt(Math.pow(x-centerX,2)+Math.pow(y-centerY,2)))
        const ball = new Ball(x,y,speed,centerRadius)
        ballArr.push(ball)
    }
}

