
class Cannon extends Interactable {

    constructor(x, y, width, height, angle, ammo_type, ammo_options, force, shots_left) {
        super(x, y, width, height);
        this.ammo_type = ammo_type;
        this.ammo_options = ammo_options;
        this.angle = angle;
        this.force = force;
        this.shots_left = shots_left;
    }

    // Getters

    getAmmoType() {
        return this.ammo_type;
    }

    getAmmoOptions() {
        return this.ammo_options;
    }

    getAngle() {
        return this.angle;
    }

    getForce() {
        return this.force;
    }

    getShots() {
        return this.shots;
    }

    // Setters

    setAmmoType(ammo_type) {
        this.ammo_type = ammo_type;
    }

    setAmmoOptions(ammo_options) {
        this.ammo_options = ammo_options;
    }

    setAngle(angle) {
        this.angle = angle;
    }

    setForce(force) {
        this.force = force;
    }

    setShotsLeft(shots_left) {
        this.shots_left = shots_left;
    }

}

const cannon = new Cannon(10, 10, 10, 10, 10, null, null, 20, 3);
console.log(cannon.getX());