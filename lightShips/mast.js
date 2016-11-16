(function (app) {
	//config
	var numberOfSides = 8,
		height = 26,
		radius = 3;
	
	// create and return API for this module
	app.createMast = function (yShift, primitives, lineColour, fillColour, alpha) {
		var line = primitives.createLine,
			fill = primitives.createFill,
			pointsObject = app.createPointsObject(),
			prismPoints = pointsObject.getPrismPoints(height, numberOfSides, radius),
			topPoints = prismPoints.topPoints,
			basePoints = prismPoints.basePoints,
			points = topPoints.concat(basePoints),
			primitives = [],
			i = numberOfSides - 1,
			topPoint, 
			nextTopPoint,
			basePoint,
			nextBasePoint;
			
		points.forEach(function(point) {
			point.y += yShift;
		});	
			
		primitives.push(fill(
			[topPoints[0], topPoints[i], basePoints[i], basePoints[0]], fillColour, alpha));
 
		for(;i > 0; i -= 1) {
			topPoint = topPoints[i]; 
			nextTopPoint = topPoints[i - 1];
			basePoint = basePoints[i];
			nextBasePoint = basePoints[i - 1];
			
			primitives.push(fill(
				[topPoint, nextTopPoint, nextBasePoint, basePoint], fillColour, alpha)),
			primitives.push(line(
				topPoint, nextTopPoint, lineColour, alpha)),
			primitives.push(line(
				nextBasePoint, basePoint, lineColour, alpha))			
		}		
		
		
		return {
			points: points,
			primitives: primitives
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));