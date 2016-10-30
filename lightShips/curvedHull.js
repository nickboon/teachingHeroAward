(function (app) {
	// config
	var lineColour = '#880011',
		fillColour = '#cc0011',
		hullAlpha = 0.8,
		width = 45,
		deckHeight = 15,
		cabinHeight = 12,
		length =150,
		halfWidth = width / 2,
		thirdWidth = width / 3,
		halfLength = length / 2,
		quarterLength = length / 4,
		baseDiff = 5;
		

	function copy(point) {
		return {x: point.x, y: point.y, z: point.z}; 
	}	
		
	function getReflectionZ(point) {
		return {x: -point.x, y: point.y, z: point.z};
	}

	function getReflectionsZ(points) {
		var reflection = [];		
		points.forEach(function (point) {
			reflection.push(getReflectionZ(point));
		});		
		return reflection;
	}	
		
	// create and return API for this module
	app.createCurvedHull = function (primitives, perspective) {
		var line = primitives.createLine,
			curve = primitives.createCurve,
			fill = primitives.createFill,
			screenX = perspective.getScreenX,
			screenY = perspective.getScreenY,
			getNearestZFromArray = app.createPointsObject().getNearestZFromArray,
			center = [
				{x: 0, y: -deckHeight - 5, z: halfLength},	// 0 bow desk
				{x: 0, y: 0, z: halfLength - baseDiff},		// 1 bow base
				{x: 0, y: 0, z: -halfLength + baseDiff},	// 2 stern base
				{x: 0, y: -deckHeight - 3, z: -halfLength}	// 3 stern deck
			],
			left = [
				{x: -halfWidth, y: -deckHeight, z: 0},								// 0
				{x: -halfWidth + baseDiff, y: 0, z: 0},				 				// 1	
				{x: -halfWidth, y: -deckHeight, z: quarterLength},					// 2	
				{x: -halfWidth, y: -deckHeight, z: -quarterLength},					// 3
				{x: -halfWidth + baseDiff, y: 0, z: (halfLength - baseDiff) / 2},	// 4
				{x: -halfWidth + baseDiff, y: 0, z: (-halfLength + baseDiff) / 2},	// 5
				
				{x: -thirdWidth, y: -deckHeight, z: quarterLength}, 					// 6
				{x: -thirdWidth, y: -deckHeight, z: -quarterLength},					// 7
				{x: -thirdWidth, y: -deckHeight - cabinHeight, z: quarterLength},	// 8
				{x: -thirdWidth, y: -deckHeight - cabinHeight, z: -quarterLength}	// 9
			],
			right = getReflectionsZ(left);			
	
	
 
	
	
		function lines() {
			return [
				//deck
				curve(center[0], left[2], left[2], left[0], lineColour, hullAlpha),
				curve(left[0], left[3], left[3], center[3], lineColour, hullAlpha),
				curve(center[0], right[2], right[2], right[0], lineColour, hullAlpha),
				curve(right[0], right[3], right[3], center[3], lineColour, hullAlpha),
				
				
				//base
				curve(center[1], left[4], left[4], left[1], lineColour, hullAlpha),		curve(center[2], left[5], left[5], left[1], lineColour, hullAlpha),		curve(center[1], right[4], right[4], right[1], lineColour, hullAlpha),	curve(center[2], right[5], right[5], right[1], lineColour, hullAlpha),	
				//keel
				line(center[0], center[1], lineColour, hullAlpha),			
				line(center[3], center[2], lineColour, hullAlpha)
			];
		}
			
		function deckFill(points) {
			return {					
				points: points,
				
				getNearestZ: function getNearestZ() {
					return getNearestZFromArray(points);
				},
				
				draw: function (context) {
					context.save();
					context.fillStyle = colours.toRgb(fillColour, hullAlpha);
					context.beginPath();
					context.moveTo(screenX(points[0]), screenY(points[0])); 
					context.bezierCurveTo(
						screenX(points[1]), screenY(points[1]),
						screenX(points[1]), screenY(points[1]),
						screenX(points[2]), screenY(points[2])
					);
					context.bezierCurveTo(
						screenX(points[3]), screenY(points[3]),
						screenX(points[3]), screenY(points[3]),
						screenX(points[4]), screenY(points[4])
					);
					context.bezierCurveTo(
						screenX(points[5]), screenY(points[5]),
						screenX(points[5]), screenY(points[5]),
						screenX(points[6]), screenY(points[6])
					);
					context.bezierCurveTo(
						screenX(points[7]), screenY(points[7]),
						screenX(points[7]), screenY(points[7]),
						screenX(points[8]), screenY(points[8])
					);
					context.closePath();
					context.fill();
					context.restore();
				}
			};
		}	

		function hullFill(points) {
			return {					
				points: points,
				
				getNearestZ: function getNearestZ() {
					return getNearestZFromArray(points);
				},
				
				draw: function (context) {
					context.save();
					context.fillStyle = colours.toRgb(fillColour, hullAlpha);
					context.beginPath();
					context.moveTo(screenX(points[0]), screenY(points[0])); 
					context.bezierCurveTo(
						screenX(points[1]), screenY(points[1]),
						screenX(points[1]), screenY(points[1]),
						screenX(points[2]), screenY(points[2])
					);
					context.lineTo(screenX(points[3]), screenY(points[3])); 
					context.bezierCurveTo(
						screenX(points[4]), screenY(points[4]),
						screenX(points[4]), screenY(points[4]),
						screenX(points[5]), screenY(points[5])
					);
					context.lineTo(screenX(points[0]), screenY(points[0])); 
					context.closePath();
					context.fill();
					context.restore();
				}
			};
		}	
				
		function hullFills() {
			return [
				//deck
				deckFill([
					center[0], left[2], left[0], left[3], center[3],
					right[3], right[0], right[2], center[0]]),
				// left bow
				hullFill([
					center[0], left[2], left[0], left[1],
					left[4], center[1]]),
				// right bow
				hullFill([
					center[0], right[2], right[0], right[1],
					right[4], center[1]]),
				// left stern
				hullFill([
					center[3], left[3], left[0], left[1],
					left[5], center[2]]),
				// right stern
				hullFill([
					center[3], right[3], right[0], right[1],
					right[5], center[2]])					
			];			
		}
						
		function cabinFills() {
			return [
				// roof
				fill([left[8], left[9], right[9], right[8]], fillColour, hullAlpha),
				// front
				fill([left[8], right[8], right[6], left[6]], fillColour, hullAlpha),
				// back
				fill([left[9], right[9], right[7], left[7]], fillColour, hullAlpha),
				// left
				fill([left[6], left[7], left[9], left[8]], fillColour, hullAlpha),
				// right
				fill([right[6], right[7], right[9], right[8]], fillColour, hullAlpha)
			];
		}		
		
		return {
			points: center
				.concat(left)
				.concat(right),
				
			primitives: hullFills()
				.concat(cabinFills())
				//
				//.concat([deckFill()])
				.concat(lines())
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));