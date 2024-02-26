//board

var blocksize = 45;   //blocksize: Size of each block (or cell) in the game grid.
var rows = 20;   //rows: Number of rows in the game grid.
var cols = 45;   //cols: Number of columns in the game grid.
var board;     //board: Reference to the HTML canvas element.
var context;   //context: 2D rendering context of the canvas.

// Snake variables
var snakeBody = [];//snakeBody: An array representing the positions of the snake's body segments.
//snakeX and snakeY: Initial position of the snake's head.
var snakeX = blocksize * 5;//(5,5) pr hoga initially snake 
var snakeY = blocksize * 5;

// Velocity
//velocityX and velocityY: Velocity of the snake in the x and y directions.
var velocityX = 0;//(0,0) hogi initially snake ki speed
var velocityY = 0;

// Food variables
//foodX and foodY: Position of the food.
var foodX;
var foodY;

var gameOver = false;

//
window.onload = function () {
    //phle board ki length set kr do
    board = document.getElementById("board");
    board.height = rows * blocksize; //board ki height set kr do
    board.width = cols * blocksize;  //board ki width kr deta hai
    context = board.getContext("2d"); // Used for drawing on the board

    placefood();//phle random food set kr do
    document.addEventListener("keyup", changeDirection);//jb key press karege to direction change kro
    setInterval(update, 1000 / 10);//har 100sec me update krte rho
}

//The update function is responsible for updating the game state in each iteration of the game loop.
//It clears the canvas, draws the food, checks if the snake has eaten the food, moves the snake's body, and checks for game over conditions.
function update() {
    if (gameOver) {
        return;
    }
    
    //board ka color black set kr do (0,0) se (board.width, board.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

     //food ka color red set kr do
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blocksize, blocksize);

    //This block of code checks if the head of the snake (snakeX, snakeY) is in the same position as the food (foodX, foodY). 
    //If this condition is true, it means the snake has eaten the food, and the following actions occur.
    if (snakeX == foodX && snakeY == foodY) {
        //Adding to Snake's Body
        //The current position of the food ([foodX, foodY]) is added as a new segment to the snakeBody array. 
        //This array represents the positions of all segments of the snake's body.(jb snake khane ko kha lega to uska size bhi snake ki bpdy me attach kr do)
        snakeBody.push([foodX, foodY]);
        //jb snake khana kha lega to firse placefood ko call karege aur nya khana firse aa jaye ga
        placefood();
    }

   // This part of the code is responsible for moving the segments of the snake's body in sync with the motion of the snake's head.
   //This loop iterates over each segment of the snake's body, starting from the last segment (the tail) and moving towards the head.
    for (let i = snakeBody.length - 1; i > 0; i--) {
        //snakeBody[i] = snakeBody[i - 1];: For each iteration, the position of the current segment (snakeBody[i]) is updated to be the same
        // as the position of the previous segment (snakeBody[i - 1]). This effectively shifts the position of each segment to be the same as
        // the position of the segment in front of it.
        snakeBody[i] = snakeBody[i - 1];
    }
    //This code is necessary to ensure that the head of the snake is always reflected as the first segment of the snake's body.
    //if (snakeBody.length): This condition checks if the snakeBody array has at least one segment. The condition is true if the snake has a body (it's not an empty array).
    if (snakeBody.length) {
        //snakeBody[0] = [snakeX, snakeY];: If the condition is true, the position of the first segment of the snake's body (index 0) is updated to be the current position of the snake's head (snakeX, snakeY).
        snakeBody[0] = [snakeX, snakeY];
    }

    //This code block essentially moves the snake's head to its new position based on the velocity and updates the canvas to reflect this change.
    context.fillStyle = "lime";
    snakeX += velocityX * blocksize;
    snakeY += velocityY * blocksize;
    context.fillRect(snakeX, snakeY, blocksize, blocksize);

    //This code block is responsible for drawing each segment of the snake's body on the canvas. 
    //The continuous execution of this logic in the game loop ensures that the snake's body is updated and redrawn in each frame, giving the appearance of smooth movement.
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blocksize, blocksize);
    }

    // Game over conditions
    //snakeX < 0: Checks if the x-coordinate of the snake's head is less than 0, which means the snake has moved beyond the left boundary of the game grid.
   //snakeX >= cols * blocksize: Checks if the x-coordinate of the snake's head is greater than or equal to the total width of the game grid (cols * blocksize), which means the snake has moved beyond the right boundary of the game grid.
   //same for snakeY in top and bottom direction
    if (snakeX < 0 || snakeX >= cols * blocksize || snakeY < 0 || snakeY >= rows * blocksize) {
        gameOver = true;
        alert("GameOver");
    }
//if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]): Within each iteration, it checks if the x-coordinate of the snake's head (snakeX) 
//is equal to the x-coordinate of the current body segment (snakeBody[i][0]), and if the y-coordinate of the snake's head (snakeY) is equal to the y-coordinate of the current body segment (snakeBody[i][1]).
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("GameOver");
        }
    }
}

//The changeDirection function is an event handler for keyup events. It changes the snake's velocity based on the pressed arrow key,
// ensuring that the snake cannot move in the opposite direction.

//e: This parameter represents the event object, which contains information about the keypress event.
  //e.code: This property of the event object represents the key code of the pressed key.
function changeDirection(e) {
    //If the "ArrowUp" key is pressed (e.code == "ArrowUp") and the snake is not currently moving downward (velocityY != 1),
    // the velocity is updated to move upward (velocityX = 0; velocityY = -1;).
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

//The placefood function is responsible for placing the food at a random position within the game grid.
function placefood() {
    foodX = Math.floor(Math.random() * cols) * blocksize;
    foodY = Math.floor(Math.random() * rows) * blocksize;
}
