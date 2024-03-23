

class MyCaster{

constructor(player,imageDataHeightGray,imageDataColor){

this.canvasCast = document.querySelector(".casting");

this.widthCast = (this.canvasCast.width = player.ray.length);
this.heightCast = (this.canvasCast.height = 320);

this.ctxCast = this.canvasCast.getContext("2d");
this.player = player;
this.imageDataHeightGray = imageDataHeightGray;
this.imageDataColor = imageDataColor;
		this.ctxCast.scale(1,1);
}

draw(){
	this.erase();
	this.castHeights();
}

erase(){
  this.ctxCast.clearRect(0, 0, this.canvasCast.width, this.canvasCast.height);
}

castHeights(){
	
	let cX = player.ray[0].x1;
	let cY = player.ray[0].y1;
	var drawData = new Uint8ClampedArray(1024*1024*4);

	
	//For every ray
	for(let i=0;i<player.ray.length;i++){
		
		let maxHeight = this.canvasCast.height;
		
		//For every pixel of the ray
		for(let z=1;z<player.dist;z++){
			
			let pX = cX + z * Math.cos(radians(player.ray[i].angle));
			let pY = cY + z * Math.sin(radians(player.ray[i].angle));
			
			if(pY>1024 || pX>1024){
				
			}else{
			let mapOffset = (1024*parseInt(pY)) + parseInt(pX);
			
			let currentHeight = parseInt((this.player.heightCast- this.imageDataHeightGray[mapOffset])/z*100+this.player.pitch);
			
			if(currentHeight<0)	currentHeight=0;
			if(currentHeight>this.canvasCast.height) currentHeight=this.canvasCast.height;
				
			//If we reach a maximum height
			if(currentHeight<maxHeight){
				
				//Lets draw the previous maxHeight top pixels on screen
				//maxheight still not updated remember
				
				for(let y=currentHeight;y<maxHeight;y++){
				//X in array is i
				//Y in array is y times mapSize so
				drawData[ y*1024*4+i*4 ] = imageDataColor[mapOffset*4];
				drawData[ y*1024*4+i*4+1 ] = imageDataColor[mapOffset*4+1];
				drawData[ y*1024*4+i*4+2 ] = imageDataColor[mapOffset*4+2];
				drawData[ y*1024*4+i*4+3 ] = 255;
				}
				
				maxHeight=currentHeight;
				
			}
			}
		
			
		}
		
		
	}
		let tmp = this.ctxCast.getImageData(0,0,1024,1024);
		tmp.data.set(drawData);
		this.ctxCast.putImageData(tmp,0,0);
}
	

distance(x1,y1,x2,y2){
	return Math.abs(Math.sqrt( ((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1))));
}

}

