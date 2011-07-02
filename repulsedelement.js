


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
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var previousTime = new Date().getTime();


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
		if(mouseX + (windowWidth-(left+width)) < left-mouseX){
		    x = -1* (mouseX + (windowWidth-(left+width)));
		} else {
		    x = mouseX - left;
		}
	    } else if(mouseX > left + width){

		if((windowWidth-mouseX)+left < mouseX-(left+width)){
		    x = ((windowWidth-mouseX)+left);
		} else {
		    x = mouseX - (left + width);
		}
	    } else {
		x = 0;
	    }

	    if(mouseY < top){
		y = mouseY - top;
	    } else if (mouseY > top + height){
		y = mouseY - (top + height);
	    } else {
		y = 0;
	    }

	    return {
		x: (mouseX - centerX),
		    y: (mouseY - centerY),
		    len: Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
		    };
	    



	};


	function getAccelerationVector(distance){

	    var absAcceleration = Math.min(.01/Math.pow(distance.len,2),20);

  

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

	    $("#jq-whosUsing").text("Accelration: {" + a.x + "," + a.y + "}");
	    
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

	    left+= velocityX/timeSlice;
	    top+= velocityY/timeSlice;


	    velocityX *= .9999;
	    velocityY *=.9999;
	    
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
