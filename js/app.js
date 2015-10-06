// Enemies our player must avoid
var Enemy = function(loc, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.loc = loc;
    this.sprite = 'images/enemy-bug.png';
    this.x = -50;
    this.y = loc * 83 - 30;
    this.speed = speed;
    
};

Enemy.prototype.checkCollision = function() {
    if(
        this.loc == player.yloc &&
        player.xloc * 101 + 25 < this.x + 101 && //Added 25px to adjust for the empty areas of the sprite
        (player.xloc + 1) * 101 - 25 > this.x //Subtracted 25px to adjust for the empty areas of the sprite
        ) 
    {
        player.reset();
        this.speed /= 1.05; //When the player loses, the speed is reduced to make the game easier
    };
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        this.x = this.x + this.speed * dt;
        if(this.x > 505) {
            this.x = -50; //This value allows the image to "enter" the scene, instead of just appearing there
        };
    this.render();
    this.checkCollision();
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    
    this.sprite = 'images/char-boy.png';
    this.xloc = 2;
    this.yloc = 5;
    
};

Player.prototype.checkWin = function() {
    if(this.yloc == 0) {
        this.reset();
        allEnemies.forEach(function(enemy) {
            enemy.speed += 100; //When the player wins, the game gets harder
        });
    };
};

Player.prototype.update = function(dt) {
    this.x = this.xloc * 101;
    this.y = this.yloc * 83 - 30;
    this.render();
    this.checkWin();

    };

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

Player.prototype.handleInput = function(key) {
    if(key == 'left' && this.xloc > 0) {
        this.xloc--;
    };
    if(key == 'right' && this.xloc < 4) {
        this.xloc++;
    };
    if(key == 'up' && this.yloc > 0) {
        this.yloc--;
    };
    if(key == 'down' && this.yloc < 5) {
        this.yloc++;
    };
};

Player.prototype.reset = function() {
    this.xloc = 2;
    this.yloc = 5;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [
    new Enemy(2, 165),
    new Enemy(3, 250),
    new Enemy(1, 300)
    ];

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

   player.handleInput(allowedKeys[e.keyCode]);
});
