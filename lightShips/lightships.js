/* requires perspective, solids, fakesphere*/
(function (app) {
	// config
	var lineColour = '#880011',
		fillColour = '#cc0011';

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
	app.createLightshipsObject = function (solids, spheres) {	
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
		
		function createSkiffHull(width, height, length) {
			var halfWidth = width / 2,
				halfHeight = height / 2,
				halfLength = length / 2,
				thirdWidth = width / 3,
				thirdHeight = height / 3,
				thirdLength = length / 3;			

			return solids.createHexahedron(
				[					
					{ x: -halfWidth, y: -height, z: -halfLength},// 0 left top front
					{ x: halfWidth, y: -height, z: -halfLength}, // 1 right top front
					{ x: thirdWidth, y: 0, z: -thirdLength},  // 2 right bottom front 
					{ x: -thirdWidth, y: 0, z: -thirdLength}, // 3 left bottom front
					{ x: -halfWidth, y: -height, z: halfLength}, // 4 left top back
					{ x: halfWidth, y: -height, z: halfLength},	 // 5 right top back
					{ x: thirdWidth, y: 0, z: thirdLength},	 // 6 right bottom back
					{ x: -thirdWidth, y: 0, z: thirdLength}	 // 7 left bottom back					
				], lineColour, fillColour 
			);
		}	
					
		function createSkiff() {
			var width = 30,
				deckHeight = 20,
				length =100,
				mastHeight = 150,
				hull = createSkiffHull(width, deckHeight, length),
				hullReflection = solids.createHexahedron(
					getReflectionsX(hull.points), lineColour, fillColour, .6
				),
				light = createLightSphere({x: 0, y: -mastHeight, z: 0}, 0.8),
				lightReflection = createLightSphere({x: 0, y: mastHeight, z: 0}, .4);
			
			return {
				points: hull.points
					.concat(hullReflection.points)
					.concat(light.points)
					.concat(lightReflection.points),
					
				primitives: hull.primitives
					.concat(hullReflection.primitives)
					.concat(light.primitives)
					.concat(lightReflection.primitives)				
			};	
		}

		if (!(solids && spheres)) {
			throw 'You need to pass in both solids and spheres objects to create a lightship.';
		}

		return {
			createSkiff: createSkiff
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
