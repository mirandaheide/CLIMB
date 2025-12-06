// Comprehensive climbing grade reference data
const climbingGrades = {
  // Bouldering grades
  bouldering: {
    vScale: [
      "VB", "V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", 
      "V9", "V10", "V11", "V12", "V13"
    ],
    font: [
      "3", "4-", "4", "4+", "5", "5+", "6A", "6A+", "6B", "6B+", "6C", "6C+", 
      "7A", "7A+", "7B", "7B+", "7C", "7C+", "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"
    ]
  },
  
  // Route climbing grades
  routeClimbing: {
    yds: [
      "5.0", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", 
      "5.10a", "5.10b", "5.10c", "5.10d", "5.11a", "5.11b", "5.11c", "5.11d",
      "5.12a", "5.12b", "5.12c", "5.12d", "5.13a", "5.13b", "5.13c", "5.13d"
    ],
    french: [
      "1", "2", "3", "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", 
      "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+"
    ]
  },
  
  // Common climbing hold types and features for BINGO challenges
  climbingFeatures: {
    routeColors: [
      "Red", "Blue", "Green", "Yellow", "Black", "White", "Purple", "Pink", 
      "Orange", "Gray", "Brown"
    ],
    holdTypes: [
      "Jug", "Crimp", "Sloper", "Pinch", "Pocket"
    ],
    moveTypes: [
      "Dyno", "Heel hook", "Toe hook", "Flag"
    ],
    routeFeatures: [
      "Slab", "Vertical", "Overhang"
    ]
  }
};

// DOM elements
const climbingTypeSelect = document.getElementById('climbing-type');
const gradeSystemSelect = document.getElementById('grade-system');
const colorOptions = document.getElementById('color-options');
const generateBtn = document.getElementById('generate-btn');
const resetBtn = document.getElementById('reset-btn');
const bingoGrid = document.getElementById('bingo-grid');

// Circuit grading elements (declare at top level so functions can access them)
let circuitGradingGroup;
let circuitGradingSelect;
let colorCategory;

// Function to update circuit grading visibility
function updateCircuitGradingVisibility() {
  if (climbingTypeSelect.value === 'bouldering') {
    circuitGradingGroup.style.display = 'block';
  } else {
    circuitGradingGroup.style.display = 'none';
    circuitGradingSelect.value = 'no';
    if (colorCategory) {
      colorCategory.style.display = 'block';
    }
  }
}

// Function to update color visibility
function updateColorVisibility() {
  if (circuitGradingSelect.value === 'yes') {
    colorCategory.style.display = 'none';
  } else {
    colorCategory.style.display = 'block';
  }
}

// Initialize form
function initializeForm() {
  // Toggle panel functionality
  const togglePanelBtn = document.getElementById('toggle-panel-btn');
  const setupPanel = document.querySelector('.setup-panel');
  const bingoCard = document.querySelector('.bingo-card');

  togglePanelBtn.addEventListener('click', () => {
    setupPanel.classList.toggle('collapsed');
    bingoCard.classList.toggle('expanded');
    
    if (setupPanel.classList.contains('collapsed')) {
      togglePanelBtn.textContent = '▶';
    } else {
      togglePanelBtn.textContent = '◀';
    }
  });

  // Get circuit grading elements
  circuitGradingGroup = document.getElementById('circuit-grading-group');
  circuitGradingSelect = document.getElementById('circuit-grading');
  colorCategory = document.querySelector('[data-category="colors"]').closest('.feature-category');

  // Populate all features including colors using the same method
  populateFeatures('color-options', climbingGrades.climbingFeatures.routeColors);
  populateFeatures('hold-types', climbingGrades.climbingFeatures.holdTypes);
  populateFeatures('move-types', climbingGrades.climbingFeatures.moveTypes);
  populateFeatures('route-features', climbingGrades.climbingFeatures.routeFeatures);

  // Add toggle functionality for feature categories
  document.querySelectorAll('.category-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const checkboxContainer = button.nextElementSibling;
      checkboxContainer.classList.toggle('collapsed');
      button.classList.toggle('collapsed');
    });
  });

  // Initialize grade slider
  initializeGradeSlider();

  // Update grade system options based on climbing type
  climbingTypeSelect.addEventListener('change', () => {
    updateGradeSystemOptions();
    initializeGradeSlider();
    updateCircuitGradingVisibility();
  });

  // Update slider when grade system changes
  gradeSystemSelect.addEventListener('change', initializeGradeSlider);

  // Show/hide colors based on circuit grading
  circuitGradingSelect.addEventListener('change', updateColorVisibility);

  // Generate button click event
  generateBtn.addEventListener('click', () => {
    console.log('Generate button clicked!');
    generateBingoCard();
    savePreferences();
  });

  // Reset button click event
  resetBtn.addEventListener('click', resetPreferences);

  // Click functionality for bingo cells
  bingoGrid.addEventListener('click', event => {
    if (event.target.classList.contains('bingo-cell') && !event.target.classList.contains('center')) {
      event.target.classList.toggle('completed');
    }
  });

  // Load saved preferences
  loadPreferences();

  // Update visibility after loading preferences
  updateCircuitGradingVisibility();
  updateColorVisibility();
}

// Populate feature checkboxes
function populateFeatures(containerId, features) {
  const container = document.getElementById(containerId);
  features.forEach(feature => {
    const featureDiv = document.createElement('div');
    featureDiv.className = 'feature-option';
    const safeId = `feature-${feature.toLowerCase().replace(/\s+/g, '-')}`;
    featureDiv.innerHTML = `
      <input type="checkbox" id="${safeId}" value="${feature}" checked>
      <label for="${safeId}">${feature}</label>
    `;
    container.appendChild(featureDiv);
  });
}

// Update grade system options based on climbing type
function updateGradeSystemOptions() {
  const climbingType = climbingTypeSelect.value;
  
  gradeSystemSelect.innerHTML = '';
  
  if (climbingType === 'bouldering') {
    addOption(gradeSystemSelect, 'vScale', 'V-Scale');
    addOption(gradeSystemSelect, 'font', 'Font (Fontainebleau)');
  } else {
    addOption(gradeSystemSelect, 'yds', 'YDS (Yosemite Decimal System)');
    addOption(gradeSystemSelect, 'french', 'French');
  }
}

// Helper function to add options to select element
function addOption(selectElement, value, text) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;
  selectElement.appendChild(option);
}

// Initialize grade slider
function initializeGradeSlider() {
  const minSlider = document.getElementById('min-grade-slider');
  const maxSlider = document.getElementById('max-grade-slider');
  const minGradeDisplay = document.getElementById('min-grade-display');
  const maxGradeDisplay = document.getElementById('max-grade-display');
  
  const climbingType = climbingTypeSelect.value;
  const gradeSystem = gradeSystemSelect.value;
  
  let grades = [];
  if (climbingType === 'bouldering') {
    grades = gradeSystem === 'vScale' ? climbingGrades.bouldering.vScale : climbingGrades.bouldering.font;
  } else {
    grades = gradeSystem === 'yds' ? climbingGrades.routeClimbing.yds : climbingGrades.routeClimbing.french;
  }
  
  const maxIndex = grades.length - 1;
  minSlider.max = maxIndex;
  maxSlider.max = maxIndex;
  
  if (parseInt(minSlider.value) > maxIndex) minSlider.value = 0;
  if (parseInt(maxSlider.value) > maxIndex) maxSlider.value = Math.min(5, maxIndex);
  
  function updateDisplay() {
    const minVal = parseInt(minSlider.value);
    const maxVal = parseInt(maxSlider.value);
    
    if (minVal > maxVal) {
      minSlider.value = maxVal;
      return updateDisplay();
    }
    
    minGradeDisplay.textContent = grades[minVal];
    maxGradeDisplay.textContent = grades[maxVal];
  }
  
  minSlider.addEventListener('input', updateDisplay);
  maxSlider.addEventListener('input', updateDisplay);
  
  updateDisplay();
}

// Get selected grade range based on slider values
function getSelectedGradeRange() {
  const climbingType = climbingTypeSelect.value;
  const gradeSystem = gradeSystemSelect.value;
  const minIndex = parseInt(document.getElementById('min-grade-slider').value);
  const maxIndex = parseInt(document.getElementById('max-grade-slider').value);
  
  let allGrades = [];
  if (climbingType === 'bouldering') {
    allGrades = gradeSystem === 'vScale' ? climbingGrades.bouldering.vScale : climbingGrades.bouldering.font;
  } else {
    allGrades = gradeSystem === 'yds' ? climbingGrades.routeClimbing.yds : climbingGrades.routeClimbing.french;
  }
  
  return allGrades.slice(minIndex, maxIndex + 1);
}

// Generate BINGO card
function generateBingoCard() {
  console.log('generateBingoCard function called');
  
  const climbingType = climbingTypeSelect.value;
  const gradeSystem = gradeSystemSelect.value;
  const isCircuitGrading = circuitGradingSelect.value === 'yes';
  
  const selectedColors = [];
  if (!isCircuitGrading) {
    document.querySelectorAll('#color-options input:checked').forEach(input => {
      selectedColors.push(input.value);
    });
    
    if (selectedColors.length === 0) {
      alert('Please select at least one color!');
      return;
    }
  }

  const selectedFeatures = [];
  document.querySelectorAll('#hold-types input:checked, #move-types input:checked, #route-features input:checked').forEach(input => {
    selectedFeatures.push(input.value);
  });
  
  if (selectedFeatures.length === 0) {
    alert('Please select at least one feature!');
    return;
  }
  
  const gradeRange = getSelectedGradeRange();
  
  if (gradeRange.length === 0) {
    alert('Please select a valid grade range!');
    return;
  }
  
  bingoGrid.innerHTML = '';













  // Generate 25 BINGO cells (5x5 grid)
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'bingo-cell';
    
    if (i === 12) {
      cell.textContent = 'FREE CLIMB';
      cell.classList.add('center');
    } else {
      const randomGrade = gradeRange[Math.floor(Math.random() * gradeRange.length)];
      const randomFeature = selectedFeatures[Math.floor(Math.random() * selectedFeatures.length)];
      const randomColor = !isCircuitGrading ? selectedColors[Math.floor(Math.random() * selectedColors.length)] : null;
      
      if (isCircuitGrading) {
        const rand = Math.random();
        
        if (rand < 0.20) {
          cell.textContent = randomFeature;
        } else if (rand < 0.40) {
          cell.textContent = randomGrade;
        } else if (rand < 0.70) {
          cell.textContent = `${randomGrade} with ${randomFeature}`;
        } else if (rand < 0.85) {
          const phrasings = [
            `${randomFeature} on ${randomGrade}`,
            `${randomGrade} using ${randomFeature}`,
            `${randomFeature} problem`
          ];
          cell.textContent = phrasings[Math.floor(Math.random() * phrasings.length)];
        } else {
          const modifiers = ['Clean', 'Flash', 'No rest', 'Silent feet', 'Campus', 'One hang'];
          const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
          cell.textContent = `${modifier}: ${randomGrade}`;
        }
      } else {
        const rand = Math.random();
        
        if (rand < 0.15) {
          cell.textContent = randomGrade;
        } else if (rand < 0.25) {
          cell.textContent = randomFeature;
        } else if (rand < 0.35) {
          cell.textContent = randomColor;
        } else if (rand < 0.60) {
          cell.textContent = `${randomColor} ${randomGrade}`;
        } else if (rand < 0.80) {
          cell.textContent = `${randomGrade} with ${randomFeature}`;
        } else if (rand < 0.90) {
          const phrasings = [
            `${randomFeature} on ${randomColor} ${randomGrade}`,
            `${randomColor} ${randomGrade} using ${randomFeature}`,
            `${randomFeature} ${randomColor} problem`
          ];
          cell.textContent = phrasings[Math.floor(Math.random() * phrasings.length)];
        } else {
          const modifiers = ['Clean', 'Flash', 'No rest', 'Silent feet', 'Campus', 'One hang'];
          const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
          cell.textContent = `${modifier}: ${randomColor} ${randomGrade}`;
        }
      }
    }
    
    bingoGrid.appendChild(cell);
  }
  
  console.log('BINGO card generated successfully!');
}

















// Save preferences to localStorage
function savePreferences() {
  const preferences = {
    climbingType: climbingTypeSelect.value,
    gradeSystem: gradeSystemSelect.value,
    circuitGrading: circuitGradingSelect.value,
    minGrade: document.getElementById('min-grade-slider').value,
    maxGrade: document.getElementById('max-grade-slider').value,
    colors: Array.from(document.querySelectorAll('#color-options input:checked')).map(input => input.value),
    features: Array.from(document.querySelectorAll('#hold-types input:checked, #move-types input:checked, #route-features input:checked')).map(input => input.value)
  };
  
  localStorage.setItem('climbingBingoPreferences', JSON.stringify(preferences));
  console.log('Preferences saved!');
}

// Load preferences from localStorage
function loadPreferences() {
  const saved = localStorage.getItem('climbingBingoPreferences');
  
  if (!saved) return;
  
  try {
    const preferences = JSON.parse(saved);
    
    if (preferences.climbingType) {
      climbingTypeSelect.value = preferences.climbingType;
      updateGradeSystemOptions();
    }
    
    if (preferences.gradeSystem) {
      gradeSystemSelect.value = preferences.gradeSystem;
    }
    
    if (preferences.circuitGrading) {
      circuitGradingSelect.value = preferences.circuitGrading;
    }
    
    if (preferences.minGrade !== undefined) {
      document.getElementById('min-grade-slider').value = preferences.minGrade;
    }
    if (preferences.maxGrade !== undefined) {
      document.getElementById('max-grade-slider').value = preferences.maxGrade;
    }
    
    initializeGradeSlider();
    
    if (preferences.colors) {
      document.querySelectorAll('#color-options input[type="checkbox"]').forEach(input => {
        input.checked = preferences.colors.includes(input.value);
      });
    }
    
    if (preferences.features) {
      document.querySelectorAll('#hold-types input[type="checkbox"], #move-types input[type="checkbox"], #route-features input[type="checkbox"]').forEach(input => {
        input.checked = preferences.features.includes(input.value);
      });
    }
    
    console.log('Preferences loaded!');
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
}

// Reset preferences
function resetPreferences() {
  if (confirm('Are you sure you want to reset all selections to defaults?')) {
    localStorage.removeItem('climbingBingoPreferences');
    
    climbingTypeSelect.value = 'routeClimbing';
    updateGradeSystemOptions();
    gradeSystemSelect.value = 'yds';
    circuitGradingSelect.value = 'no';
    
    document.querySelectorAll('.feature-checkboxes input[type="checkbox"]').forEach(input => {
      input.checked = true;
    });
    
    document.getElementById('min-grade-slider').value = 0;
    document.getElementById('max-grade-slider').value = 5;
    initializeGradeSlider();
    
    updateCircuitGradingVisibility();
    updateColorVisibility();
    
    bingoGrid.innerHTML = '<div class="placeholder-text">Configure your settings and click "Generate BINGO Card" to start!</div>';
    
    console.log('Preferences reset!');
  }
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', initializeForm);

// Copy link functionality
document.getElementById('copyLinkBtn').addEventListener('click', function() {
  const pageLink = window.location.href;

  navigator.clipboard.writeText(pageLink)
    .then(() => {
      const feedbackSpan = document.getElementById('copyFeedback');
      feedbackSpan.style.display = 'inline';
      setTimeout(() => {
        feedbackSpan.style.display = 'none';
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy link: ', err);
      alert('Could not copy link. Please copy it manually.');
    });
});

// Contact modal functionality
const contactBtn = document.getElementById('contact-btn');
const contactModal = document.getElementById('contact-modal');
const closeModal = document.querySelector('.close');
const contactForm = document.getElementById('contact-form');

contactBtn.addEventListener('click', (e) => {
  e.preventDefault();
  contactModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  contactModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === contactModal) {
    contactModal.style.display = 'none';
  }
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  const formData = new FormData(contactForm);
  
  try {
    const response = await fetch('https://formspree.io/f/myzrpnaq', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      alert('Thanks for your message! I\'ll get back to you soon.');
      contactModal.style.display = 'none';
      contactForm.reset();
    } else {
      alert('Oops! There was a problem sending your message. Please try again.');
    }
  } catch (error) {
    alert('Oops! There was a problem sending your message. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});