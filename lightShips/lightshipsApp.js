
/* required diagrams, transformations */
(function (app) {
	// config
	var numberOfBoats = 100,
		boatWidth = 30,
		boatHeight = 20,
		boatLength =100,
		areaWidth = 100,
		halfAreaWidth  = areaWidth / 2,
		boatSpacing = boatWidth * 10;

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
					
	function getRandomNumberBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}	
	
	function shiftRotateBoat(points, transformation) {
		var rotatePointAboutY = transformation.rotatePointAboutY,
			randomAngle = getRandomNumberBetween(0, transformation.numberOfRotationalIncrements - 1),
			randomDistX = (getRandomNumberBetween(0, areaWidth) - halfAreaWidth) * boatSpacing,
			randomDistZ = getRandomNumberBetween(0, areaWidth) * boatSpacing;
			
		points.forEach(function (point) {
			rotatePointAboutY(point, randomAngle);
			point.x += randomDistX;
			point.z += randomDistZ;			
		});	
	}	
	
	function copyOf(point) {
		return {x: point.x, y: point.y, z: point.z}; 
	}
			
	function createLightSphere(spheres, point, alpha) {
		var center = spheres.create(copyOf(point), 10, '#ffffff', '#ffffff', alpha),
			middle = spheres.create(copyOf(point), 14, '#ffff00', '#ffff00', alpha / 4),
			outer =spheres.create(copyOf(point), 16, '#ffff00', '#ffff00', alpha / 6);		

		return {
			solids: [center, middle, outer],
			points:	center.points.concat(middle.points).concat(outer.points)		
		}; 
	}
	
	function createHull(solids, width, height, length) {
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
			], '#880011', '#cc0011'
		);
	}	
				
	function createLightboat(solids, spheres, transformation) {
		var hull = createHull(solids, boatWidth, boatHeight, boatLength),
			light = createLightSphere(
				spheres, 
				{x: 0, y: -150, z: 0},
				0.8
			),
			hullReflection = solids.createHexahedron(
				getReflectionsX(hull.points),
				'#880011',
				'#cc0011',
				.6
			),
			lightReflection = createLightSphere(
				spheres, 
				{x: 0, y: 150, z: 0},
				.4
			),
			points = hull.points
				.concat(light.points)
				.concat(hullReflection.points)
				.concat(lightReflection.points);

		shiftRotateBoat(points, transformation);
		
		return [hull, hullReflection]
			.concat(light.solids)
			.concat(lightReflection.solids);		
	}
											
	function createLightboats(perspective, transformation) {
		var drawing = app.createDrawingObject(perspective),
			vectorDrawing = app.createVectorDrawingObject(perspective),
			primitives = app.createPrimitivesObject(drawing, vectorDrawing),
			solids = app.createSolidsObject(primitives),
			spheres = app.createFakeSpheresObject(perspective),
			lightBoats = [],
			primitives = [],
			i;
			
		for (i = numberOfBoats - 1; i >= 0; i -= 1) {
			lightBoats = lightBoats.concat(
				createLightboat(solids, spheres, transformation)
			);
		}

		lightBoats.forEach(function (solid) {
			primitives = primitives.concat(solid.primitives)
		});
		vectorDrawing.setKeyListenerForPrintSvg(primitives);	
			
		return lightBoats;
	};
		
	app.run = function () {
		var diagram = app.createDefaultFullScreenDiagram(),
			perspective = diagram.perspective, 
			transformation = app.createTransformationObject(),
			solidsList = createLightboats(perspective, transformation),
			inputTranformer = transformation.createKeyboardDrivenTransformer(solidsList);
			
		 diagram.stage.setSolids(solidsList);
		 diagram.stage.setTransformers([inputTranformer]);
	}		
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
