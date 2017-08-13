var imgView = {
    init:function(){

    }
};


var view = {

    init:function(){


    },
    renderDom: function(){


    },
    addEvent:function(){

    }
    touchEvent:function(){
        var istouch = false; 
        var x1 = 0,x2 = 0,y1 = 0,y2 = 0;
        return {
            touchstart:function(event){
                istouch = true;
                var touch = event.touches[0];
                x1 = touch.pageX;
                y1 = touch.pageY;
            },
            touchmove:function(event){
                var touch = event.touches[0]; 
                if(Math.abs(y1-y2) > 20){
                    return false;
                }
                if(istouch){
                    x2 = touch.pageX;
                    y2 = touch.pageY;
                    if(Math.abs(x2-x1) > 60){
                        istouch = false;
                        if(indexpostion >= 0 && indexpostion <= 5){
                            if(x2-x1 > 0 && indexpostion >= 0){  
                                if(indexpostion === 0){
                                    istouch = false;
                                    $J_imgview[0].style.webkitTransform = 'translateX(' + (.3*windowwidth) + 'px)';
                                    setTimeout(function(){$J_imgview[0].style.webkitTransform = 'translateX(0px)'},200);
                                    return;
                                }else{
                                    indexpostion--;
                                }
                            }else if(x2-x1 < 0 && indexpostion <= 5){
                                if(indexpostion === 5){
                                    istouch = false; 
                                    $J_imgview[0].style.webkitTransform = 'translateX(' + -((.3 + indexpostion)*windowwidth) + 'px)';
                                    setTimeout(function(){$J_imgview[0].style.webkitTransform = 'translateX(' + -(5*windowwidth) + 'px)'},200);
                                    return;
                                }else{
                                    indexpostion++;
                                }    
                            }
                            $J_imgview[0].style.webkitTransform = 'translateX(' + (-indexpostion*windowwidth) + 'px)';
                        }
                    }
                }
            },
            touchend:function(event){
                istouch = false; 
            }
        };
    }
}
module.exports = imgView;