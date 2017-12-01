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
});

Events.on(mouseConstraint, 'enddrag', function(event) {
    Matter.Body.setVelocity(event.body, {x: 0, y: 0});
});

var ground = Bodies.rectangle(400, 610, 810, 60, {
    isStatic: true,
});
var hitA = Bodies.circle(100, 200, 30, {float: true, isSensor: true});

// var boxA = Bodies.rectangle(400, 200, 80, 80);
// var boxB = Bodies.rectangle(450, 50, 80, 80);
// var obstacle = Bodies.rectangle(400, 210, 90, 90, { isStatic: true });
// var car1 = Composites.car(200, 300, 90, 10, 40);
// var car2 = Composites.car(100, 200, 90, 20, 50);


// var comp = Composite.create();
// Composite.add(comp, boxA);
// Composite.add(comp, boxB);
// Composites.chain(comp, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 50, render: { type: 'line' }});

var bot = Bodies.rectangle(200, 570, 60, 40, {
    render: {
        sprite: {
            strokeStyle: '#C44D58',
            fillStyle: 'transparent',
            lineWidth: 1
        }
    }
});

var bot2 = Bodies.circle(200, 240, 30, {
    render: {
        strokeStyle: '#C44D58',
        fillStyle: '#C44D58',
        lineWidth: 1
    }
})

World.add(world, [ground, bot, hitA, bot2]);


//Shelves
World.add(world, [
    Bodies.rectangle(150, 60, 150, 13, { isStatic: true })
]);

World.add(world, [
    Bodies.rectangle(350, 30, 150, 13, { isStatic: true })
]);

World.add(world, [
    Bodies.rectangle(350, 90, 150, 13, { isStatic: true })
]);

World.add(world, [
    Bodies.rectangle(350, 180, 150, 13, { isStatic: true })
]);



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





Body.applyForce(bot, {
    x: bot.position.x-10,
    y: bot.position.y
}, {
    x: 0.02,
    y: -0.05
});
// var ypos = 100;
// var dy = 2;
// Events.on(engine, 'beforeUpdate', function(event) {
//     Body.setPosition(obstacle, { x:350, y:ypos});
//     ypos += dy;
//     if(ypos > 530){
//         ypos = 530;
//         dy *= -1;
//     }
// });