(function (app) {
	// config
	var lineColour = '#880011',
		fillColour = '#cc0011',
		alpha = 0.8,
		width = 45,
		deckHeight = 15,
		cabinHeight = 12,
		length =150,
		halfWidth = width / 2,
		thirdWidth = width / 3,
		halfLength = length / 2,
		quarterLength = length / 4,
		baseDiff = 5;
		bezierSplitDepth = 0;
		
		// objects from dependancies
		points = app.createPointsObject(),
		reflect = points.reflectPointsAcrossZero;
		
	// create and return API for this module
	app.createCurvedHullModel = function (primitives, perspective) {		
		var center = [
				// bow to stern
				
				// deck
				{x: 0, y: -deckHeight - 5, z: halfLength},	// 0 bow desk
				{x: 0, y: -deckHeight - 3, z: -halfLength},	// 1 stern deck

				// base
				{x: 0, y: 0, z: halfLength - baseDiff},		// 2 bow base
				{x: 0, y: 0, z: -halfLength + baseDiff}	// 3 stern base
			],
			
			left = [			
				// bow to stern
				
				// deck
				{x: -halfWidth, y: -deckHeight, z: quarterLength},						
				{x: -halfWidth, y: -deckHeight, z: 0},								
				{x: -halfWidth, y: -deckHeight, z: -quarterLength},					

				// base
				{x: -halfWidth + baseDiff, y: 0, z: (halfLength - baseDiff) / 2},	
				{x: -halfWidth + baseDiff, y: 0, z: 0},				 					
				{x: -halfWidth + baseDiff, y: 0, z: (-halfLength + baseDiff) / 2},	

				// cabin
				{x: -thirdWidth, y: -deckHeight - cabinHeight, z: quarterLength},
				{x: -thirdWidth, y: -deckHeight - cabinHeight, z: -quarterLength},
				{x: -thirdWidth, y: -deckHeight, z: quarterLength}, 				
				{x: -thirdWidth, y: -deckHeight, z: -quarterLength}			
			],

			right = reflect(left, 'x'),	

			curves = [
				// deck
				
				// left
				[center[0], left[0], left[0], left[1]],
				[left[1], left[2], left[2], center[1]],
				
				// right
				[center[0], right[0], right[0], right[1]],
				[right[1], right[2], right[2], center[1]],
				
				// base

				// left
				[center[2], left[3], left[3], left[4]],
				[left[4], left[5], left[5], center[3]],
				
				// right
				[center[2], right[3], right[3], right[4]],
				[right[4], right[5], right[5], center[3]],
			];
				
			hull = app.createCurvedHull(primitives, perspective, curves, bezierSplitDepth, lineColour, fillColour, alpha),
		
			cabin = app.createCabin(primitives, [
				left[6], left[7], left[8], left[9],
				right[6], right[7], right[8], right[9]
			], lineColour, fillColour, alpha);		
		
		return {
			points: center
					.concat(left)
					.concat(right)
					.concat(hull.points),
					
			primitives: hull.primitives
				.concat(cabin.primitives)
			
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));