var current_level = 1;

class Example extends Phaser.Scene {

    preload () {
        this.load.image("wood", "./assets/images/wood.png");
        this.load.image("steel", "./assets/steel.jpg");
        this.load.image("cannon_barrel", "./assets/images/cannon_barrel.png");

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
        const gui = new dat.GUI();
        const p1 = gui.addFolder("Controls");

        this.cannon = new Cannon(0, 20, 300, 400, 0, 0, 0, 0, 0);
        p1.add(cannon, 'angle', 0, 1).step(0.1).listen();
        p1.add(cannon, 'force', 0, 1).step(0.1).listen();
        p1.add(cannon, 'x', 0, 100).step(0.1).listen();
        p1.open();


        this.matter.world.setBounds(0, 0, 800, 600);

        this.level["level"].forEach(element => {
            this.render_tile(new BlockType(element["s_type"], element["i_x"], element["i_y"]));
        });

        this.render_cannon(cannon);


        // this.input.keyboard.on("keydown-A", () => {r1.x = r1.x + 50; r1.y = r1.y += 30});
        // this.render_tile(new BlockType("wood", 3, 4));
        // this.render_tile(new BlockType("steel", 100, 300));
    }

    update() {
        console.log(this.cannon.angle);
    }
    

    render_tile(block) {
        console.log(PROPERTIES);
        console.log(block.s_type);
        const properties = PROPERTIES[block.s_type] || {};
        this.matter.add.image(block.i_x * 50, block.i_y * 50, block.s_type, null, properties).setScale(1);
    }

    render_cannon(cannon) {
        const properties = PROPERTIES["cannon_barrel"] || {};
        this.matter.add.image(cannon.x, cannon.y, "cannon_barrel", null, properties).setScale(2);
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
