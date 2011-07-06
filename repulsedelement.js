/*
  Usage example for a single element: $("#button").repulsedElement();

  or for multiple elements:

  $(".classname").each(function(){
     $(this).repulsedElement();
     });

 */


(function($) {
        
    $.fn.repulsedElement = function(){
	
	var element = $(this),
	    top = element.offset().top,
	    left = element.offset().left,
	    width = element.width(),
	    height = element.height(),
	    velocityX = 0,
	    velocityY = 0,
	    mouseX = 10000,
	    mouseY = 10000,
	    windowWidth = $(document).width(),
	    windowHeight = $(document).height(),
	    previousTime = new Date().getTime();

	// Set to absolute positioning
	// Set a min-width to prevent from wrapping near edges (not the cleanest of solutions but appears to work)
	// Set a z-index to 1 more than the existing maximum z-index (could be tested more)

	element.css("position","absolute");
	element.css("min-width",element.width());

	element.css('z-index',1+Math.max(0,Math.max.apply(null,$.map($('body > *'),function(e,n){
			    if($(e).css('position')=='absolute')
				return parseInt($(e).css('z-index'))||1;
			})
		    )
		)
	    );
		
	// capture mouse movement
	$("body").mousemove(function(e){
		mouseX = e.pageX;
		mouseY = e.pageY;
	    });
       
	// capture resize event
	$(window).resize(function(){
		windowWidth = $(document).width();
		windowHeight = $(document).height();
	    });
		   
 
	// getDistanceVector
	// returns a normalized vector representing direction to center of element, and the distance to that point
	function getDistanceVector(){ 

	    // centerX/Y = virtual location of the center, depending on mouse position (since the button "wraps" around the side)
	    // distanceX/Y = distance to the closest point of the element (since the element has a non-zero area)
	    // normalizedVectorX/Y = direction to center of the element from the mouse


	    var centerX = left + element.width()/2,
	        centerY = top + element.height()/2,
		distanceX = 0,
		distanceY = 0,
		nomalizedVectorX = 0,
		normalizedVectorY = 0;

	    // determine location and direction based on where the mouse is WRT the element
	    // easiest to just do on a case-by-case basis
	    // there could be a more elegant solution

	    if(mouseX < left){
		if(mouseX + (windowWidth-(left+width)+width) < left-mouseX){

		    centerX = mouseX-(mouseX+width+(windowWidth-left-width/2));
		    distanceX = mouseX- (centerX+ width/2);

		} else {
		    distanceX = mouseX - left;
		}
	    } else if(mouseX > left + width){

		if((windowWidth-mouseX)+left+width < mouseX-(left+width)){
		    centerX = mouseX+(left+width/2)+width+(windowWidth-mouseX);
		    distanceX = mouseX- (centerX- width/2);
		} else {
		    distanceX = mouseX - (left + width);
		}
	    } else {
		distanceX = 0;
	    };

	    if(mouseY < top){
		if(mouseY + (windowHeight-(top+height)+height) < top-mouseY){
		   
		    centerY = mouseY - (mouseY+height+(windowHeight-top-height/2));
		    distanceY=mouseY-(centerY+height/2);
		} else {
		    distanceY=mouseY-top;
		}

	    } else if (mouseY > top + height){
		
		if((windowHeight-mouseY)+top+height < mouseY-(top+height)){
		    centerY = mouseY+(top+height/2)+height+(windowHeight-mouseY);
		    distanceY=mouseY-(centerY-height/2);
		} else {
		    distanceY=mouseY - (top+height);
		}
	    } else {
		distanceY = 0;
	    };

	    // Figure out the normalized direction to the element

	    normalizedVectorX = mouseX - centerX;
	    normalizedVectorY = mouseY - centerY;

	    if(Math.abs(normalizedVectorX) > Math.abs(normalizedVectorY)){
		normalizedVectorY = normalizedVectorY / Math.abs(normalizedVectorX);
		normalizedVectorX = normalizedVectorX / Math.abs(normalizedVectorX);

	    } else if(Math.abs(normalizedVectorY) > Math.abs(normalizedVectorX)) {
		normalizedVectorX = normalizedVectorX / Math.abs(normalizedVectorY);
		normalizedVectorY = normalizedVectorY / Math.abs(normalizedVectorY);
	    } else if(normalizedVecotrY == 0){
		normalizedVectorX = 0;
		normalizedVectorY = 0;
	    };
	    
	    // return direction, distance

	    return {
		x: normalizedVectorX,
		    y: normalizedVectorY,
		    len: Math.sqrt(Math.pow(distanceX,2)+Math.pow(distanceY,2))
		    };
	    



	};


	// getAccelerationVector
	// returns a veotor representing the acceleration to apply to the element based on relative distance/location of mouse
	function getAccelerationVector(distance){

	    // acceleration = Constant/distance^2
	    // constant was determined based on some manual tweaking
	    // set max acceleration = 50 pixels / milliseconds^2
	    
	    var absAcceleration = Math.min(3/Math.abs(Math.pow(distance.len,2)),50);

	    return {x: absAcceleration * distance.x * -1,
		     y: absAcceleration * distance.y * -1
		    };

	};

	// moveElement
	// figures out distance, acceleration, velocity, and moves the element
	// could probably be refactored to be a little cleaner
	function moveElement(){

	    var distance = getDistanceVector(),
		a = getAccelerationVector(distance),
		newTime = new Date().getTime(),
		timeSlice = newTime - previousTime;

	    previousTime = newTime;

	    // add acceleration to current velocity

	    velocityX += a.x*timeSlice;
	    velocityY += a.y*timeSlice;

	    // slow velocity down a little (sorta like drag)
	    // "half-life" of the velocity is 500ms
	    velocityX *= (1-timeSlice/500.0);
	    velocityY *= (1-timeSlice/500.0);

	    // set some bounds on the velocity
	    // no more than .5 pixels per millisecond (500 pixels per second)
	    // TODO: must be a more elegant way of doing this...
	    if(velocityX > 0.5){
		velocityX = 0.5;
	    }
	    if(velocityX < -0.5){
		velocityX = -0.5;
	    }
	    if(velocityY > 0.5){
		velocityY = 0.5;
	    }
	    if(velocityY < -0.5){
		velocityY = -0.5;
	    }
	    

	    // figure out new top/left position of the element
	    left+= velocityX*timeSlice;
	    top+= velocityY*timeSlice;

	    // wrap around
	    // TODO: must be a more elegant way of doing this...
	    if(left > windowWidth){
		left = -width;
	    }
	    if(left < -width){
		left = windowWidth;
	    }
	    if(top>windowHeight){
		top = -height;
	    }
	    if(top<-height){
		top = windowHeight;
	    }

	    // apply local variable to actual element
	    element.css("left",left);
	    element.css("top",top);
	    
	    

	};

	// loop
	// could perhaps do this a smarter way in jQuery
	// haven't had time to experiment yet
	function loop(){

	    
	    moveElement();

	    setTimeout(loop,5);

	};

	// invoke the main loop

	loop();

    };

})( jQuery );
