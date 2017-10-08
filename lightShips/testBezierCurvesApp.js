/* requires test */
(function(app) {
    function checkForDuplicateElements(array) {
        var i = array.length - 1,
            j;

        for (; i >= 0; i -= 1) {
            for (j = i - 1; j >= 0; j -= 1) {
                if (array[i] === array[j]) {
                    return false;
                }
            }
        }
        return true;
    }

    function unitTests() {
        var bezierCurvesObject = app.createBezierCurvesObject(),
            sut1 = bezierCurvesObject.splitBezierInTwo,
            splitBezierInTwoTest = app.createTestObject('splitBezierInTwo(pointA, pointB, pointC, pointD)'),
            repeatSplitBezierInTwoTest = app.createTestObject('repeatSplitBezierInTwo(repeat, pointA, pointB, pointC, pointD)'),
            sut2 = bezierCurvesObject.repeatSplitBezierInTwo,
            result;

        result = sut1(
            splitBezierInTwoTest.createPointFixture(),
            splitBezierInTwoTest.createPointFixture(),
            splitBezierInTwoTest.createPointFixture(),
            splitBezierInTwoTest.createPointFixture()
        ).length;

        splitBezierInTwoTest.assertEqual("We expect 6 points returned when the curve is split.", 6, result)

        result = sut2(
            0,
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture()
        ).length;

        repeatSplitBezierInTwoTest.assertEqual("We expect 7 points returned when the curve is split once.", 7, result);

        result = sut2(
            1,
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture()
        ).length;

        repeatSplitBezierInTwoTest.assertEqual("We expect 13 points returned when the curve is split twice.", 13, result);

        result = sut2(
            2,
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture()
        ).length;

        repeatSplitBezierInTwoTest.assertEqual("We expect 25 points returned when the curve is split thrice.", 25, result);

        result = sut2(
            3,
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture(),
            repeatSplitBezierInTwoTest.createPointFixture()
        );
        result = checkForDuplicateElements(result);

        repeatSplitBezierInTwoTest.assertEqual("We expect no duplicate elements in the returned array.", true, result);
    }

    function visualTest(canvas) {
        var colours = app.createColourObject(),
            context = canvas.getDrawingContext(),
            vanishingPointX = canvas.getWidth() / 2,
            vanishingPointY = canvas.getHeight() / 2,
            perspective = app.createPerspectiveObject(vanishingPointX, vanishingPointY);
        screenX = perspective.getScreenX,
            screenY = perspective.getScreenY,
            points = [
                { x: -100, y: 100, z: 0 },
                { x: -50, y: 50, z: 0 },
                { x: -50, y: -50, z: 0 },
                { x: 0, y: -100, z: 0 }
            ],
            initialCurveColour = '#000000',
            newCurveColour = '#ff0000',
            bezierCurvesObject = app.createBezierCurvesObject(),
            sut = bezierCurvesObject.repeatSplitBezierInTwo,
            result = [];


        function toggleRedGreen(colour) {
            return (colour === '#ff0000') ? '#00ff00' : '#ff0000';
        }

        function markPoints(points, colour) {
            var halfwidth = 10;

            points.forEach(function(point) {
                context.save();
                context.beginPath();
                context.strokeStyle = colours.toRgb(colour, 0.5);
                context.moveTo(screenX(point) - halfwidth, screenY(point));
                context.lineTo(screenX(point) + halfwidth, screenY(point));
                context.moveTo(screenX(point), screenY(point) - halfwidth);
                context.lineTo(screenX(point), screenY(point) + halfwidth);
                context.stroke();
                context.restore();

                if (colour != initialCurveColour) {
                    colour = toggleRedGreen(colour);
                }
            });
        }

        function drawCurve(points, colour) {
            var i = points.length - 1;

            context.save();

            while (i - 3 >= 0) {
                context.strokeStyle = colours.toRgb(colour, 0.5);
                context.beginPath();
                context.moveTo(screenX(points[i]), screenY(points[i]));
                context.bezierCurveTo(
                    screenX(points[i - 1]), screenY(points[i - 1]),
                    screenX(points[i - 2]), screenY(points[i - 2]),
                    screenX(points[i - 3]), screenY(points[i - 3])
                );
                context.stroke();
                if (colour != initialCurveColour) {
                    colour = toggleRedGreen(colour);
                }
                i -= 3;
            }

            context.restore();
            markPoints(points, colour);
        }

        drawCurve(points, initialCurveColour);

        result = sut(1, points[0], points[1], points[2], points[3]);
        drawCurve(result, newCurveColour);
    }

    app.run = function() {
        var canvas = app.createCanvasObject(400, 300);
        unitTests();
        visualTest(canvas);
    }
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));