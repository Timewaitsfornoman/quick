var canvas = null;
var ctx = null;
var imageData = null;
var gammaCorrection = 0;
var image = null;

function clickAutoGamma() {
	var img = document.getElementById("image_gamma");
	
	adjustImageGamma(img);
}

function adjustImageGamma(img) {
	image = img;
	canvas = document.createElement('canvas');
	canvas.id = img.id;
	canvas.className = img.className;
	//canvas.width = img.naturalWidth;
	canvas.width = img.width;
	//canvas.height = img.naturalHeight;
	canvas.height = img.height;
	
	ctx = canvas.getContext('2d');
	//ctx.drawImage(img, 0, 0);
	ctx.drawImage(img, 0, 0, img.width, img.height);
	
	var image_parentNode = img.parentNode;
	image_parentNode.replaceChild(canvas, img);
		
	//imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	var gammaVal = getGammaVal();
	gammaCorrection = 1 / gammaVal;
	
	setTimeout(function() {
		//for ( y = 0; y < image.naturalHeight; y++) {
		for ( y = 0; y < canvas.height; y++) {
			//for ( x = 0; x < image.naturalWidth; x++) {
			for ( x = 0; x < canvas.width; x++) {
				var index = parseInt(x + canvas.width * y) * 4;
				resetPixelColor(index);
			}
		}
		ctx.putImageData(imageData, 0, 0);
		//var dataURL = canvas.toDataURL('image/png');
	}, 0);
}

function resetPixelColor(index) {
	imageData.data[index + 0] = Math.pow((imageData.data[index + 0] / 255), gammaCorrection) * 255;
	imageData.data[index + 1] = Math.pow((imageData.data[index + 1] / 255), gammaCorrection) * 255;
	imageData.data[index + 2] = Math.pow((imageData.data[index + 2] / 255), gammaCorrection) * 255;
}

function getGammaVal() {
	var pixData = imageData.data;
	var grayNum = pixData.length / 4;
	var totalGrayVal = 0;
	for (var i = 0; i < pixData.length; i += 4) {
		/* RGB to Luma: http://stackoverflow.com/questions/37159358/save-canvas-in-grayscale */
		//var grayscale = pix[i] * 0.2126 + pix[i+1] * 0.7152 + pix[i+2] * 0.0722;
		var grayscale = (pixData[i] + pixData[i+1] + pixData[i+2]) / 3;
		//pix[i] = grayscale;       // red
		//pix[i+1] = grayscale;     // green
		//pix[i+2] = grayscale;     // blue
		// alpha
		totalGrayVal = totalGrayVal + grayscale;
	}
	var mean = totalGrayVal / grayNum;
	var gammaVal = Math.log10(mean/255) / Math.log10(0.5);
	console.log(mean);
	console.log(gammaVal);
	return gammaVal;
}
