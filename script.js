/**
 * Nutrition Track - Vanilla JavaScript
 * Enhanced with Time-based Greetings and improved UI/UX
 */

// DOM Elements
const authPage = document.getElementById('auth-page');
const mainPage = document.getElementById('main-page');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const uploadBox = document.getElementById('upload-box');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const changeImageBtn = document.getElementById('change-image');
const analyzeBtn = document.getElementById('analyze-btn');
const analyzeText = document.getElementById('analyze-text');
const analyzeLoader = document.getElementById('analyze-loader');
const resultsSection = document.getElementById('results-section');
const foodNameEl = document.getElementById('food-name');
const caloriesEl = document.getElementById('calories');
const proteinEl = document.getElementById('protein');
const carbsEl = document.getElementById('carbs');
const fatsEl = document.getElementById('fats');
const tipTextEl = document.getElementById('tip-text');
const greetingContainer = document.getElementById('greeting-container');
const greetingText = document.getElementById('greeting-text');

// State
let currentImage = null;

// Dummy nutrition data
const dummyData = [
    {
        foodName: 'Grilled Chicken Salad',
        calories: 350,
        protein: 32,
        carbs: 18,
        fats: 14,
        healthTip: 'Great source of lean protein. Add some avocado for healthy fats!'
    },
    {
        foodName: 'Pasta with Vegetables',
        calories: 480,
        protein: 15,
        carbs: 72,
        fats: 12,
        healthTip: 'Rich in carbohydrates for energy. Consider whole grain pasta for more fiber.'
    },
    {
        foodName: 'Fruit Smoothie Bowl',
        calories: 290,
        protein: 8,
        carbs: 58,
        fats: 5,
        healthTip: 'Packed with vitamins and antioxidants. Add chia seeds for omega-3s.'
    },
    {
        foodName: 'Avocado Toast',
        calories: 320,
        protein: 10,
        carbs: 28,
        fats: 22,
        healthTip: 'Excellent source of healthy monounsaturated fats and fiber.'
    }
];

// Check login status
function isLoggedIn() {
    return localStorage.getItem('nutritiontrack_user') !== null;
}

// Get User Name
function getUserName() {
    const userStr = localStorage.getItem('nutritiontrack_user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            return user.name || 'User';
        } catch (e) {
            return 'User';
        }
    }
    return 'User';
}

// Update Greeting based on time
function updateGreeting() {
    const name = getUserName();
    const now = new Date();
    const hour = now.getHours();
    
    let greeting = '';
    let emoji = '';

    if (hour >= 5 && hour < 12) {
        greeting = 'Good Morning';
        emoji = '☀️';
    } else if (hour >= 12 && hour < 17) {
        greeting = 'Good Afternoon';
        emoji = '🌤️';
    } else if (hour >= 17 && hour < 21) {
        greeting = 'Good Evening';
        emoji = '🌆';
    } else {
        greeting = 'Good Night';
        emoji = '🌙';
    }

    // Set greeting with accented name
    greetingText.innerHTML = `${greeting}, <span class="bg-gradient-to-r from-accent to-green-400 bg-clip-text text-transparent">${name}</span> ${emoji}`;
    
    // Animate greeting
    greetingContainer.classList.remove('opacity-0', 'translate-y-4');
    greetingContainer.classList.add('opacity-100', 'translate-y-0');
}

// Show appropriate screen
function showAppropriateScreen() {
    if (isLoggedIn()) {
        authPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        
        // Trigger greeting animation after a small delay to ensure visibility
        setTimeout(updateGreeting, 100);
    } else {
        authPage.classList.remove('hidden');
        mainPage.classList.add('hidden');
        greetingContainer.classList.add('opacity-0', 'translate-y-4');
        greetingContainer.classList.remove('opacity-100', 'translate-y-0');
    }
}

// Toggle auth forms
function toggleAuthForms(showLogin) {
    if (showLogin) {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

// Handle Login
function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Extract name from email for demo purposes if not signed up
    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    localStorage.setItem('nutritiontrack_user', JSON.stringify({ email, name: formattedName }));
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    showAppropriateScreen();
}

// Handle Signup
function handleSignup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    localStorage.setItem('nutritiontrack_user', JSON.stringify({ email, name }));
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    showAppropriateScreen();
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('nutritiontrack_user');
    resetUploadState();
    showAppropriateScreen();
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        currentImage = e.target.result;
        previewImg.src = currentImage;
        uploadBox.classList.add('hidden');
        imagePreview.classList.remove('hidden');
        analyzeBtn.disabled = false; // Enable analyze button only after image upload
        resultsSection.classList.add('hidden', 'opacity-0', 'translate-y-4'); // Hide results
    };
    reader.readAsDataURL(file);
}

// Reset upload state
function resetUploadState() {
    currentImage = null;
    fileInput.value = '';
    uploadBox.classList.remove('hidden');
    imagePreview.classList.add('hidden');
    resultsSection.classList.add('hidden', 'opacity-0', 'translate-y-4');
    analyzeBtn.disabled = true;
}

// Setup drag and drop
function setupDragAndDrop() {
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('border-accent', 'bg-dark-hover');
    });

    uploadBox.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('border-accent', 'bg-dark-hover');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('border-accent', 'bg-dark-hover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect({ target: fileInput });
        }
    });
}

// Analyze image
function analyzeImage() {
    if (!currentImage) return;

    // Loading state
    analyzeBtn.disabled = true;
    analyzeText.textContent = 'Analyzing...';
    analyzeLoader.classList.remove('hidden');
    
    // Hide previous results if any
    resultsSection.classList.add('hidden', 'opacity-0', 'translate-y-4');

    // Fake loading delay (2 seconds)
    setTimeout(() => {
        const randomData = dummyData[Math.floor(Math.random() * dummyData.length)];
        displayResults(randomData);

        // Reset button state
        analyzeBtn.disabled = false;
        analyzeText.textContent = 'Analyze Nutrition';
        analyzeLoader.classList.add('hidden');
    }, 2000);
}

// Display results with animation
function displayResults(data) {
    foodNameEl.textContent = data.foodName;
    caloriesEl.textContent = data.calories;
    proteinEl.textContent = data.protein;
    carbsEl.textContent = data.carbs;
    fatsEl.textContent = data.fats;
    tipTextEl.textContent = data.healthTip;

    resultsSection.classList.remove('hidden');
    
    // Trigger animation frame for transition
    requestAnimationFrame(() => {
        resultsSection.classList.remove('opacity-0', 'translate-y-4');
        resultsSection.classList.add('opacity-100', 'translate-y-0');
        
        // Smooth scroll
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Event Listeners
showSignupLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms(false); });
showLoginLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthForms(true); });
loginBtn.addEventListener('click', handleLogin);
signupBtn.addEventListener('click', handleSignup);
logoutBtn.addEventListener('click', handleLogout);
uploadBox.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
changeImageBtn.addEventListener('click', resetUploadState);
analyzeBtn.addEventListener('click', analyzeImage);

document.getElementById('login-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
});
document.getElementById('signup-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSignup();
});

// Initialize
setupDragAndDrop();
showAppropriateScreen();

