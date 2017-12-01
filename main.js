// Module aliases
var Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies,
Body = Matter.Body,
Common = Matter.Common,
Composite = Matter.Composite,
Composites = Matter.Composites,
Events = Matter.Events,
Vector = Matter.Vector,
MouseConstraint = Matter.MouseConstraint,
Mouse = Matter.Mouse,
renderOffsetX,
renderOffsetY;

// Create an engine
var engine = Engine.create();
var world = engine.world;

// Create a renderer
var render = Render.create({
element: document.body,
engine: engine
});

Engine.run(engine);
Render.run(render);

var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 1,
        render: {
            visible: false
        }
    }
});

render.canvas.height = document.body.scrollHeight;
render.canvas.width = document.body.scrollWidth;
renderOffsetX = document.body.scrollWidth / 4;
renderOffsetY = document.body.scrollHeight / 20;


World.add(world, mouseConstraint);
render.mouse = mouse;

// Suspend normal gravity
engine.world.gravity.scale = 0;

/**
    EVENTS
*/

let forcesToApply = [];
let resetBot = true;

var ground = Bodies.rectangle(285 + renderOffsetX, 610 + renderOffsetY, 160, 60, { isStatic: true });
var respawnGround = Bodies.rectangle(400 + renderOffsetX, 800 + renderOffsetY, 10000, 60, { isStatic: true });
var logo = Bodies.rectangle(630, 40, 100, 60, {
    isStatic: true,
    render: {
        sprite: {
            texture: './img/stemwars.png',
            xScale: 0.8,
            yScale: 0.8
        }
    } 
});
var banner = Bodies.rectangle(1050, 80, 100, 60, {
    isStatic: true,
    render: {
        sprite: {
            texture: './img/stem-sign.png',
            xScale: 0.8,
            yScale: 0.8
        }
    } 
});

var bot;
// var hitA = ;

var hitCircles = [
    Bodies.circle(50, 50, 30, {float: true, isSensor: true, render: {sprite: {texture: './img/force-left.png', xScale: 0.5, yScale: 0.5}}}),
    Bodies.circle(100, 50, 30, {float: true, isSensor: true, render: {sprite: {texture: './img/force-up.png', xScale: 0.5, yScale: 0.5}}}),
    Bodies.circle(150, 50, 30, {float: true, isSensor: true, render: {sprite: {texture: './img/force-right.png', xScale: 0.5, yScale: 0.5}}}),
    Bodies.circle(200, 50, 30, {float: true, isSensor: true, render: {sprite: {texture: './img/force-down.png', xScale: 0.5, yScale: 0.5}}}),
    Bodies.circle(250, 50, 30, {float: true, isSensor: true, render: {sprite: {texture: './img/force-left.png', xScale: 0.5, yScale: 0.5}}}),
    Bodies.circle(300, 50, 30, {float: true, isSensor: true, render: {sprite: {texture: './img/force-up.png', xScale: 0.5, yScale: 0.5}}}),
    Bodies.circle(350, 50, 30, {float: true, isSensor: true, render: {sprite: {texture: './img/force-right.png', xScale: 0.5, yScale: 0.5}}}),
    Bodies.circle(400, 50, 30, {float: true, isSensor: true, render: {sprite: {texture: './img/force-down.png', xScale: 0.5, yScale: 0.5}}})
];
var moveCircles = [
    {x: -0.1, y: 0},
    {x: 0, y: -0.1},
    {x: 0.1, y: 0},
    {x: 0, y: 0.1},
    {x: -0.1, y: 0},
    {x: 0, y: -0.1},
    {x: 0.1, y: 0},
    {x: 0, y: 0.1}
];

World.add(world, [ground, respawnGround, banner, logo]);

hitCircles.forEach(elem => {
    World.add(world, [elem]);
});


Engine.run(engine);
Render.run(render);

// Apply custom gravity
Events.on(engine, 'beforeUpdate', function() {
    // Drag & drop
    var bodies = Composite.allBodies(engine.world);
    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];

        if (body.float) {
            // Suspend gravity
            body.force.x = 0;
            body.force.y = 0;
            body.mass = 0.001;
            continue;
        } else {
            // Apply normal gravity
            body.force.y += body.mass * 0.001;
        }
    }

    // Apply the force events
    while (forcesToApply.length > 0) {
        let aux = forcesToApply.shift();
        Body.applyForce(aux[0], aux[1], aux[2]);
    }

    // Respawn
    if (resetBot) {
        resetBot = false;

        if (bot) {
            Matter.Composite.remove(world, bot);
        }

        bot = Bodies.circle(288 + renderOffsetX, 570 + renderOffsetY, 25, {
            render: {
                sprite: {
                    texture: './img/kanano.png',
                    xScale: 0.85,
                    yScale: 0.85
                }
            } 
        });

        
        World.add(world, [bot]);

        // Matter.Body.setVelocity(bot, {x: 0, y: 0});

        Body.applyForce(bot, {
            x: bot.position.x,
            y: bot.position.y
        }, {
            x: 0.0,
            y: -0.007
        });
    }
});

//Shelves
var shelfHeight = 10;
var shelves = [
    {
        x: 130 + renderOffsetX,
        y: 440 + renderOffsetY
    },
    {
        x: 450 + renderOffsetX,
        y: 440 + renderOffsetY
    },
    {
        x: 130 + renderOffsetX,
        y: 200 + renderOffsetY
    },
    {
        x: 450 + renderOffsetX,
        y: 200 + renderOffsetY
    }
];

shelves.forEach(shelf => {
    World.add(world, [
        //shelf
        Bodies.rectangle(shelf.x, shelf.y, 150, shelfHeight, {
            isStatic: true,
            render: {
                sprite: {
                    texture: './img/shelf.png',
                    xScale: 0.7,
                    yScale: 0.7,
                    yOffset: -0.45
                }
            } 
            
        }),
        //box
        Bodies.rectangle(shelf.x - 30, (shelf.y - shelfHeight), 50, 50, {
            mass: 0.1,
            render: {
                sprite: {
                    texture: './img/pi.png',
                    xScale: 0.7,
                    yScale: 0.7
                }
            } 
        }),
        Bodies.rectangle(shelf.x + 30, (shelf.y - shelfHeight), 50, 50, {
            mass: 0.1,
            render: {
                sprite: {
                    texture: './img/piper.png',
                    xScale: 0.7,
                    yScale: 0.7
                }
            } 
        }),
        // top of the box triangle
        Bodies.rectangle(shelf.x, (shelf.y - shelfHeight - 80), 50, 50, {
            mass: 0.1,
            render: {
                sprite: {
                    texture: './img/sam.png',
                    xScale: 0.7,
                    yScale: 0.7
                }
            } 
        })
    ]);
});

render.options.wireframes = false;

Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];

        if (pair.bodyB === bot) {
            if (respawnGround == pair.bodyA) {
                resetBot = true;
                return;
            }

            let aux = hitCircles.find(elem => (elem === pair.bodyA));

            if (aux) {
                let index = hitCircles.indexOf(pair.bodyA);
                
                if (index < 0) {
                    return;
                }

                forcesToApply.push([
                    bot, {
                        x: bot.position.x - ((bot.position.x - pair.bodyA.position.x) / 2),
                        y: bot.position.y - ((bot.position.y - pair.bodyA.position.y) / 2)
                    }, {
                        x: moveCircles[index].x,
                        y: moveCircles[index].y
                    }
                ]);
            }
        }
    }
});

Events.on(mouseConstraint, 'enddrag', function(event) {
    Matter.Body.setVelocity(event.body, {x: 0, y: 0});
});
