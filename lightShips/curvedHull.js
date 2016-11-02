(function (app) {
	var points = app.createPointsObject(),
		getNearestZFromArray = points.getNearestZFromArray;
		repeatSplitBezier = app.createBezierCurvesObject().repeatSplitBezierInTwo;
		
	// create and return API for this module	
	/* curves:
	 * 0 deck left 1
	 * 1 deck left 2
	 * 2 deck right 1
	 * 3 deck right 2
	 * 4 base left 1
	 * 5 base left 2
	 * 6 base right 1
	 * 7 base right 2
	*/
	app.createCurvedHull = function (primitives, perspective, curves, bezierSplitDepth, lineColour,fillColour,  alpha) {
		var createLine = primitives.createLine,
			createCurve = primitives.createCurve,
			fill = primitives.createFill,
			screenX = perspective.getScreenX,
			screenY = perspective.getScreenY,
			
			deck = {		
				getNearestZ: function getNearestZ() {
					return getNearestZFromArray([
						curves[0][0], curves[0][1], curves[0][2], curves[0][3],
						curves[1][1], curves[1][2], curves[1][3],
						curves[2][1], curves[2][2], curves[2][3],
						curves[3][1], curves[3][2]
					]);
				},
				
				draw: function (context) {
					context.save();
					context.fillStyle = colours.toRgb(fillColour, alpha);
					context.beginPath();
					context.moveTo(screenX(curves[0][0]), screenY(curves[0][0])); 
					context.bezierCurveTo(
						screenX(curves[0][1]), screenY(curves[0][1]),
						screenX(curves[0][2]), screenY(curves[0][2]),
						screenX(curves[0][3]), screenY(curves[0][3])
					);
					context.bezierCurveTo(
						screenX(curves[1][1]), screenY(curves[1][1]),
						screenX(curves[1][2]), screenY(curves[1][2]),
						screenX(curves[1][3]), screenY(curves[1][3])
					);
					context.bezierCurveTo(
						screenX(curves[3][2]), screenY(curves[3][2]),
						screenX(curves[3][1]), screenY(curves[3][1]),
						screenX(curves[3][0]), screenY(curves[3][0])
					);
					context.bezierCurveTo(
						screenX(curves[2][2]), screenY(curves[2][2]),
						screenX(curves[2][1]), screenY(curves[2][1]),
						screenX(curves[2][0]), screenY(curves[2][0])
					);
					context.closePath();
					context.fill();
					context.restore();
				}
			},

			curvePoints = [],
			hull = {};

			
			
		function hullFill(points) {
			return {					
				points: points,
				
				getNearestZ: function getNearestZ() {
					return getNearestZFromArray(points);
				},
				
				draw: function (context) {
					context.save();
					context.fillStyle = colours.toRgb(fillColour, alpha);
					context.beginPath();
					context.moveTo(screenX(points[0]), screenY(points[0])); 
					context.bezierCurveTo(
						screenX(points[1]), screenY(points[1]),
						screenX(points[2]), screenY(points[2]),
						screenX(points[3]), screenY(points[3])
					);
					context.lineTo(screenX(points[4]), screenY(points[4])); 
					context.bezierCurveTo(
						screenX(points[5]), screenY(points[5]),
						screenX(points[6]), screenY(points[6]),
						screenX(points[7]), screenY(points[7])
					);
					context.lineTo(screenX(points[0]), screenY(points[0])); 
					context.closePath();
					context.fill();
					context.restore();
				}
			};
		}			
			
		function hullSide(primitivesArray, deckSet, baseSet) {
			var i = curvePoints[deckSet].length - 1;
			
			while (i -3 >= 0) {
				var currentSet = [
					curvePoints[deckSet][i],	// 0
					curvePoints[deckSet][i-1],	// 1
					curvePoints[deckSet][i-2],	// 2
					curvePoints[deckSet][i-3],	// 3
					curvePoints[baseSet][i-3],	// 4
					curvePoints[baseSet][i-2],	// 5
					curvePoints[baseSet][i-1],	// 6
					curvePoints[baseSet][i] 	// 7
				];
									
				primitivesArray.push(createLine(currentSet[3], currentSet[4], lineColour, alpha));
				
				primitivesArray.push(hullFill(currentSet));
				
				i -= 3;					
			}				
			
		}	
			
		/* curves:
		 * 0 deck left 1
		 * 1 deck left 2
		 * 2 deck right 1
		 * 3 deck right 2
		 * 4 base left 1
		 * 5 base left 2
		 * 6 base right 1
		 * 7 base right 2
		 */	
		
		function hullCurves() {
			var primitives = [],
				i;

			curves.forEach(function (curve) {
				primitives.push(createCurve(curve[0], curve[1], curve[2], curve[3], lineColour, alpha));
				
				curvePoints.push(repeatSplitBezier(bezierSplitDepth, curve[0], curve[1], curve[2], curve[3]));
			}); 
			
			hullSide(primitives, 0, 4);
			hullSide(primitives, 1, 5);
			hullSide(primitives, 2, 6);
			hullSide(primitives, 3, 7);
			return primitives;
		}	
			
		function createCurveSets() {
			var sets = [];
			curves.forEach(function (curve) {				
				sets.push(repeatSplitBezier(bezierSplitDepth, curve[0], curve[1], curve[2], curve[3]));
			}); 			
			return sets;
		}	
			
		function getPoints() {
			var points = [],
				i;
				
			curvePoints.forEach(function (set) {
				for(i = set.length - 2; i > 0; i -= 1) {
					points.push(set[i]);
				}				
			});
			return points;
		}	
			
		curvePoints = createCurveSets();		
		hull.primitives = hullCurves();				
								
		return {
			points: getPoints(),
			primitives: [deck]
				.concat(hull.primitives)
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));