var current_level = 3;


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

        this.matter.world.setBounds(0, 0, 800, 600);

        this.level["level"].forEach(element => {
            this.render_tile(new BlockType(element["s_type"], element["i_x"], element["i_y"]));
        });

        // this.input.keyboard.on("keydown-A", () => {r1.x = r1.x + 50; r1.y = r1.y += 30});
        // this.render_tile(new BlockType("wood", 3, 4));
        // this.render_tile(new BlockType("steel", 100, 300));
    }
    

    render_tile(block) {
        console.log(PROPERTIES);
        console.log(block.s_type);
        const properties = PROPERTIES[block.s_type] || {};
        this.matter.add.image(block.i_x * 50, block.i_y * 50, block.s_type, null, properties).setScale(1);
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
