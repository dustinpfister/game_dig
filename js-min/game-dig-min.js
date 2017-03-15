var land=function(){var t={cells:[],w:8,h:8,d:3,totalPebble:1e3,amount:0,hideMethod:{current:"random_amount",params:{topLTPer:.5,bestPebPer:.5,maxPer:.5}},hpRange:{low:1,high:1}},e={makeOptions:function(e){var a=[];return t.cells.forEach(function(t,n){void 0===e?a.push(n):t.z===e&&a.push(n)}),a},spliceFromOptions:function(e){return t.cells[e.splice(Math.floor(Math.random()*e.length),1)[0]]},setAmount:function(e,a){t.amount+=a,e.total=a,e.amount=e.total},forDepth:function(e){for(var a=0,n=t.d;a<n;)e(t.getLayer(a),a),a+=1}},a=function(){var e=0,a=0,n={total:0,remaining:0};return t.cells.forEach(function(t){e+=t.total,a+=t.amount,t.total>0&&(n.total+=1,t.amount>0&&(n.remaining+=1))}),{total:e,remaining:a,lootCells:n}},n=function(){var a={random_amount:function(){var a,n,o=e.makeOptions(),i={low:.1,high:.2},r=(Math.random()*(i.high-i.low)+i.low).toFixed(2)-0,p=Math.floor(t.totalPebble*r),d=Math.floor(t.totalPebble/p),l=t.totalPebble%p;for(t.amount=0,a=0;a<d;)n=e.spliceFromOptions(o),e.setAmount(n,p),a+=1;l&&(n=e.spliceFromOptions(o),e.setAmount(n,l))}},n=function(n){n=void 0===n?"random_amount":n,a[n].call(t,e,t.hideMethod.params,t)};return n.list=function(){return Object.keys(a)},n.injectMethod=function(t){a[t.name]=t.method},n}(),o=function(){var e,a,o,i,r,p=t.w*t.h*t.d;for(t.cells=[],t.amount=0,e=0;e<p;)i=e%t.d,a=Math.floor(e/(t.d*t.h)),o=Math.floor((e-a*(t.d*t.h))/t.d),r=Math.floor(Math.random()*(t.hpRange.high-t.hpRange.low+1))+t.hpRange.low,t.cells.push({amount:0,total:0,done:!1,hp:r,maxHp:r,canDig:!1,i:e,x:a,y:o,z:i}),e+=1;n(t.hideMethod.current),t.amount=t.totalPebble};return t.reset=function(){o()},t.setLevel=function(t){this.totalPebble=100*t+Math.pow(2,t)-2,this.d=3+Math.floor(.5*t),this.d>20&&(this.d=20),this.hpRange.low=1+Math.floor(t/20*1),this.hpRange.high=1+Math.floor(t/20*3),this.hpRange.low=this.hpRange.low>4?4:this.hpRange.low,this.hpRange.high=this.hpRange.high>4?4:this.hpRange.high},t.getInfo=function(){var t=a();return{tab:t,tabString:t.remaining+"/"+t.total,layers:this.d,hideMethods:n.list()}},t.addHideMethod=function(t){n.injectMethod(t)},t.getCell=function(e,a,n){return void 0!==a&&void 0!==n?t.cells[t.h*t.d*e+a*t.d+n]:t.cells[e]},t.getLayer=function(e){for(var a=[],n=e,o=t.cells.length;n<o;)a.push(t.cells[n]),n+=t.d;return a},t.getDepth=function(e,a){return t.cells.splice(a*t.d+t.d*t.w*e,t.d)},t.digAt=function(t,e,n,o){var i,r=this.getCell(t,e,n),p=this,d={amount:0,dropDown:!1,hp:r.hp,canDig:r.canDig,tab:{}};r.hp<=0?(d.dropDown=!0,i=this.getLayer(n),i.forEach(function(t){t.x>=r.x-1&&t.x<=r.x+1&&t.y>=r.y-1&&t.y<=r.y+1&&(p.getCell(t.i).canDig=!0)})):(r.hp-=1,d.hp=r.hp,r.hp<=0&&(r.canDig=!0,d.hp=0,r.amount>0&&(d.amount=r.amount,r.amount=0),r.done=!0)),d.tab=a(),o(d)},t}();land.addHideMethod({name:"normal1",method:function(t,e){console.log('I am the "normal1" hide method, but you can call me Jerry.');for(var a,n,o,i=land.w*land.h*e.topLTPer,r=function(){for(var t,e=0,a=[],n=0;e<land.d;)(e+1)/land.d,t=Math.floor(i-(i-1)*(e/(land.d-1))),t=t<=0?1:t,a.push({lootTileCount:t}),n+=t,e+=1;return{layers:a,totalLootTiles:n}}(),p=land.d,d=1,l=land.totalPebble/land.d,h=0;p--;)o=r.layers[p],d=1-(land.d-p-1)/land.d,a=Math.floor(l*d),h+=a,o.amount=a;n=land.totalPebble-h,r.layers[land.d-1].amount+=n,t.forDepth(function(e,a){var n,o,i,p,d,l=t.makeOptions(a),h=0;for(n=r.layers[a].amount,i=r.layers[a].lootTileCount,n/i<1&&(i=n),o=Math.floor(n/i),h=n%i,p=0;p<i;)d=t.spliceFromOptions(l),p===i-1&&h?t.setAmount(d,o+h):t.setAmount(d,o),p+=1})}});var state=function(){var t={layer:0,pebble:0,digs:10,maxDigs:10,landLevel:1},e=function(){localStorage.setItem("dig_gamesave",JSON.stringify(t))},a={current:t,startOver:function(){t={layer:0,pebble:0,digs:5,maxDigs:5,landLevel:1},e()},levelUp:function(){var a=Math.log(t.pebble)/Math.log(4),n=Math.floor(a);console.log("I am the level up method."),console.log("current level: "+t.landLevel),console.log("new level: "+n),n>t.landLevel&&(console.log("level up!"),t.landLevel=n),t.maxDigs=10+5*(t.landLevel-1),e()},reset:function(){t.layer=0,t.digs=t.maxDigs,land.setLevel(t.landLevel),land.reset()},userAction:function(a,n,o){o=o||function(){},t.digs>0?land.digAt(a,n,t.layer,function(e){var i=!1,r=!1;e.dropDown?t.layer<land.d-1&&(i=!0,t.layer+=1):(0===e.hp&&(r=!0,t.pebble+=e.amount),t.digs-=1),o({active:!0,tileX:a,tileY:n,dropEvent:i,burst:r,tileStatus:e})}):(this.reset(),land.reset(),o({})),e()}};return function(){var n;localStorage.getItem("dig_gamesave")||e();try{n=JSON.parse(localStorage.getItem("dig_gamesave")),t.pebble=n.pebble,t.landLevel=n.landLevel,t.maxDigs=n.maxDigs,t.digs=t.maxDigs}catch(t){egg.myErrorMethod(new Error("error loading JSON data"))}a.reset()}(),a}(),DIG=function(){var t,e,a,n=!1,o={dropAnimation:!1,dropFrame:0,dropMaxFrames:100,dropTile:{setActive:!0,x:0,y:0},setDropTile:function(t,e){this.dropTile.setActive?(this.dropTile.x=t,this.dropTile.y=e):(this.dropTile.x=0,this.dropTile.y=0)},setupMap:function(){a=app.add.tilemap(),a.addTilesetImage("tiles"),t=a.create("activeLayer",8,8,32,32),e=a.createBlankLayer("zoomLayer",8,8,32,32),t.fixedToCamera=!1,t.width=.8*app.height,t.height=.8*app.height,t.x=.05*app.width,t.y=.05*app.height,t.inputEnabled=!0,e.fixedToCamera=!1,e.x=-32,e.y=-32,e.width=32,e.height=32,this.genLayer("activeLayer",state.current.layer),this.genLayer("zoomLayer",state.current.layer)},dropStart:function(){this.dropFrame=0,this.dropAnimation=!0,this.genLayer("activeLayer",state.current.layer),this.genLayer("zoomLayer",state.current.layer-1),e.width=.8*app.height,e.height=.8*app.height,e.alpha=1,t.width=0,t.height=0},droping:function(){if(this.dropAnimation){var a,n=2*app.width/this.dropMaxFrames,o=.05*app.width,i=this.dropFrame/this.dropMaxFrames;this.dropFrame+=1,e.width+=2*n,e.height+=2*n,e.alpha=1-i,a=e.width/8,e.x=o-n*this.dropFrame+(a*this.dropTile.x*i-a/2),e.y=o-n*this.dropFrame+(a*this.dropTile.y*i-a/2),t.width=.8*app.height*i,t.height=.8*app.height*i,t.x=o+(.4*app.height-t.width/2),t.y=o+(.4*app.height-t.width/2),t.alpha=i,this.dropFrame===this.dropMaxFrames&&(e.x=-32,e.y=-32,e.width=32,e.height=32,this.dropFrame=0,this.dropAnimation=!1)}},update:function(){this.dropAnimation||o.genLayer("activeLayer",state.current.layer)},genLayer:function(t,e){var o,i,r,p,d,l,h=0,p=64;for(t=t||"activeLayer",void 0===e&&state.current.layer,d=0===e?3:1,l=e===land.d-1?1:0;h<p;)o=h%8,r=Math.floor(h/8),i=land.getCell(o,r,e),a.putTile(n&&i.amount>0?2:0===i.hp?l:10*d+i.hp,o,r,t),h+=1}},i=[],r=function(){var t=i.length;if(t>0)for(;t--;)i[t].update(),i[t].alive||i.splice(t,1)},p=function(e,a){var n,o,i=0,r=0,p=t.width/e.width,d=t.height/e.height,l=p*a.tileX+t.left,h=d*a.tileY+t.top,s=t.getTiles(l,h,1,1)[0],c=s.index;for(this.sprites=[],this.birth=new Date,this.alive=!0,a.tileStatus.amount&&(n=app.add.sprite(l,h,"icons",2),n.width=p/2,n.height=d/2,app.physics.enable([n],Phaser.Physics.ARCADE),n.body.velocity.y=-96,this.sprites.push(n),n=app.add.bitmapText(l+n.width,h,"desyrel","+"+a.tileStatus.amount,30),app.physics.enable([n],Phaser.Physics.ARCADE),n.body.velocity.y=-96,this.sprites.push(n)),o=0;o<4;)n=app.add.sprite(l+p/2*r,h+d/2*i,"tiles_split",2*c+20*i+r+20*Math.floor(c/10)),n.width=p/2,n.height=d/2,app.physics.enable([n],Phaser.Physics.ARCADE),n.body.velocity.x=-32*(1-2*r),n.body.velocity.y=-32*(1-2*i),r+=1,2===r&&(r=0,i+=1),o+=1,this.sprites.push(n)};return p.prototype.update=function(){var t=new Date-this.birth;t>2500&&(this.sprites.forEach(function(t){t.destroy()}),this.alive=!1),this.sprites.forEach(function(e){e.alpha=1-t/2500})},{showPebble:function(t){n=!n,"boolean"==typeof t&&(n=t),o.genLayer("activeLayer",state.current.layer)},reGen:function(){o.genLayer("activeLayer",state.current.layer)},run:function(){var e,n=["digs","layer","pebble","landLevel"],d={},l=function(t){"string"==typeof t?console.log("game.js: "+t):console.log(t)},h=(function(){var t=!1;(function(e,a){!t&&e&&(a(),t=!0)})}(),function(){var t=[state.current.digs,state.current.layer+1+"/"+land.d,state.current.pebble,state.current.landLevel];n.forEach(function(e,a){d[e].text=t[a]}),e.text=land.getInfo().tabString}),s=function(t,e){var n=Math.floor(t.width/land.w),r=e.x-t.x,d=e.y-t.y,s=Math.floor(r/n),c=Math.floor(d/n);o.dropAnimation?l("cant do that now, droping down..."):(state.userAction(s,c,function(t){t.active&&(t.burst&&(i.push(new p(a,t)),a.putTile(0,t.tileX,t.tileY,"activeLayer")),t.dropEvent&&(o.setDropTile(s<4?4-s:0-(s-4),c<4?4-c:0-(c-4)),o.dropStart()))}),state.current.digs<=0&&app.state.start("dig_over"),state.current.layer===land.d-1&&(!function(){var t=land.getLayer(land.d-1),e=t.length;t.forEach(function(t){t.done&&(e-=1)}),e<=0&&app.state.start("dig_over")}(),o.update()),function(){land.getInfo().tab.remaining<=0&&app.state.start("dig_over")}(),h())};return{create:function(){var a,i=.72*app.width,r=.2*app.height,p=.15*app.height,l=.08*app.width,c=.06*app.width,u=[0,3,2,4];o.setupMap(),t.events.onInputDown.add(s),u.forEach(function(t,e){a=app.add.sprite(i,r+p*e,"icons",t),a.width=l,a.height=l,d[n[e]]=app.add.bitmapText(i+l,r+p*e,"desyrel","0",c)}),e=app.add.bitmapText(.05*app.width,.86*app.height,"desyrel",land.getInfo().tabString,c),a=app.add.button(app.width-l,0,"icons",function(){app.state.clearCurrentState(),app.state.start("dig_options")},this,1,1,1),a.width=l,a.height=l,h(),app.physics.startSystem(Phaser.Physics.ARCADE),app.physics.arcade.gravity.y=100},update:function(){return function(){r(),o.droping()}}()}}(),options:function(){return{create:function(){var t,e=.1*app.width,a=.6*app.width,n=.2*app.height,o=app.world.centerX-a/2,i=.3*app.height,r=.2*app.height,p=app.add.bitmapText(0,0,"desyrel","Game Options:",e);p.x=app.world.centerX-p.width/2,p.y=.05*app.height,t=app.add.button(0,0,"button",function(){app.state.start("dig_run")},this,6,6,7),t.width=a,t.height=n,t.x=o,t.y=i,t=app.add.button(0,0,"button",function(){state.reset(),land.reset(),app.state.start("dig_run")},this,0,0,1),t.width=a,t.height=n,t.x=o,t.y=i+r,t=app.add.button(0,0,"button",function(){app.state.start("title")},this,4,4,5),t.width=a,t.height=n,t.x=o,t.y=i+2*r}}}(),over:function(){var t;return{create:function(){var e,a=.1*app.width,n=land.getInfo(),o=n.tab.total-n.tab.remaining,i=.6*app.width,r=.2*app.height,p=app.world.centerX-i/2,d=.55*app.height,l=.2*app.height,h=(app.width,app.add.bitmapText(0,0,"desyrel","Dig is Over!",a));h.x=app.world.centerX-h.width/2,h.y=.05*app.height,t=app.add.bitmapText(96,128,"desyrel","Total Land Pebble : "+n.tab.total,a/2),t.x=app.world.centerX-.5*t.width,t.y=.25*app.height,text_pebbleWon=app.add.bitmapText(96,160,"desyrel","Pebble Won : "+o,.9*a),text_pebbleWon.x=app.world.centerX-text_pebbleWon.width/2,text_pebbleWon.y=.3*app.height,state.levelUp(),state.reset(),land.reset(),e=app.add.button(0,0,"button",function(){state.reset(),land.reset(),app.state.start("dig_run")},this,0,0,1),e.width=i,e.height=r,e.x=p,e.y=d,e=app.add.button(0,0,"button",function(){app.state.start("title")},this,4,4,5),e.width=i,e.height=r,e.x=p,e.y=d+l}}}()}}(),Load=function(){return{preload:function(){var t=app.add.sprite(0,0,"loadingbar");t.width=0,t.x=app.world.centerX-t.width/2,t.y=app.world.centerY-16,app.load.onLoadStart.add(function(){},this),app.load.onFileComplete.add(function(e){t.width=app.width*(e/100),t.x=app.world.centerX-t.width/2},this),app.load.onLoadComplete.add(function(){},this),app.load.spritesheet("button","img/button.png",160,45),app.load.spritesheet("icons","img/icons.png",32,32),app.load.image("tiles","img/tiles2.png"),app.load.spritesheet("tiles_split","img/tiles2.png",16,16),app.load.bitmapFont("desyrel","img/desyrel.png","img/font1.xml"),app.load.image("logo","img/logo.png"),Phaser.DJP_PATCH?Phaser.DJP_PATCH.env&&"development"!==Phaser.DJP_PATCH.env?app.load.json("hard_settings","js-min/hard_settings.json"):(Phaser.DJP_PATCH.env="development",app.load.json("hard_settings","js/hard_settings.json")):(Phaser.DJP_PATCH={env:"development"},app.load.json("hard_settings","js/hard_settings.json"))},create:function(){app.state.add("title",Title),app.state.add("dig_run",DIG.run),app.state.add("dig_over",DIG.over),app.state.add("dig_options",DIG.options),app.state.start("title")}}}(),Title=function(){var t,e;return{create:function(){var a,n;t=app.add.tilemap(),t.addTilesetImage("tiles"),e=t.create("level1",4,4,32,32),e.width=app.height,e.height=app.height,e.fixedToCamera=!1,e.x=app.world.centerX-e.width/2,e.y=0,function(){for(var e,a,n,o=0,n=16;o<n;)e=o%4,a=Math.floor(o/4),t.putTile(Math.floor(10*Math.floor(3*Math.random()+1)+4*Math.random()),e,a,"level1"),o+=1}(),a=app.add.button(0,0,"button",function(){app.state.start("dig_run")},this,0,0,1),a.width=app.width/4*1.6,a.height=app.width/4*.45,a.x=app.world.centerX-a.width/2,a.y=app.world.centerY+.125*app.height,n=app.add.sprite(app.world.centerX,app.world.centerY,"logo"),n.angle=0,n.width=app.width/3*2,n.height=app.width/3*1,n.x=app.width/2-n.width/2,n.y=app.world.centerY-n.height;var o=app.cache.getJSON("hard_settings");app.add.bitmapText(5,app.height-30,"desyrel","v"+o.version+" ( "+o.env+" )",20)}}}(),egg=function(){var t=function(t){switch(console.log("********** egg.js for DIG **********"),t){case"westside":"dig_run"===app.state.current?(land.currentHideMethod="all-in-left-top-zero",land.setLevel(state.current.landLevel),land.reset(),DIG.showPebble(!0),DIG.reGen()):console.log("I need 2b called durring da dig.run state fool, yall tripin.");break;case"hidelist":console.log(land.getInfo().hideMethods);break;case"show":console.log("Show pebble toggled"),DIG.showPebble();break;default:console.log("Take a look at egg.js at the repo, here:"),console.log("https://raw.githubusercontent.com/dustinpfister/dig/master/js/egg.js")}return"********************"};return t.hide=function(t){var e=land.getInfo().hideMethods;if(void 0===t)return console.log(e),"current: "+land.currentHideMethod;console.log(typeof t),"number"==typeof t&&(land.currentHideMethod=e[t]),"string"==typeof t&&(land.currentHideMethod=t)},t.myErrorMethod=function(t){var e=document.getElementById("errorlog"),a="";e.style.display="block",a+="ERROR: \n",a+="error message: "+t.message+"\n\n",t.stack&&(a+="Stack: \n",a+=t.stack+"\n\n"),e.innerHTML+=a},t}();land.addHideMethod({name:"all-in-left-top-zero",method:function(t){console.log("I am the all-in-left-top-zero hide method"),t.setAmount(this.cells[0],this.totalPebble)}});var app=function(){var t=window.innerWidth<640?window.innerWidth:640,e=t<640?260:480;return new Phaser.Game(t,e,Phaser.AUTO,"gamearea",{preload:function(){app.load.image("loadingbar","img/loadingbar.png")},create:function(){land.hideMethod.current="normal1",land.reset(),app.state.add("load",Load),app.state.start("load")}})}();