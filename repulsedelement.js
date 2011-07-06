


(function ($) {
        

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


		
	// capture mouse movement, set to local variable
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

    /*

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

    */
})( jQuery );
