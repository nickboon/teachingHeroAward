/* requires points, perspective, colours, directedRotation */
(function (app) {
	// objects from dependancies 
	var colours  = app.createColourObject(), 
		getNearestZFromArray = app.createPointsObject().getNearestZFromArray;
		
	// create and return API for this module
	app.createlightship = function (perspective, lineColour, fillColour, alpha) { 
		var getScreenX = perspective.getScreenX,
			getScreenY = perspective.getScreenY,
			points = [
				{x: -50, y: 30, z: 0}, // 0 start curve
				{x: 80, y: 30, z: 0}, // 1 control 1
				{x: 130, y: 30, z: 0}, // 2 control 2
				{x: 180, y: -30, z: 0}, // 3 end curve (point);
				{x: -150, y: -30, z: 10}, // 4 front
				{x: -150, y: 0, z: 7}, // 5
				{x: -50, y: -10, z: 8}, // 6
				{x: -150, y: -30, z: -10}, // 7 back
				{x: -150, y: 0, z: -7}, // 8
				{x: -50, y: -10, z: -8}, // 9
				// move the end 1px away
				{x: -151, y: -30, z: 10}, // 10 front
				{x: -151, y: 0, z: 7}, // 11
				{x: -151, y: -30, z: -10}, // 12 back
				{x: -151, y: 0, z: -7} // 13
			],
			knifePoint = points[3];
		
		function getKnifePoint() {
			return knifePoint;
		}
		
		function shouldDisappear() {
			var deviation = knifePoint.x;
				
			return (deviation < margin && deviation > -margin)
		}

		function createDisappearingCurve(pointA, pointB, pointC, pointD, colour) {
			return {
				points: [pointA, pointB, pointC, pointD],

				getNearestZ: function getNearestZ() {
					return Math.min(pointA.z, pointD.z);			
				},
				
				draw: function (context) {
					if(shouldDisappear()) {
						return;
					}
					
					context.save();
					context.beginPath();
					context.strokeStyle = colours.toRgb(colour, alpha);
					context.moveTo(getScreenX(pointA), getScreenY(pointA));
					context.bezierCurveTo(
						getScreenX(pointB), getScreenY(pointB),
						getScreenX(pointC), getScreenY(pointC),
						getScreenX(pointD), getScreenY(pointD)
					);
					context.stroke();
					context.restore();
				}		
			};	
		}
		
		function createDisappearingLine (pointA, pointB) {
			return {
				points: [pointA, pointB],
				
				getNearestZ: function getNearestZ() {
					return Math.min(pointA.z, pointB.z);			
				},
				
				draw: function (context) {
					if(shouldDisappear()) {
						return;
					}
	 
					context.save();
					context.beginPath();
					context.strokeStyle = colours.toRgb(lineColour, alpha);
					context.moveTo(getScreenX(pointA), getScreenY(pointA));
					context.lineTo(getScreenX(pointB), getScreenY(pointB));
					context.stroke();
					context.restore();
				}	
			};			
		}
		
		function createDisappearingFill(points) {
			return {
				points: points,
				
				getNearestZ: function getNearestZ() {
					return getNearestZFromArray(points);
				},
				
				draw: function (context) {
					var lastIndex = points.length - 1,
						i;

					if(shouldDisappear()) {
						return;
					}
						
					context.save();
					context.fillStyle = colours.toRgb(fillColour, alpha);
					context.beginPath();
					context.moveTo(
						getScreenX(points[lastIndex]), getScreenY(lastIndex)
					);				
					for(i = lastIndex ; i >= 0; i -= 1) {
						context.lineTo(
							getScreenX(points[i]), getScreenY(points[i])
						);		
					}
					context.closePath();
					context.fill();
					context.restore();
				}	
			};	
		}
			
		function createDisappearingSideFill(handlePoints) {
			return {
				
				points: handlePoints.concat(
					[points[0], points[1], points[2], points[3]]
				),
				
				getNearestZ: function getNearestZ() {
					return getNearestZFromArray(points);
				},
				
				draw: function (context) {
					if(shouldDisappear()) {
						return;
					}
									
					context.save();
					context.fillStyle = colours.toRgb(fillColour, alpha);
					context.beginPath();
					context.moveTo(
						getScreenX(points[0]), getScreenY(points[0])
					); 
					context.bezierCurveTo(
						getScreenX(points[1]), getScreenY(points[1]),
						getScreenX(points[2]), getScreenY(points[2]),
						getScreenX(points[3]), getScreenY(points[3])
					); 
					context.lineTo(
						getScreenX(handlePoints[0]), 
						getScreenY(handlePoints[0]));
					context.lineTo(
						getScreenX(handlePoints[1]), 
						getScreenY(handlePoints[1]));
					context.lineTo(
						getScreenX(handlePoints[2]), 
						getScreenY(handlePoints[2])); 
					context.closePath();
					context.fill();
					context.restore();
				}
			} 
		}

		function createPrimitives(lineColour, fillColour,  alpha) {
			return [ 
				createBladeEdge(lineColour, alpha),
				createDisappearingLine(points[3], points[4]),
				createDisappearingLine(points[4], points[5]),
				createDisappearingLine(points[5], points[6]),
				createDisappearingLine(points[6], points[0]),
				createDisappearingLine(points[7], points[8]),
				createDisappearingLine(points[8], points[9]),
				createDisappearingLine(points[9], points[0]),
				createDisappearingLine(points[3], points[7]),
				createDisappearingLine(points[4], points[7]),
				createDisappearingLine(points[5], points[8]),
				createDisappearingLine(points[6], points[9]),
				createDisappearingLine(points[6], points[9]),
				createDisappearingFill([points[12], points[10], points[11], points[13]]),
				createDisappearingFill([points[3], points[7], points[4]]),
				createDisappearingFill([points[8], points[5], points[6], points[9]]),
				createDisappearingFill([points[9], points[6], points[0]]),
				createDisappearingSideFill([points[4], points[5], points[6]]), // front
				createDisappearingSideFill([points[7], points[8], points[9]]) // back 
			];
		}

		function createBladeEdge(colour, alpha) {
			return createDisappearingCurve(
				points[0],
				points[1],
				points[2],
				points[3], colour, alpha
			);
		}
	
		return {
			points: points,
			getKnifePoint: getKnifePoint,
			primitives: createPrimitives(lineColour, fillColour, alpha),
			createBladeEdge: createBladeEdge 
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));

