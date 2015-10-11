//============FROGGER===========//

// Enemies our player must avoid
var Enemy = function(row, speed) {
    // Variables applied to each of our instances go here
    this.row = row;
    // An URL to the image/sprite for our enemies. The URL should also be on the call to the helper function Resources.load() in engine.js.
    this.sprite = 'images/enemy-bug.png';
    // x is negative so that the enemy "enters" the canvas, instead of just appearing in it
    this.x = -50;
    // Each row has 83 pixels, but there is a misalignement of 30px due to the "3D effect" of the blocks
    this.y = row * 83 - 30;
    this.speed = speed;
};

Enemy.prototype.checkCollision = function() {
    if (
        this.row == player.row &&
        // Check if any point in the width of the player sprite
        // matches any point in the width of the enemy sprite
        player.col * 101 + 25 < this.x + 101 && //Added 25px to adjust for the transparent areas of the sprite
        (player.col + 1) * 101 - 25 > this.x //Subtracted 25px to adjust for the transparent areas of the sprite
    ) {
        lifeCounter.loseLife();
        player.reset();
        this.speed /= 1.05; //When the player loses, the speed is reduced to make the game easier
    }
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
    }
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
    this.col = 2;
    this.row = 5;
};

Player.prototype.checkWin = function() {
    if(this.row == 0) {
        this.reset();
        score += 1000;
        renderScore();
        //When the player wins, the game gets harder
        allEnemies.forEach(function(enemy) {
            enemy.speed += 100;
        });
    }
};

Player.prototype.update = function() {
    clearCanvas();
    this.x = this.col * 101;
    this.y = this.row * 83 - 30;
    this.render();
    this.checkWin();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if(key == 'left' && this.col > 0) {
        this.col--;
    }
    else if(key == 'right' && this.col < 4) {
        this.col++;
    }
    else if(key == 'up' && this.row > 0) {
        this.row--;
    }
    else if(key == 'down' && this.row < 5) {
        this.row++;
    }
};

Player.prototype.reset = function() {
    this.col = 2;
    this.row = 5;
    allBonuses = generateBonuses();
};

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

//================LIVES======================//
var lifeCounter = {
    sprite : 'images/Heart_mini.png',
    row : 6,
    col : 4,
    currentlives : 3
};

lifeCounter.render = function() {
    ctx.clearRect(303, 595, 202, 101);
    for(i=0; i < this.currentlives; i++) {
        var y = this.row * 97;
        var x = (this.col - i) * 40 + 303;
        ctx.drawImage(Resources.get(lifeCounter.sprite), x, y);
    }
};

lifeCounter.loseLife = function() {
    this.currentlives--;
    console.log(this.currentlives);
    if(this.currentlives > 0) {
        console.log(this.currentlives);
        this.render;
    } else {
        console.log('Game Over');
        bolGameOver = true;
    }
};

//===============GAME OVER===================//

var bolGameOver = false;

//Render game over screen
var gameOver = function() {
    ctx.clearRect(0,0, 505, 707);
    ctx.font ='bold 48px Arial';
    ctx.fillText('GAME OVER!', 101, 303);
    ctx.font = '24px Arial';
    ctx.fillText('Press "Enter" to play again', 101, 403);
    document.addEventListener('keyup', function(e) {
        if(e.keyCode == 13) {
            bolGameOver = false;
            lifeCounter.currentlives = 3;
            score = 0;
        }
    });
    return true;
};


//===============SCORE=======================//

//Counter
var score = 0;

//Render text on the bottom left
var renderScore = function() {
    ctx.clearRect(0, 595, 202, 101);
    ctx.font = '48px Arial';
    ctx.fillText(score.toString(), 0, 585 + 48);
};

//===============BONUS=================//

var Bonus = function(spriteURL, row, bonusValue) {
    this.sprite = spriteURL;
    this.bonusValue = bonusValue;
    this.row = row;
    this.col = getRandomInt(0,5);
};

Bonus.prototype.update = function() {
    this.render();
    this.checkBonus();
};

//Render gems
Bonus.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.col * 101, this.row * 83 - 10);
};

//Check if the player got the gem
Bonus.prototype.checkBonus = function() {
    if(player.row == this.row && player.col == this.col) {
        score += this.bonusValue;
        renderScore();
        allBonuses[1] = createBonus(pickGemColor());
    }
};

//Probablility of the type of gem
var pickGemColor = function() {
    var selector = getRandomInt(1,100);
    if(selector < 10) {
        return 'orangeGem';
    }
    else if(selector < 40) {
        return 'blueGem';
    }
    else {
        return 'greenGem';
    }
};

//Helper functions
//Pick a random integer from a range
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

var clearCanvas = function() {
    ctx.clearRect(0,0, 505, 585);
};

var createBonus = function(type) {
    switch(type) {
        case 'star':
            return star = new Bonus('images/Star.png', 0, 1000);
            break;
        case 'orangeGem':
            return orangeGem = new Bonus('images/Gem Orange.png', getRandomInt(1,3), 5000);
            break;
        case 'blueGem':
            return blueGem = new Bonus('images/Gem Blue.png', getRandomInt(1,3), 2000);
            break;
        case 'greenGem':
            return greenGem = new Bonus('images/Gem Green.png', getRandomInt(1,3), 500);
            break;
    }
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

var generateBonuses = function() {
    return [
    createBonus('star'),
    createBonus(pickGemColor())
    ];
};

allBonuses = generateBonuses();