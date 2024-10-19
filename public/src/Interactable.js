
/**
 * 
 * Standard class for anything that has a width, height, position
 * and is interacts with stuff like the cannon ball
 * 
 */
class Interactable {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

}

// module.exports = Interactable;