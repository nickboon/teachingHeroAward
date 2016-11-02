
/* required diagrams, transformations */
(function (app) {
	// config
	var numberOfShips = 1,
		areaWidth = 100,
		halfAreaWidth  = areaWidth / 2,
		shipSpacing = 300,
		transformation = app.createTransformationObject();
					
	function getRandomNumberBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}	
	
	function shiftRotateShip(points) {
		var rotatePointAboutY = transformation.rotatePointAboutY,
			randomAngle = getRandomNumberBetween(0, transformation.numberOfRotationalIncrements - 1),
			randomDistX = (getRandomNumberBetween(0, areaWidth) - halfAreaWidth) * shipSpacing,
			randomDistZ = getRandomNumberBetween(0, areaWidth) * shipSpacing;
			
		points.forEach(function (point) {
			rotatePointAboutY(point, randomAngle);
			point.x += randomDistX;
			point.z += randomDistZ;			
		});	
	}	
	
	function createLightships(perspective) {
		var drawing = app.createDrawingObject(perspective),
			vectorDrawing = app.createVectorDrawingObject(perspective),
			primitivesObject = app.createPrimitivesObject(drawing, vectorDrawing),
			solids = app.createSolidsObject(primitivesObject),
			spheres = app.createFakeSpheresObject(perspective),
			lightshipsObject = app.createLightshipsObject(spheres),
			lightship,
			hull,
			lightships = [],
			primitives = [],
			i;
			
		for (i = numberOfShips - 1; i >= 0; i -= 1) {
			//hull = app.createCalshotSpitHull(primitivesObject, perspective);
			hull = app.createCurvedHullModel(primitivesObject, perspective);
			//hull = app.createBasicHull(solids);
			lightship = lightshipsObject.create(hull);
			//shiftRotateShip(lightship.points);
			lightships.push(lightship);
			primitives = primitives.concat(lightship.primitives)
		}

		vectorDrawing.setKeyListenerForPrintSvg(primitives);	
			
		return lightships;
	};
		
	app.run = function () {
		var diagram = app.createDefaultFullScreenDiagram(),
			perspective = diagram.perspective, 
			solidsList = createLightships(perspective),
			inputTranformer = transformation.createKeyboardDrivenTransformer(solidsList);
			
		 diagram.stage.setSolids(solidsList);
		 diagram.stage.setTransformers([inputTranformer]);
	}		
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
