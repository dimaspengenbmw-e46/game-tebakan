const DEV_MODE = true; // Set to true to enable developer features
const DEV_KEY = 'sukma ayunda'; // Change this to your secret key

export const config = {
  initialLives: 20,
  initialHints: 20,
  timePerQuestion: 30,
  maxLevel: 100,
  devMode: true, // Set developer mode to true
  devKey: 'sukma-dev',
  security: {
    preventRefresh: false, // Disable refresh prevention in dev mode
    preventInspect: false, // Disable inspect prevention in dev mode
    checkInterval: 1000
  }
};

// Add security checks
if (!DEV_MODE) {
  // Disable console for non-developers
  window.console.log = function() {};
  window.console.info = function() {};
  window.console.warn = function() {};
  window.console.error = function() {};
  
  // Detect DevTools
  let devtools = function() {};
  devtools.toString = function() {
    if (!DEV_MODE) {
      document.body.innerHTML = 'Game dinonaktifkan karena mencoba menggunakan DevTools!';
    }
  }
  setInterval(devtools, 100);
}

export const developerTools = {
  setLives: (amount) => {
    localStorage.setItem('dev_lives', amount);
    return true;
  },
  
  setHints: (amount) => {
    localStorage.setItem('dev_hints', amount);
    return true;
  },
  
  setLevel: (level) => {
    localStorage.setItem('dev_level', level);
    return true;
  },
  
  resetGame: () => {
    localStorage.clear();
    return true;
  }
};
