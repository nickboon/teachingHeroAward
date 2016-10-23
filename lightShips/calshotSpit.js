(function (app) {
	// create and return API for this module
	app.createCalshotSpitHull = function (primitives, perspective, width, deckHeight, length, lineColour, fillColour, hullAlpha) {
		var line = primitives.createLine,
			curve = primitives.createCurve,
			fill = primitives.createFill,
			screenX = perspective.getScreenX,
			screenY = perspective.getScreenY,
			getNearestZFromArray = app.createPointsObject().getNearestZFromArray,
			halfWidth = width / 2,
			deckhouseHeight = deckHeight * 1.5,
			halfLength = length / 2,
			thirdWidth = width / 3,
			thirdLength = length / 3,	
			zOffset = -length * .4,
			deckPoints = [
				{x: -halfWidth, y: -deckHeight -5, z: -70 + zOffset}, // 0 start curve stern
				{x: -halfWidth -thirdWidth * 2, y: -deckHeight, z: -10 + zOffset}, // 1 control 1
				{x: -halfWidth -thirdWidth * 2, y: -deckHeight, z: 155 + zOffset}, // 2 control 2
				{x: 0, y: -deckHeight - 10, z: 180 + zOffset}, // 3 end curve (bows);
			
				{x: halfWidth + thirdWidth * 2, y: -deckHeight, z: 155 + zOffset}, // 4 control 2
				{x: halfWidth + thirdWidth * 2, y: -deckHeight, z: -10 + zOffset}, // 5 control 1
				{x: halfWidth, y: -deckHeight - 5, z: -70 + zOffset}, // 6	start curve stern
				
				{x: -thirdWidth, y: -deckHeight - 7, z: -80 + zOffset}, // 7 bow control 1
				{x: thirdWidth, y: -deckHeight - 7, z: -80 + zOffset}, // 8 bow control 2
			],
			footprintPoints = [	
				{x: -halfWidth, y: 0, z: -70 + zOffset}, // 0 start curve stern
				{x: -halfWidth -thirdWidth, y: 0, z: -10 + zOffset}, // 1 control 1
				{x: -halfWidth -thirdWidth, y: 0, z: 155 + zOffset}, // 2 control 2
				{x: 0, y: 0, z: 180 + zOffset  - 10}, // 3 end curve (bows);
			
				{x: halfWidth + thirdWidth, y: 0, z: 155 + zOffset}, // 4  control 1
				{x: halfWidth + thirdWidth, y: 0, z: -10 + zOffset}, // 5 control 32
				{x: halfWidth, y: 0, z: -70 + zOffset}, // 6	start curve stern
				
				{x: -thirdWidth, y: 0, z: -80 + zOffset}, // 7 bow control 1
				{x: thirdWidth, y: 0, z: -80 + zOffset} // 8 bow control 2
			],
			deckhousePoints = [
				{ x: -halfWidth, y: -deckhouseHeight, z: -halfLength},// 0 left top front
				{ x: halfWidth, y: -deckhouseHeight, z: -halfLength}, // 1 right top front
				{ x: halfWidth, y: -deckHeight, z: -halfLength},  // 2 right bottom front 
				{ x: -halfWidth, y: -deckHeight, z: -halfLength}, // 3 left bottom front
				{ x: -halfWidth, y: -deckhouseHeight, z: halfLength}, // 4 left top back
				{ x: halfWidth, y: -deckhouseHeight, z: halfLength},	 // 5 right top back
				{ x: halfWidth, y: -deckHeight, z: halfLength},	 // 6 right bottom back
				{ x: -halfWidth, y: -deckHeight, z:  halfLength}	 // 7 left bottom 
			];
			
			
			
			var deck = {
				leftStern: {x: -15, y: -25, z: -110}, 
				leftSternC: {x: -35, y: -20, z: -50},
				leftSternC2: {x: -30, y: -20, z: -50},
				leftMid: {x: -30, y: -20, z: 0},
				leftBowC: {x: -30, y: -20, z: 115},
				leftBowC2: {x: -30, y: -20, z: 120},

				bow: {x: 0, y: -30, z: 140},
				
				rightStern: {x: 15, y: -25, z: -110}, 
				rightsternC: {x: 35, y: -20, z: -50},
				rightSternC2: {x: 30, y: -20, z: -50},
				rightMid: {x: 30, y: -20, z: 0},
				rightBowC: {x: 30, y: -20, z: 115},
				rightBowC2: {x: 30, y: -20, z: 10},
				
				sternCLeft: {x: -10, y: -27, z: -120},				
				stern: {x: 0, y: -28, z: -117},				
				sternCRight: {x: 10, y: -27, z: -120}
			},
			footprint = {	
				leftStern: {x: -15, y: 0, z: -110}, 
				leftSternC: {x: -25, y: 0, z: -50},
				leftSternC2: {x: -30, y: 0, z: -50},
				leftMid: {x: -25, y: 0, z: 25},
				leftBowC: {x: -25, y: 0, z: 115},
				leftBowC2: {x: -25, y: -20, z: 120},
				
				bow: {x: 0, y: 0, z: 130}, 
			
				rightBowC: {x: 25, y: 0, z: 115},
				rightBowC2: {x: 25, y: 0, z: -50},
				rightMid: {x: 25, y: 0, z: 15},
				rightStern: {x: 15, y: 0, z: -110},
				leftSternC: {x: 25, y: 0, z: -50},
				leftSternC2: {x: 30, y: 0, z: -50},
				
				sternCLeft: {x: -10, y: 0, z: -120},
				stern: {x: 0, y: 0, z: -117},				
				sternCRight: {x: 10, y: 0, z: -120}
			};
			
		function createDeckFill(points) {
			return {					
				points: points,
				
				getNearestZ: function getNearestZ() {
					return getNearestZFromArray(points);
				},
				
				draw: function (context) {
					context.save();
					context.fillStyle = colours.toRgb(fillColour, hullAlpha);
					context.beginPath();
					context.moveTo(
						screenX(points[0]), screenY(points[0])
					); 
					context.bezierCurveTo(
						screenX(points[1]), screenY(points[1]),
						screenX(points[2]), screenY(points[2]),
						screenX(points[3]), screenY(points[3])
					); 
					context.bezierCurveTo(
						screenX(points[4]), screenY(points[4]),
						screenX(points[5]), screenY(points[5]),
						screenX(points[6]), screenY(points[6])
					); 
					context.bezierCurveTo(
						screenX(points[8]), screenY(points[8]),
						screenX(points[7]), screenY(points[7]),
						screenX(points[0]), screenY(points[0])
					); 
					context.closePath();
					context.fill();
					context.restore();
				}
			};
		}
			
		function createSideFill() {
			// width = 30,
			// deckHeight = 20,
		    // length =100,
		    // mastHeight = 150;
		    // zOffest = -40

			return {					
				points: [
					deck.bow, deck.leftMid,
					footprint.bow, footprint.leftMid
				],
				
				getNearestZ: function getNearestZ() {
					return getNearestZFromArray(deckPoints);
				},
				
				draw: function (context) {
					context.save();
					context.fillStyle = colours.toRgb('#00ff00', hullAlpha);
					context.beginPath();
					context.moveTo(screenX(deck.bow), screenY(deck.bow)); 
					context.bezierCurveTo(
						screenX(deck.leftBowC), screenY(deck.leftBowC),
						screenX(deck.leftBowC2), screenY(deck.leftBowC2),
						screenX(deck.leftMid), screenY(deck.leftMid)
					); 
					
					context.lineTo(screenX(footprint.leftMid), screenY(footprint.leftMid)); 
					context.bezierCurveTo(
						screenX(deck.leftBowC2), screenY(deck.leftBowC2),
						screenX(deck.leftBowC), screenY(deck.leftBowC),
						screenX(deck.leftMid), screenY(deck.leftMid));
					context.lineTo(screenX(footprint.bow), screenY(footprint.bow)); 
					context.closePath();
					context.fill();
					context.restore();
				}
			};
		}
		function getPrimitives() {				
			return [					
				// footprint
				curve(
					footprintPoints[0], footprintPoints[1], footprintPoints[2], footprintPoints[3], lineColour, hullAlpha),
				curve(
					footprintPoints[6], footprintPoints[5], footprintPoints[4], footprintPoints[3], lineColour, hullAlpha),
				curve(
					footprintPoints[0], footprintPoints[7], footprintPoints[8], footprintPoints[6], lineColour, hullAlpha),
				line(
					deckPoints[3], footprintPoints[3], lineColour, hullAlpha),
				createSideFill(deckPoints, footprintPoints),
				// deck
				curve(
					deckPoints[0], deckPoints[1], deckPoints[2], deckPoints[3],
					lineColour, hullAlpha),
				curve(
					deckPoints[6], deckPoints[5], deckPoints[4], deckPoints[3],
					lineColour, hullAlpha),
				curve(
					deckPoints[0], deckPoints[7], deckPoints[8], deckPoints[6],
					lineColour, hullAlpha),
				createDeckFill(deckPoints),
				//deckhouse
				line(
					deckhousePoints[0], deckhousePoints[1], lineColour, hullAlpha),
				line(
					deckhousePoints[1], deckhousePoints[2], lineColour, hullAlpha),
				line(
					deckhousePoints[2], deckhousePoints[3], lineColour, hullAlpha),
				line(
					deckhousePoints[3], deckhousePoints[0], lineColour, hullAlpha),
				line(
					deckhousePoints[5], deckhousePoints[4], lineColour, hullAlpha),
				line(
					deckhousePoints[4], deckhousePoints[7], lineColour, hullAlpha),
				line(
					deckhousePoints[7], deckhousePoints[6], lineColour, hullAlpha),
				line(
					deckhousePoints[6], deckhousePoints[5], lineColour, hullAlpha),
				line(
					deckhousePoints[0], deckhousePoints[4], lineColour, hullAlpha),
				line(
					deckhousePoints[1], deckhousePoints[5], lineColour, hullAlpha),
				line(
					deckhousePoints[2], deckhousePoints[6], lineColour, hullAlpha),
				line(
					deckhousePoints[3], deckhousePoints[7], lineColour, hullAlpha),

				// fill points are defined clockwise
				fill(
					[deckhousePoints[0], deckhousePoints[1], deckhousePoints[2], deckhousePoints[3]], fillColour, hullAlpha),
				fill(
					[deckhousePoints[5], deckhousePoints[4], deckhousePoints[7], deckhousePoints[6]], fillColour, hullAlpha),
				fill(
					[deckhousePoints[4], deckhousePoints[0], deckhousePoints[3], deckhousePoints[7]], fillColour, hullAlpha),
				fill(
					[deckhousePoints[1], deckhousePoints[5], deckhousePoints[6], deckhousePoints[2]], fillColour, hullAlpha),
				fill(
					[deckhousePoints[4], deckhousePoints[5], deckhousePoints[1], deckhousePoints[0]], fillColour, hullAlpha),
			];				
		}

		if (!primitives || !perspective) {
			throw 'You need to pass in a primitives object and a perspective to create a Calshot Spit hull.';
		}

		return {
			points: footprintPoints
				.concat(deckPoints)
				.concat(deckhousePoints)
				.concat([
					deck.bow, deck.leftMid, deck.leftBowC, deck.leftBowC2,
					footprint.bow, footprint.leftMid, footprint.leftBowC, footprint.leftBowC2
				]),
				
			primitives: getPrimitives()
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
