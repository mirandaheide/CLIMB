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
      saveBingoCard(); // Save card state when completion changes
    }
  });

  // Load saved preferences
  loadPreferences();

  // Update visibility after loading preferences
  updateCircuitGradingVisibility();
  updateColorVisibility();
  
  // Try to load saved bingo card (if one exists)
  const cardLoaded = loadBingoCard();
  if (!cardLoaded) {
    // No saved card, show placeholder
    bingoGrid.innerHTML = '<div class="placeholder-text">Make selections and click "Generate Card" to begin</div>';
  }
}

// Populate feature buttons (changed from checkboxes to button-style)
function populateFeatures(containerId, features) {
  const container = document.getElementById(containerId);
  features.forEach(feature => {
    const featureDiv = document.createElement('div');
    featureDiv.className = 'feature-option'; // Unselected by default
    const safeId = `feature-${feature.toLowerCase().replace(/\s+/g, '-')}`;
    featureDiv.innerHTML = `
      <input type="checkbox" id="${safeId}" value="${feature}">
      <label for="${safeId}">${feature}</label>
    `;
    
    // Add click handler to toggle selection
    featureDiv.addEventListener('click', () => {
      const checkbox = featureDiv.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      featureDiv.classList.toggle('selected', checkbox.checked);
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
    single: 0.40,        // 40% - Single attribute squares
    twoA: 0.25,         // 25% - Two attribute squares A (Color+Grade, Color+Wall)
    twoB: 0.10,         // 10% - Two attribute squares B (Grade+Hold, Grade+Wall, Color+Hold)
    modifier: 0.20,      // 20% - Modifier squares
    wildcard: 0.05      // 5% - Wildcard squares
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

// Configuration for circuit grading mode (no colors, more hold/wall focus)
const BINGO_CONFIG_CIRCUIT = {
  probabilities: {
    single: 0.25,        // 25% - Single attribute squares (Grade, Hold, Wall - no color)
    twoAttribute: 0.40,  // 40% - Two attribute squares (Grade+Hold, Grade+Wall, Hold+Wall)
    modifier: 0.20,      // 20% - Modifier squares
    wildcard: 0.05       // 5% - Wildcard squares
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
  wildcards: ["Climber's Choice", "Friend's Choice"]
};

// Helper function to determine grade position in selected range
// Returns: 'beginner' (first 3), 'middle' (middle 50%), or 'top' (top 25%)
function getGradePosition(grade, gradeRange) {
  const index = gradeRange.indexOf(grade);
  if (index === -1) return 'middle'; // Fallback
  
  const rangeLength = gradeRange.length;
  const beginnerThreshold = Math.min(3, rangeLength);
  const topThreshold = Math.max(rangeLength - Math.ceil(rangeLength * 0.25), beginnerThreshold);
  
  if (index < beginnerThreshold) return 'beginner';
  if (index >= topThreshold) return 'top';
  return 'middle';
}

// Helper function to get hold type with weighted distribution based on grade position
function getWeightedHoldType(selectedHoldTypes, gradePosition) {
  if (selectedHoldTypes.length === 0) return null;
  
  const jugs = selectedHoldTypes.filter(ht => ht === 'Jug');
  const slopers = selectedHoldTypes.filter(ht => ht === 'Sloper');
  const otherHolds = selectedHoldTypes.filter(ht => ht !== 'Jug' && ht !== 'Sloper');
  
  let rand = Math.random();
  
  if (gradePosition === 'beginner') {
    // 70% Jugs, 30% Slopers/Other, 0% Crimps/Pockets/Pinches
    const excluded = ['Crimp', 'Pocket', 'Pinch'];
    const allowedHolds = selectedHoldTypes.filter(ht => !excluded.includes(ht));
    
    if (allowedHolds.length === 0) return selectedHoldTypes[0]; // Fallback
    
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
    // 5% Jugs, 95% All other hold types
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
  
  // Middle 50% or default: equal distribution
  return selectedHoldTypes[Math.floor(Math.random() * selectedHoldTypes.length)];
}

// Helper function to check if a combination is invalid
function isInvalidCombination(attributes, grade, gradePosition, gradeRange, selectedHoldTypes, selectedWallTypes) {
  const hasGrade = attributes.includes('grade');
  const hasHold = attributes.includes('hold');
  const hasWall = attributes.includes('wall');
  
  // Check each invalid combination rule
  for (const rule of BINGO_CONFIG.invalidCombinations) {
    if (rule.type === 'grade+hold' && hasGrade && hasHold) {
      const holdType = getWeightedHoldType(selectedHoldTypes, gradePosition);
      if (rule.condition.gradePosition && rule.condition.gradePosition === gradePosition) {
        if (rule.condition.holdType && rule.condition.holdType === holdType) {
          return true;
        }
      }
    }
    
    if (rule.type === 'wall+hold' && hasWall && hasHold) {
      // This would need the actual wall type and hold type selected
      // We'll check this during generation when we have the actual values
    }
  }
  
  return false;
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

// Generate a single bingo cell with new probability system
function generateBingoCell(gradeRange, selectedColors, selectedHoldTypes, selectedWallTypes, isCircuitGrading, climbingType) {
  let cellText = '';
  let attempts = 0;
  const maxAttempts = 50; // Prevent infinite loops
  
  // Select the appropriate config based on circuit grading mode
  const config = isCircuitGrading ? BINGO_CONFIG_CIRCUIT : BINGO_CONFIG;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Pick a random grade
    const randomGrade = gradeRange[Math.floor(Math.random() * gradeRange.length)];
    const gradePosition = getGradePosition(randomGrade, gradeRange);
    
    // Determine base square type
    const rand = Math.random();
    let squareType = '';
    let attributes = [];
    
    // 5% Wildcard squares
    if (rand < config.probabilities.wildcard) {
      cellText = config.wildcards[Math.floor(Math.random() * config.wildcards.length)];
      break;
    }
    
    // Single attribute squares
    else if (rand < config.probabilities.wildcard + config.probabilities.single) {
      const singleRand = Math.random();
      const singleOptions = [];
      
      // Build available single attribute options
      if (!isCircuitGrading && selectedColors.length > 0) {
        singleOptions.push('color');
      }
      singleOptions.push('grade');
      if (selectedHoldTypes.length > 0) {
        singleOptions.push('hold');
      }
      if (selectedWallTypes.length > 0) {
        singleOptions.push('wall');
      }
      
      if (singleOptions.length === 0) break;
      
      const selectedSingle = singleOptions[Math.floor(Math.random() * singleOptions.length)];
      attributes = [selectedSingle];
      
      if (selectedSingle === 'color' && !isCircuitGrading) {
        const randomColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
        const activityType = climbingType === 'bouldering' ? 'Boulder' : 'Route';
        cellText = `${randomColor} ${activityType}`;
        squareType = 'single';
      } else if (selectedSingle === 'grade') {
        cellText = randomGrade;
        squareType = 'single';
      } else if (selectedSingle === 'hold' && selectedHoldTypes.length > 0) {
        const holdType = getWeightedHoldType(selectedHoldTypes, gradePosition);
        cellText = `${holdType} Holds`;
        squareType = 'single';
      } else if (selectedSingle === 'wall' && selectedWallTypes.length > 0) {
        const wallType = selectedWallTypes[Math.floor(Math.random() * selectedWallTypes.length)];
        cellText = `${wallType} Wall`;
        squareType = 'single';
      }
    }
    
    // Two attribute squares
    else if (isCircuitGrading) {
      // Circuit mode: 40% two attribute (Grade+Hold, Grade+Wall, Hold+Wall)
      const twoAttrOptions = [];
      
      if (selectedHoldTypes.length > 0) {
        twoAttrOptions.push(['grade', 'hold']);
      }
      if (selectedWallTypes.length > 0) {
        twoAttrOptions.push(['grade', 'wall']);
      }
      if (selectedHoldTypes.length > 0 && selectedWallTypes.length > 0) {
        twoAttrOptions.push(['hold', 'wall']);
      }
      
      if (twoAttrOptions.length === 0) break;
      
      const selectedCombo = twoAttrOptions[Math.floor(Math.random() * twoAttrOptions.length)];
      attributes = selectedCombo;
      const [attr1, attr2] = selectedCombo;
      
      const holdType = getWeightedHoldType(selectedHoldTypes, gradePosition);
      const wallType = selectedWallTypes.length > 0 ? selectedWallTypes[Math.floor(Math.random() * selectedWallTypes.length)] : null;
      
      // Check for invalid combinations
      if (attributes.includes('grade') && attributes.includes('hold')) {
        if (gradePosition === 'top' && holdType === 'Jug') {
          continue; // Regenerate - invalid combination
        }
        if (gradePosition === 'beginner' && (holdType === 'Crimp' || holdType === 'Pocket')) {
          continue; // Regenerate - invalid combination
        }
      }
      
      if (attributes.includes('wall') && attributes.includes('hold')) {
        if (wallType === 'Slab' && (holdType === 'Pocket' || holdType === 'Pinch')) {
          continue; // Regenerate - invalid combination
        }
      }
      
      // Format the combination
      if (attr1 === 'grade' && attr2 === 'hold') {
        const phrasings = [`${randomGrade} with ${holdType}s`, `${randomGrade} using ${holdType}s`];
        cellText = phrasings[Math.floor(Math.random() * phrasings.length)];
        squareType = 'twoAttribute';
      } else if (attr1 === 'grade' && attr2 === 'wall') {
        cellText = `${randomGrade} on ${wallType} Wall`;
        squareType = 'twoAttribute';
      } else if (attr1 === 'hold' && attr2 === 'wall') {
        cellText = `${holdType}s on ${wallType} Wall`;
        squareType = 'twoAttribute';
      } else if (attr1 === 'wall' && attr2 === 'hold') {
        cellText = `${holdType} on ${wallType} Wall`;
        squareType = 'twoAttribute';
      }
    } else {
      // Non-circuit mode: Two attribute squares A (Color+Grade, Color+Wall)
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
          cellText = `${randomColor} ${activityType} on ${wallType}`;
          squareType = 'twoA';
        }
      }
      // Non-circuit mode: Two attribute squares B (Grade+Hold, Grade+Wall, Color+Hold)
      else if (rand < config.probabilities.wildcard + config.probabilities.single + config.probabilities.twoA + config.probabilities.twoB) {
      const twoBOptions = [];
      
      if (selectedHoldTypes.length > 0) {
        twoBOptions.push(['grade', 'hold']);
        if (!isCircuitGrading && selectedColors.length > 0) {
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
      
      // Check for invalid combinations
      if (attributes.includes('grade') && attributes.includes('hold')) {
        // Check: High grade + Jugs, Beginner + Crimps/Pockets
        if (gradePosition === 'top' && holdType === 'Jug') {
          continue; // Regenerate - invalid combination
        }
        if (gradePosition === 'beginner' && (holdType === 'Crimp' || holdType === 'Pocket')) {
          continue; // Regenerate - invalid combination
        }
      }
      
      if (attributes.includes('wall') && attributes.includes('hold')) {
        // Check: Slab + Pockets/Pinches
        if (wallType === 'Slab' && (holdType === 'Pocket' || holdType === 'Pinch')) {
          continue; // Regenerate - invalid combination
        }
      }
      
      // Format the combination
      if (attr1 === 'grade' && attr2 === 'hold') {
        const phrasings = [`${randomGrade} with ${holdType}s`];
        cellText = phrasings[Math.floor(Math.random() * phrasings.length)];
        squareType = 'twoB';
      } else if (attr1 === 'grade' && attr2 === 'wall') {
        cellText = `${randomGrade} on ${wallType} Wall`;
        squareType = 'twoB';
      } else if (attr1 === 'color' && attr2 === 'hold') {
        cellText = `${holdType} Holds on ${randomColor} Problem`;
        squareType = 'twoB';
      } else if (attr1 === 'hold' && attr2 === 'grade') {
        const phrasings = [`${holdType} on ${randomGrade}`, `${randomGrade} using ${holdType}`];
        cellText = phrasings[Math.floor(Math.random() * phrasings.length)];
        squareType = 'twoB';
      } else if (attr1 === 'wall' && attr2 === 'grade') {
        cellText = `${randomGrade} on ${wallType}`;
        squareType = 'twoB';
      } else if (attr1 === 'color' && attr2 === 'hold') {
        cellText = `${holdType} ${randomColor} Problem`;
        squareType = 'twoB';
      }
      }
    }
    
    // Modifier squares (add modifier to single or two-attribute squares)
    // This is handled after we have a valid square
    
    if (cellText) {
      // Apply modifier to single or two-attribute squares
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
  
  return cellText || 'Climb something!'; // Fallback
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
      // Use new probability-based generation system
      cell.textContent = generateBingoCell(
        gradeRange,
        selectedColors,
        selectedHoldTypes,
        selectedWallTypes,
        isCircuitGrading,
        climbingType
      );
    }
    
    // OLD GENERATION LOGIC - REMOVED
    /* if (isCircuitGrading) {
        const rand = Math.random();
        
        if (rand < 0.20) {
          cell.textContent = randomFeature;
        } else if (rand < 0.40) {
          cell.textContent = randomGrade;
        } else if (rand < 0.70) {
          // Use appropriate preposition based on feature type
          if (isHoldType(randomFeature)) {
            const holdPhrasings = [
              `${randomGrade} with ${randomFeature}`,
              `${randomGrade} using ${randomFeature}`
            ];
            cell.textContent = holdPhrasings[Math.floor(Math.random() * holdPhrasings.length)];
          } else if (isWallType(randomFeature)) {
            cell.textContent = `${randomGrade} on ${randomFeature}`;
          }
        } else if (rand < 0.85) {
          // More varied phrasings based on feature type
          if (isHoldType(randomFeature)) {
            const holdPhrasings = [
              `${randomFeature} on ${randomGrade}`,
              `${randomGrade} using ${randomFeature}`,
              `${randomFeature} problem`
            ];
            cell.textContent = holdPhrasings[Math.floor(Math.random() * holdPhrasings.length)];
          } else if (isWallType(randomFeature)) {
            const wallPhrasings = [
              `${randomGrade} on ${randomFeature}`,
              `${randomFeature} problem`
            ];
            cell.textContent = wallPhrasings[Math.floor(Math.random() * wallPhrasings.length)];
          }
        } else {
          const modifiers = ['First Attempt', 'Silent feet'];
          const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
          cell.textContent = `${modifier}: ${randomGrade}`;
        }
      }
      
      
      
      
       else {
        const rand = Math.random();
        
        if (rand < 0.15) {
          cell.textContent = randomGrade;
        } else if (rand < 0.25) {
          cell.textContent = randomFeature;
        } else if (rand < 0.35) {
          // Color only: show "color route" or "color bouldering"
          const activityType = climbingType === 'bouldering' ? 'Boulder' : 'Route';
          cell.textContent = `${randomColor} ${activityType}`;
        } else if (rand < 0.60) {
          cell.textContent = `${randomColor} ${randomGrade}`;
        } else if (rand < 0.80) {
          // Use appropriate preposition based on feature type
          if (isHoldType(randomFeature)) {
            const holdPhrasings = [
              `${randomGrade} with ${randomFeature}`,
              `${randomGrade} using ${randomFeature}`
            ];
            cell.textContent = holdPhrasings[Math.floor(Math.random() * holdPhrasings.length)];
          } else if (isWallType(randomFeature)) {
            cell.textContent = `${randomGrade} on ${randomFeature}`;
          }
        } else if (rand < 0.90) {
          // More varied phrasings with color, based on feature type
          if (isHoldType(randomFeature)) {
            const holdPhrasings = [
              `${randomColor} ${randomGrade} using ${randomFeature}`,
              `${randomFeature} ${randomColor} Problem`
            ];
            cell.textContent = holdPhrasings[Math.floor(Math.random() * holdPhrasings.length)];
          } else if (isWallType(randomFeature)) {
            cell.textContent = `${randomFeature} on ${randomColor} ${randomGrade}`;
          }
        } else {
          const modifiers = ['First Attempt', 'Silent feet'];
          const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
          cell.textContent = `${modifier}: ${randomColor} ${randomGrade}`;
        }
      }
    } */
    
    bingoGrid.appendChild(cell);
  }












  
  
  console.log('BINGO card generated successfully!');
  saveBingoCard(); // Save the newly generated card
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
  
  if (!saved) return false; // No saved card
  
  try {
    const cardData = JSON.parse(saved);
    
    // Only load if we have exactly 25 cells
    if (!cardData || cardData.length !== 25) return false;
    
    // Clear the grid
    bingoGrid.innerHTML = '';
    
    // Recreate all cells
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
    return true; // Successfully loaded
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
function resetPreferences() {
  if (confirm('Are you sure you want to reset all selections to defaults?')) {
    localStorage.removeItem('climbingBingoPreferences');
    localStorage.removeItem('climbingBingoCard'); // Also clear saved card
    
    climbingTypeSelect.value = 'routeClimbing';
    updateGradeSystemOptions();
    gradeSystemSelect.value = 'yds';
    circuitGradingSelect.value = 'no';
    
    // Unselect all feature buttons
    document.querySelectorAll('.feature-option').forEach(option => {
      const checkbox = option.querySelector('input[type="checkbox"]');
      checkbox.checked = false;
      option.classList.remove('selected');
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