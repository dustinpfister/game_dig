
var Game = (function () {

    var digmap = {

        offset : {

            x : 50,
            y : 50

        }

    },
    text_disp,
    map,
    layer1,

    genLayer = function () {

        var width = 8,
        height = 8,
        i = 0,
        x,
        y,
        len,
        data = [],
        len = width * height,
        landData;

        // use map.put to populate the layer
        while (i < len) {

            x = i % width;
            y = Math.floor(i / width);

            map.putTile(

                land.getCell(x, y, state.current.layer).amount ? 2 : 1, //Math.floor(Math.random() * 4),
                x,
                y,
                'activeLayer');

            i += 1;

        }

    },

    doOnceIf = (function () {

        var didIt = false;

        return function (condition, what) {

            if (!didIt && condition) {

                what();
                didIt = true;

            }

        };

    }
        ()),

    userAction = function (pointer) {

        var x,
        y;

        // click or touch on the layer?
        if (layer1.input.pointerDown()) {

            // use pointer.x, and pointer.y for a position relative to the canvas, and not the window.

            // dig in state.js
            state.userAction(pointer.position.x - digmap.offset.x, pointer.position.y - digmap.offset.y, function (result) {

                if (result.active) {

                    if (result.burst) {
                        // update the tile map
                        map.putTile(null, result.tileX, result.tileY, 'activeLayer');

                    }

                    if (result.dropEvent) {

                        console.log('drop!');
                        genLayer();

                    }

                    console.log('tile:');
                    console.log(result.tile);

                }

            });

        }

        // dig
        //state.userAction(pointer.clientX, pointer.clientY);

    };

    return {

        create : function () {

            //  Creates a blank tilemap
            map = app.add.tilemap();

            //  Add a Tileset image to the map
            map.addTilesetImage('tiles');

            layer1 = map.create('activeLayer', 8, 8, 32, 32);

            text_disp = app.add.bitmapText(50, 50, 'desyrel', 'a', 64);

            // tile size is a little weird for now
            // 50 is (map size in state.js / land width in land.js) 400 / 8 = 50.
            layer1.setScale(1.5, 1.5);

            layer1.fixedToCamera = false;
            layer1.x = digmap.offset.x;
            layer1.y = digmap.offset.x;
            layer1.inputEnabled = true;

            genLayer();

            app.add.button(480, 0, 'button', function () {

                app.state.start('title');

            }, this, 0, 0, 1);

            //app.input.addMoveCallback(move, this);

        },

        update : (function () {

            var delay = 300,
            last = new Date();

            return function () {

                if (app.input.pointer1.active) {

                    userAction(app.input.pointer1);

                }

                if (app.input.mousePointer.leftButton.isDown) {

                    if (new Date() - last >= delay) {

                        last = new Date();

                        userAction(app.input.mousePointer);

                    }

                }

                doOnceIf(app.input.mousePointer.active, function () {});

            };

        }
            ())

    };

}
    ());
