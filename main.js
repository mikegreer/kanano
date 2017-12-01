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
var hitA = Bodies.circle(400, 400, 30, {float: true, isSensor: true});

var bot = Bodies.rectangle(200, 570, 60, 40);

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
