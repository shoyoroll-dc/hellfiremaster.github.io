// Get the game container element
let gameContainer = document.getElementById('game-container');

// Initialize PIXI.js Application with responsive settings
let app = new PIXI.Application({
    width: gameContainer.clientWidth,
    height: gameContainer.clientHeight,
    backgroundColor: 0x1099bb,
    resizeTo: gameContainer,
});
gameContainer.appendChild(app.view);

// Variables for Claw, Toys, and game state
let claw, toys = [];
let isMoving = false;
let targetX = null;
let collectedToysSet = new Set(); // Set to track collected toys

// List of emojis to use as toys
let emojiList = ["🎁", "🐻", "🐸", "🦄", "🐙", "🐷", "🐶", "🦊", "🐼", "🐨", "🐯", "🐹"]; 

// Initialize the game
function initGame() {
    // Create the claw
    claw = new PIXI.Graphics();
    claw.beginFill(0xff0000);
    claw.drawRect(-25, 0, 50, 10);
    claw.endFill();
    claw.y = 0;
    claw.x = app.screen.width / 2;
    app.stage.addChild(claw);

    // Position toys randomly on the stage
    const toyYPosition = app.screen.height - 50; // Position near the bottom
    for (let i = 0; i < emojiList.length; i++) {
        let toy = new PIXI.Text(emojiList[i], {
            fontFamily: 'Arial', 
            fontSize: 48,
        });
        toy.anchor.set(0.5);
        // Random x position within the screen bounds
        toy.x = Math.random() * (app.screen.width - 100) + 50;
        toy.y = toyYPosition - Math.random() * 30; // Slight random y position
        toys.push(toy);
        app.stage.addChild(toy);
    }
}

// Handle window resize to keep the game responsive
window.addEventListener('resize', () => {
    app.renderer.resize(gameContainer.clientWidth, gameContainer.clientHeight);
    resetClawPosition();
});

// Mouse click event handler to move the claw
function onClawMove(event) {
    if (isMoving) return; // Prevent multiple movements at the same time
    // Get the target x position relative to the canvas
    targetX = event.clientX - app.view.getBoundingClientRect().left;
    isMoving = true; // Indicate that the claw is moving
    app.ticker.add(moveClawFunction); // Add the move function to the ticker
}

// Function to move the claw horizontally
const moveClawFunction = (delta) => {
    if (!isMoving || targetX === null) return;

    const speed = 5;
    if (Math.abs(claw.x - targetX) < speed) {
        claw.x = targetX;
        app.ticker.remove(moveClawFunction);
        dropClaw();
    } else {
        claw.x += claw.x < targetX ? speed : -speed;
    }
};

// Function to drop the claw and pick up toys
function dropClaw() {
    const dropSpeed = 5;
    let originalY = claw.y;

    const raiseFunction = () => {
        claw.y -= dropSpeed;
        if (claw.y <= originalY) {
            app.ticker.remove(raiseFunction);
            resetClawPosition();
            isMoving = false;
        }
    };

    const dropFunction = () => {
        claw.y += dropSpeed;
        if (claw.y >= app.screen.height - 100) { // Reaches toy level
            app.ticker.remove(dropFunction);
            pickupToy();
            app.ticker.add(raiseFunction); // Start raising the claw
        }
    };

    app.ticker.add(dropFunction); // Start dropping the claw
}

// Function to check collision and collect toy
function pickupToy() {
    for (let toy of toys) {
        if (toy.visible && hitTestRectangle(claw, toy)) {
            collectToy(toy);
            break;
        }
    }
}

// Simple rectangle collision detection
function hitTestRectangle(r1, r2) {
    const r1Bounds = r1.getBounds();
    const r2Bounds = r2.getBounds();
    return r1Bounds.x + r1Bounds.width > r2Bounds.x &&
        r1Bounds.x < r2Bounds.x + r2Bounds.width &&
        r1Bounds.y + r1Bounds.height > r2Bounds.y &&
        r1Bounds.y < r2Bounds.y + r2Bounds.height;
}

// Function to collect the toy and update the collection
function collectToy(toy) {
    if (!collectedToysSet.has(toy.text)) {
        collectedToysSet.add(toy.text);

        const toyElement = document.createElement('div');
        toyElement.classList.add('toy');
        toyElement.innerText = toy.text;

        const collectedToysContainer = document.getElementById('collected-toys');
        collectedToysContainer.appendChild(toyElement);
    }
    // Play a sound effect (optional, requires a sound file)
    // let audio = new Audio('pickup_sound.mp3');
    // audio.play();

    toy.visible = false; // Hide the toy from the stage
}

// Reset the claw to its initial position
function resetClawPosition() {
    claw.x = app.screen.width / 2;
    claw.y = 0;
    targetX = null;
}

// Start the game
initGame();

// Add event listener for mouse clicks
app.view.addEventListener('click', onClawMove);