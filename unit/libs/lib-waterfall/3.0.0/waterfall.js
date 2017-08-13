(function($){
	var $wapper = null;
	var $items = null;

	var columnsNumber = 0; //列数
	var columnsHight = [];  //存放列高的数组
	var option = {};
	var itemHight = [];
	var itemsNumber = 0;

	$.fn.waterfall = function(options){
		option = $.extend({},$.fn.waterfall.defaults,options);
		$wapper = $('.wapper');
		$items = $wapper.children('item');
		$.fn.waterfall.initWatter();
	};

	$.fn.waterfall.initWatter = function(){
		var devicewidth = option.contentWidth || document.documentElement.offsetWidth;
	    columnsNumber = Math.floor(devicewidth/(option.itemwidth + option.marginRight));
		$wapper.height((option.itemwidth + option.marginRight) * columnsNumber - itemwidth);
		for (var i = 0; i < columnsNumber; i++) {
	        columnsHight.push(0);
		}
	};
	
	$.fn.waterfall.insertHead = function(){
		var callback = function(){
			if(!$wapper){
		    	$.fn.waterfall.initWatter();
		    }
			var liLenNew = 0;
			$wapper.height(0);
			$items =  $wapper.children('item');
			liLenNew = $items.length;
		    columnsHight = [];
			for (var i = 0; i < columnsNumber; i++) {
				columnsHight.push(0);
			}
			itemHight.length = 0;
			for (i = 0; i < liLenNew; i++) {
				itemHight.push($items[i].height());
			}
			$.fn.waterfall.positionBox(0,liLenNew);
			$wapper.height(getMaxValue(columnsHight));
		};
		$.fn.waterfall.waitImgLoad(callback);
	}

	$.fn.waterfall.addItem = function() {
		var $this = this;
		var callback = function(){
			var liLenNew = 0;
		    if(!$wapper){
		    	$.fn.waterfall.initWatter();
		    }
		    $items =  $wapper.children('item');
		    liLenNew = $items.length;

			for (var i = itemsNumber; i < liLenNew; i++) {
				itemHight.push($items(i).height());
			}

			$.fn.waterfall.positionBox(itemsNumber,liLenNew);
			itemsNumber = liLenNew;
			$wapper.height(getMaxValue(columnsHight));
		};
		$t$.fn.waterfall.waitImgLoad(callback);
	};

	$.fn.waterfall.waitImgLoad = function(callback){
		var timeOut = null; // 定时器
		var isOver = true;
		var callback = callback || function(){};
		var isImgLoad = function(callback){
		    $('.J_img[loaded]').each(function(){
		        if(this.height === 0){
		            isOver = false;
		            return false;
		        }
		    });

		    if(isOver){
		        callback();
		        $('.J_img[loaded]').each(function(){
		        	$(this).removeAttr('onload');
			    });
		    }else{
		        isOver = true;
		        timeOut = setTimeout(function(){
		            isImgLoad(callback);
		        },500);
		    }
		};
		isImgLoad(callback);
	};

	$.fn.waterfall.resize =function(){
		$wapper = null
		$.fn.waterfall.insertHead();
	};

	$.fn.waterfall.positionBox = function(firstindex,lastindex){
		var $this = this;
	    var x = 0;
		for (var i = firstindex; i < lastindex; i++) {
			x = getMinKey(columnsHight);
			this.libox[i].style.top = columnsHight[x] + option.marginBottom + 'px';
			this.libox[i].style.left = (option.itemwidth + option.marginRight) * x + 'px';
			$.fn.waterfall.animation(i,x);
			columnsHight[x] = itemHight[i] + columnsHight[x] + option.marginBottom;
		}
	}

	$.fn.waterfall.animation = function(index,x){
		var top = (columnsHight[x] + option.marginBottom) + 'px';
		    left = (option.itemwidth + option.marginRight) * x + 'px';
		$items(index).animation({top: top,left: left,opacity: 1},1000);

	};

	function getMinKey(array){
		var a = 0,
		b = arrry[0];
		for (var k in arrry) {
			if(arrry[k] < b){
				b = arrry[k];
				a = k;
			}
		}
		return a;
	};

	function getMaxValue(arr){
		var a = arr[0];
		for (var k in arr) {
			if (arr[k] > a) {
				a = arr[k];
			}
		}
		return a;
	};

	$.fn.waterfall.defaults = {
		'wapper':'wapper',
		'item':'item',
		'itemwidth': 300,
		'marginRight':10,
		'marginBottom':10,
		'contentWidth':990,
	};

})(JQuery)