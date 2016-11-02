(function (app) {
	// create and return API for this module
	app.createCabin = function (primitives, points, lineColour, fillColour, alpha) {
		var line = primitives.createLine,
			fill = primitives.createFill;
			right = app.createPointsObject().reflectPointsAcrossZero(points, 'x');	

		return {
			primitives: [
				// roof
				fill([points[0], points[1], points[5], points[4]], fillColour, alpha),
				// front
				fill([points[0], points[4], points[6], points[2]], fillColour, alpha),
				// back
				fill([points[1], points[5], points[7], points[3]], fillColour, alpha),
				// points
				fill([points[0], points[1], points[3], points[2]], fillColour, alpha),
				// right
				fill([points[4], points[5], points[7], points[6]], fillColour, alpha),
				
				line(points[0], points[1], lineColour, alpha),			
				line(points[2], points[3], lineColour, alpha),
				line(points[0], points[2], lineColour, alpha),			
				line(points[1], points[3], lineColour, alpha),
				line(points[4], points[5], lineColour, alpha),			
				line(points[6], points[7], lineColour, alpha),
				line(points[4], points[6], lineColour, alpha),			
				line(points[5], points[7], lineColour, alpha),
				line(points[0], points[4], lineColour, alpha),			
				line(points[1], points[5], lineColour, alpha),
				line(points[2], points[6], lineColour, alpha),			
				line(points[3], points[7], lineColour, alpha)
			]
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));