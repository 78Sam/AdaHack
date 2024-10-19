
var current_level = 1;
var fired = false;

class Example extends Phaser.Scene {

    preload () {
        this.load.image("wood", "./assets/images/wood.png");
        this.load.image("steel", "./assets/images/steel.png");
        this.load.image("platform","./assets/images/beam.png");
        this.load.image("pirate","./assets/images/pirate.png");
        this.load.image("cannon","./assets/images/cannon_base.png");

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

        // this.input.keyboard.on('keydown-W', this.fire, this);

        const gui = new dat.GUI();
        const p1 = gui.addFolder("Controls");

        const WORLD_HEIGHT = 600;
        const WORLD_WIDTH = 800;

        this.cannon = new Cannon(500, 500, 300, 400, 0, 0, 0, 0, 0);
        p1.add(this.cannon, 'angle', 0, 6).step(0.1).listen();
        p1.add(this.cannon, 'force', 0, 1).step(0.1).listen();
        p1.add(this.cannon, 'x', 0, WORLD_WIDTH).step(1).listen();
        p1.add(this.cannon, 'y', 0, WORLD_HEIGHT).step(1).listen();
        p1.open();


        this.matter.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        this.level["level"].forEach(element => {
            this.render_tile(new BlockType(element["s_type"], element["i_x"], element["i_y"]));
        });

        this.cannon_image = this.render_cannon(this.cannon);

        this.cursors = this.input.keyboard.createCursorKeys();
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

    fire() {
        if (!fired) {
            fired = true;

            console.log(-1*this.cannon_image.angle);

            var rad = Phaser.Math.DegToRad(this.cannon_image.angle);
            
            var ball = this.render_cannon_ball(new BlockType("cannon_ball", this.cannon.x + 100*Math.cos(rad), this.cannon.y + 100*Math.sin(rad)));
            ball.setVelocity(10*Math.cos(rad), 10*Math.sin(rad));

            setTimeout(function() {
                fired = false;
                // ball.destroy();
            }, 1000);
        }
        // ball.setAngle(this.cannon_image.angle);
    }
    

    render_tile(block) {
        console.log(PROPERTIES);
        console.log(block.s_type);
        const properties = PROPERTIES[block.s_type] || {};
        this.matter.add.image(block.i_x * 50, block.i_y * 50, block.s_type, null, properties).setScale(1);
    }

    render_cannon(cannon) {
        const properties = PROPERTIES["cannon_barrel"] || {};
        return this.matter.add.image(this.cannon.x, this.cannon.y, "cannon_barrel", null, properties).setScale(2);
    }

    render_cannon_ball(ball) {
        const properties = PROPERTIES["cannon_ball"] || {};
        console.log(ball.x, ball.y);
        return this.matter.add.image(ball.i_x, ball.i_y, "cannon_ball", null, properties).setScale(2);
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
