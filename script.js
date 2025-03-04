import gameState from './gameState.js';
import { config } from './config.js';

// Disable right click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Disable DevTools through F12 and other keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Prevent F12
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    // Prevent Ctrl+Shift+I and Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        return false;
    }
    
    // Prevent Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
    }
    
    // Prevent Ctrl+U (view source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
    }
});

// Additional DevTools detection
function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if (widthThreshold || heightThreshold) {
        document.body.innerHTML = 'DevTools terdeteksi! Mohon tutup DevTools untuk melanjutkan permainan.';
    }
}

setInterval(detectDevTools, 1000);

// Add simpler refresh handling
window.addEventListener('beforeunload', (e) => {
  // Save current game state before refresh
  gameState.saveToStorage();
});

let timer = null;
let currentLevelInGame = 1;

const questions = [
  { level: 1, question: "Apa ibukota Indonesia?", answer: "Jakarta" },
  { level: 2, question: "2 + 2 = ?", answer: "4" },
  { level: 3, question: "Planet terdekat dari matahari?", answer: "Merkurius" },
  { level: 4, question: "Siapa penemu lampu pijar?", answer: "Thomas Edison" },
  { level: 5, question: "Hewan yang bisa hidup di darat dan air disebut?", answer: "Amfibi" },
  { level: 6, question: "Berapakah nilai dari 10 x 5?", answer: "50" },
  { level: 7, question: "Sebutkan 3 warna primer!", answer: "Merah Kuning Biru" },
  { level: 8, question: "Benua terbesar di dunia?", answer: "Asia" },
  { level: 9, question: "Nama lain dari 100 cm?", answer: "1 Meter" },
  { level: 10, question: "Nama ilmiah dari air?", answer: "H2O" },

  { level: 11, question: "Laut terluas di dunia?", answer: "Samudra Pasifik" },
  { level: 12, question: "Jumlah provinsi di Indonesia tahun 2024?", answer: "38" },
  { level: 13, question: "Siapa pencipta lagu Indonesia Raya?", answer: "WR Supratman" },
  { level: 14, question: "Gunung tertinggi di pulau Jawa?", answer: "Semeru" },
  { level: 15, question: "Apa fungsi akar pada tumbuhan?", answer: "Menyerap air" },
  { level: 16, question: "Berapa jumlah kaki laba-laba?", answer: "8" },
  { level: 17, question: "Nama ilmiah manusia?", answer: "Homo Sapiens" },
  { level: 18, question: "Siapa penemu telepon?", answer: "Alexander Graham Bell" },
  { level: 19, question: "Apa nama alat untuk mengukur suhu?", answer: "Termometer" },
  { level: 20, question: "Apa mata uang Jepang?", answer: "Yen" },

  { level: 21, question: "Nama Presiden Indonesia pertama?", answer: "Soekarno" },
  { level: 22, question: "Gunung tertinggi di Indonesia?", answer: "Puncak Jaya" },
  { level: 23, question: "Lambang negara Indonesia?", answer: "Garuda Pancasila" },
  { level: 24, question: "Siapa penulis novel Laskar Pelangi?", answer: "Andrea Hirata" },
  { level: 25, question: "Ibukota Jawa Barat?", answer: "Bandung" },
  { level: 26, question: "Organel sel yang menghasilkan energi?", answer: "Mitokondria" },
  { level: 27, question: "Benda yang menarik besi disebut?", answer: "Magnet" },
  { level: 28, question: "Satuan dari massa?", answer: "Kilogram" },
  { level: 29, question: "Berapakah sisi dalam segitiga?", answer: "3" },
  { level: 30, question: "Siapa pencipta teori gravitasi?", answer: "Isaac Newton" },

  { level: 31, question: "Hewan tercepat di dunia?", answer: "Cheetah" },
  { level: 32, question: "Gas yang digunakan dalam balon udara?", answer: "Helium" },
  { level: 33, question: "Ikan yang dapat menghasilkan listrik?", answer: "Belut Listrik" },
  { level: 34, question: "Berapa jumlah tulang pada manusia dewasa?", answer: "206" },
  { level: 35, question: "Siapa ilmuwan yang menciptakan teori relativitas?", answer: "Albert Einstein" },
  { level: 36, question: "Apa nama ilmiah dari gula pasir?", answer: "Sukrosa" },
  { level: 37, question: "Apa fungsi paru-paru?", answer: "Bernapas" },
  { level: 38, question: "Siapa ilmuwan yang menemukan vaksin?", answer: "Edward Jenner" },
  { level: 39, question: "Apa nama lain dari vitamin C?", answer: "Asam Askorbat" },
  { level: 40, question: "Apa rumus kimia garam dapur?", answer: "NaCl" },

  { level: 41, question: "Kenapa ayam menyeberang jalan?", answer: "Mau ke seberang" },
  { level: 42, question: "Apa yang selalu naik tapi tidak pernah turun?", answer: "Umur" },
  { level: 43, question: "Apa yang lebih besar dari semesta?", answer: "Tagihan listrik" },
  { level: 44, question: "Apa yang ada di tengah kota?", answer: "Huruf O" },
  { level: 45, question: "Kenapa ikan nggak sekolah?", answer: "Sudah ada insang" },
  { level: 46, question: "Apa yang makin dipotong makin panjang?", answer: "Jalan" },
  { level: 47, question: "Kalau dua kucing berlomba, siapa yang menang?", answer: "Kucing cepat" },
  { level: 48, question: "Benda apa yang kalau dibuka malah basah?", answer: "Payung" },
  { level: 49, question: "Apa yang punya leher tapi tidak punya kepala?", answer: "Botol" },
  { level: 50, question: "Kenapa matematika itu jahat?", answer: "Bikin pusing" },

  { level: 51, question: "Siapa atlet bulu tangkis Indonesia dengan forehand smash mematikan?", answer: "Taufik Hidayat" },
  { level: 52, question: "Di cabang olahraga apa Indonesia sering bersaing di SEA Games?", answer: "Bulu tangkis" },
  { level: 53, question: "Olahraga apa yang paling populer di Indonesia?", answer: "Sepak bola" },
  { level: 54, question: "Tim nasional sepak bola Indonesia dikenal dengan julukan apa?", answer: "Garuda" },
  { level: 55, question: "Sebutkan salah satu olahraga tradisional Indonesia!", answer: "Pencak silat" },
  { level: 56, question: "Siapa pahlawan nasional dari Pertempuran Surabaya 1945?", answer: "Bung Tomo" },
  { level: 57, question: "Apa nama peristiwa 17 Agustus 1945?", answer: "Proklamasi" },
  { level: 58, question: "Siapa yang memproklamasikan kemerdekaan Indonesia?", answer: "Soekarno & Hatta" },
  { level: 59, question: "Apa nama dokumen perjanjian Indonesia-Belanda?", answer: "Linggarjati" },
  { level: 60, question: "Siapa 'Bapak Pendidikan Nasional' Indonesia?", answer: "Ki Hajar Dewantara" },

  { level: 61, question: "Siapa ilmuwan wanita yang menang dua Nobel?", answer: "Marie Curie" },
  { level: 62, question: "Ilmuwan yang mengubah pandangan alam semesta?", answer: "Galileo Galilei" },
  { level: 63, question: "Siapa yang mengemukakan teori evolusi?", answer: "Charles Darwin" },

  // Level 64 - 70: Materi Basket
  { level: 64, question: "Apa istilah untuk tembakan tiga angka dalam basket?", answer: "Three-pointer" },
  { level: 65, question: "Sebutkan salah satu teknik dribbling efektif!", answer: "Crossover" },
  { level: 66, question: "Apa nama area di bawah ring basket?", answer: "Area kunci" },
  { level: 67, question: "Apa sebutan pelanggaran tanpa dribbling?", answer: "Traveling" },
  { level: 68, question: "Apa istilah untuk aksi dunk dalam basket?", answer: "Slam dunk" },
  { level: 69, question: "Sebutkan salah satu posisi utama basket!", answer: "Point guard" },
  { level: 70, question: "Apa istilah bola masuk tanpa menyentuh pinggir?", answer: "Swish" },

  { level: 71, question: "Siapa 'Wakil Proklamator' Indonesia?", answer: "Mohammad Hatta" },
  { level: 72, question: "Apa itu 'Bandung Lautan Api'?", answer: "Pembakaran Bandung" },
  { level: 73, question: "Siapa pahlawan wanita dari Aceh?", answer: "Cut Nyak Dhien" },
  { level: 74, question: "Apa nama kerajaan di Jawa abad 8-10?", answer: "Mataram Kuno" },
  { level: 75, question: "Siapa pendiri Kerajaan Majapahit?", answer: "Raden Wijaya" },
  { level: 76, question: "Apa peristiwa era reformasi Indonesia?", answer: "Jatuhnya Soeharto" },
  { level: 77, question: "Di tahun berapa Indonesia merdeka?", answer: "1945" },
  { level: 78, question: "Apa lambang perjuangan kemerdekaan?", answer: "Merah Putih" },

  { level: 79, question: "Siapa atlet bulu tangkis wanita Olimpiade?", answer: "Susi Susanti" },
  { level: 80, question: "Olahraga apa yang bikin bangga di Asian Games?", answer: "Angkat besi" },
  { level: 81, question: "Siapa atlet angkat besi internasional Indonesia?", answer: "Eko Yuli Irawan" },
  { level: 82, question: "Siapa penemu komputer pertama?", answer: "Charles Babbage" },
  { level: 83, question: "Siapa yang kembangkan vaksin polio pertama?", answer: "Jonas Salk" },
  { level: 84, question: "Olahraga apa disebut 'King of Sports'?", answer: "Sepak bola" },
  { level: 85, question: "Siapa petenis legendaris dengan 20 gelar Grand Slam?", answer: "Roger Federer" },
  { level: 86, question: "Siapa petenis wanita dominan dunia?", answer: "Serena Williams" },
  { level: 87, question: "Dalam olahraga apa 'slam dunk' jadi atraksi?", answer: "Bola basket" },
  { level: 88, question: "Siapa pelatih sepak bola muda terkenal Indonesia?", answer: "Jacksen F. Tiago" },
  { level: 89, question: "Siapa yang temukan partikel elektron?", answer: "J.J. Thomson" },
  { level: 90, question: "Olahraga apa dijuluki 'catur dengan raket'?", answer: "Tenis meja" },

  { level: 91, question: "Apa itu komposisi dalam lukisan?", answer: "Pengaturan elemen" },
  { level: 92, question: "Sebut tiga media lukis dasar!", answer: "Minyak, akrilik, cat air" },
  { level: 93, question: "Apa fungsi sketsa?", answer: "Panduan gambar" },
  { level: 94, question: "Perbedaan cat akrilik dan minyak?", answer: "Akrilik cepat kering" },
  { level: 95, question: "Apa itu perspektif?", answer: "Menggambar kedalaman" },
  { level: 96, question: "Sebut alat dasar melukis!", answer: "Kuas, palet, kanvas" },
  { level: 97, question: "Apa arti 'nilai' dalam lukisan?", answer: "Terang & gelap" },
  { level: 98, question: "Mengapa penting warna primer?", answer: "Campur warna" },
  { level: 99, question: "Peran bayangan dalam lukisan?", answer: "Kedalaman" },
  { level: 100, question: "Apa itu teknik impasto?", answer: "Cat tebal" }
];

// DOM Elements
const mainMenu = document.getElementById("main-menu");
const levelMenu = document.getElementById("level-menu");
const gameplay = document.getElementById("gameplay");
const shopMenu = document.getElementById("shop");
const levelList = document.getElementById("level-list");
const levelTitle = document.getElementById("level-title");
const questionText = document.getElementById("question");
const answerInput = document.getElementById("answer-input");
const submitAnswer = document.getElementById("submit-answer");
const useHint = document.getElementById("use-hint");
const livesDisplay = document.getElementById("lives");
const hintsDisplay = document.getElementById("hints");
const timerDisplay = document.getElementById("timer");
const backgroundMusic = document.getElementById('background-music');

// Ensure all elements are correctly referenced
if (!mainMenu || !levelMenu || !gameplay || !shopMenu || !levelList || !levelTitle || !questionText || !answerInput || !submitAnswer || !useHint || !livesDisplay || !hintsDisplay || !timerDisplay || !backgroundMusic) {
  console.error("One or more DOM elements are not correctly referenced.");
}

// Update UI
function updateUI() {
  livesDisplay.textContent = gameState.lives;
  hintsDisplay.textContent = gameState.hints;
}

// Event Listeners
document.getElementById("start-button").addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  levelMenu.classList.remove("hidden");
  document.querySelector('.github-button').classList.add('hidden'); // Hide GitHub button
  loadLevels();
  backgroundMusic.play();
});

document.getElementById("back-to-main-levels").addEventListener("click", () => {
  levelMenu.classList.add("hidden");
  mainMenu.classList.remove("hidden");
  document.querySelector('.github-button').classList.remove('hidden'); // Show GitHub button
  backgroundMusic.pause();
});

document.getElementById("back-to-main-shop").addEventListener("click", () => {
  shopMenu.classList.add("hidden");
  mainMenu.classList.remove("hidden");
  document.querySelector('.github-button').classList.remove('hidden'); // Show GitHub button
  backgroundMusic.pause();
});

document.getElementById("shop-button").addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  shopMenu.classList.remove("hidden");
  document.querySelector('.github-button').classList.add('hidden'); // Hide GitHub button
  backgroundMusic.pause();
});

document.getElementById("back-to-levels").addEventListener("click", () => {
  gameplay.classList.add("hidden");
  levelMenu.classList.remove("hidden");
  clearInterval(timer);
  backgroundMusic.play();
});

// Music menu controls
const musicMenu = document.getElementById("music-menu");
const allAudios = document.querySelectorAll('audio');
let currentMusic = null;

document.getElementById("music-button").addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  musicMenu.classList.remove("hidden");
});

document.getElementById("back-to-main-music").addEventListener("click", () => {
  musicMenu.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

document.querySelectorAll('.music-option').forEach(button => {
  button.addEventListener('click', () => {
    const musicId = button.getAttribute('data-music');

    // Stop all music first
    allAudios.forEach(audio => audio.pause());

    // Remove active class from all buttons
    document.querySelectorAll('.music-option').forEach(btn => {
      btn.classList.remove('active');
    });

    if (musicId !== 'none') {
      const audio = document.getElementById(musicId);
      if (audio) {
        audio.currentTime = 0;
        audio.play();
        currentMusic = audio;
        button.classList.add('active');
      }
    }

    // Save music preference
    localStorage.setItem('selectedMusic', musicId);
  });
});

// Load saved music preference
document.addEventListener('DOMContentLoaded', () => {
  const savedMusic = localStorage.getItem('selectedMusic');
  if (savedMusic && savedMusic !== 'none') {
    const audio = document.getElementById(savedMusic);
    if (audio) {
      const button = document.querySelector(`[data-music="${savedMusic}"]`);
      audio.play();
      currentMusic = audio;
      button?.classList.add('active');
    }
  }
});

// Load Levels
function loadLevels() {
  if (!levelList) return;

  levelList.innerHTML = '';
  const maxLevel = questions.length; // Use actual number of questions

  for (let i = 1; i <= maxLevel; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.add('level-button');

    // Add current level indicator
    if (i === gameState.currentLevel) {
      button.classList.add('current');
    }

    // Disable future levels
    if (i > gameState.currentLevel) {
      button.classList.add('disabled');
      button.disabled = true;
      button.title = 'Selesaikan level sebelumnya terlebih dahulu';
    }

    button.addEventListener('click', () => {
      if (!button.disabled) {
        startLevel(i);
      } else {
        alert('Selesaikan level sebelumnya terlebih dahulu!');
      }
    });

    levelList.appendChild(button);
  }
}

// Start Level
function startLevel(level) {
  if (gameState.lives <= 0) {
    alert("Nyawa habis! Beli nyawa di toko atau tonton iklan.");
    return;
  }

  currentLevelInGame = level;
  levelMenu.classList.add("hidden");
  gameplay.classList.remove("hidden");

  const question = questions.find(q => q.level === level);
  if (!question) {
    alert("Level belum tersedia!");
    return;
  }

  levelTitle.textContent = `Level ${level}`;
  questionText.textContent = question.question;
  answerInput.value = "";
  answerInput.focus();

  // Clear existing timer
  if (timer) clearInterval(timer);
  startTimer();

  // Save current level
  gameState.currentLevel = Math.max(gameState.currentLevel, level);
  gameState.saveToStorage();
}

// Timer
function startTimer() {
  let time = gameState.time;
  timerDisplay.textContent = time;

  timer = setInterval(() => {
    time--;
    timerDisplay.textContent = time;

    if (time <= 0) {
      clearInterval(timer);
      handleTimeOut();
    }
  }, 1000);
}

// Handle Time Out
function handleTimeOut() {
  gameState.lives--;
  updateUI();

  if (gameState.lives <= 0) {
    alert("Nyawa habis! Beli nyawa di toko atau tonton iklan.");
    gameplay.classList.add("hidden");
    mainMenu.classList.remove("hidden");
  } else {
    document.body.classList.add("vibrate");
    setTimeout(() => document.body.classList.remove("vibrate"), 300);
    alert("Waktu habis! Nyawa berkurang 1.");
    startTimer(); // Restart timer untuk level yang sama
  }
}

// Submit Answer
submitAnswer.addEventListener("click", () => {
  const question = questions.find(q => q.level === currentLevelInGame);
  if (!question) return;

  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = question.answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    clearInterval(timer);

    if (currentLevelInGame >= gameState.currentLevel) {
      gameState.currentLevel = currentLevelInGame + 1;

      if (gameState.currentLevel > questions.length) {
        alert("Selamat! Anda telah menyelesaikan semua level!");
        gameplay.classList.add("hidden");
        mainMenu.classList.remove("hidden");
        return;
      }
    }

    // Remove the loadLevels() call since we don't need to reset the whole level menu
    alert("Benar! Lanjut ke level berikutnya.");
    startLevel(currentLevelInGame + 1); // Directly start next level instead
    gameState.saveToStorage();
  } else {
    alert("Salah! Coba lagi.");
    loseLife();
    answerInput.value = "";
    answerInput.focus();
    gameState.saveToStorage();
  }
});

// Use Hint
useHint.addEventListener("click", () => {
  if (gameState.hints > 0) {
    const question = questions.find(q => q.level === currentLevelInGame);
    if (question) {
      alert(`Jawabannya adalah: ${question.answer}`);
      gameState.hints--;
      hintsDisplay.textContent = gameState.hints;
      gameState.saveToStorage();
    } else {
      alert("Pertanyaan tidak ditemukan!");
    }
  } else {
    alert("Hint habis! Beli lagi di toko.");
  }
});

// Lose Life
function loseLife() {
  gameState.lives--;
  updateUI();

  if (gameState.lives <= 0) {
    alert("Nyawa habis! Beli nyawa di toko atau tonton iklan.");
    gameplay.classList.add("hidden");
    mainMenu.classList.remove("hidden");
  } else {
    document.body.classList.add("vibrate");
    setTimeout(() => document.body.classList.remove("vibrate"), 300);
  }
}

// Reset Game
document.getElementById("reset-button").addEventListener("click", () => {
  gameState.currentLevel = 1;
  gameState.lives = 20;
  gameState.hints = 20;
  updateUI();
  loadLevels();
  alert("Progres game telah direset!");
});

// Shop Functionality
document.getElementById("buy-life").addEventListener("click", () => {
  if (confirm("Beli 1 nyawa dengan 5 hint?")) {
    if (gameState.hints >= 5) {
      gameState.hints -= 5;
      gameState.lives += 1;
      updateUI();
      alert("Nyawa berhasil dibeli!");
    } else {
      alert("Hint tidak cukup!");
    }
  }
});

document.getElementById("buy-hint").addEventListener("click", () => {
  if (confirm("Beli 1 hint dengan 1 nyawa?")) {
    if (gameState.lives > 1) {
      gameState.lives -= 1;
      gameState.hints += 1;
      updateUI();
      alert("Hint berhasil dibeli!");
    } else {
      alert("Nyawa tidak cukup!");
    }
  }
});

// Update UI saat pertama kali load
updateUI();

document.querySelectorAll('.buy-button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.getAttribute('data-item');
    const quantity = button.getAttribute('data-quantity');
    const price = button.getAttribute('data-price');
    showPaymentModal(item, quantity, price);
  });
});

function showPaymentModal(item, quantity, price) {
  const paymentModal = document.getElementById('payment-modal');
  const paymentDescription = document.getElementById('payment-description');
  paymentDescription.textContent = `Beli ${quantity} ${item} seharga Rp ${price}`;
  paymentModal.classList.remove('hidden');
}

document.getElementById('confirm-payment').onclick = () => {
  const item = document.querySelector('.buy-button[data-item]').getAttribute('data-item');
  const quantity = document.querySelector('.buy-button[data-quantity]').getAttribute('data-quantity');
  const price = document.querySelector('.buy-button[data-price]').getAttribute('data-price');
  const paymentMethod = document.getElementById('payment-method').value;
  processPayment(item, quantity, price, paymentMethod);
  document.getElementById('payment-modal').classList.add('hidden');
};

document.getElementById('cancel-payment').onclick = () => {
  document.getElementById('payment-modal').classList.add('hidden');
};

function processPayment(item, quantity, price, paymentMethod) {
  // Implement payment processing logic here
  console.log(`Processing payment for ${quantity} ${item} at Rp ${price} using ${paymentMethod}`);
  // After successful payment, update the user's lives or hints
  if (item === 'life') {
    gameState.lives += parseInt(quantity);
    updateUI();
  } else if (item === 'hint') {
    gameState.hints += parseInt(quantity);
    updateUI();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initial UI setup
  mainMenu.classList.remove('hidden');
  levelMenu.classList.add('hidden');
  gameplay.classList.add('hidden');
  shopMenu.classList.add('hidden');

  // Initialize game state
  updateUI();
  loadLevels();

  // Show appropriate screen based on current game state
  if (currentLevelInGame > 1) {
    mainMenu.classList.add('hidden');
    levelMenu.classList.remove('hidden');
  }

  // Start button listener
  const startButton = document.getElementById('start-button');
  if (startButton) {
    startButton.addEventListener('click', () => {
      console.log('Start button clicked');
      mainMenu.classList.add('hidden');
      levelMenu.classList.remove('hidden');
      loadLevels();
      if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
          console.log("Audio playback failed:", error);
        });
      }
    });
  }

  // Improved loadLevels function
  function loadLevels() {
    if (!levelList) return;

    levelList.innerHTML = '';
    const maxLevel = Math.min(100, questions.length);

    for (let i = 1; i <= maxLevel; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add('level-button');

      if (i > gameState.currentLevel) {
        button.classList.add('disabled');
        button.disabled = true;
      }

      button.addEventListener('click', () => {
        if (!button.disabled) {
          startLevel(i);
        }
      });

      levelList.appendChild(button);
    }
  }

  // Improved startLevel function
  function startLevel(level) {
    if (gameState.lives <= 0) {
      alert("Nyawa habis! Beli nyawa di toko atau tonton iklan.");
      return;
    }

    const question = questions.find(q => q.level === level);
    if (!question) {
      alert("Level belum tersedia!");
      return;
    }

    currentLevelInGame = level;
    levelMenu.classList.add('hidden');
    gameplay.classList.remove('hidden');

    levelTitle.textContent = `Level ${level}`;
    questionText.textContent = question.question;
    answerInput.value = '';
    answerInput.focus();

    if (timer) clearInterval(timer);
    startTimer();
  }

  // Add keyboard support for answer submission
  if (answerInput) {
    answerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default form submission
        if (submitAnswer) {
          submitAnswer.click();
        }
      }
    });
  }
});

// Add page load and refresh handling
window.addEventListener('load', () => {
  updateUI();
  if (gameState.currentLevel > 1) {
    mainMenu.classList.add('hidden');
    levelMenu.classList.remove('hidden');
    loadLevels();
  }
});

// Save state before refresh/close
window.addEventListener('beforeunload', () => {
  gameState.saveToStorage();
});

document.addEventListener('DOMContentLoaded', () => {
  // Set default volume for all audio elements
  const allAudios = document.querySelectorAll('audio');
  allAudios.forEach(audio => {
    audio.volume = 0.3; // Set volume 
  });

  // Save music preference and maintain volume when changing tracks
  document.querySelectorAll('.music-option').forEach(button => {
    button.addEventListener('click', () => {
      const musicId = button.getAttribute('data-music');
      
      // Stop all music first
      allAudios.forEach(audio => {
        audio.pause();
        audio.volume = 0.5; // Ensure volume is set when switching
      });
      
      // ...rest of music control code...
    });
  });

  // ...rest of existing code...
});

document.querySelectorAll('.music-option').forEach(button => {
    button.addEventListener('click', () => {
        const musicId = button.getAttribute('data-music');
        
        // Stop all music first
        allAudios.forEach(audio => {
            audio.pause();
            audio.volume = 0.5;
        });

        // Remove active class and reset background
        document.querySelectorAll('.music-option').forEach(btn => {
            btn.classList.remove('active');
        });

        // Change background based on music selection
        switch(musicId) {
            case 'music1': // Lagu Santai
                document.body.style.background = 'linear-gradient(135deg, #89f7fe, #66a6ff)';
                break;
            case 'music2': // Lagu Semangat
                document.body.style.background = 'linear-gradient(135deg, #ff9a9e, #fad0c4)';
                break;
            case 'music3': // Lagu Fokus
                document.body.style.background = 'linear-gradient(135deg, #2c003e, #411d5d)';
                break;
            case 'none':
                document.body.style.background = 'linear-gradient(135deg, #6a11cb, #2575fc)'; // Default background
                break;
        }

        if (musicId !== 'none') {
            const audio = document.getElementById(musicId);
            if (audio) {
                audio.currentTime = 0;
                audio.play();
                currentMusic = audio;
                button.classList.add('active');
            }
        }

        localStorage.setItem('selectedMusic', musicId);
        localStorage.setItem('selectedBackground', document.body.style.background);
    });
});

// Restore saved background on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedMusic = localStorage.getItem('selectedMusic');
    const savedBackground = localStorage.getItem('selectedBackground');
    
    if (savedBackground) {
        document.body.style.background = savedBackground;
    }
    
    // ...rest of existing DOMContentLoaded code...
});

// ...rest of existing code...

