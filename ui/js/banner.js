// reference to canvas
var c;
var ctx;
// reference to banner img
var bgImg = new Image();
// triangle arrow
var triPos = 0;
var targetTriPos = 0;
var relativeTriPos = 0;
var easing = 0.08;
// triangle base/2
var triSize = 8;

$(document).ready(function() {
	bgImg.src = rootPath + 'ui/img/banner.jpg';
	c = document.getElementById("banner");
	ctx = c.getContext("2d");
	
	window.setInterval(draw, 20);
});

function draw() {
	// clear and draw/position banner
	ctx.canvas.width = window.innerWidth;
	var bannerHeight = (ctx.canvas.width / bgImg.width) * bgImg.height;
	var mobileYShift = 0;
    if (ctx.canvas.width < 520)
    	mobileYShift = 35;
	ctx.drawImage(bgImg, 0, -(bannerHeight / 2) + (ctx.canvas.height / 2) + (triSize/2) - mobileYShift, ctx.canvas.width, bannerHeight);
	
	// triangle position
	if (triPos != targetTriPos) {
		var dx = targetTriPos - triPos;
		if (Math.abs(dx) < 0.2) {
			// round if close
			triPos = targetTriPos;
		} else {
			triPos += dx * easing;
		}
	}
	
	relativeTriPos = ctx.canvas.width/2 - triPos;
	// draw pointer if window width is large enough
	if (ctx.canvas.width >= 520) {
		// draw triangle
		ctx.beginPath();
		
		ctx.moveTo(0, 0);
		ctx.lineTo(relativeTriPos, 0);
		ctx.lineTo(relativeTriPos - triSize, triSize);
		ctx.lineTo(0, triSize);
		
		ctx.moveTo(ctx.canvas.width, 0);
		ctx.lineTo(relativeTriPos, 0);
		ctx.lineTo(relativeTriPos + triSize, triSize);
		ctx.lineTo(ctx.canvas.width, triSize);
		
		ctx.closePath();
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();
	} else {
		// rectangle instead for mobile
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0,0,ctx.canvas.width,triSize);
	}
}

// set arrow target position for current page
function setBannerArrow(target) {
	if (target == "blog") {
		targetTriPos = 124;
	} else if (target == "about") {
		targetTriPos = 0;
	} else if (target == "contact") {
		targetTriPos = -116;
	}
}