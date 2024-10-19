
var current_level = 3;
var fired = false;
var died = false;

class Example extends Phaser.Scene {

    preload () {
        this.load.image("wood", "./assets/images/wood.png");
        this.load.image("steel", "./assets/images/steel.png");
        this.load.image("platform","./assets/images/beam.png");
        this.load.image("pirate","./assets/images/pirate.png");
        this.load.image("cannon_base","./assets/images/base2.png");
        this.load.image("cannon_barrel","./assets/images/cannon_barrel.png");
        this.load.image("cannon_ball","./assets/images/cannon_ball.png");
        this.load.image("bg", "./assets/images/bg.jpg");
        this.load.audio("fire_sound", "./assets/Sounds/cannon.mp3");
        this.load.audio("death_sound", "./assets/Sounds/pirate_death.mp3");
        this.load.image('Startblock', './assets/images/StartBlock.png');
        this.load.image('Fireblock', './assets/images/FireBlock.png');
        this.load.image('GoBlock', './assets/images/GoBlock.png');
        this.load.image('angle60', './assets/images/angle60.png');
        this.load.image('angle45', './assets/images/angle45.png');
        this.load.image('angle30', './assets/images/angle30.png');

        Parser(`level${current_level}`).then(data => {
            if (data) {
                this.level = data;
            } else {
                console.log("Error");
            }
        }).catch(error => {
            console.error('Error:', error);
        });

        console.log(this.level);

    }

    create () {


        // TYLER START

        const body1 = this.matter.add.image(200, 150, 'Startblock').setStatic(true).setName("Start");
        const body2 = this.matter.add.image(200, 350, 'Fireblock').setStatic(true).setName("Fire");
        const Gobody = this.matter.add.image(200, 550, 'GoBlock').setStatic(true).setName("Go");
        const angle60 = this.matter.add.image(300, 150, 'angle60').setStatic(true).setName("angle60");
        const angle45 = this.matter.add.image(300, 250, 'angle45').setStatic(true).setName("angle45");
        const angle30 = this.matter.add.image(300, 350, 'angle30').setStatic(true).setName("angle30");
        Gobody.setInteractive();
        
        const fillOver = 0xff0000;
        const strokeOver = 0xffff00;
        const lineThicknessOver = 4;

        var Connections = {}

        // Dragging stuff
        const bodies = [ body1, body2, angle45, angle60, angle30];
        var SelectedBlock = -1 // the block we are dragging
        var isDragging = false // If we are dragging
        var ConnectedBlock // The block we are connecting to
        this.input.on('pointermove', function (pointer) {
            const x = pointer.worldX;
            const y = pointer.worldY;

            if (isDragging  && SelectedBlock !=null){

                bodies[SelectedBlock].setPosition(x,y)
                
                //remove this from table
                for(var i in Connections){
                    if(Connections[i] == SelectedBlock){
                        delete Connections[i]
                        break;
                    }
                }
                var tempBlock = SelectedBlock
                while (Connections[tempBlock]!= null){
                    var bounds = bodies[tempBlock].getBounds();
                    var newX = bounds.x + bounds.width/2;
                    var newY = bounds.y + bounds.height+bounds.height/2;
                    bodies[Connections[tempBlock]].setPosition(newX,newY);
                    tempBlock= Connections[tempBlock]
                };
                
                // ConnectingBlocks
                var hit = false
                for (let i = 0; i < bodies.length; i++)
                {
                    const body = bodies[i];
                    if (i!= SelectedBlock){ //If not the block we are moving
                        if (this.matter.containsPoint(body, x, y))
                        {
                            hit = true
                            ConnectedBlock = i
                            this.matter.world.setBodyRenderStyle(body, fillOver, strokeOver, lineThicknessOver);
                            //body.setTint(0xffffff)
                        }
                        else
                        {
                            //body.setTint(0xff0000)
                            this.matter.world.setBodyRenderStyle(body);
                        }
                    }

                }
                if (!hit) {
                    ConnectedBlock = null;
                }
            }
            else
            {   
                var hit = false
                for (let i = 0; i < bodies.length; i++)
                {
                    const body = bodies[i];

                    if (this.matter.containsPoint(body, x, y))
                    {
                        hit = true
                        SelectedBlock = i
                        this.matter.world.setBodyRenderStyle(body, fillOver, strokeOver, lineThicknessOver);
                    }
                    else
                    {
                        this.matter.world.setBodyRenderStyle(body);
                    }
                }
                if (!hit) {
                    SelectedBlock = null;
                }
            }
            

        }, this);
        this.input.on('pointerdown', function (pointer) {
            isDragging = true;
        },this);
        this.input.on('pointerup', function (pointer) {
            isDragging = false;
            
            if (ConnectedBlock!=null && SelectedBlock != null){
                //If we are connecting with something then connect
                var MainBody = bodies[ConnectedBlock];
                var MovedBody = bodies[SelectedBlock];

                var MainBounds = MainBody.getBounds();
                var MovedBounds = MovedBody.getBounds();

                var ConnectionPointX = MainBounds.x + MainBounds.width/2;
                var ConnectionPointY = MainBounds.y + MainBounds.height + MovedBounds.height/2;

                MovedBody.setPosition(ConnectionPointX,ConnectionPointY);

                //Add list to array of commands
                if (Connections[ConnectedBlock]!=null){ // If it already exists then we want to place this new block in the middle
                    var temp = Connections[ConnectedBlock]
                    delete Connections[ConnectedBlock]
                    Connections[ConnectedBlock] = SelectedBlock
                    Connections[SelectedBlock] = temp

                    //move everthing down
                    var tempBlock = SelectedBlock
                    while (Connections[tempBlock]!= null){
                        var bounds = bodies[tempBlock].getBounds();
                        var newX = bounds.x + bounds.width/2;
                        var newY = bounds.y + bounds.height+bounds.height/2;
                        bodies[Connections[tempBlock]].setPosition(newX,newY);
                        tempBlock= Connections[tempBlock]
                    };
                }
                Connections[ConnectedBlock] = SelectedBlock
                console.log(Connections)
            };
            


        },this);
        
        Gobody.on('pointerup', () =>
        {
            //Run the code
            //Find the Start Block
            var startID = null
            var i
            for (i in Connections){
                console.log(bodies[i].name)
                if (bodies[i].name == "Start"){
                    startID = i;
                    
                }
            }
            console.log(startID)
            var tempID = startID
            while (Connections[tempID] != null){
                console.log(bodies[Connections[tempID]].name)

                if (bodies[Connections[tempID]].name == "angle45") {
                    this.cannon.angle = -120;
                    // this.cannon.angle = -45;
                    console.log("angle45")
                }

                if (bodies[Connections[tempID]].name == "angle60") {
                    this.cannon.angle = -45;
                    console.log("angle60")
                }

                if (bodies[Connections[tempID]].name == "angle30") {
                    this.cannon.angle = -0.3;
                    console.log("angle30")
                }
                
                if (bodies[Connections[tempID]].name == "Fire")
                {
                    Gobody.destroy();
                    this.fire();
                    console.log("fired")
                }
               
                tempID = Connections[tempID];
            }


        });


        // TYLER END

        
        // this.input.keyboard.on('keydown-W', this.fire, this);
        
        const gui = new dat.GUI();
        const p1 = gui.addFolder("Controls");
        
        const WORLD_HEIGHT = 600;
        const WORLD_WIDTH = 800;

        // this.add.image(0, WORLD_WIDTH, "bg").setOrigin(0, 1);
        this.add.image(0, 0, "bg").setOrigin(0, 0).setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT).setAlpha(0.3);
        
        this.cannon = new Cannon(500, 500, 300, 400, 0, 0, 0, 0.5, 0);
        p1.add(this.cannon, 'angle', 0, 6).step(0.1).listen();
        p1.add(this.cannon, 'force', 0.5, 3).step(0.1).listen();
        p1.add(this.cannon, 'x', 0, WORLD_WIDTH).step(1).listen();
        p1.add(this.cannon, 'y', 0, WORLD_HEIGHT).step(1).listen();
        p1.open();


        // this.matter.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        this.cannon_image = this.render_cannon(this.cannon);

        this.level["level"].forEach(element => {
            this.render_tile(new BlockType(element["s_type"], element["i_x"], element["i_y"]));
        });


        this.cursors = this.input.keyboard.createCursorKeys();

        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                if ((bodyA.gameObject === this.ball && bodyB.gameObject === this.pirate) ||
                    (bodyA.gameObject === this.pirate && bodyB.gameObject === this.ball)) {
                    if (!died) {
                        this.sound.play("death_sound");
                        died = true;
                    }
                }
            });
        });
    }

    update() {
        // this.render_cannon(cannon);
        // console.log(this.cannon_image.angle, this.cannon.angle);
        if (this.cursors.space.isDown) {
            this.fire();
        }
        this.cannon_image.rotation = this.cannon.angle;
        this.cannon_image.x = this.cannon.x;
        this.cannon_image.y = this.cannon.y;
    }

    // fire() {
    //     setTimeout(function() {
    //         if (!fired) {
    //             fired = true;
    
    //             console.log(-1*this.cannon_image.angle);
    
    //             this.sound.play("fire_sound");
    
    //             var rad = Phaser.Math.DegToRad(this.cannon_image.angle);
                
    //             this.ball = this.render_cannon_ball(new BlockType("cannon_ball", this.cannon.x + 100*Math.cos(rad), this.cannon.y + 100*Math.sin(rad)));
    //             this.ball.setVelocity(15*Math.cos(rad)*this.cannon.force, 15*Math.sin(rad)*this.cannon.force);
    
    //             setTimeout(function() {
    //                 fired = false;
    //                 // ball.destroy();
    //             }, 1000);
    //         }
    //     }, 1000);
    //     // ball.setAngle(this.cannon_image.angle);
    // }

    fire() {
        setTimeout(() => {
            if (!this.fired) {
                this.fired = true;
    
                console.log(-1 * this.cannon_image.angle);
    
                this.sound.play("fire_sound");
    
                var rad = Phaser.Math.DegToRad(this.cannon_image.angle);
    
                this.ball = this.render_cannon_ball(new BlockType("cannon_ball", this.cannon.x + 100 * Math.cos(rad), this.cannon.y + 100 * Math.sin(rad)));
                this.ball.setVelocity(15 * Math.cos(rad) * this.cannon.force, 15 * Math.sin(rad) * this.cannon.force);
    
                setTimeout(() => {
                    this.fired = false;
                    // this.ball.destroy(); // Uncomment if you want to destroy the ball after 1 second
                }, 1000);
            }
        }, 1000);
        // this.ball.setAngle(this.cannon_image.angle); // Uncomment if you want to set the angle of the ball
    }
    

    render_tile(block) {
        if (block.s_type == "cannon_base") {
            this.cannon.x = block.i_x*50;
            this.cannon.y = block.i_y*50;
        }
        console.log(PROPERTIES);
        console.log(block.s_type);
        const properties = PROPERTIES[block.s_type] || {};
        if (block.s_type == "pirate") {
            this.pirate = this.matter.add.image(block.i_x * 50, block.i_y * 50, block.s_type, null, properties).setScale(1);
        } else {
            this.matter.add.image(block.i_x * 50, block.i_y * 50, block.s_type, null, properties).setScale(1);
        }
    }

    render_cannon(cannon) {
        const properties = PROPERTIES["cannon_barrel"] || {};
        return this.matter.add.image(this.cannon.x, this.cannon.y, "cannon_barrel", null, properties).setScale(2);
    }

    render_cannon_ball(ball) {
        const properties = PROPERTIES["cannon_ball"] || {};
        console.log(ball.x, ball.y);
        return this.matter.add.image(ball.i_x, ball.i_y, "cannon_ball", null, properties).setScale(1);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 } // Ensure gravity is set
        }
    }
};

const game = new Phaser.Game(config);

window.addEventListener('load', () => {
    game.canvas.focus();
});
