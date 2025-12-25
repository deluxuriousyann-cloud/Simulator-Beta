const player = document.querySelector('.player');
const userInput = document.querySelector('.userInput');
const allInput = document.querySelector('.allInput');
const mainAudio = document.querySelector('.mainAudio');

const directions = ['left', 'right', 'up', 'down'];
const rect = player.getBoundingClientRect();


const defaultPlayerPosition = {
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    top: rect.top
}
const allowedCommands = [
    'move: move to left 100px', 
    'jump: jump for 50px', 
    'reset',
    'hi',
    'calculate: calculate 12 * 12',
    'change color to (color)',
    'say: say i love yannix',
    'play music'
];
const music = {
    mainMusic: mainAudio,
    backupMusic: null
}

let instruction = '';
let playerFunctions = ['jump', 'move']
let numbers = /\d+/;
let valueToJump = '';
let commandDone = false;
let direction = '';
let moveSign = '';
let amount = '';
let commandIndex = 1;

console.log(`Player starting position: Left: ${rect.left}; Right: ${rect.right}`)
console.log(defaultPlayerPosition);

allowedCommands.forEach((command) => {
    console.log(`available command: ${command}.`);
    allInput.innerHTML += `${commandIndex}.) ${command}. <br>`;
    commandIndex++;
})

Object.entries(defaultPlayerPosition).forEach(([key, value]) => {
  console.log(key, value);
});

function movePlayer(amount) {
    // X -> horizontal (translateX), Y -> vertical (translateY)
    movePlayer

    if (direction === 'X') {
        player.style.setProperty('--valToMoveLeft', `${moveSign}${amount}px`);
        player.classList.add('moveLeftAnim');
    } else {
        player.style.setProperty('--valToMoveUp', `${moveSign}${amount}px`);
        player.classList.add('moveUpAnim');
    }

    commandDone = true;

    const onEnd = () => {
        player.classList.remove('moveUpAnim', 'moveLeftAnim');
        // persist final transform so the element stays where it moved
        if (direction === 'X') {
            player.style.transform = `translateX(${moveSign}${amount}px)`;
        } else {
            player.style.transform = `translateY(${moveSign}${amount}px)`;
        }
        commandDone = false;
        userInput.value = '';
        player.removeEventListener('animationend', onEnd);
    };

    player.addEventListener('animationend', onEnd, { once: true });

    console.log(`moved player to ${direction} axis for ${moveSign}${amount}px, current position: left:${rect.left}, top:${rect.top}`);
    return;
}

function jumpPlayer() {
    if (commandDone) return;
    player.style.setProperty('--jump', `-${valueToJump}px`);
    player.classList.add('jumpAnim');

    player.addEventListener('animationend', () => {
        player.classList.remove('jumpAnim');
    }, {once: true});
    userInput.value = '';
    commandDone = false;
}

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (commandDone) return;

    const userWant = userInput.value.trim();
    const playerDo = '';
    console.log(userWant);

    if (userWant.includes('jump')) {
        let newNumber = 0;
        const defaultJump = 30;
        let hasNumbers = false;

        const match = userWant.match(/\d+/);
        if (match) {
            hasNumbers = true;
            newNumber = parseInt(match[0]);
            valueToJump = newNumber;
            console.log(`jump fetched; specified height? ${hasNumbers} for ${newNumber}px;`);
            jumpPlayer();
        } else {
            console.log(`jump fetched; no specified value; jump to default ${defaultJump}px`);
            valueToJump = 30;
            jumpPlayer();
        }

    };

    if (userWant.includes('move')) {
        let newNumber = 0;
        let hasNumbers = false;
        let defaultMove = 20;

        const match = userWant.match(/\d+/);
        if (match) {
            newNumber = parseInt(match[0]);
            hasNumbers = true;
        } else {
            newNumber = defaultMove;
            hasNumbers = false;
        }

        const dirFound = directions.find(dir => userWant.toLowerCase().includes(dir));
        if (dirFound) {
            console.log(`move to ${dirFound}`);
            switch (dirFound) {
                case 'left':
                    direction = 'X'; moveSign = '-'; break;
                case 'right':
                    direction = 'X'; moveSign = ''; break;
                case 'up':
                    direction = 'Y'; moveSign = '-'; break;
                case 'down':
                    direction = 'Y'; moveSign = ''; break;
            }
        // now call your movement handler
        // movePlayer(direction, moveSign, amount);
        console.log(`move detected; to ${dirFound}; numSpecified? ${hasNumbers}, for ${newNumber}`);
        amount = newNumber;
        player.classList.remove('playerAim');
        movePlayer(amount);
        return;
        }
    }

    if (userWant.toLowerCase() == 'reset') {
        player.style.transform = `translate(0, 0)`;
        userInput.value = '';
        console.log(`position has been reset: left: ${rect.left}; right: ${rect.right}`);
    }

    if (userWant.toLowerCase() == 'hi') {
        player.textContent = `hello!`;
        player.classList.add('playerScale');
        userInput.value = '';
        console.log(`said hello successfully`);

        setInterval(() => {
            player.textContent = '';
            player.classList.remove('playerScale');
        }, 5000);
    }

    if (userWant.toLowerCase().startsWith('calculate')) {
        // extract expression after the keyword
        const expr = userWant.replace(/^calculate\s*/i, '').trim();

        // allow digits, whitespace, parentheses, decimal point and +-*/ operators only
        if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
            console.log('Invalid characters in expression');
        } else {
            try {
                // evaluate safely-ish after validation
                const result = Function('"use strict"; return (' + expr + ')')();
                console.log(`expression: ${expr} = ${result}`);
                player.textContent = `${result}`;
                player.classList.add('playerScale');
                userInput.value = '';

                setInterval(() => {
                    player.textContent = '';
                    player.classList.remove('playerScale');
                }, 5000);

            } catch (err) {
                console.log('Invalid expression');
            }
        }
    }

    if (userWant.toLowerCase().startsWith('change color')) {
        const colorReplacement = userWant.replace(/^change color to\s*/i, '').trim();
        console.log(`changing color to ${colorReplacement}`);
        player.style.backgroundColor = colorReplacement;
        return;
    }

    if (userWant.toLowerCase().startsWith('say')) {
        const say = userWant.replace(/^say\s*/i, '').trim()
        console.log(`saying ${say}`);
        player.textContent = `${say}`;
        player.classList.add('playerScale');
        userInput.value = '';
        
        setInterval(() => {
            player.textContent = '';
            player.classList.remove('playerScale');
        }, 5000);
        return;
    }

    if (userWant.toLowerCase() == 'play music' || userWant.toLowerCase().startsWith('play music')) {
        const defaultMusic = Object(music.mainMusic);
        const musicToPlay = userWant.replace(/^play music\s*/i, '').trim();

        if (musicToPlay) {
            console.log('no backup music yet'); 
            userInput.value = 'no other music available' ;

            setInterval(() => {
                userInput.value = '';
            }, 5000);
            return;
        }
        defaultMusic.play();
        console.log('music played');
        let rotate = 0;
        let musicPlaying = true;
        let color = [0, 0, 0];

        function rotatePlayer() {
            if (!musicPlaying) return player.style.transform = 'rotate(0deg)';

            rotate += 1;
            player.style.transform = `rotate(${rotate}deg)`;
        }

        setInterval (() => {
            rotatePlayer();
        }, 10)

        setInterval(() => {
            musicPlaying = false;
            console.log('stopped playing');
            return;
        }, 23000);
        
    }
});
