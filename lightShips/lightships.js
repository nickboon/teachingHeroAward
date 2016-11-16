/* requires perspective, solids, fakesphere*/
(function (app) {
	var mastHeight = 100; //150

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
				center = spheres.create(point, 10, sourceColour, sourceColour, alpha),
				middle = spheres.create(point, 14, glowColour, glowColour, alpha / 4),
				outer = spheres.create(point, 16, glowColour, glowColour, alpha / 6);		

			return {
				points:	[point],
				
				primitives: center.primitives
					.concat(middle.primitives)
					.concat(outer.primitives)
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
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
