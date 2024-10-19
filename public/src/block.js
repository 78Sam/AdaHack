class BlockType {
    constructor(s_texture, i_x, i_y) {
        this.s_texture = s_texture;
        this.i_x = i_x;
        this.i_y = i_y;
    }
}

class WoodType extends BlockType {}

class SteelType extends BlockType {}

class GlassType extends BlockType {}

// module.exports = BlockTypes;