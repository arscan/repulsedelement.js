


(function($){
        
    $.fn.psychoElement = function(options){

	
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
		setTimeout(_loop,10);
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
