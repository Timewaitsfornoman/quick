/*
*@param String  wapper瀑布流容器的ID 必选
*@param Number  liwidth瀑布流容器子元素宽度 必选
*@param String  animate瀑布流动画效果 可选 默认全屏宽度
*@param Number  allwidth瀑布流容器宽度 可选 默认全屏宽度
*@param Number  boxwidth瀑布流子原素左右间距 可选，默认为10
*@param Number  boxhight瀑布流子原素上下间距 可选，默认为10
*/
function Waterfall(wapper,liwidth,animate,allwidth,boxwidth,boxhight) {
	this.wapper = wapper;
	this.liwidth = liwidth || 300;
	this.boxwidth = boxwidth ||10;
	this.boxhight = boxhight || 10;
	this.allwidth = allwidth || 0;
	this.ulbox = null;
	this.libox =  null;
	this.boxitemwidth = null;
	this.columnsNumber = 0;
	this.lisLength = 0;
	this.columnsHight = [];
	this.elementHight = [];
	this.animate = animate || 'fadeIn';
};

/*
*@function 初始化瀑布流行列
*/

Waterfall.prototype.initBox = function(){
	var devicewidth = this.allwidth || document.documentElement.offsetWidth;
	this.boxitemwidth = this.liwidth + this.boxwidth;
	this.columnsNumber = Math.floor(devicewidth/this.boxitemwidth);
	this.ulbox = document.getElementById(this.wapper);
	this.ulbox.style.width = this.boxitemwidth * this.columnsNumber - this.boxwidth + 'px';

	for (var i = 0; i < this.columnsNumber; i++) {
		this.columnsHight.push(0);
	}
};
/*
*@function insertHead插入瀑布插入的条数流顶部
*/
Waterfall.prototype.insertHead = function(){
	var $this = this;
	var callback = function(){
		if(!this.ulbox){
	    	this.initBox();
	    }
		var liLenNew = 0;
		this.ulbox.style.height = 0 + 'px';
		this.libox =  this.ulbox.getElementsByTagName("li");
		liLenNew = this.libox.length;
	    this.columnsHight = [];
		for (var i = 0; i < this.columnsNumber; i++) {
			this.columnsHight.push(0);
		}
		this.elementHight.length = 0;
		for (i = 0; i < liLenNew; i++) {
			this.elementHight.push(this.libox[i].offsetHeight);
		}
		this.positionBox(0,liLenNew);
		this.ulbox.style.height = this.getMaxValue(this.columnsHight) +"px";
	};
	$this.waitImgLoad(callback);
};
/**
 *@function addItem往瀑布流尾部插入数据
 */
Waterfall.prototype.addItem = function() {
	var $this = this;
	var callback = function(){
		var liLenNew = 0;
	    if(!this.ulbox){
	    	this.initBox();
	    }
	    this.libox =  this.ulbox.getElementsByTagName("li");
	    liLenNew = this.libox.length;

		for (var i = this.lisLength; i < liLenNew; i++) {
			this.elementHight.push(this.libox[i].offsetHeight);
		}

		this.positionBox(this.lisLength,liLenNew);
		this.lisLength = liLenNew;
		this.ulbox.style.height = this.getMaxValue(this.columnsHight) +"px";
	};
	$this.waitImgLoad(callback);
};

/**@function waitImgLoad 等待瀑布流插入数据图片加载好执行callback回调
 * @param function callback 参数callback 插入图片加载好后的回调函数
 */

Waterfall.prototype.waitImgLoad = function(callback){
    var $this = this;
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
	        callback.apply($this);
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
/**
 *@function resize 窗口大小改变时执行重新排列函数
 */
Waterfall.prototype.resize =function(){
	this.ulbox = null;
	this.insertHead();
};

/**
 * positionBox 实现瀑布流定位
 * @param  Number firstindex 插入的起始位置
 * @param  Number lastindex  插入的结束位置
 */
Waterfall.prototype.positionBox = function(firstindex,lastindex){
	var $this = this,
	x = 0,
    top = 0,
    left = 0,
    index = 0;
	for (var i = firstindex; i < lastindex; i++) {

		if(this.animation === 'animationPushin' && i < 16){
			index = i%this.columnsNumber;
			top = this.columnsHight[index] + this.boxhight + 'px';
	        left = this.boxitemwidth * index + 'px';
			$this.animationPushin(i,top,left);
			this.columnsHight[index] = this.elementHight[i] + this.columnsHight[index] + this.boxhight;
		}else{
			x = this.getMinKey(this.columnsHight);
			top = this.columnsHight[x] + this.boxhight + 'px';
	        left = this.boxitemwidth * x + 'px';
	        $this.animationTopin(i,top,left);
			this.columnsHight[x] = this.elementHight[i] + this.columnsHight[x] + this.boxhight;
		}
	}
};

Waterfall.prototype.animationDefult = function(index,top,left){
    $(this.libox[index]).animate({top: top,left: left,opacity:'1'},600);
};


Waterfall.prototype.animationPushin = function(index,top,left){
    $(this.libox[index]).animate({top: top,left: left,opacity:'1'});
};

Waterfall.prototype.animationFadein = function(index,top,left){
    $(this.libox[index]).animate({top: top,left: left},1);
    $(this.libox[index]).animate({opacity: '1'},1000);
};

Waterfall.prototype.animationTopin = function(index,top,left){
    $(this.libox[index]).animate({top: 0,left: left,opacity:'1'},1);
    $(this.libox[index]).animate({top: top,left: left},1000);
};

Waterfall.prototype.animationLeftin = function(index,top,left){
    $(this.libox[index]).animate({top: top,left: 0,opacity:'1'},1);
    $(this.libox[index]).animate({top: top,left: left},1000);
};

/**
 * getMinKey 查找出最小值
 * @param  Array arrry 待查找的数组
 */
Waterfall.prototype.getMinKey = function(arrry){
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
/**
 * getMaxValue 查找数组里的最大值
 * @param  Array arr 带查找数组
 */
Waterfall.prototype.getMaxValue = function(arr) {
	var a = arr[0];
	for (var k in arr) {
		if (arr[k] > a) {
			a = arr[k];
		}
	}
	return a;
};
module.exports = Waterfall;