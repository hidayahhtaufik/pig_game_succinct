'use strict';

// Game Elements
const player0El = document.getElementById('player-0');
const player1El = document.getElementById('player-1');
const score0El = document.getElementById('score-0');
const score1El = document.getElementById('score-1');
const current0El = document.getElementById('current-0');
const current1El = document.getElementById('current-1');
const diceEl = document.getElementById('dice');
const btnNew = document.getElementById('btn-new');
const btnRoll = document.getElementById('btn-roll');
const btnHold = document.getElementById('btn-hold');

// Modal Elements
const modal = document.getElementById('winner-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const loadingContainer = document.getElementById('loading-container');
const proofResult = document.getElementById('proof-result');
const proofHash = document.getElementById('proof-hash');

// Game State
let scores, currentScore, activePlayer, playing;

// Pink-themed Dice SVGs
const diceImages = {
  1: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="20" fill="white" stroke="#ff0080" stroke-width="3"/>
        <circle cx="60" cy="60" r="10" fill="#ff0080"/>
      </svg>`,
  2: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="20" fill="white" stroke="#ff0080" stroke-width="3"/>
        <circle cx="40" cy="40" r="10" fill="#ff0080"/>
        <circle cx="80" cy="80" r="10" fill="#ff0080"/>
      </svg>`,
  3: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="20" fill="white" stroke="#ff0080" stroke-width="3"/>
        <circle cx="35" cy="35" r="10" fill="#ff0080"/>
        <circle cx="60" cy="60" r="10" fill="#ff0080"/>
        <circle cx="85" cy="85" r="10" fill="#ff0080"/>
      </svg>`,
  4: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="20" fill="white" stroke="#ff0080" stroke-width="3"/>
        <circle cx="40" cy="40" r="10" fill="#ff0080"/>
        <circle cx="80" cy="40" r="10" fill="#ff0080"/>
        <circle cx="40" cy="80" r="10" fill="#ff0080"/>
        <circle cx="80" cy="80" r="10" fill="#ff0080"/>
      </svg>`,
  5: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="20" fill="white" stroke="#ff0080" stroke-width="3"/>
        <circle cx="35" cy="35" r="10" fill="#ff0080"/>
        <circle cx="85" cy="35" r="10" fill="#ff0080"/>
        <circle cx="60" cy="60" r="10" fill="#ff0080"/>
        <circle cx="35" cy="85" r="10" fill="#ff0080"/>
        <circle cx="85" cy="85" r="10" fill="#ff0080"/>
      </svg>`,
  6: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="20" fill="white" stroke="#ff0080" stroke-width="3"/>
        <circle cx="35" cy="30" r="10" fill="#ff0080"/>
        <circle cx="85" cy="30" r="10" fill="#ff0080"/>
        <circle cx="35" cy="60" r="10" fill="#ff0080"/>
        <circle cx="85" cy="60" r="10" fill="#ff0080"/>
        <circle cx="35" cy="90" r="10" fill="#ff0080"/>
        <circle cx="85" cy="90" r="10" fill="#ff0080"/>
      </svg>`
};

// Initialize Game
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add('hidden');
  player0El.classList.remove('winner');
  player1El.classList.remove('winner');
  player0El.classList.add('active');
  player1El.classList.remove('active');
  
  modal.style.display = 'none';
  
  console.log('🎲 New Succinct Pig Game Started!');
};

// Switch Player Function
const switchPlayer = function () {
  document.getElementById(`current-${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('active');
  player1El.classList.toggle('active');
  
  console.log(`🔄 Switched to Player ${activePlayer + 1}`);
};

// SP1 Proof Generation
const generateSP1Proof = async (playerName) => {
  try {
    console.log(`🔮 Requesting SP1 proof for winner: ${playerName}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    const response = await fetch('http://152.53.164.253:3000/api/generate-proof', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: playerName }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 SP1 Proof Response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error generating SP1 proof:', error);
    
    if (error.name === 'AbortError') {
      return { 
        success: false, 
        isRealProof: false,
        error: 'Request timeout - server took too long to respond'
      };
    }
    
    return { 
      success: false, 
      isRealProof: false,
      error: error.message || 'Network error'
    };
  }
};

window.shareOnTwitter = function(playerName, proofHash) {
    const tweetText = encodeURIComponent(
        `🎲 I played the Pig Game and generated a SP1 Zero-Knowledge Proof @SuccinctLabs! ` +
        `🏆 ${playerName} won and the result is verified with hash: ${proofHash.substring(0, 16)}... ` +
        `🔮 Powered by @SuccinctLabs SP1 zkVM! ` +
        `🚀 Script by @Hidayahhtaufik – Try it yourself https://pig-game-succinct.auranode.xyz/`
    );

  window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'width=600,height=400');
  
  console.log('🐦 Twitter share opened for:', playerName);
};

const showWinnerModal = async (playerNumber) => {
  const playerName = `Player ${playerNumber + 1}`;
  const finalScore = scores[playerNumber];
  
  modalTitle.textContent = '🏆 Pig Game Champion!';
  modalMessage.textContent = `${playerName} wins with ${finalScore} points!`;
  
  loadingContainer.style.display = 'flex';
  proofResult.style.display = 'none';
  proofHash.style.display = 'none';
  modal.style.display = 'flex';

  console.log(`🎯 GAME COMPLETE! ${playerName} achieved victory with ${finalScore} points`);
  console.log('🔄 Initiating Succinct SP1 proof generation...');
  console.log(proofHash, "<<<<<<<<")
  try {
    // Generate SP1 proof
    const proofData = await Promise.race([
      generateSP1Proof(playerName),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Proof generation timeout')), 600000)
      )
    ]);
    
    loadingContainer.style.display = 'none';
    proofResult.style.display = 'block';

    // Display results based on proof generation success
    
    if (proofData.success && proofData.isRealProof) {
      proofResult.innerHTML = '✅ SP1 Zero-Knowledge Proof Generated Successfully!<br><small>Victory verified with SP1</small>';
      proofResult.className = 'proof-result proof-success';
      
      // Make sure to set the proof hash HTML content
      proofHash.innerHTML = `<strong>Succinct Proof Hash:</strong><br><span style="word-break: break-all; font-family: monospace; font-size: 0.9rem;">${proofData.proofHash}</span>`;
      proofHash.style.display = 'block';
      
      console.log(`🎉 Champion ${playerName} verified with SP1 proof!`);
      console.log(`🔐 Proof Hash: ${proofData.proofHash}`);
      
      // Add Twitter share button after successful proof
      const shareButtonContainer = document.createElement('div');
      shareButtonContainer.style.marginTop = '2rem';
      shareButtonContainer.innerHTML = `
        <button id="twitter-share-btn" 
                style="background: linear-gradient(45deg, #1da1f2, #0d8bd9); 
                       color: white; border: none; padding: 1.2rem 2.5rem; 
                       border-radius: 25px; font-size: 1.4rem; font-weight: 600; 
                       cursor: pointer; transition: all 0.3s ease; 
                       box-shadow: 0 4px 15px rgba(12, 152, 239, 0.4);"
                onclick="shareOnTwitter('${playerName}', '${proofData.proofHash}')">
          🐦 Share on Twitter
        </button>

      `;
      proofResult.appendChild(shareButtonContainer);
      
      // Add event listener to the button instead of inline onclick
      document.getElementById('twitter-share-btn').addEventListener('click', function() {
        window.shareOnTwitter(playerName, proofData.proofHash);
      });
      
      // Add celebration sparkles
      for (let i = 0; i < 8; i++) {
        setTimeout(() => addSparkles(), i * 200);
      }
    } else {
      proofResult.innerHTML = '⚠️ SP1 Proof Generation Failed<br><small>Please check server connection</small>';
      proofResult.className = 'proof-result proof-failure';
      
      if (proofData.error) {
        proofResult.innerHTML += `<br><small>Error: ${proofData.error}</small>`;
      }
      
      console.log(`❌ Proof generation failed for ${playerName}`);
    }
  } catch (error) {
    // Handle timeout or other errors
    console.error('❌ Proof generation error or timeout:', error);
    
    loadingContainer.style.display = 'none';
    proofResult.style.display = 'block';
    proofResult.innerHTML = '⚠️ Proof Generation Timeout<br><small>Server took too long to respond</small>';
    proofResult.className = 'proof-result proof-failure';
  }
};

// Close Modal Function (DON'T auto-start new game)
window.closeModal = function() {
  modal.style.display = 'none';
  // Don't call init() - let user manually start new game
  console.log('🎯 Modal closed - Click "New Game" to play again');
};

// Emergency reset function - accessible from console
window.emergencyReset = function() {
  console.log('🚨 Emergency reset triggered');
  modal.style.display = 'none';
  loadingContainer.style.display = 'none';
  proofResult.style.display = 'none';
  proofHash.style.display = 'none';
  playing = true;
  init();
};

// Add emergency reset on Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    console.log('🚨 Escape pressed - Emergency reset');
    window.emergencyReset();
  }
});

// Sparkle Effect Function
const addSparkles = () => {
  const sparkles = ['✨', '💎', '🌟', '⭐', '💫', '🎊', '🎉'];
  const randomSparkle = sparkles[Math.floor(Math.random() * sparkles.length)];
  
  const sparkle = document.createElement('div');
  sparkle.textContent = randomSparkle;
  sparkle.style.position = 'fixed';
  sparkle.style.left = Math.random() * window.innerWidth + 'px';
  sparkle.style.top = Math.random() * window.innerHeight + 'px';
  sparkle.style.fontSize = Math.random() * 2 + 1.5 + 'rem';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.zIndex = '999';
  sparkle.style.animation = 'sparkleFloat 3s ease-out forwards';
  
  document.body.appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 3000);
};

// Roll Dice Event
btnRoll.addEventListener('click', function () {
  if (playing) {
    // Generate random dice roll (1-6)
    const dice = Math.trunc(Math.random() * 6) + 1;
    
    console.log(`🎲 Player ${activePlayer + 1} rolled: ${dice}`);

    // Show dice with pink theme
    diceEl.classList.remove('hidden');
    diceEl.src = `data:image/svg+xml;base64,${btoa(diceImages[dice])}`;

    // Game logic: if rolled 1, lose current score and switch
    if (dice !== 1) {
      // Add dice value to current score
      currentScore += dice;
      document.getElementById(`current-${activePlayer}`).textContent = currentScore;
      
      console.log(`📈 Player ${activePlayer + 1} current score: ${currentScore}`);
    } else {
      // Rolled 1 - lose everything and switch player
      console.log(`💥 Player ${activePlayer + 1} rolled 1! Switching players...`);
      switchPlayer();
    }
    
    // Add sparkles occasionally on good rolls
    if (dice >= 4 && Math.random() > 0.6) {
      addSparkles();
    }
  }
});

// Hold Score Event
btnHold.addEventListener('click', function () {
  if (playing) {
    // Add current score to player's total score
    scores[activePlayer] += currentScore;
    document.getElementById(`score-${activePlayer}`).textContent = scores[activePlayer];
    
    console.log(`💰 Player ${activePlayer + 1} held ${currentScore} points. Total: ${scores[activePlayer]}`);

    // WIN CONDITION: Check if player reaches 100 points
    if (scores[activePlayer] >= 100) {
      // Game Over - Winner Found!
      playing = false;
      diceEl.classList.add('hidden');

      // Mark winner visually
      document.getElementById(`player-${activePlayer}`).classList.add('winner');
      document.getElementById(`player-${activePlayer}`).classList.remove('active');

      console.log(`🏆 WINNER! Player ${activePlayer + 1} reached ${scores[activePlayer]} points!`);
      
      // This is where your backend logs will appear!
      // The SP1 proof generation happens here when score >= 100
      showWinnerModal(activePlayer);
    } else {
      // Continue game - switch to next player
      switchPlayer();
    }
    
    // Add sparkles for good scores
    if (currentScore >= 15) {
      addSparkles();
    }
  }
});

// New Game Event
btnNew.addEventListener('click', function() {
  console.log('🔄 Starting new game...');
  init();
});

// Check backend connection on page load
window.addEventListener('load', async function() {
  console.log('🚀 Succinct Pig Game Loaded!');
  console.log('🎯 Goal: First player to reach 100 points wins!');
  console.log('⚠️  Warning: Rolling 1 loses your current score!');
  
  // Test multiple URLs
  const testURLs = [
    'http://localhost:3000/health',
    'http://127.0.0.1:3000/health',
    'http://localhost:1000/health',
    'http://127.0.0.1:1000/health',
    'http://152.53.164.253:3000',
    '/health'
  ];
  
  let connected = false;
  
  for (const url of testURLs) {
    try {
      console.log(`🔗 Testing connection to: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Succinct backend connected:', data.service);
        console.log('🔮 SP1 Zero-Knowledge proofs ready!');
        console.log(`📡 Using URL: ${url}`);
        connected = true;
        break;
      }
    } catch (error) {
      console.warn(`❌ Failed to connect to ${url}: ${error.message}`);
    }
  }
  
  if (!connected) {
    console.warn('⚠️ Backend not available on any URL');
    console.log('💡 Troubleshooting:');
    console.log('   1. Make sure server is running: node server.js');
    console.log(`   2. Check server is on port 3000`);
    console.log('   3. Access game via http://localhost:3000 (not file://)');
    console.log('   4. Check browser console for CORS errors');
    console.log('🔧 To reset if stuck: Press ESC or type emergencyReset() in console');
  }
});

// Initialize the game
init();

// Game Instructions
console.log(`
🎲 === SUCCINCT PIG GAME RULES === 🎲
🎯 Goal: First player to reach 100 points wins!
🎲 Roll dice to accumulate points
📥 Hold to bank your current score
⚠️  Rolling 1 = lose current score & switch players
🏆 Winner gets SP1 Zero-Knowledge Proof!
🔮 Powered by Succinct Labs
==========================================
`);