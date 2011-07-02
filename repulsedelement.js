


(function($){
        

    $.fn.repulsedElement = function(){

	var top,left,velocity,mouseX=-1000,mouseY=-10000;
	
	var element = $(this);
	var top = element.offset().top;
	var left = element.offset().left;
	var width = element.width();
	var height = element.height();
	var velocityX = 0;
	var velocityY = 0;
	var mouseX = -1000;
	var mosueY = -1000;
	var windowWidth = $(document).width();
	var windowHeight = $(document).height();
	var previousTime = new Date().getTime();
	var elementBufferDistance = Math.sqrt(Math.pow(width/2,2) + Math.pow(height/2,2));


	element.css("position","absolute");
	element.css("min-width",element.width());

	$("body").mousemove(function(e){

		mouseX = e.pageX;
		mouseY = e.pageY;

	});
	


	// Private Functions
	// Note: new copy every time this is applied to an element
	// Probably could fix this

	function getDistanceVector(){


	    var centerX = left + element.width()/2;
	    var centerY = top + element.height()/2;

	    var x = 0;
	    var y = 0;

	    if(mouseX < left){
		if(mouseX + (windowWidth-(left+width)+width) < left-mouseX){
		    // alert('should put button to the left');
		    //		    centerX = (left + width/2)-width-windowWidth;
		    //alert('new centerXa from ' + centerX + ' at left ' + left);
		    centerX = mouseX-(mouseX+width+(windowWidth-left-width/2));

		    x = mouseX- (centerX+ width/2);

		} else {
		    x = mouseX - left;
		}
	    } else if(mouseX > left + width){

		if((windowWidth-mouseX)+left+width < mouseX-(left+width)){
		    //		    alert('should put button to the right');

		    centerX = mouseX+(left+width/2)+width+(windowWidth-mouseX);
		    //		    alert('new centerXb ' + centerX + ' at left ' + left  );
		    x = mouseX- (centerX- width/2);
		} else {
		    x = mouseX - (left + width);
		}
	    } else {
		x = 0;
	    }

	    if(mouseY < top){
		if(mouseY + (windowHeight-(top+height)+height) < top-mouseY){
		   
		    centerY = mouseY - (mouseY+height+(windowHeight-top-height/2));
		    y=mouseY-(centerY+height/2);
		} else {
		    y=mouseY-top;
		}

	    } else if (mouseY > top + height){
		
		if((windowHeight-mouseY)+top+height < mouseY-(top+height)){
		    centerY = mouseY+(top+height/2)+height+(windowHeight-mouseY);
		    y=mouseY-(centerY-height/2);
		} else {
		    y=mouseY - (top+height);
		}
	    } else {
		y = 0;
	    }

	    // normalize x and y


	    /*
	    if(Math.abs(x) > Math.abs(y)){
		y = y / Math.abs(x);
		x = x / Math.abs(x);

		y = Math.min(y,.000000001);
	    } else if(Math.abs(y) > Math.abs(x)) {
		x = x / Math.abs(y);
		y = y / Math.abs(y);
	    } else if(y == 0){
		x = 0;
		y = 0;
	    };
		
	    
	    if(Math.abs(centerX) > Math.abs(centerY)){
		centerY = centerY / Math.abs(centerX);
		centerX = centerX / Math.abs(centerX);

		centerY = Math.min(centerY,.000000001);
	    } else if(Math.abs(centerY) > Math.abs(centerX)) {
		centerX = centerX / Math.abs(centerY);
		centerY = centerY / Math.abs(centerY);
	    } else if(centerY == 0){
		centerX = 0;
		centerY = 0;
	    };
	    */
	    //$("#jq-whosUsing").html("Position: {" + centerX + "," + centerY + "} <BR>Distance: {" + x + "," + y + "}");
	    return {
		x: (mouseX - centerX),
		    y: (mouseY - centerY),
		    len: Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
		    };
	    



	};


	function getAccelerationVector(distance){

	    var absAcceleration = Math.min(.0005/Math.abs(Math.pow(distance.len,2)),50);

$("#jq-whosUsing").html("len: {" + distance.len +"}");
	    

	    return {x: absAcceleration * distance.x * -1,
		     y: absAcceleration * distance.y * -1
		    };

	};


	function moveElement(){

	    var distance = getDistanceVector();
	    


	    var a = getAccelerationVector(distance);



	    var newTime = new Date().getTime();
	    var timeSlice = newTime - previousTime;
	    previousTime = newTime;

	    //$("#jq-whosUsing").text("Framerate: {" + 1000.0/timeSlice+ "}");



	    velocityX += a.x/timeSlice;
	    velocityY += a.y/timeSlice;


	    velocityX *=.999;
	    velocityY *=.999;


	    
	    if(velocityX > 5){
		velocityX = 5;
	    }
	    if(velocityX < -5){
		velocityX = -5;
	    }
	    if(velocityY > 5){
		velocityY = 5;
	    }
	    if(velocityY < -5){
		velocityY = -5;
	    }

	    //	    velocityX -= .01*velocityX/timeSlice;
	    //velocityY -= .01*velocityY/timeSlice;

	    left+= velocityX/timeSlice;
	    top+= velocityY/timeSlice;

	    if(left > windowWidth){
		left = -width;
	    };
	    if(left < -width){
		left = windowWidth;
	    };

	    if(top>windowHeight){
		top = -height;
	    };

	    if(top<-height){
		top = windowHeight;
	    };

	    element.css("left",left);
	    element.css("top",top);
	    
	    

	};

	function _loop(){

	    moveElement();

	    setTimeout(_loop,4);

	};


	setTimeout(_loop,500);

    };

    $.fn.repulsedElementAdvanced = function(){
	

	$(this).data('coords',{x:0.0,y:0.0,top:0.0,left:0.0});

	var newelements = [];
	var closestElement = 0;

	var currentWindowSize = {width:$(window).width(),height:$(window).height()};

	for(i=0; i<4; i++){
	    newelements.push($(this).clone(true,true).appendTo($(this).parent()));
	}

	$(this).css("position","absolute");
	$(this).css("min-width",$(this).width());
	$(this).css('visibility','hidden');

	newelements[0].css("position","absolute")
			.css("min-width",$(this).width())
			.css('top',$(this).offset().top)
			.css('left',$(this).offset().left)
			.data("coords",{x:$(this).offset().left+$(this).width()/2,y:$(this).offset().top+$(this).height()/2,top:$(this).offset().top,left:$(this).offset().left});

	newelements[1].css("position","absolute")
			.css("min-width",$(this).width())
			.css('top',$(this).offset().top+$(window).height())
			.css('left',$(this).offset().left)
			.data("coords",{x:$(this).offset().left+$(this).width()/2,y:$(this).offset().top+$(window).height()+$(this).height()/2,top:$(this).offset().top+$(window).height(),left:$(this).offset().left});
	
	newelements[2].css("position","absolute")
			.css("min-width",$(this).width())
			.css('top',$(this).offset().top)
			.css('left',$(this).offset().left+$(window).width())
			.data("coords",{x:$(this).offset().left+$(window).width()+$(this).width()/2,y:$(this).offset().top+$(this).height()/2,top:$(this).offset().top,left:$(this).offset().left+$(window).width()});
	
	newelements[3].css("position","absolute")
			.css("min-width",$(this).width())
			.css('top',$(this).offset().top+$(window).height())
			.css('left',$(this).offset().left+$(window).width())
			.data("coords",{x:$(this).offset().left+$(window).width()+$(this).width()/2,y:$(this).offset().top+$(window).height()+$(this).height()/2,top:$(this).offset().top+$(window).height(),left:$(this).offset().left+$(window).width()});


	function _loop(){

		var frc = _force(_calculateDistance());


		for(i=0;i<4;i++){

			newelements[i].data('coords').x += -frc*(mouseCoords.left-newelements[closestElement].data('coords').x);
			newelements[i].data('coords').y += -frc*(mouseCoords.top -newelements[closestElement].data('coords').y);
			newelements[i].data('coords').left += -frc*(mouseCoords.left-newelements[closestElement].data('coords').x);
			newelements[i].data('coords').top += -frc*(mouseCoords.top-newelements[closestElement].data('coords').y);
			
			newelements[i].css("left",newelements[i].data('coords').left);
			newelements[i].css("top",newelements[i].data('coords').top);

			if(newelements[i].data('coords').x > $(window).width() * 1.5){
				newelements[i].data('coords').x -=2.0*$(window).width();
				newelements[i].data('coords').left -=2.0*$(window).width();
			}

			if(newelements[i].data('coords').x < $(window).width() * -.5){
				newelements[i].data('coords').x +=2.0*$(window).width();
				newelements[i].data('coords').left +=2.0*$(window).width();
			}

			
			if(newelements[i].data('coords').y > $(window).height() * 1.5){
				newelements[i].data('coords').y -=2.0*$(window).height();
				newelements[i].data('coords').top -=2.0*$(window).height();
			}

			if(newelements[i].data('coords').y < $(window).height() * -.5){
				newelements[i].data('coords').y +=2.0*$(window).height();
				newelements[i].data('coords').top +=2.0*$(window).height();
			}


		
		}
		setTimeout(_loop,0);
		//$("#log").text("Button: " + newelements[0].data('coords').top + "-" + newelements[0].data('coords').left +  " Mouse: " + mouseCoords.top + "-" + mouseCoords.left + " Distance: " + _calculateDistance() + " Force: " + _force(_calculateDistance()));
 		
	};

	function _calculateDistance(){

		minDistance = 100000;
		for(i = 0; i<4; i++){
			if(minDistance > Math.sqrt(Math.pow(mouseCoords.left-newelements[i].data('coords').x,2)+Math.pow(mouseCoords.top-newelements[i].data('coords').y,2))){
				minDistance = Math.sqrt(Math.pow(mouseCoords.left-newelements[i].data('coords').x,2)+Math.pow(mouseCoords.top-newelements[i].data('coords').y,2));
				closestElement = i;
			}
			
		}

		return minDistance;

		//alert(closestElement);

		
	};

	function _force(distance){
		
		return Math.min(Math.max(2000.0/Math.pow((distance),2.0)-.001,0),5.0);		

	};

	var mouseCoords = {left:$(window).height()*4,top:$(window).width()*4};

	$("body").mousemove(function(e){

		mouseCoords.left = e.pageX;
		mouseCoords.top = e.pageY;

	});
	
	$(window).resize(function(){

		for(i = 0; i<4; i++){
			
			if(newelements[i].data('coords').top > currentWindowSize.height){
				newelements[i].data('coords').top += $(window).height() - currentWindowSize.height;
				newelements[i].data('coords').y += $(window).height() - currentWindowSize.height;
			}

			if(newelements[i].data('coords').left > currentWindowSize.width){
				newelements[i].data('coords').left += $(window).width() - currentWindowSize.width;
				newelements[i].data('coords').x += $(window).width() - currentWindowSize.width;
			}
			
		}

		currentWindowSize = {width:$(window).width(),height:$(window).height()};
		
	
	});

	_loop();

    };
})( jQuery );
