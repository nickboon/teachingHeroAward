(function (app) {
	// config
	var lineColour = '#880011',
		fillColour = '#cc0011',
		alpha = 0.8,
		bezierSplitDepth = 2,

		
		// objects from dependancies
		points = app.createPointsObject(),
		reflect = points.reflectPointsAcrossZero;
		
	// create and return API for this module
	app.createCalshotSpitModel = function (primitives, perspective) {		
		var center = [
				// bow to stern
				
				// deck
				{x: 0, y: -23, z: -92},	// 0 bow deck
				{x: 0, y: -20, z: 81},	// 1 stern deck

				// base
				{x: 0, y: 0, z: -87},		// 2 bow base
				{x: 0, y: 0, z: 64}	// 3 stern base
			],
			reflectedCenter = reflect([center[0], center[1]], 'y'),
			
			left = [			
				// cabin
				{x: -15, y: -23, z: 27},	//top stern
				{x: -15, y: -23, z: -45},	//top bow
				{x: -15, y: -9, z: 27},		//base stern
				{x: -15, y: -9, z: -45},		//base bow			
				// bow to stern
				
				// deck
				//first control						
				{x: -26, y: -13, z: -74},	//4
				// second control = middle
				//middle								
				{x: -26, y: -13, z: 0},		//5
				// first control
				{x: -26, y: -13, z: 54},	//6 
				// second control = corner
				// corner
				{x: -16, y: -19, z: 71},	//7					
				// first control
				{x: -11, y: -19, z: 79},	//8					
				// second control
				{x: -8, y: -19, z: 80},		//9					
				
				// base
				//first control						
				{x: -26, y: 0, z: -78},		//10
				// second control = middle
				//middle								
				{x: -26, y: 0, z: 0},		//11
				// first control
				{x: -26, y: 0, z: 42},		//12
				// second control = corner				
				// corner
				{x: -16, y: 0, z: 57},		//13
				// first control
				{x: -11, y: 0, z: 63},		//14					
				// second control
				{x: -8, y: 0, z: 65}		//15					
			],
			reflectedLeft = reflect(left, 'y'),

			right = reflect(left, 'x'),	
			reflectedRight = reflect(right, 'y'),
			
			curves = [
				// deck				
				// left
				//stern to middle
				[center[0], left[4], left[5], left[5]], 	//0
				//middle to corner
				[left[5], left[6], left[7], left[7]],		//1
				//corner to stern
				[left[7], left[8], left[9], center[1]],		//2
				
				// right
				//stern to middle
				[center[0], right[4], right[5], right[5]],	//3
				//middle to corner
				[right[5], right[6], right[7], right[7]],	//4
				//corner to stern
				[right[7], right[8], right[9], center[1]],	//5
				
				// base
				// left
				//stern to middle
				[center[2], left[10], left[11], left[11]],	//6
				//middle to corner
				[left[11], left[12], left[13], left[13]],	//7				
				//corner to stern
				[left[13], left[14], left[15], center[3]],	//8

				// right				
				//stern to middle
				[center[2], right[10], right[11], right[11]],//9
				//middle to corner
				[right[11], right[12], right[13], right[13]],//10
				//corner to stern
				[right[13], right[14], right[15], center[3]]//11
			];
				
			reflectedCurves = [
				[reflectedCenter[0], reflectedLeft[4], reflectedLeft[5], reflectedLeft[5]], 	//0
				[reflectedLeft[5], reflectedLeft[6], reflectedLeft[7], reflectedLeft[7]],		//1
				[reflectedLeft[7], reflectedLeft[8], reflectedLeft[9], reflectedCenter[1]],		//2
				[reflectedCenter[0], reflectedRight[4], reflectedRight[5], reflectedRight[5]],	//3
				[reflectedRight[5], reflectedRight[6], reflectedRight[7], reflectedRight[7]],	//4
				[reflectedRight[7], reflectedRight[8], reflectedRight[9], reflectedCenter[1]],	//5
				[center[2], reflectedLeft[10], reflectedLeft[11], reflectedLeft[11]],	//6
				[reflectedLeft[11], reflectedLeft[12], reflectedLeft[13], reflectedLeft[13]],	//7				
				[reflectedLeft[13], reflectedLeft[14], reflectedLeft[15], center[3]],	//8
				[center[2], reflectedRight[10], reflectedRight[11], reflectedRight[11]],//9
				[reflectedRight[11], reflectedRight[12], reflectedRight[13], reflectedRight[13]],//10
				[reflectedRight[13], reflectedRight[14], reflectedRight[15], center[3]]//11
			];

			hull = app.createCalshotSpitHull(primitives, perspective, curves, bezierSplitDepth, lineColour, fillColour, alpha),
			reflectedHull = app.createCalshotSpitHull(primitives, perspective, reflectedCurves, bezierSplitDepth, lineColour, fillColour, alpha),
						
			cabin = app.createCabin(primitives, [
				left[0], left[1], left[2], left[3],
				right[0], right[1], right[2], right[3]
			], lineColour, fillColour, alpha),

			cabinReflectionPoints = reflect(
				[left[0], left[1], left[2], left[3]],'y')
					.concat(reflect([
						right[0], right[1], right[2], right[3]], 'y')),

			cabinReflection = app.createCabin(primitives, cabinReflectionPoints, lineColour, fillColour, alpha),

			mast = app.createMast(-36, primitives, lineColour, fillColour, alpha),
			mastReflection = app.createMast(36, primitives, lineColour, fillColour, alpha);
					
		return {
			points: center
				.concat(left)
				.concat(right)
				.concat(hull.points)
				.concat(mast.points)
				.concat(mastReflection.points)
				.concat(cabinReflectionPoints)
				.concat(reflectedHull.points)
				.concat(reflectedLeft)
				.concat(reflectedRight)
				.concat(reflectedCenter),
					
			primitives: hull.primitives
				.concat(cabin.primitives)
				.concat(mast.primitives)
				.concat(mastReflection.primitives)
				.concat(cabinReflection.primitives)
				.concat(reflectedHull.primitives)
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
