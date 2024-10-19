var current_level = 1;

class Example extends Phaser.Scene {

    preload () {
        this.load.image("wood", "./assets/wood.jpg");
        this.load.image("steel", "./assets/steel.jpg");

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

        this.level["level"].forEach(element => {
            this.render_tile(new BlockType(element["s_type"], element["i_x"], element["i_y"]));
        });

        // this.input.keyboard.on("keydown-A", () => {r1.x = r1.x + 50; r1.y = r1.y += 30});
        // this.render_tile(new BlockType("wood", 3, 4));
        // this.render_tile(new BlockType("steel", 100, 300));
    }

    render_tile(block) {
        this.matter.add.image(block.i_x*50, block.i_y*50, block.s_texture);
    }

}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    physics: {
        default: 'matter'
    }
};

const game = new Phaser.Game(config);
