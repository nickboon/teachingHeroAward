(function (app) {
	// config
	var lineColour = '#880011',
		fillColour = '#cc0011',
		hullAlpha = 0.8,
		width = 30,
		deckHeight = 20,
		length =100;

	function getReflectionX(point) {
		return {x: point.x, y: -point.y, z: point.z};
	}
			
	function getReflectionsX(points) {
		var reflection = [];
		
		points.forEach(function (point) {
			reflection.push(getReflectionX(point));
		});
		
		return reflection;
	}		
	// create and return API for this module
	app.createBasicHull = function (solids) {
		var halfWidth = width / 2,
			halfHeight = deckHeight / 2,
			halfLength = length / 2,
			thirdWidth = width / 3,
			thirdHeight = deckHeight / 3,
			thirdLength = length / 3,	
			hull = solids.createHexahedron(
				[					
					{ x: -halfWidth, y: -deckHeight, z: -halfLength},// 0 left top front
					{ x: halfWidth, y: -deckHeight, z: -halfLength}, // 1 right top front
					{ x: thirdWidth, y: 0, z: -thirdLength},  // 2 right bottom front 
					{ x: -thirdWidth, y: 0, z: -thirdLength}, // 3 left bottom front
					{ x: -halfWidth, y: -deckHeight, z: halfLength}, // 4 left top back
					{ x: halfWidth, y: -deckHeight, z: halfLength},	 // 5 right top back
					{ x: thirdWidth, y: 0, z: thirdLength},	 // 6 right bottom back
					{ x: -thirdWidth, y: 0, z: thirdLength}	 // 7 left bottom back					
				], lineColour, fillColour, hullAlpha 
			),
			hullReflection = solids.createHexahedron(
				getReflectionsX(hull.points), lineColour, fillColour, hullAlpha - .2
			);
			
		if (!solids) {
			throw 'You need to pass in a solids object to create a basic hull.';
		}
				
		return	{
			points: hull.points.concat(hullReflection.points),
			primitives: hull.primitives.concat(hullReflection.primitives)
		};
	}
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));