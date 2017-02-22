

var Title = (function () {

    var map,
    layer1,
    text_button_newgame;

    return {

        create : function () {

            var button,
            scale,
            genLayer,
            logo;

            //  Creates a blank tilemap
            map = app.add.tilemap();

            //  Add a Tileset image to the map
            map.addTilesetImage('tiles');

            console.log('title state setup.');

            layer1 = map.create('level1', 4, 4, 32, 32);

            //layer1.setScale(3.5, 3.5);
            //layer1.fixedToCamera = false;
            //layer1.x = app.world.centerX - (32 * 2) * 3.5;
            //layer1.y = app.world.centerY - (32 * 2) * 3.5;

            //layer1.setScale(1, 1);
            layer1.width = app.height;
            layer1.height = app.height;
            layer1.fixedToCamera = false;
            layer1.x = app.world.centerX - (layer1.width / 2); //app.world.centerX - (32 * 2) * 3.5;
            layer1.y = 0; //app.world.centerY - (32 * 2) * 3.5;


            genLayer = function () {

                var width = 4,
                height = 4,
                i = 0,
                x,
                y,
                len,
                data = [],
                len = width * height;

                // use map.put to populate the layer
                while (i < len) {

                    x = i % width;
                    y = Math.floor(i / width);

                    map.putTile(

                        Math.floor(Math.floor(Math.random() * 3 + 1) * 10 + Math.random() * 4),
                        x,
                        y,
                        'level1');

                    i += 1;

                }

            };

            genLayer();

            // new game button
            //var button = app.add.button(app.world.centerX - 80, app.world.centerY + 30, 'button', function () {
            button = app.add.button(0, 0, 'button', function () {

                    app.state.start('dig_run');

                }, this, 0, 0, 1);

            // scale to game size
            button.width = 1.60 * (app.width / 4);
            button.height = .45 * (app.width / 4);
            button.x = app.world.centerX - (button.width / 2);
            button.y = app.world.centerY + (app.height * 0.125);

            /*
            logo = app.add.sprite(app.world.centerX, app.world.centerY, 'logo');
            logo.angle = 0;
            logo.width = logo.width * 2;
            logo.height = logo.height * 2;
            logo.x = app.width / 2 - logo.width / 2;
            logo.y = app.world.centerY - 200;
             */

            logo = app.add.sprite(app.world.centerX, app.world.centerY, 'logo');
            logo.angle = 0;
            logo.width = 2 * (app.width / 3); //logo.width * 2;
            logo.height = 1 * (app.width / 3);
            logo.x = app.width / 2 - logo.width / 2;
            logo.y = app.world.centerY - logo.height;

        }
    };

}
    ());
