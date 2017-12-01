// Module aliases
var Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies;
Body = Matter.Body,
Common = Matter.Common,
Composite = Matter.Composite,
Composites = Matter.Composites,
Events = Matter.Events,
Vector = Matter.Vector,
MouseConstraint = Matter.MouseConstraint;
Mouse = Matter.Mouse;

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

World.add(world, mouseConstraint);
render.mouse = mouse;

// Suspend normal gravity
engine.world.gravity.scale = 0;

/**
    EVENTS
*/

let forcesToApply = [];

var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var hitA = Bodies.circle(50, 50, 30, {float: true, isSensor: true});

var bot = Bodies.circle(200, 570, 25, {
    render: {
        sprite: {
            texture: './img/kanano.png',
            xScale: 0.9,
            yScale: 0.9
        }
    } 
});

World.add(world, [ground, bot, hitA]);

Engine.run(engine);
Render.run(render);

Body.applyForce(bot, {
    x: bot.position.x-10,
    y: bot.position.y
}, {
    x: 0.02,
    y: -0.05
});

// Apply custom gravity
Events.on(engine, 'beforeUpdate', function() {
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
});

var ground = Bodies.rectangle(400, 610, 810, 60, {
    isStatic: true,
});

// var boxA = Bodies.rectangle(400, 200, 80, 80);
// var boxB = Bodies.rectangle(450, 50, 80, 80);
// var obstacle = Bodies.rectangle(400, 210, 90, 90, { isStatic: true });
// var car1 = Composites.car(200, 300, 90, 10, 40);
// var car2 = Composites.car(100, 200, 90, 20, 50);


// var comp = Composite.create();
// Composite.add(comp, boxA);
// Composite.add(comp, boxB);
// Composites.chain(comp, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 50, render: { type: 'line' }});

// var bot = Bodies.rectangle(200, 570, 60, 40, {
//     render: {
//         sprite: {
//             strokeStyle: '#C44D58',
//             fillStyle: 'transparent',
//             lineWidth: 1
//         }
//     }
// });

// World.add(world, [ground, bot, hitA]);
World.add(world, [ground, hitA]);


//Shelves
var shelfHeight = 10;
var shelves = [
    {
        x: 180,
        y: 390
    },
    {
        x: 400,
        y: 380
    },
    {
        x: 180,
        y: 150
    },
    {
        x: 400,
        y: 150
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
            render: {
                sprite: {
                    texture: './img/pi.png',
                    xScale: 0.7,
                    yScale: 0.7
                }
            } 
        }),
        Bodies.rectangle(shelf.x + 30, (shelf.y - shelfHeight), 50, 50, {
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
// var stack = Composites.stack(100, 0, 10, 8, 10, 10, function(x, y) {
//     return Bodies.circle(x, y, Common.random(15, 30), { restitution: 0.6, friction: 0.1 });
// });

// World.add(world, [
//     stack,
//     Bodies.polygon(200, 460, 3, 60),
//     Bodies.polygon(400, 460, 5, 60),
//     Bodies.rectangle(600, 460, 80, 80)
// ]);

Events.on(engine, 'collisionStart', event => {
    var pairs = event.pairs;

    console.log(event);

    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];

        if (pair.bodyB === bot) {
            if (pair.bodyA === hitA) {
                forcesToApply.push([
                    bot, {
                        x: bot.position.x - ((bot.position.x - hitA.position.x) / 2),
                        y: bot.position.y - ((bot.position.y - hitA.position.y) / 2)
                    }, {
                        x: 0,
                        y: -0.1
                    }
                ]);
            }
        }
    }
});

Events.on(mouseConstraint, 'enddrag', function(event) {
    Matter.Body.setVelocity(event.body, {x: 0, y: 0});
});
