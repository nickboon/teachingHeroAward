(function (app) {
	function halfWayPoint(pointA, pointB) {
		return {
			x: (pointA.x + pointB.x) / 2,
			y: (pointA.y + pointB.y) / 2,
			z: (pointA.z + pointB.z) / 2
		}			
	}

	function splitBezierInTwo(pointA, pointB, pointC, pointD) {
		var pointE = halfWayPoint(pointA, pointB),
			pointF = halfWayPoint(pointB, pointC),
			pointG = halfWayPoint(pointC, pointD),
			pointH = halfWayPoint(pointE, pointF),
			pointI = halfWayPoint(pointF, pointG),
			pointJ = halfWayPoint(pointH, pointI);
					
		return [pointE, pointH, pointJ, pointI, pointG, pointD];			
	}

	function repeatSplitBezierInTwo(repeat, pointA, pointB, pointC, pointD) {
		var result = [pointA, pointB, pointC, pointD],
			newPoints = [],
			j = 0;
		
		for (; repeat >= 0; repeat -= 1) {
			do {
				newPoints = newPoints.concat(
					splitBezierInTwo(result[j], result[j+1], result[j+2], result[j+3])
				);
				j += 3;
			} while (j < result.length - 1);
			result = [pointA].concat(newPoints);;
			newPoints.length = 0;
			j = 0;
		}
		return result;
	}
	
	app.createBezierCurvesObject = function () {
		return {
			splitBezierInTwo: splitBezierInTwo,
			repeatSplitBezierInTwo, repeatSplitBezierInTwo
		};
	};
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));