/* requires perspective, solids, fakesphere*/
(function (app) {
	// config
	var lineColour = '#880011',
		fillColour = '#cc0011',
		hullAlpha = 0.8,
		width = 30,
		deckHeight = 20,
		length =100,
		mastHeight = 150;

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
			
	function copyOf(point) {
		return {x: point.x, y: point.y, z: point.z}; 
	}
														
	// create and return API for this module
	app.createLightshipsObject = function (spheres) {	
		function createLightSphere(point, alpha) {
			var sourceColour = '#ffffff',
				glowColour = '#ffff00',
				center = spheres.create(copyOf(point), 10, sourceColour, sourceColour, alpha),
				middle = spheres.create(copyOf(point), 14, glowColour, glowColour, alpha / 4),
				outer = spheres.create(copyOf(point), 16, glowColour, glowColour, alpha / 6);		

			return {
				points:	center.points.concat(middle.points).concat(outer.points),		
				primitives: center.primitives.concat(middle.primitives).concat(outer.primitives)
			}; 
		}
		
		function createBasicHull(solids) {
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
				
			if (!(solids)) {
				throw 'You need to pass in a solids objects to create a basic hull.';
			}
	
				
			return	{
				points: hull.points.concat(hullReflection.points),
				primitives: hull.primitives.concat(hullReflection.primitives)
			};
		}	
			
		function createCalshotSpitHull(primitives) {						
			var halfWidth = width / 2,
				halfLength = length / 2,
				thirdWidth = width / 3,
				thirdLength = length / 3,	
				zOffset = -length * .4,
				points = [
					// deck
					{x: -halfWidth, y: -deckHeight -5, z: -70 + zOffset}, // 0 start curve stern
					{x: -halfWidth -thirdWidth * 2, y: -deckHeight, z: -10 + zOffset}, // 1 control 1
					{x: -halfWidth -thirdWidth * 2, y: -deckHeight, z: 155 + zOffset}, // 2 control 2
					{x: 0, y: -deckHeight - 10, z: 180 + zOffset}, // 3 end curve (bows);
				
					{x: halfWidth + thirdWidth * 2, y: -deckHeight, z: 155 + zOffset}, // 4 control 2
					{x: halfWidth + thirdWidth * 2, y: -deckHeight, z: -10 + zOffset}, // 5 control 1
					{x: halfWidth, y: -deckHeight - 5, z: -70 + zOffset}, // 6	start curve stern
					
					{x: -thirdWidth, y: -deckHeight - 7, z: -80 + zOffset}, // 7 bow control 1
					{x: thirdWidth, y: -deckHeight - 7, z: -80 + zOffset}, // 8 bow control 2
					
					// footprint
					{x: -halfWidth, y: 0, z: -70 + zOffset}, // 9 start curve stern
					{x: -halfWidth -thirdWidth, y: 0, z: -10 + zOffset}, // 10 control 1
					{x: -halfWidth -thirdWidth, y: 0, z: 155 + zOffset}, // 11 control 2
					{x: 0, y: 0, z: 180 + zOffset  - 10}, // 12 end curve (bows);
				
					{x: halfWidth + thirdWidth, y: 0, z: 155 + zOffset}, // 13 control 2
					{x: halfWidth + thirdWidth, y: 0, z: -10 + zOffset}, // 14 control 1
					{x: halfWidth, y: 0, z: -70 + zOffset}, // 15	start curve stern
					
					{x: -thirdWidth, y: 0, z: -80 + zOffset}, // 16 bow control 1
					{x: thirdWidth, y: 0, z: -80 + zOffset} // 17 bow control 2
				];
			
			function getPrimitives() {				
				return [
					// deck
					primitives.createCurve(
						points[0], points[1], points[2], points[3],
						lineColour, hullAlpha
					),
					primitives.createCurve(
						points[6], points[5], points[4], points[3],
						lineColour, hullAlpha
					),
					primitives.createCurve(
						points[0], points[7], points[8], points[6],
						lineColour, hullAlpha
					),
					// footprint
					primitives.createCurve(
						points[9], points[10], points[11], points[12],
						lineColour, hullAlpha
					),
					primitives.createCurve(
						points[15], points[14], points[13], points[12],
						lineColour, hullAlpha
					),
					primitives.createCurve(
						points[9], points[16], points[17], points[15],
						lineColour, hullAlpha
					),
					primitives.createLine(
						points[3], points[12], lineColour, hullAlpha
					)
					//,
					//primitives.createFill(points, fillColour, hullAlpha)
				];				
			}
			
			return {
				points: points,
				primitives: getPrimitives()
			};
		}
			
		function create(hull) {				
				light = createLightSphere({x: 0, y: -mastHeight, z: 0}, 0.8),
				lightReflection = createLightSphere({x: 0, y: mastHeight, z: 0}, .4);
			
			return {
				points: hull.points
					.concat(light.points)
					.concat(lightReflection.points),
					
				primitives: hull.primitives
					.concat(light.primitives)
					.concat(lightReflection.primitives)				
			};	
		}

		if (!(spheres)) {
			throw 'You need to pass in a spheres objects to create a lightship.';
		}

		return {
			create: create,
			createBasicHull: createBasicHull,
			createCalshotSpitHull: createCalshotSpitHull
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
