class FlappyBird extends Phaser.Scene {
    bird: Phaser.Physics.Arcade.Sprite;
    pipe: Phaser.Physics.Arcade.Sprite;

    jumpSound: Phaser.Sound.BaseSound;

    pipes: Phaser.GameObjects.Group;

    timer: Phaser.Time.TimerEvent;

    score: number = 0;

    labelScore: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: 'FlappyBird'
        });
    }

    preload(): void {
        // This function will be executed at the beginning
        // That's where we load the images and sounds

        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.audio('jump', 'assets/jump.wav');
    }

    create(): void {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        this.jumpSound = this.sound.add('jump');
        this.pipes = this.physics.add.group();
        this.bird = this.physics.add.sprite(100, 245, 'bird');

        this.bird.setGravityY(1000);

        this.timer = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes.bind(this),
            loop: true
        });

        this.labelScore = this.add.text(20, 20, "0", {font: "30px Arial", fill: "#ffffff"});

        const space_key: Phaser.Input.Keyboard.Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        space_key.on('down', this.jump.bind(this));
    }

    update(timestep: number, delta: number): void {
        // This function is called 60 times per second
        // It contains the game's logic

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();

        this.physics.add.overlap(this.bird, this.pipes, this.hitPipe.bind(this));

        if (this.bird.angle < 20)
            this.bird.angle += 1;
    }

    jump(): void {
        if(this.bird.active != true){
            return;
        }
        this.jumpSound.play();

        //this.bird.angle = -20;
        this.tweens.add({
            targets: [this.bird],
            angle: {value: -20, duration: 100}
        });

        this.bird.setVelocityY(-350);
    }

    restartGame(): void {
        this.score = 0;
        this.labelScore.text = String(this.score);
        this.scene.restart();
    }

    addOnePipe(x, y): void {
        // Create a pipe at the position x and y
        this.pipe = this.physics.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(this.pipe);

        // Add velocity to the pipe to make it move left
        this.pipe.setVelocityX(-200);
    }

    addRowOfPipes(): void {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        let hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole + 1'
        for (let i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 30);


        this.score += 1;
        this.labelScore.text = String(this.score);
    }

    hitPipe(): void {

        // Set the alive property of the bird to false
        this.bird.setActive(false);

        this.timer.destroy();

        this.pipes.children.each((p: Phaser.Physics.Arcade.Sprite) => {
            p.body.velocity.x = 0;
        });
    }
}

export default FlappyBird;
