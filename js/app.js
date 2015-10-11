//================================================FROGGER================================================//

/**
 * Represents the Enemies our player must avoid.
 * @constructor
 */
var Enemy = function(row, speed) {
    // The row where the enemy will be.
    this.row = row;
    /* An URL to the image/sprite for our enemies.
     * The URL should also be on the call to the helper function Resources.load() in engine.js.
     */
    this.sprite = 'images/enemy-bug.png';
    // x is negative so that the enemy "enters" the canvas, instead of just appearing in it.
    this.x = -50;
    // Each row has 83 pixels, but there is a misalignement of 30px due to the "3D effect" of the blocks.
    this.y = row * 83 - 30;
    this.speed = speed;
};

/** Checks if the player is at the same position as the enemy.
 * If so, lose one life, reset the player and slow that enemy to make the game easier.
 */
Enemy.prototype.checkCollision = function() {
    if (
        /* Check if any point in the width of the player sprite matches
         * any point in the width of the enemy sprite.
         */
        this.row == player.row &&
        player.col * 101 + 25 < this.x + 101 && //Added 25px to adjust for the transparent areas of the sprite
        (player.col + 1) * 101 - 25 > this.x //Subtracted 25px to adjust for the transparent areas of the sprite
    ) {
        lifeCounter.loseLife();
        player.reset();
        this.speed /= 1.05; //When the player loses, the speed is reduced to make the game easier.
    }
};

/** Updates the enemy's position, keeping it in a loop, re-renders it and checks
 * if the player collided with it.
 * (Called on every game tick).
 * @param {float} dt - a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if(this.x > 505) {
        this.x = -50; //This value allows the enemy to "enter" the scene, instead of just appearing there
    }
    this.render();
    this.checkCollision();
};

/** Renders the enemy sprite on the canvas.
 * (Called on every game tick).
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Represents the Player character.
 * @constructor
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.col = 2;
    this.row = 5;
};

/** Checks if the player won (reached the water / row 0).
 * If the player won, it increases and re-renders the score,
 * and increases the speed of all enemies, to make the game harder.
 */
Player.prototype.checkWin = function() {
    if(this.row == 0) {
        this.reset();
        score += 1000;
        renderScore();
        allEnemies.forEach(function(enemy) {
            enemy.speed += 100;
        });
    }
};

/** Updates the player's position, re-renders it and checks
 * if the player won.
 * (Called on every game tick).
 */
Player.prototype.update = function() {
    clearCanvas();
    this.x = this.col * 101;
    this.y = this.row * 83 - 30;
    this.render();
    this.checkWin();
};

/** Renders the player character.
 * (Called on every game tick).
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/** Adjust the position of the player according to the keyboard input,
 * and restrict movement to the canvas limits.
 * (Called on every keyup event).
 */
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

/** Replaces the player in the start position and regenerates the bonuses. */
Player.prototype.reset = function() {
    this.col = 2;
    this.row = 5;
    allBonuses = generateBonuses();
};

/** This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

   player.handleInput(allowedKeys[e.keyCode]);
});

/** Object that holds the position and sprite of the life counter,
 * and the player's current lives.
 */
var lifeCounter = {
    sprite : 'images/Heart_mini.png',
    row : 6,
    col : 4,
    currentLives : 3
};

/** Renders the hearts representing current lives in the
 * bottom right corner of the canvas.
 * (Called on every game tick).
 */
lifeCounter.render = function() {
    ctx.clearRect(303, 595, 202, 101);
    for(i=0; i < this.currentLives; i++) {
        var y = this.row * 97;
        var x = (this.col - i) * 40 + 303;
        ctx.drawImage(Resources.get(lifeCounter.sprite), x, y);
    }
};

/** Decreases one life to currentLives and checks for game over. */
lifeCounter.loseLife = function() {
    this.currentLives--;
    if(this.currentLives > 0) {
        this.render;
    } else {
        bolGameOver = true;
    }
};

// Initiate the game over boolean.
var bolGameOver = false;

/** Render the game over screen and restart
 * the game when the player presses -enter-.
 * The main() function in engine.js loops through this function
 * while bolGameOver is true.
 */
var gameOver = function() {
    ctx.clearRect(0,0, 505, 707);
    ctx.font ='bold 48px Arial';
    ctx.fillText('GAME OVER!', 101, 303);
    ctx.font = '24px Arial';
    ctx.fillText('Press "Enter" to play again', 101, 403);
    document.addEventListener('keyup', function(e) {
        if(e.keyCode == 13) {
            bolGameOver = false;
            lifeCounter.currentLives = 3;
            score = 0;
        }
    });
    return true;
};

// Initiate the score counter.
var score = 0;

/** Render the score on the bottom left of the canvas.
 * (Called on every game tick).
 */
var renderScore = function() {
    ctx.clearRect(0, 595, 202, 101); //Clear the score area
    ctx.font = '48px Arial';
    ctx.fillText(score.toString(), 0, 585 + 48);
};

/**
 * Represents the Bonuses our player can catch.
 * @constructor
 * @param {string} spriteURL - URL to the sprite
 * @param {int} row - the row in which to place the bonus
 * @param {int} bonusValue - how much the bonus is worth
 */
var Bonus = function(spriteURL, row, bonusValue) {
    this.sprite = spriteURL;
    this.bonusValue = bonusValue;
    this.row = row;
    this.col = getRandomInt(0,5);
};

/** Checks if the player got the bonus and re-renders it.
 * (Called on every game tick).
 */
Bonus.prototype.update = function() {
    this.render();
    this.checkBonus();
};

/** Renders the bonus.
 * (Called on every game tick).
 */
Bonus.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.col * 101 + 10, this.row * 83 - 10); // +10/-10 centers the gem in the grid.
};

/** Check if the player got the gem. */
Bonus.prototype.checkBonus = function() {
    if(player.row == this.row && player.col == this.col) {
        score += this.bonusValue;
        renderScore();
        allBonuses[1] = createBonus(pickGemColor());
    }
};

/**Randomly picks an orange, blue or green gem, after the following probabilities:
 *  Orange  - 10%
 *  Blue    - 30%
 *  Green   - 60%
 */
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

/** Pick a random integer from a range. */
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

/** Clear the canvas in the map area to avoid artifacts.*/
var clearCanvas = function() {
    ctx.clearRect(0,0, 505, 585);
};

/** Instantiate a bonus of the selected type.
 * @param {string} type - type of bonus to instantiate, from the 4 possible.
 */
var createBonus = function(type) {
    switch(type) {
        case 'star':
            return star = new Bonus('images/Star.png', 0, 1000);
            break;
        case 'orangeGem':
            return orangeGem = new Bonus('images/Gem Orange_mini.png', getRandomInt(1,3), 5000);
            break;
        case 'blueGem':
            return blueGem = new Bonus('images/Gem Blue_mini.png', getRandomInt(1,3), 2000);
            break;
        case 'greenGem':
            return greenGem = new Bonus('images/Gem Green_mini.png', getRandomInt(1,3), 500);
            break;
    }
};

/** Returns an array with all the bonuses.*/
var generateBonuses = function() {
    return [
    createBonus('star'),
    createBonus(pickGemColor())
    ];
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Place all bonus objects in an array called allBonuses
var allEnemies = [
    new Enemy(2, 165),
    new Enemy(3, 250),
    new Enemy(1, 300)
    ];

var player = new Player();

allBonuses = generateBonuses();