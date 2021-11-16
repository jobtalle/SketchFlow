const Vector = function(x, y) {
    this.x = x;
    this.y = y;
};

Vector.prototype.copy = function() {
    return new Vector(this.x, this.y);
}