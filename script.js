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
      "7A", "7A+", "7B", "7B+", "7C", "7C+", "8A", "8A+"
    ]
  },
  
  // Route climbing grades
  routeClimbing: {
    yds: [
      "5.5", "5.6", "5.7", "5.8", "5.9", 
      "5.10a", "5.10b", "5.10c", "5.10d", "5.11a", "5.11b", "5.11c", "5.11d",
      "5.12a", "5.12b", "5.12c", "5.12d", "5.13a"
    ],
    french: [
     "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", 
      "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+"
    ]
  },
  
  // difficulties to leverage for circuit grading
  circuitDifficulty: {
    difficulty: [
      "Beginner", "Intermediate", "Advanced"
    ]
  },

  // Common climbing hold types and features for BINGO challenges
  climbingFeatures: {
    routeColors: [
      "Red", "Blue", "Green", "Yellow", "Black", "White", "Purple", "Pink", 
      "Orange", "Gray", "Brown"
    ],
    holdTypes: [
      "Jug", "Crimp", "Sloper", "Pocket"
    ],
    routeFeatures: [
      "Slab", "Vert", "Overhung"
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
const circuitLevel = document.getElementById('circuit-level');

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

// Function to update SLIDER visibility
function updateColorVisibility() {
  if (circuitGradingSelect.value === 'yes') {
   document.getElementById("slider-elements").style.display = 'none';
  } else {
     document.getElementById("slider-elements").style.display = 'block';
  }
}

function updateLevelVisibility() {
  const colorLabelElement = document.getElementById("smart-label-color");
  
  if (circuitGradingSelect.value === 'yes') {
    // Show difficulty selector
    document.getElementById("difficulty-selector").style.display = 'block';
    // Update Route Colors label
    colorLabelElement.innerHTML = '<span class="toggle-icon">▼</span> Colors You Climb';
  } else {
    // Hide difficulty selector
    document.getElementById("difficulty-selector").style.display = 'none';
    // Reset Route Colors label
    colorLabelElement.innerHTML = '<span class="toggle-icon">▼</span> Available Route Colors';
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
populateFeatures('route-features', climbingGrades.climbingFeatures.routeFeatures);
populateFeatures('circuit-level', climbingGrades.circuitDifficulty.difficulty);

// Add toggle functionality for feature categories
document.querySelectorAll('.category-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const checkboxContainer = button.nextElementSibling;
    checkboxContainer.classList.toggle('collapsed');
    button.classList.toggle('collapsed');
  });
});

// SET DEFAULT VALUES - ensures dropdowns are aligned on first page load
climbingTypeSelect.value = 'routeClimbing';
circuitGradingSelect.value = 'no';
updateGradeSystemOptions();  // This populates the grade system dropdown
gradeSystemSelect.value = 'yds';  // Then set it to YDS



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
  circuitGradingSelect.addEventListener('change', updateLevelVisibility);

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
      saveBingoCard();
    }
  });

  // Load saved preferences
  loadPreferences();

  // Update visibility after loading preferences
  updateCircuitGradingVisibility();
  updateColorVisibility();
  updateLevelVisibility();
  
  // Try to load saved bingo card (if one exists)
  const cardLoaded = loadBingoCard();
  if (!cardLoaded) {
    bingoGrid.innerHTML = '<div class="placeholder-text">Make selections and click "Generate Card" to begin</div>';
  }
}

// Populate feature buttons
// Populate feature buttons (changed from checkboxes to button-style)
function populateFeatures(containerId, features) {
  const container = document.getElementById(containerId);
  
  // Check if this is the circuit-level container (should be radio buttons)
  const isCircuitLevel = containerId === 'circuit-level';
  const inputType = isCircuitLevel ? 'radio' : 'checkbox';
  const inputName = isCircuitLevel ? 'circuit-level-select' : '';
  
  features.forEach(feature => {
    const featureDiv = document.createElement('div');
    featureDiv.className = 'feature-option'; // Unselected by default
    const safeId = `feature-${feature.toLowerCase().replace(/\s+/g, '-')}`;
    
    featureDiv.innerHTML = `
      <input type="${inputType}" ${inputName ? `name="${inputName}"` : ''} id="${safeId}" value="${feature}">
      <label for="${safeId}">${feature}</label>
    `;
    
    // Add click handler to toggle selection
    featureDiv.addEventListener('click', () => {
      const input = featureDiv.querySelector('input');
      
      if (isCircuitLevel) {
        // For radio buttons, unselect all others first
        container.querySelectorAll('.feature-option').forEach(opt => {
          opt.classList.remove('selected');
          opt.querySelector('input').checked = false;
        });
      }
      
      input.checked = !input.checked;
      featureDiv.classList.toggle('selected', input.checked);
    });
    
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

// Helper function to check if a feature is a hold type
function isHoldType(feature) {
  return climbingGrades.climbingFeatures.holdTypes.includes(feature);
}

// Helper function to check if a feature is a wall type
function isWallType(feature) {
  return climbingGrades.climbingFeatures.routeFeatures.includes(feature);
}

// Configuration for bingo square generation (non-circuit mode)
const BINGO_CONFIG = {
  probabilities: {
    single: 0.40,
    twoA: 0.25,
    twoB: 0.10,
    modifier: 0.20,
    wildcard: 0.05
  },
  invalidCombinations: [
    {
      type: 'grade+hold',
      condition: { gradePosition: 'top', holdType: 'Jug' },
      description: 'High grade (top 25%) + Jugs'
    },
    {
      type: 'grade+hold',
      condition: { gradePosition: 'beginner', holdType: 'Crimp' },
      description: 'Beginner grade (first 3) + Crimps'
    },
    {
      type: 'grade+hold',
      condition: { gradePosition: 'beginner', holdType: 'Pocket' },
      description: 'Beginner grade (first 3) + Pockets'
    },
    {
      type: 'wall+hold',
      condition: { wallType: 'Slab', holdType: 'Pocket' },
      description: 'Slab + Pockets'
    },
    {
      type: 'wall+hold',
      condition: { wallType: 'Slab', holdType: 'Pinch' },
      description: 'Slab + Pinches'
    }
  ],
  modifiers: ['First Attempt', 'Silent Feet'],
  wildcards: ["Climber's Choice", "Friend's Choice", "Current Project"]
};

// Configuration for circuit grading mode
const BINGO_CONFIG_CIRCUIT = {
  probabilities: {
    single: 0.30,
    twoAttribute: 0.45,
    modifier: 0.20,
    wildcard: 0.05
  },
  invalidCombinations: [
    {
      type: 'wall+hold',
      condition: { wallType: 'Slab', holdType: 'Pocket' },
      description: 'Slab + Pockets'
    },
    {
      type: 'wall+hold',
      condition: { wallType: 'Slab', holdType: 'Pinch' },
      description: 'Slab + Pinches'
    }
  ],
  skillBasedRestrictions: {
    beginner: ['Crimp', 'Pocket', 'Pinch'],
    advanced: []
  },
  modifiers: ['First Attempt', 'Silent Feet'],
  wildcards: ["Climber's Choice", "Friend's Choice"]
};

// Helper function to determine grade position in selected range
function getGradePosition(grade, gradeRange) {
  const index = gradeRange.indexOf(grade);
  if (index === -1) return 'middle';
  
  const rangeLength = gradeRange.length;
  const beginnerThreshold = Math.min(3, rangeLength);
  const topThreshold = Math.max(rangeLength - Math.ceil(rangeLength * 0.25), beginnerThreshold);
  
  if (index < beginnerThreshold) return 'beginner';
  if (index >= topThreshold) return 'top';
  return 'middle';
}

// Helper function to get hold type with weighted distribution
function getWeightedHoldType(selectedHoldTypes, gradePosition) {
  if (selectedHoldTypes.length === 0) return null;
  
  const jugs = selectedHoldTypes.filter(ht => ht === 'Jug');
  const slopers = selectedHoldTypes.filter(ht => ht === 'Sloper');
  const otherHolds = selectedHoldTypes.filter(ht => ht !== 'Jug' && ht !== 'Sloper');
  
  let rand = Math.random();
  
  if (gradePosition === 'beginner') {
    const excluded = ['Crimp', 'Pocket', 'Pinch'];
    const allowedHolds = selectedHoldTypes.filter(ht => !excluded.includes(ht));
    
    if (allowedHolds.length === 0) return selectedHoldTypes[0];
    
    if (jugs.length > 0 && rand < 0.70) {
      return jugs[Math.floor(Math.random() * jugs.length)];
    } else {
      const nonJugs = allowedHolds.filter(ht => ht !== 'Jug');
      if (nonJugs.length > 0) {
        return nonJugs[Math.floor(Math.random() * nonJugs.length)];
      } else if (jugs.length > 0) {
        return jugs[Math.floor(Math.random() * jugs.length)];
      }
    }
  } else if (gradePosition === 'top') {
    if (jugs.length > 0 && otherHolds.length > 0 && rand < 0.05) {
      return jugs[Math.floor(Math.random() * jugs.length)];
    } else if (otherHolds.length > 0) {
      return otherHolds[Math.floor(Math.random() * otherHolds.length)];
    } else if (slopers.length > 0) {
      return slopers[Math.floor(Math.random() * slopers.length)];
    } else if (jugs.length > 0) {
      return jugs[Math.floor(Math.random() * jugs.length)];
    }
  }
  
  return selectedHoldTypes[Math.floor(Math.random() * selectedHoldTypes.length)];
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

// Generate a single bingo cell
function generateBingoCell(gradeRange, selectedColors, selectedHoldTypes, selectedWallTypes, isCircuitGrading, climbingType, difficultyContext = null) {
  let cellText = '';
  let attempts = 0;
  const maxAttempts = 50;
  
  const config = isCircuitGrading ? BINGO_CONFIG_CIRCUIT : BINGO_CONFIG;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    let randomGrade = null;
    let gradePosition;

    if (isCircuitGrading) {
      gradePosition = difficultyContext;
    } else {
      randomGrade = gradeRange[Math.floor(Math.random() * gradeRange.length)];
      gradePosition = getGradePosition(randomGrade, gradeRange);
    }
    
    const rand = Math.random();
    let squareType = '';
    let attributes = [];
    
    // Wildcard squares
    if (rand < config.probabilities.wildcard) {
      cellText = config.wildcards[Math.floor(Math.random() * config.wildcards.length)];
      break;
    }
    
    // Single attribute squares
    else if (rand < config.probabilities.wildcard + config.probabilities.single) {
      const singleOptions = [];
      
      if (isCircuitGrading) {
        if (selectedColors.length > 0) singleOptions.push('color');
        if (selectedHoldTypes.length > 0) singleOptions.push('hold');
        if (selectedWallTypes.length > 0) singleOptions.push('wall');
      } else {
        if (selectedColors.length > 0) singleOptions.push('color');
        singleOptions.push('grade');
        if (selectedHoldTypes.length > 0) singleOptions.push('hold');
        if (selectedWallTypes.length > 0) singleOptions.push('wall');
      }
      
      if (singleOptions.length === 0) break;
      
      const selectedSingle = singleOptions[Math.floor(Math.random() * singleOptions.length)];
      attributes = [selectedSingle];
      
      if (selectedSingle === 'color') {
        const randomColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
        const activityType = climbingType === 'bouldering' ? 'Boulder' : 'Route';
        cellText = `${randomColor} ${activityType}`;
        squareType = 'single';
      } else if (selectedSingle === 'grade' && !isCircuitGrading) {
        cellText = randomGrade;
        squareType = 'single';
      } else if (selectedSingle === 'hold' && selectedHoldTypes.length > 0) {
        const holdType = getWeightedHoldType(selectedHoldTypes, gradePosition);
        
        if (isCircuitGrading && gradePosition === 'beginner') {
          if (config.skillBasedRestrictions.beginner.includes(holdType)) {
            continue;
          }
        }
        
        cellText = `${holdType} Holds`;
        squareType = 'single';
      } else if (selectedSingle === 'wall' && selectedWallTypes.length > 0) {
        const wallType = selectedWallTypes[Math.floor(Math.random() * selectedWallTypes.length)];
        cellText = `${wallType} Wall`;
        squareType = 'single';
      }
    }
    
    // Two attribute squares - CIRCUIT MODE
    else if (isCircuitGrading) {
      const twoAttrOptions = [];
      
      if (selectedColors.length > 0 && selectedHoldTypes.length > 0) {
        twoAttrOptions.push(['color', 'hold']);
      }
      if (selectedColors.length > 0 && selectedWallTypes.length > 0) {
        twoAttrOptions.push(['color', 'wall']);
      }
      if (selectedHoldTypes.length > 0 && selectedWallTypes.length > 0) {
        twoAttrOptions.push(['hold', 'wall']);
      }
      
      if (twoAttrOptions.length === 0) break;
      
      const selectedCombo = twoAttrOptions[Math.floor(Math.random() * twoAttrOptions.length)];
      attributes = selectedCombo;
      const [attr1, attr2] = selectedCombo;
      
      const randomColor = selectedColors.length > 0 ? selectedColors[Math.floor(Math.random() * selectedColors.length)] : null;
      const holdType = getWeightedHoldType(selectedHoldTypes, gradePosition);
      const wallType = selectedWallTypes.length > 0 ? selectedWallTypes[Math.floor(Math.random() * selectedWallTypes.length)] : null;
      const activityType = climbingType === 'bouldering' ? 'Boulder' : 'Route';
      
      if (gradePosition === 'beginner' && holdType && config.skillBasedRestrictions.beginner.includes(holdType)) {
        continue;
      }
      
      if (attributes.includes('wall') && attributes.includes('hold')) {
        if (wallType === 'Slab' && (holdType === 'Pocket' || holdType === 'Pinch')) {
          continue;
        }
      }
      
      if (attr1 === 'color' && attr2 === 'hold') {
        const phrasings = [
          `${holdType} Holds on ${randomColor} ${activityType}`,
          `${randomColor} ${activityType} with ${holdType}s`
        ];
        cellText = phrasings[Math.floor(Math.random() * phrasings.length)];
        squareType = 'twoAttribute';
      } else if (attr1 === 'color' && attr2 === 'wall') {
        cellText = `${randomColor} ${activityType} on ${wallType} Wall`;
        squareType = 'twoAttribute';
      } else if (attr1 === 'hold' && attr2 === 'wall') {
        cellText = `${holdType}s on ${wallType} Wall`;
        squareType = 'twoAttribute';
      }
    }
    
    // Two attribute squares - NON-CIRCUIT MODE
    else {
      if (rand < config.probabilities.wildcard + config.probabilities.single + config.probabilities.twoA) {
        const twoAOptions = [];
        
        if (selectedColors.length > 0) {
          twoAOptions.push(['color', 'grade']);
          if (selectedWallTypes.length > 0) {
            twoAOptions.push(['color', 'wall']);
          }
        }
        
        if (twoAOptions.length === 0) break;
        
        const selectedCombo = twoAOptions[Math.floor(Math.random() * twoAOptions.length)];
        attributes = selectedCombo;
        const [attr1, attr2] = selectedCombo;
        
        const randomColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
        const wallType = selectedWallTypes.length > 0 ? selectedWallTypes[Math.floor(Math.random() * selectedWallTypes.length)] : null;
        
        if (attr1 === 'color' && attr2 === 'grade') {
          cellText = `${randomColor} ${randomGrade}`;
          squareType = 'twoA';
        } else if (attr1 === 'color' && attr2 === 'wall') {
          const activityType = climbingType === 'bouldering' ? 'Boulder' : 'Route';
          cellText = `${randomColor} ${activityType} on ${wallType} Wall`;
          squareType = 'twoA';
        }
      }
      else if (rand < config.probabilities.wildcard + config.probabilities.single + config.probabilities.twoA + config.probabilities.twoB) {
        const twoBOptions = [];
        
        if (selectedHoldTypes.length > 0) {
          twoBOptions.push(['grade', 'hold']);
          if (selectedColors.length > 0) {
            twoBOptions.push(['color', 'hold']);
          }
        }
        if (selectedWallTypes.length > 0) {
          twoBOptions.push(['grade', 'wall']);
        }
        
        if (twoBOptions.length === 0) break;
        
        const selectedCombo = twoBOptions[Math.floor(Math.random() * twoBOptions.length)];
        attributes = selectedCombo;
        const [attr1, attr2] = selectedCombo;
        
        const randomColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
        const holdType = getWeightedHoldType(selectedHoldTypes, gradePosition);
        const wallType = selectedWallTypes.length > 0 ? selectedWallTypes[Math.floor(Math.random() * selectedWallTypes.length)] : null;
        
        if (attributes.includes('grade') && attributes.includes('hold')) {
          if (gradePosition === 'top' && holdType === 'Jug') {
            continue;
          }
          if (gradePosition === 'beginner' && (holdType === 'Crimp' || holdType === 'Pocket')) {
            continue;
          }
        }
        
        if (attributes.includes('wall') && attributes.includes('hold')) {
          if (wallType === 'Slab' && (holdType === 'Pocket' || holdType === 'Pinch')) {
            continue;
          }
        }
        
        if (attr1 === 'grade' && attr2 === 'hold') {
          cellText = `${randomGrade} with ${holdType}s`;
          squareType = 'twoB';
        } else if (attr1 === 'grade' && attr2 === 'wall') {
          cellText = `${randomGrade} on ${wallType} Wall`;
          squareType = 'twoB';
        } else if (attr1 === 'color' && attr2 === 'hold') {
          cellText = `${holdType} Holds on ${randomColor} Problem`;
          squareType = 'twoB';
        }
      }
    }
    
    // Apply modifier
    if (cellText) {
      const canHaveModifier = isCircuitGrading 
        ? (squareType === 'single' || squareType === 'twoAttribute')
        : (squareType === 'single' || squareType === 'twoA');
      
      if (canHaveModifier) {
        const modifierRand = Math.random();
        if (modifierRand < config.probabilities.modifier) {
          const modifier = config.modifiers[Math.floor(Math.random() * config.modifiers.length)];
          cellText = `${modifier}: ${cellText}`;
        }
      }
      break;
    }
  }
  
  return cellText || 'Climb something!';
}

// Generate BINGO card
function generateBingoCard() {
  console.log('generateBingoCard function called');
  
  const climbingType = climbingTypeSelect.value;
  const gradeSystem = gradeSystemSelect.value;
  const isCircuitGrading = circuitGradingSelect.value === 'yes';
  
  let difficultyContext;
  let gradeRange = [];
  
  if (isCircuitGrading) {
    const selectedLevelInput = document.querySelector('#circuit-level input:checked');
    if (!selectedLevelInput) {
      alert('Please select your climbing level!');
      return;
    }
    
    const skillLevel = selectedLevelInput.value;
    
    if (skillLevel === 'Beginner') {
      difficultyContext = 'beginner';
    } else if (skillLevel === 'Intermediate') {
      difficultyContext = 'middle';
    } else if (skillLevel === 'Advanced') {
      difficultyContext = 'top';
    }
  } else {
    gradeRange = getSelectedGradeRange();
    
    if (gradeRange.length === 0) {
      alert('Please select a valid grade range!');
      return;
    }
  }
  
  const selectedColors = [];
  document.querySelectorAll('#color-options input:checked').forEach(input => {
    selectedColors.push(input.value);
  });
  
  if (selectedColors.length === 0) {
    alert('Please select at least one color!');
    return;
  }

  const selectedHoldTypes = [];
  document.querySelectorAll('#hold-types input:checked').forEach(input => {
    selectedHoldTypes.push(input.value);
  });
  
  const selectedWallTypes = [];
  document.querySelectorAll('#route-features input:checked').forEach(input => {
    selectedWallTypes.push(input.value);
  });
  
  if (selectedHoldTypes.length === 0 && selectedWallTypes.length === 0) {
    alert('Please select at least one hold type or wall type!');
    return;
  }
  
  bingoGrid.innerHTML = '';

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'bingo-cell';
    
    if (i === 12) {
      cell.textContent = 'FREE CLIMB';
      cell.classList.add('center');
    } else {
      cell.textContent = generateBingoCell(
        gradeRange,
        selectedColors,
        selectedHoldTypes,
        selectedWallTypes,
        isCircuitGrading,
        climbingType,
        difficultyContext
      );
    }
    
    bingoGrid.appendChild(cell);
  }
  
  console.log('BINGO card generated successfully!');
  saveBingoCard();
}

// Save bingo card state to localStorage
function saveBingoCard() {
  const cells = bingoGrid.querySelectorAll('.bingo-cell');
  const cardData = [];
  
  cells.forEach(cell => {
    cardData.push({
      text: cell.textContent,
      isCompleted: cell.classList.contains('completed'),
      isCenter: cell.classList.contains('center')
    });
  });
  
  localStorage.setItem('climbingBingoCard', JSON.stringify(cardData));
  console.log('Bingo card saved!');
}

// Load bingo card state from localStorage
function loadBingoCard() {
  const saved = localStorage.getItem('climbingBingoCard');
  
  if (!saved) return false;
  
  try {
    const cardData = JSON.parse(saved);
    
    if (!cardData || cardData.length !== 25) return false;
    
    bingoGrid.innerHTML = '';
    
    cardData.forEach(cellData => {
      const cell = document.createElement('div');
      cell.className = 'bingo-cell';
      cell.textContent = cellData.text;
      
      if (cellData.isCompleted) {
        cell.classList.add('completed');
      }
      if (cellData.isCenter) {
        cell.classList.add('center');
      }
      
      bingoGrid.appendChild(cell);
    });
    
    console.log('Bingo card loaded!');
    return true;
  } catch (error) {
    console.error('Error loading bingo card:', error);
    return false;
  }
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
    features: Array.from(document.querySelectorAll('#hold-types input:checked, #route-features input:checked')).map(input => input.value)
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
        const isChecked = preferences.colors.includes(input.value);
        input.checked = isChecked;
        input.closest('.feature-option').classList.toggle('selected', isChecked);
      });
    }
    
    if (preferences.features) {
      document.querySelectorAll('#hold-types input[type="checkbox"], #route-features input[type="checkbox"]').forEach(input => {
        const isChecked = preferences.features.includes(input.value);
        input.checked = isChecked;
        input.closest('.feature-option').classList.toggle('selected', isChecked);
      });
    }
    
    console.log('Preferences loaded!');
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
}

// Reset preferences
// Reset preferences
function resetPreferences() {
  if (confirm('Are you sure you want to reset all selections to defaults?')) {
    localStorage.removeItem('climbingBingoPreferences');
    localStorage.removeItem('climbingBingoCard');
    
    climbingTypeSelect.value = 'routeClimbing';
    circuitGradingSelect.value = 'no';
    
    // Update grade system options and initialize slider
    updateGradeSystemOptions();
    gradeSystemSelect.value = 'yds';
    initializeGradeSlider();
    
    // Unselect all feature buttons
    document.querySelectorAll('.feature-option').forEach(option => {
      const checkbox = option.querySelector('input[type="checkbox"], input[type="radio"]');
      checkbox.checked = false;
      option.classList.remove('selected');
    });
    
    document.getElementById('min-grade-slider').value = 0;
    document.getElementById('max-grade-slider').value = 5;
    
    // Update all visibility states AFTER resetting values
    updateCircuitGradingVisibility();
    updateColorVisibility();
    updateLevelVisibility();
    
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





// javascript for modal


"use strict";
const howto = document.querySelector(".howto");
const overlay = document.querySelector(".overlay");
const btnColsehowto = document.querySelector(".close-howto");
const btnOpenhowto = document.querySelectorAll(".show-howto");

const closehowto = function () {
  howto.classList.add("hidden");
  overlay.classList.add("hidden");
};

const openhowto = function () {
  howto.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

for (let i = 0; i < btnOpenhowto.length; i++) {
  btnOpenhowto[i].addEventListener("click", openhowto);
}

btnColsehowto.addEventListener("click", closehowto);
overlay.addEventListener("click", closehowto);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !howto.classList.contains("hidden")) {
    closehowto();
  }
});
