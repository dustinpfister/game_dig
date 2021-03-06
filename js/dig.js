
var DIG = (function () {

    var showPebble = false,

    layer1,
    layer2,
    map,

    Layers = {

        dropAnimation : false,
        dropFrame : 0,
        dropMaxFrames : 100,

        // the current drop down tile
        dropTile : {

            setActive : true,
            x : 0,
            y : 0

        },

        // set the drop down tile
        setDropTile : function (x, y) {

            // if set active it true
            if (this.dropTile.setActive) {

                this.dropTile.x = x;
                this.dropTile.y = y;

            } else {

                // else default to 0,0

                this.dropTile.x = 0;
                this.dropTile.y = 0;

            }

        },

        // setup the map (this is called in DIG.run)
        setupMap : function () {

            //  Creates a blank tilemap
            map = app.add.tilemap();

            //  Add a Tileset image to the map
            map.addTilesetImage('tiles');

            layer1 = map.create('activeLayer', 8, 8, 32, 32);
            layer2 = map.createBlankLayer('zoomLayer', 8, 8, 32, 32);

            // tile size is a little weird for now
            layer1.fixedToCamera = false;
            layer1.width = app.height * .8;
            layer1.height = app.height * .8;
            layer1.x = app.width * .05;
            layer1.y = app.height * .05;
            layer1.inputEnabled = true;

            // zoom layer
            layer2.fixedToCamera = false;
            layer2.x = -32;
            layer2.y = -32;
            layer2.width = 32;
            layer2.height = 32;

            this.genLayer('activeLayer', state.current.layer);
            this.genLayer('zoomLayer', state.current.layer);

        },

        dropStart : function () {

            this.dropFrame = 0;
            this.dropAnimation = true;

            // set the active, and zoom layer
            this.genLayer('activeLayer', state.current.layer);
            this.genLayer('zoomLayer', state.current.layer - 1);
            layer2.width = app.height * .8;
            layer2.height = app.height * .8;
            layer2.alpha = 1;

            layer1.width = 0;
            layer1.height = 0;

        },

        droping : function () {

            if (this.dropAnimation) {

                var delta = app.width * 2 / this.dropMaxFrames,
                home = app.width * .05,
                tileSize,
                i = this.dropFrame / this.dropMaxFrames;

                this.dropFrame += 1;

                layer2.width += delta * 2;
                layer2.height += delta * 2;
                layer2.alpha = 1 - i;
                tileSize = layer2.width / 8;
                layer2.x = home - delta * this.dropFrame + (tileSize * this.dropTile.x * i - tileSize / 2);
                layer2.y = home - delta * this.dropFrame + (tileSize * this.dropTile.y * i - tileSize / 2);

                layer1.width = app.height * .8 * i;
                layer1.height = app.height * .8 * i;
                layer1.x = home + (app.height * .4 - layer1.width / 2);
                layer1.y = home + (app.height * .4 - layer1.width / 2);
                layer1.alpha = i;

                if (this.dropFrame === this.dropMaxFrames) {

                    layer2.x = -32;
                    layer2.y = -32;
                    layer2.width = 32;
                    layer2.height = 32;
                    this.dropFrame = 0;
                    this.dropAnimation = false;

                    //genLayer();
                    //genLayer('activeLayer', state.current.layer);

                }

            }

        },

        update : function () {

            if (!this.dropAnimation) {

                Layers.genLayer('activeLayer', state.current.layer);

            }

        },

        // generate, or regenerate the tilemap to the current layer
        genLayer : function (layerName, stackLayerNumber) {

            var width = 8,
            height = 8,
            i = 0,
            x,
            tile,
            y,
            len,
            data = [],
            len = width * height,
            landData,
            tileSet,
            zeroTile;

            layerName = layerName || 'activeLayer';

            //stackLayerNumber = stackLayerNumber || state.current.layer;

            stackLayerNumber === undefined ? state.current.layer : stackLayerNumber;

            tileSet = stackLayerNumber === 0 ? 3 : 1;
            zeroTile = stackLayerNumber === land.d - 1 ? 1 : 0; // the tile sheet index for a tile with 0 hp

            // use map.put to populate the layer
            while (i < len) {

                x = i % width;
                y = Math.floor(i / width);

                tile = land.getCell(x, y, stackLayerNumber);

                map.putTile(

                    showPebble ? tile.amount > 0 ? 2 : tile.hp === 0 ? zeroTile : tileSet * 10 + tile.hp : tile.hp === 0 ? zeroTile : tileSet * 10 + tile.hp,
                    x,
                    y,
                    layerName);

                i += 1;

            }

        },

    },

    // current tile bursts
    bursts = [],

    // bursts collection updater to be called in DIG.run's update method
    burstsUpdater = function () {

        var i = bursts.length;

        if (i > 0) {
            while (i--) {

                bursts[i].update();

                if (!bursts[i].alive) {

                    bursts.splice(i, 1);

                }

            }

        }

    },

    // the tile burst constructor
    Burst = function (map, stateResult) {

        var sprite,

        si,
        bottom = 0, // bottom part of the tile if 0 (0 or 1)
        right = 0, // right part of the tile if 0 (0 or 1)

        w = layer1.width / map.width,
        h = layer1.height / map.height,
        x = w * stateResult.tileX + layer1.left,
        y = h * stateResult.tileY + layer1.top,
        tile = layer1.getTiles(x, y, 1, 1)[0],
        tileIndex = tile.index; // the 32 x 32 relative sprite index

        this.sprites = [];
        this.birth = new Date();
        this.alive = true;

        // if pebble start pebble sprite
        if (stateResult.tileStatus.amount) {

            // pebble icon sprite
            sprite = app.add.sprite(x, y, 'icons', 2);
            sprite.width = w / 2;
            sprite.height = h / 2;
            app.physics.enable([sprite], Phaser.Physics.ARCADE);
            sprite.body.velocity.y = -96;

            // push the pebble icon
            this.sprites.push(sprite);

            // amount text
            sprite = app.add.bitmapText(x + sprite.width, y, 'desyrel', '+' + stateResult.tileStatus.amount, 30);
            app.physics.enable([sprite], Phaser.Physics.ARCADE);
            sprite.body.velocity.y = -96;
            this.sprites.push(sprite);

        }

        // make burst sprites
        si = 0;
        while (si < 4) {

            sprite = app.add.sprite(
                    x + w / 2 * right,
                    y + h / 2 * bottom,
                    'tiles_split', tileIndex * 2 + 20 * bottom + right + 20 * Math.floor(tileIndex / 10));
            sprite.width = w / 2;
            sprite.height = h / 2;
            app.physics.enable([sprite], Phaser.Physics.ARCADE);

            sprite.body.velocity.x = -32 * (1 - 2 * right);
            sprite.body.velocity.y = -32 * (1 - 2 * bottom);
            //sprite.lifeSpan = 100;

            right += 1;
            if (right === 2) {

                right = 0;
                bottom += 1;

            }

            si += 1;

            this.sprites.push(sprite);

        }

    };

    Burst.prototype.update = function () {

        var age = new Date() - this.birth;

        // destroy old sprites
        if (age > 2500) {

            this.sprites.forEach(function (sprite) {

                sprite.destroy();

            });
            this.alive = false;

        }

        this.sprites.forEach(function (sprite) {

            sprite.alpha = 1 - age / 2500;

        });

    };

    return {

        // show pebble method is used by egg.js
        showPebble : function (setTo) {

            showPebble = !showPebble;

            if (typeof setTo === 'boolean') {

                showPebble = setTo

            }

            Layers.genLayer('activeLayer', state.current.layer);

        },

        // external reGen method is used by egg.js

        reGen : function () {

            Layers.genLayer('activeLayer', state.current.layer);

        },

        // DIG.run Phaser state (the actual main game state, running at the current layer)
        run : (function () {

            var text_disp,
            text_digs,
            text_layer,
            text_pebble,
            text_totals,
            text_landLevel,
            textNames = ['digs', 'layer', 'pebble', 'landLevel'],
            dropAnimation = false, // are we doing a drop animation now?
            dropFrame = 0,
            dropMaxFrames = 30,
            dropTile = {

                x : -1,
                y : 0

            },
            text = {},
            //map,

            log = function (mess) {

                if (typeof mess === "string") {

                    console.log('game.js: ' + mess);

                } else {

                    console.log(mess);

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

            // update Display Info
            updateInfo = function () {

                // update display info
                // what to display for each text
                var what = [

                    state.current.digs,
                    (state.current.layer + 1) + '/' + land.d,
                    state.current.pebble,
                    state.current.landLevel

                ];

                // update text
                textNames.forEach(function (textName, i) {

                    text[textName].text = what[i];

                });

                text_totals.text = land.getInfo().tabString;

            },

            // DIG.run userAction helper
            userAction = function (sprite, pointer) {

                var cellSize = Math.floor(sprite.width / land.w),
                x = pointer.x - sprite.x,
                y = pointer.y - sprite.y,
                cellX = Math.floor(x / cellSize),
                cellY = Math.floor(y / cellSize);

                // if a dropdown animation is not goinf on
                if (!Layers.dropAnimation) {

                    // dig at state.js
                    state.userAction(
                        cellX,
                        cellY,
                        function (result) {

                        if (result.active) {

                            if (result.burst) {

                                // start the new burst animation
                                bursts.push(new Burst(map, result));

                                // update the tile map
                                map.putTile(0, result.tileX, result.tileY, 'activeLayer');

                            }

                            if (result.dropEvent) {

                                Layers.setDropTile(
                                    cellX < 4 ? 4 - cellX : 0 - (cellX - 4),
                                    cellY < 4 ? 4 - cellY : 0 - (cellY - 4));

                                Layers.dropStart();

                            }

                        }

                    });

                    // out of digs?
                    if (state.current.digs <= 0) {

                        app.state.start('dig_over');

                    }

                    // out of tiles on the bottom layer?
                    if (state.current.layer === land.d - 1) {

                        (function () {

                            var theBottom = land.getLayer(land.d - 1),
                            count = theBottom.length;

                            theBottom.forEach(function (cell) {

                                if (cell.done) {

                                    count -= 1;

                                }

                            });

                            if (count <= 0) {

                                app.state.start('dig_over');

                            }

                        }
                            ());

                        Layers.update();

                    }

                    // all the pebble? wow!
                    (function () {

                        var info = land.getInfo();

                        if (info.tab.remaining <= 0) {

                            app.state.start('dig_over');

                        }

                    }
                        ());

                    updateInfo();

                } else {

                    log('cant do that now, droping down...');

                }

            };

            // what will get returned to DIG.run
            return {

                // DIG.run's create method
                create : function () {

                    var iconSX = app.width * .72,
                    iconSY = app.height * .20,
                    iconStep = app.height * .15,
                    iconSize = app.width * .08,
                    textSize = app.width * .06,

                    // shovel, layers,coin,steps
                    iconIndexs = [0, 3, 2, 4],

                    sprite;

                    Layers.setupMap();

                    // touch mouse event handler on the tilemap
                    layer1.events.onInputDown.add(userAction);

                    // place the icons
                    iconIndexs.forEach(function (iconIndex, i) {

                        // icons
                        sprite = app.add.sprite(iconSX, iconSY + iconStep * i, 'icons', iconIndex);
                        sprite.width = iconSize;
                        sprite.height = iconSize;

                        // icon text
                        text[textNames[i]] = app.add.bitmapText(
                                iconSX + iconSize,
                                iconSY + iconStep * i, 'desyrel', '0', textSize);

                    });

                    // pebble totals
                    text_totals = app.add.bitmapText(
                            app.width * 0.05,
                            app.height * .86, 'desyrel', land.getInfo().tabString, textSize);

                    sprite = app.add.button(app.width - iconSize, 0, 'icons', function () {

                            app.state.clearCurrentState();
                            app.state.start('dig_options');

                        }, this, 1, 1, 1);

                    sprite.width = iconSize;
                    sprite.height = iconSize;

                    // call update info foe the first time
                    updateInfo();

                    // start ARCADE Physics
                    app.physics.startSystem(Phaser.Physics.ARCADE);
                    //  Set the world (global) gravity
                    app.physics.arcade.gravity.y = 100;

                },

                // DIG.run's update method
                update : (function () {

                    return function () {

                        burstsUpdater();

                        Layers.droping();

                    };

                }
                    ())

            };

        }
            ()),

        // DIG.options Phaser state ( switches to when the gear icon is clicked )
        options : (function () {

            var text_label;

            return {

                create : function () {

                    var textSize = app.width * .1,
                    sprite,
                    buttonW = app.width * .6,
                    buttonH = app.height * .2,
                    buttonX = app.world.centerX - buttonW / 2,
                    buttonStartY = app.height * .3,
                    buttonStepY = app.height * .20,

                    text_label = app.add.bitmapText(0, 0, 'desyrel', 'Game Options:', textSize);
                    text_label.x = app.world.centerX - text_label.width / 2;
                    text_label.y = app.height * .05;

                    // resume button
                    sprite = app.add.button(0, 0, 'button', function () {

                            app.state.start('dig_run');

                        }, this, 6, 6, 7);
                    sprite.width = buttonW;
                    sprite.height = buttonH;
                    sprite.x = buttonX;
                    sprite.y = buttonStartY;

                    // new game button
                    sprite = app.add.button(0, 0, 'button', function () {

                            state.reset();
                            land.reset();

                            app.state.start('dig_run');

                        }, this, 0, 0, 1);
                    sprite.width = buttonW;
                    sprite.height = buttonH;
                    sprite.x = buttonX;
                    sprite.y = buttonStartY + buttonStepY;

                    // new game button
                    sprite = app.add.button(0, 0, 'button', function () {

                            app.state.start('title');

                        }, this, 4, 4, 5);
                    sprite.width = buttonW;
                    sprite.height = buttonH;
                    sprite.x = buttonX;
                    sprite.y = buttonStartY + buttonStepY * 2;

                }

            };
        }
            ()),

        // DIG.over Phaser state (game will switch to this when the run state comes to an end)
        over : (function () {

            var test_label,
            text_totalPebble,
            text_pebbelWon;

            return {

                create : function () {

                    var textSize = app.width * .1,
                    landInfo = land.getInfo(),
                    pebbleWon = landInfo.tab.total - landInfo.tab.remaining,

                    buttonW = app.width * .6,
                    buttonH = app.height * .2,
                    buttonX = app.world.centerX - buttonW / 2,
                    buttonStartY = app.height * .55,
                    buttonStepY = app.height * .20,

                    iconSize = app.width * .08,
                    sprite,

                    text_label = app.add.bitmapText(0, 0, 'desyrel', 'Dig is Over!', textSize);
                    text_label.x = app.world.centerX - text_label.width / 2;
                    text_label.y = app.height * .05;

                    text_totalPebble = app.add.bitmapText(96, 128, 'desyrel',
                            'Total Land Pebble : ' + landInfo.tab.total, textSize / 2);

                    text_totalPebble.x = app.world.centerX - text_totalPebble.width * .5;
                    text_totalPebble.y = app.height * .25;

                    text_pebbleWon = app.add.bitmapText(96, 128 + 32, 'desyrel',
                            'Pebble Won : ' + pebbleWon, textSize * .9);

                    text_pebbleWon.x = app.world.centerX - text_pebbleWon.width / 2;
                    text_pebbleWon.y = app.height * .3;

                    state.levelUp();
                    state.reset();
                    land.reset();

                    // new game button
                    sprite = app.add.button(0, 0, 'button', function () {

                            state.reset();
                            land.reset();

                            app.state.start('dig_run');

                        }, this, 0, 0, 1);
                    sprite.width = buttonW;
                    sprite.height = buttonH;
                    sprite.x = buttonX;
                    sprite.y = buttonStartY;

                    // new game button
                    sprite = app.add.button(0, 0, 'button', function () {

                            app.state.start('title');

                        }, this, 4, 4, 5);

                    sprite.width = buttonW;
                    sprite.height = buttonH;
                    sprite.x = buttonX;
                    sprite.y = buttonStartY + buttonStepY;

                }

            };

        }
            ())

    };

}
    ());
