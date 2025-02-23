// Form data management
let formData = {
  prefix: '',
  category: '',
  taskAbout: [],
  taskGoal: [],
  taskWhy: [],
  taskHow: [],
  acceptanceCriteria: [],
  dependencies: [],
  pathLocation: '',
  priority: '',
  deadline: ''
};

// Global variables for version management
let shortDescVersions = [];
let fullDescVersions = [];
let currentShortDescIndex = 0;
let currentFullDescIndex = 0;

// Add new input field
function addInputField(fieldName) {
  const container = document.getElementById(`${fieldName}-container`);
  const isTextarea = ['taskWhy', 'taskHow', 'acceptanceCriteria', 'dependencies'].includes(fieldName);
  
  const inputGroup = document.createElement('div');
  inputGroup.className = 'input-group';
  
  const input = document.createElement(isTextarea ? 'textarea' : 'input');
  input.type = 'text';
  input.className = fieldName;
  input.name = `${fieldName}[]`;
  if (fieldName === 'taskAbout') {
    input.required = true;
  }
  input.placeholder = container.querySelector(isTextarea ? 'textarea' : 'input').placeholder;
  if (isTextarea) {
    input.rows = 3;
  }
  
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove';
  removeBtn.textContent = '×';
  removeBtn.onclick = function() { removeInputField(this); };
  
  inputGroup.appendChild(input);
  inputGroup.appendChild(removeBtn);
  container.appendChild(inputGroup);
  
  input.addEventListener('input', saveFormData);
}

// Remove input field
function removeInputField(button) {
  const inputGroup = button.parentElement;
  const container = inputGroup.parentElement;
  const isTaskAbout = container.id === 'taskAbout-container';
  
  // Don't remove if it's the last taskAbout field
  if (isTaskAbout && container.children.length <= 1) {
    showError('Cannot remove the last task description field as it is required.');
    return;
  }
  
  if (container.children.length > 1) {
    inputGroup.remove();
    saveFormData();
  }
}

// Load saved form data from localStorage
function loadSavedData() {
  const saved = localStorage.getItem('taskFormData');
  if (saved) {
    formData = JSON.parse(saved);
    
    // Handle single input fields
    ['prefix', 'category', 'pathLocation', 'priority', 'deadline'].forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        element.value = formData[key];
      }
    });
    
    // Handle multiple input fields
    ['taskAbout', 'taskGoal', 'taskWhy', 'taskHow', 'acceptanceCriteria', 'dependencies'].forEach(key => {
      const container = document.getElementById(`${key}-container`);
      if (container && Array.isArray(formData[key])) {
        // Only clear container if we have saved data to restore
        if (formData[key].length > 0) {
          container.innerHTML = '';
          
          formData[key].forEach(value => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            const input = document.createElement(key.includes('Why') || key.includes('How') || key === 'acceptanceCriteria' || key === 'dependencies' ? 'textarea' : 'input');
            input.type = 'text';
            input.className = key;
            input.name = `${key}[]`;
            input.value = value;
            if (key === 'taskAbout') {
              input.required = true;
              input.placeholder = "Describe the task in one sentence";
            }
            if (input.tagName === 'TEXTAREA') {
              input.rows = 3;
            }
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn-remove';
            removeBtn.textContent = '×';
            removeBtn.onclick = function() { removeInputField(this); };
            
            inputGroup.appendChild(input);
            inputGroup.appendChild(removeBtn);
            container.appendChild(inputGroup);
          });
        }
      }
    });
  }
  
  // Ensure there's at least one taskAbout field
  const taskAboutContainer = document.getElementById('taskAbout-container');
  if (!taskAboutContainer.children.length) {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'taskAbout';
    input.name = 'taskAbout[]';
    input.required = true;
    input.placeholder = "Describe the task in one sentence";
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove';
    removeBtn.textContent = '×';
    removeBtn.onclick = function() { removeInputField(this); };
    
    inputGroup.appendChild(input);
    inputGroup.appendChild(removeBtn);
    taskAboutContainer.appendChild(inputGroup);
  }
}

// Save form data to localStorage
function saveFormData() {
  // Handle single input fields
  ['prefix', 'category', 'pathLocation', 'priority', 'deadline'].forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      formData[key] = element.value;
    }
  });
  
  // Handle multiple input fields
  ['taskAbout', 'taskGoal', 'taskWhy', 'taskHow', 'acceptanceCriteria', 'dependencies'].forEach(key => {
    const inputs = document.getElementsByClassName(key);
    formData[key] = Array.from(inputs)
      .map(input => input.value)
      .filter(value => value.trim() !== '');
  });
  
  localStorage.setItem('taskFormData', JSON.stringify(formData));
}

// Format output text professionally
function formatOutput(data) {
  let shortDesc = `[${data.prefix}]: ${data.category} - ${data.taskAbout[0]}`;
  
  let fullDesc = `Task Description\n================\n\n`;
  fullDesc += `Overview\n--------\n${data.taskAbout.map(item => `• ${item}`).join('\n')}\n\n`;
  
  if (data.taskGoal.length > 0) {
    fullDesc += `Objectives\n----------\n${data.taskGoal.map(item => `• ${item}`).join('\n')}\n\n`;
  }
  
  if (data.taskWhy.length > 0) {
    fullDesc += `Business Value\n--------------\n${data.taskWhy.map(item => `• ${item}`).join('\n')}\n\n`;
  }
  
  if (data.taskHow.length > 0) {
    fullDesc += `Implementation Details\n---------------------\n${data.taskHow.map(item => `• ${item}`).join('\n')}\n\n`;
  }
  
  if (data.acceptanceCriteria.length > 0) {
    fullDesc += `Acceptance Criteria\n------------------\n${data.acceptanceCriteria.map(item => `• ${item}`).join('\n')}\n\n`;
  }
  
  if (data.dependencies.length > 0) {
    fullDesc += `Dependencies\n------------\n${data.dependencies.map(item => `• ${item}`).join('\n')}\n\n`;
  }
  
  if (data.pathLocation) fullDesc += `Location: ${data.pathLocation}\n`;
  if (data.priority) fullDesc += `Priority: ${data.priority}\n`;
  if (data.deadline) fullDesc += `Deadline: ${data.deadline}\n`;
  
  return { shortDesc, fullDesc: fullDesc.trim() };
}

// Format data for Gemini API
function formatPromptForGemini() {
  let prompt = `Please improve the following task description professionally. Make it more clear, concise, and impactful while maintaining the core information:\n\n`;
  prompt += `Task Type: ${formData.prefix} - ${formData.category}\n\n`;
  
  if (formData.taskAbout.length > 0) {
    prompt += `Task Overview:\n${formData.taskAbout.map(item => `- ${item}`).join('\n')}\n\n`;
  }
  
  if (formData.taskGoal.length > 0) {
    prompt += `Goals:\n${formData.taskGoal.map(item => `- ${item}`).join('\n')}\n\n`;
  }
  
  if (formData.taskWhy.length > 0) {
    prompt += `Business Value:\n${formData.taskWhy.map(item => `- ${item}`).join('\n')}\n\n`;
  }
  
  if (formData.taskHow.length > 0) {
    prompt += `Implementation Approach:\n${formData.taskHow.map(item => `- ${item}`).join('\n')}\n\n`;
  }
  
  if (formData.acceptanceCriteria.length > 0) {
    prompt += `Acceptance Criteria:\n${formData.acceptanceCriteria.map(item => `- ${item}`).join('\n')}\n\n`;
  }
  
  if (formData.dependencies.length > 0) {
    prompt += `Dependencies:\n${formData.dependencies.map(item => `- ${item}`).join('\n')}\n\n`;
  }
  
  prompt += `Please provide two responses:\n1. A short, one-line description (max 100 characters)\n2. A detailed description with proper formatting and sections`;
  
  return prompt;
}

// Call Gemini API
async function callGeminiAPI(prompt) {
  const GEMINI_API_KEY = 'AIzaSyCL9qTuUgzaYN7hZXWvrbRsjxDoogPTwrQ';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

// Improve with AI
async function improveWithAI() {
  const improveButtons = document.querySelectorAll('.btn-icon');
  improveButtons.forEach(btn => {
    btn.classList.add('loading');
    btn.disabled = true;
  });
  
  try {
    const prompt = formatPromptForGemini();
    const aiResponse = await callGeminiAPI(prompt);
    
    // Parse AI response
    const [shortDesc, ...fullDescParts] = aiResponse.split('\n\n');
    const fullDesc = fullDescParts.join('\n\n');
    
    // Add new versions
    addNewVersion('short', shortDesc);
    addNewVersion('full', fullDesc);
  } catch (error) {
    showError('Failed to get AI improvements. Please try again.');
  } finally {
    improveButtons.forEach(btn => {
      btn.classList.remove('loading');
      btn.disabled = false;
    });
  }
}

// Add new version
function addNewVersion(type, content) {
  const versions = type === 'short' ? shortDescVersions : fullDescVersions;
  const currentIndex = type === 'short' ? currentShortDescIndex : currentFullDescIndex;
  
  versions.push(content);
  const newIndex = versions.length - 1;
  
  // Update tabs
  const tabsContainer = document.getElementById(`${type}DescTabs`);
  const newTab = document.createElement('button');
  newTab.className = 'tab';
  newTab.textContent = `Version ${newIndex + 1}`;
  newTab.dataset.index = newIndex;
  newTab.onclick = () => switchTab(type, newIndex);
  tabsContainer.appendChild(newTab);
  
  // Show close button if more than one version
  const closeBtn = tabsContainer.nextElementSibling;
  if (versions.length > 1) {
    closeBtn.classList.remove('hidden');
  }
  
  // Switch to new version
  switchTab(type, newIndex);
}

// Switch tab
function switchTab(type, index) {
  const versions = type === 'short' ? shortDescVersions : fullDescVersions;
  if (index >= versions.length) return;
  
  // Update current index
  if (type === 'short') {
    currentShortDescIndex = index;
  } else {
    currentFullDescIndex = index;
  }
  
  // Update tab active state
  const tabs = document.querySelectorAll(`#${type}DescTabs .tab`);
  tabs.forEach(tab => tab.classList.remove('active'));
  tabs[index].classList.add('active');
  
  // Update content
  const output = document.getElementById(`${type}Output`);
  output.textContent = versions[index];
  
  // Update close button
  const closeBtn = document.querySelector(`#${type}DescTabs + .btn-close-tab`);
  closeBtn.dataset.index = index;
}

// Close tab
function closeTab(type, index) {
  const versions = type === 'short' ? shortDescVersions : fullDescVersions;
  if (versions.length <= 1) return;
  
  // Remove version
  versions.splice(index, 1);
  
  // Update tabs
  const tabsContainer = document.getElementById(`${type}DescTabs`);
  tabsContainer.innerHTML = versions.map((_, i) => `
    <button class="tab${i === 0 ? ' active' : ''}" data-index="${i}" onclick="switchTab('${type}', ${i})">
      Version ${i + 1}
    </button>
  `).join('');
  
  // Hide close button if only one version
  const closeBtn = tabsContainer.nextElementSibling;
  if (versions.length <= 1) {
    closeBtn.classList.add('hidden');
  }
  
  // Switch to first version
  switchTab(type, 0);
}

// Show error message
function showError(message) {
  const errorElement = document.getElementById('error');
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  setTimeout(() => {
    errorElement.classList.add('hidden');
  }, 5000);
}

// Handle form submission
document.getElementById('taskForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const errorElement = document.getElementById('error');
  const outputContainer = document.getElementById('output');
  
  // Update form data before validation
  saveFormData();
  
  // Validate required fields
  if (!formData.prefix || !formData.category || !formData.taskAbout.length) {
    errorElement.textContent = 'Please fill in all required fields (Prefix, Category, and What is the task about?)';
    errorElement.classList.remove('hidden');
    return;
  }
  
  errorElement.classList.add('hidden');
  
  // Generate output
  const { shortDesc, fullDesc } = formatOutput(formData);
  
  // Reset versions if needed
  if (shortDescVersions.length === 0) {
    // Initialize first versions
    shortDescVersions = [shortDesc];
    fullDescVersions = [fullDesc];
    
    // Update the output displays
    const shortOutput = document.getElementById('shortOutput');
    const fullOutput = document.getElementById('fullOutput');
    
    if (shortOutput && fullOutput) {
      shortOutput.textContent = shortDesc;
      fullOutput.textContent = fullDesc;
    }
  } else {
    // Add new versions
    addNewVersion('short', shortDesc);
    addNewVersion('full', fullDesc);
  }
  
  // Show output container
  outputContainer.classList.remove('hidden');
  // Use requestAnimationFrame for smoother animation
  requestAnimationFrame(() => {
    outputContainer.classList.add('visible');
  });
});

// Handle form reset
document.getElementById('resetBtn').addEventListener('click', function() {
  const form = document.getElementById('taskForm');
  const errorElement = document.getElementById('error');
  const outputContainer = document.getElementById('output');
  
  // Reset form and formData
  form.reset();
  formData = {
    prefix: '',
    category: '',
    taskAbout: [],
    taskGoal: [],
    taskWhy: [],
    taskHow: [],
    acceptanceCriteria: [],
    dependencies: [],
    pathLocation: '',
    priority: '',
    deadline: ''
  };
  
  // Reset multiple input fields to single empty field
  ['taskAbout', 'taskGoal', 'taskWhy', 'taskHow', 'acceptanceCriteria', 'dependencies'].forEach(key => {
    const container = document.getElementById(`${key}-container`);
    if (container) {
      container.innerHTML = '';
      addInputField(key);
    }
  });
  
  // Clear localStorage
  localStorage.removeItem('taskFormData');
  
  // Hide error and output
  errorElement.classList.add('hidden');
  outputContainer.classList.remove('visible');
  setTimeout(() => outputContainer.classList.add('hidden'), 300);
});

// Copy to clipboard function
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.textContent;
  
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy text:', err);
  });
}

// Export JSON function
function exportJSON() {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(formData, null, 2))}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', 'task_details.json');
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Add input event listeners to all form fields
document.querySelectorAll('input, select, textarea').forEach(element => {
  element.addEventListener('input', saveFormData);
});

// Load saved data when the page loads
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  
  // Ensure at least one input field exists for each multiple input field
  ['taskAbout', 'taskGoal', 'taskWhy', 'taskHow', 'acceptanceCriteria', 'dependencies'].forEach(key => {
    const container = document.getElementById(`${key}-container`);
    if (container && container.children.length === 0) {
      addInputField(key);
    }
  });
});