
function radians(val){
        return ((Math.PI / 180) * val);
 }
class Player{
	
	constructor(xpos,ypos,size){
		this.xpos = xpos;
		this.ypos = ypos;
		this.size = size;
		this.dist = 800;
		this.angle=270; //No need to rotate the 2d cube (Too much work)
		this.heightCast=400;
		this.pitch = 100;
		this.ray = [];
		this.keys = {
			up: 0,
			down:0,
			left:0,
			right:0,
			shift:0,
			space:0
		};
	}
	
	initRays(){
		
		let cX = this.xpos+this.size/2;
		let cY = this.ypos+this.size/2;
		let tam = 130;
		let division = 2;
		let anguloM = this.angle - tam/(division*2);
		for(let i=0;i<tam;i++){	
		
		this.ray[i]={
			x1:cX,
			y1:cY,
			x2:cX+this.dist*Math.cos(radians( (anguloM+(i/division)))),
			y2:cY+this.dist*Math.sin(radians( (anguloM+(i/division)))),
			angle:anguloM+i/division,
		};
				
		if(anguloM+(i/division)>360)this.ray[i].angle-=360;	
		else if(anguloM+(i/division)<0)	this.ray[i].angle+=360;				
		
		}
		
		}
	
	
	draw(){
        ctx.strokeStyle = 'white';            
		ctx.beginPath();
		
        for(let i=0;i<this.ray.length;i++){
		ctx.moveTo(this.ray[i].x1,this.ray[i].y1);
		ctx.lineTo(this.ray[i].x2,this.ray[i].y2);
		}
		
		ctx.stroke();
		ctx.closePath();
		
		
		ctx.fillStyle = "green";
		ctx.fillRect(this.xpos,this.ypos,this.size,this.size);  
	}
	

};


var FRAME = 1000 / 60 ;

const canvas = document.querySelector(".tela");
const width = (canvas.width = 1024);
const height = (canvas.height =1024);
const ctx = canvas.getContext("2d");

const selector = document.querySelector(".flex");

const fullScreen = document.querySelector(".material-icons");


selector.onclick = () =>{
		document.body.requestPointerLock();
}
fullScreen.onclick = () =>{
	selector.requestFullscreen();
}

var player = new Player(500,1000,5);
player.initRays();

window.addEventListener("keyup", (e) => myKeyEventsRelease(e));
window.addEventListener("keydown", (e) => myKeyEvents(e));  
window.addEventListener("mousemove", (e) => myMouseEvents(e)); 


function myMouseEvents(event){
		let pitchMove = event.movementY/10;
		player.pitch -= pitchMove;
        if(player.pitch<-100)player.pitch=-100;
		else if(player.pitch>300)player.pitch = 300;
		
		player.angle+=(event.movementX/40);
        if(player.angle<0)player.angle=player.angle+360;
		else if(player.angle>360)player.angle=player.angle-360;
		
	}

function myKeyEventsRelease(event){
	    if(event.code=="KeyD"){
			player.keys.right= 0;
        }
        if(event.code=="KeyA"){
            player.keys.left= 0;
		}
		
        if(event.code=="ShiftLeft"){
            player.keys.shift= 0;
		}
        if(event.code=="Space"){
            player.keys.space= 0;
		}
		
        if(event.code=="KeyW"){
            player.keys.up = 0;			
		}
        if(event.code=="KeyS"){
            player.keys.down = 0;
		}
    
}
function myKeyEvents(event){
	
        if(event.code=="KeyD"){
			player.keys.right= 1;
        }
        if(event.code=="KeyA"){
            player.keys.left= 1;
        }		
        if(event.code=="ShiftLeft"){
            player.keys.shift= 1;
		}
		
        if(event.code=="Space"){
            player.keys.space= 1;
		}
        if(event.code=="KeyW"){
            player.keys.up = 1;
				
		}
        if(event.code=="KeyS"){
            player.keys.down = 1;
		}
            
}

function checkKeys(){
	
	if(player.keys.up==1){
		player.xpos+= 1*Math.cos(radians(player.angle));
		player.ypos+= 1*Math.sin(radians(player.angle));
	}
	
	if(player.keys.down==1){
		player.xpos-= 1*Math.cos(radians(player.angle));
		player.ypos-= 1*Math.sin(radians(player.angle));
	}
	
	
	if(player.keys.shift==1){
		player.heightCast--;
	}
	if(player.keys.space==1){
		player.heightCast++;
	}
}


var imageDataHeight;
var imageDataHeightGray=[];
var imageDataColor;

var caster;


const imgHeight = new Image(1024,1024);
const imgColor = new Image(1024,1024);
imgHeight.onload = start;
imgHeight.crossOrigin = "";
imgHeight.src = "height.gif";


function start(){
erase();
ctx.drawImage(imgHeight, 0, 0);
imageDataHeight = ctx.getImageData(0,0,1024,1024).data;
convertGray();
erase();
imgColor.onload = start2;
imgColor.crossOrigin = "";	
imgColor.src = "color.gif";
}


function start2(){
erase();
ctx.drawImage(imgColor, 0, 0);
imageDataColor = ctx.getImageData(0,0,1024,1024).data;
caster = new MyCaster(player,imageDataHeightGray,imageDataColor);



function loop(){
  erase();  
  ctx.drawImage(imgColor, 0, 0);
  checkKeys();
  player.initRays();
  player.draw(); 
  caster.draw();
 
  window.requestAnimationFrame(loop);

}

window.requestAnimationFrame(loop);


}

function erase(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function rotationMath(point, centro,vel) {
        let x = centro.x + (point.x - centro.x) * Math.cos(radians(vel)) - (point.y - centro.y) * Math.sin(radians(vel));
        let y = centro.y + (point.x - centro.x) * Math.sin(radians(vel)) + (point.y - centro.y) * Math.cos(radians(vel));
        return { x, y };
}

function distance(x1,y1,x2,y2){
	return Math.abs(Math.sqrt( ((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1))));
}

function convertGray(){
	let j=0;
	let rI,gI,bI,gray;

	for(let i=0;i<imageDataHeight.length;i+=4){
		rI = imageDataHeight[i] *  0.2126;
		gI = imageDataHeight[i+1] * 0.715;
		bI = imageDataHeight[i+2] * 0.0722;
		//Skip i+3 cause is alpha
		gray = rI + gI + bI;
		imageDataHeightGray[j]=gray;
		j++;
	}
}