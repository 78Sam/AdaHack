class BlockType {
    constructor(s_type, i_x, i_y, params) {
        this.s_type = s_type;
        this.i_x = i_x;
        this.i_y = i_y;
        this.params = params
    }
}

const PROPERTIES = {
    "pirate":{
        friction: 0.6,
        density:0.5
    },
    "wood": {
        restitution: 0.8,
        friction: 0.6,
        density: 0.1
    },
    "steel": {
        restitution: 1.0, // Bounciness
        friction: 0.5, // Friction
        density: 1 // Density
    },
    "platform":{
        isStatic: true
        density: 0.001 // Density
    },
    "cannon_barrel": {
        isStatic: true
    },
    "cannon_ball": {
        restitution: 1.0, // Bounciness
        friction: 0.5, // Friction
        density: 0.001 // Density
    }

}