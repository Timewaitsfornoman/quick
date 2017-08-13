function Waterfall(wapper,boxwidth, boxhight) {
	this.boxwidth = boxwidth ||10;
	this.boxhight = boxhight || 10;
	this.lenArr = [];
	this.devicewidth = 0;
	this.ulbox = null;
	this.libox =  null;
	this.boxitemwidth = null;
	this.columnsNumber = 0;
	this.lisLenhth = 0;
	this.columnsHight = [];
	this.elementHight = [];
	this.resize = null;
	this.wapper = wapper;
	this.main(wapper);
};

Waterfall.prototype.init = function(){
	this.boxwidth = this.boxwidth ||10;
	this.boxhight = this.boxhight || 10;
	this.lenArr = [];
	this.devicewidth = 0;
	this.ulbox = null;
	this.libox =  null;
	this.boxitemwidth = null;
	this.columnsNumber = 0;
	this.lisLenhth = 0;
	this.columnsHight = [];
	this.elementHight = [];
	this.resize = null;
	this.main(this.wapper);

};

Waterfall.prototype.main = function(wapper){
	this.devicewidth = document.documentElement.offsetWidth;
	this.ulbox = document.getElementById(wapper);
	this.libox =  this.ulbox.getElementsByTagName("li");
	this.boxitemwidth = this.libox[0].offsetWidth + this.boxwidth;
	this.columnsNumber = Math.floor(this.devicewidth/this.boxitemwidth);
	this.ulbox.style.width = this.boxitemwidth * this.columnsNumber - this.boxwidth + "px";
	this.lisLenhth = this.libox.length;
	for (var i = 0; i < this.lisLenhth; i++) {
		this.elementHight.push(this.libox[i].offsetHeight);
	}
	//排第一列
	for(var j = 0; j < this.columnsNumber; j++){
		this.libox[j].style.top = "0";
		this.libox[j].style.left = this.boxitemwidth * j + "px";
		this.libox[j].style.opacity = "1";
		this.libox[j].style["-moz-opacity"] = "1";
		this.libox[j].style["filter"] = "alpha(opacity=100)";
		this.columnsHight.push(this.elementHight[j]);
	}
	//后续排列
	this.positionBox(this.columnsNumber,this.lisLenhth);
	this.ulbox.style.height = this.getMaxValue(this.columnsHight) + 'px';
};

Waterfall.prototype.insertHead = function(){
	this.init();
};

Waterfall.prototype.addItem = function() {

	    this.libox =  this.ulbox.getElementsByTagName("li");
		var liLenNew = this.libox.length;

		for (var i = this.lisLenhth; i < liLenNew; i++) {
			this.elementHight.push(this.libox[i].offsetHeight);
		}

		this.positionBox(this.lisLenhth,liLenNew);
		this.lisLenhth = liLenNew;
		this.ulbox.style.height = this.getMaxValue(this.columnsHight) +"px";

};

Waterfall.prototype.positionBox =function(firstindex,lastindex){

	for (var i = firstindex; i < lastindex; i++) {
		var x = this.getMinKey(this.columnsHight);
		this.libox[i].style.top = this.columnsHight[x] + this.boxhight + "px";
		this.libox[i].style.left = this.boxitemwidth * x + "px";
		this.libox[i].style.opacity = "1";
		this.libox[i].style["-moz-opacity"] = "1";
		this.libox[i].style["filter"] = "alpha(opacity=100)";
		this.columnsHight[x] = this.elementHight[i] + this.columnsHight[x] + this.boxhight;
	}
};

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