const input = document.querySelector("input"),
  guess = document.querySelector(".guess"),
  checkButton = document.querySelector("button"),
  remainChances = document.querySelector(".chances");

input.focus();

let randomNum = Math.floor(Math.random() * 50);
chance = 5;

// Function to play womp womp sound effect
function playWompSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    50,
    audioContext.currentTime + 0.5,
  );

  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.5,
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

// rising chime for win
function playWinSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator.frequency.linearRampToValueAtTime(
    1000,
    audioContext.currentTime + 0.6,
  );

  gainNode.gain.setValueAtTime(0.0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.2);
  gainNode.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 0.6);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.6);
}

checkButton.addEventListener("click", () => {
  // Decrement the chance variable on every click
  chance--;
  let inputValue = input.value;
  // Check if the input value is equal to the random number
  // clear any previous animation classes
  guess.classList.remove("shake", "jump");

  if (inputValue == randomNum) {
    // Update guessed number, disable input, check button text and color.
    [guess.textContent, input.disabled] = [
      "Congratulations!! You Won the Game",
      true,
    ];
    [checkButton.textContent, guess.style.color] = ["Replay", "#333"];
    // trigger jump animation on success message
    guess.classList.add("jump");
    // play win sound
    playWinSound();
    // fire confetti if available
    if (typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    //Check if input value is > random number and within 1-99 range.
  } else if (inputValue > randomNum && inputValue < 51) {
    // Update the guess text and remaining chances
    [guess.textContent, remainChances.textContent] = [
      "Your guess is high",
      chance,
    ];
    guess.style.color = "#333";
    //Check if input value is < random number and within 1-99 range.
  } else if (inputValue < randomNum && inputValue > 0) {
    // Update the guessed number text and remaining chances
    [guess.textContent, remainChances.textContent] = [
      "Your guess is low",
      chance,
    ];
  } else {
    // Update the guessed number text, color and remaining chances
    [guess.textContent, remainChances.textContent] = [
      "Your number is invalid",
      chance,
    ];
    guess.style.color = "#DE0611";
  }
  if (chance == 0) {
    //Update check button, disable input, and clear input value.
    // Update guessed number text and color to indicate user loss.
    [checkButton.textContent, input.disabled, inputValue] = [
      "Replay",
      true,
      "",
    ];
    [guess.textContent, guess.style.color] = ["You lost the game", "#DE0611"];
    // trigger shake animation
    guess.classList.add("shake");
    // play womp womp sound
    playWompSound();
    // create floating sad faces
    for (let i = 0; i < 27; i++) {
      const face = document.createElement("div");
      face.textContent = "😢";
      face.classList.add("sad-face", `float${i + 1}`);
      face.style.left = Math.random() * 80 + 10 + "%";
      face.style.top = Math.random() * 80 + 10 + "%";
      document.body.appendChild(face);
      // remove after 5 seconds
      setTimeout(() => face.remove(), 5000);
    }
  }
  if (chance < 0) {
    window.location.reload();
  }
});
