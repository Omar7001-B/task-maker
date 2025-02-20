# Task Description Generator

A professional web application that helps generate structured and well-formatted task descriptions for development projects. Built with vanilla JavaScript and modern CSS, this tool helps standardize task documentation across teams.

## Features

### 1. Basic Information
- **Prefix Selection**: Choose from multiple project areas (FE, BE, API, DB, UI, UX, INFRA)
- **Category Selection**: Categorize tasks (Feature, Bug, Refactor, Research, Test)

### 2. Multi-Input Fields
- Add multiple entries for each section using the "+" button
- Remove entries with the "×" button
- Required fields are marked with "*"

### 3. Task Description Sections
- **Short Description**
  - Task Overview (Required)
  - Task Goals
- **Long Description**
  - Business Value/Purpose
  - Implementation Approach
  - Acceptance Criteria
  - Dependencies/Prerequisites
- **Additional Details**
  - Path/Location
  - Priority Level
  - Deadline

### 4. Smart Features
- **AI Improvements**: Integration with Gemini API to enhance task descriptions
- **Version Management**: Track multiple versions of generated descriptions
- **Tab Interface**: Switch between different versions of descriptions
- **Local Storage**: Automatically saves form data
- **Export Options**:
  - Copy to clipboard functionality
  - Export as JSON
  - Multiple output formats

### 5. Output Formats
- Short Description: Concise one-line summary
- Full Description: Detailed markdown-style formatted output with sections

## Usage

1. Fill in the required fields:
   - Select a Prefix
   - Choose a Category
   - Add at least one Task Description

2. Add additional information as needed:
   - Click "+" to add multiple entries in any section
   - Use "×" to remove unwanted entries

3. Generate the description:
   - Click "Generate" to create the task description
   - Use "Improve with AI" to get AI-enhanced versions
   - Switch between versions using the tabs
   - Copy or export the final description

4. Reset or Modify:
   - Use the "Reset" button to clear all fields
   - Edit and regenerate as needed

## Technical Details

### Local Storage
- Form data is automatically saved
- Persists between browser sessions
- Restored on page reload

### AI Integration
- Uses Gemini API for improvements
- Generates both short and detailed descriptions
- Maintains professional formatting

### Validation
- Required fields must be filled
- Cannot remove last entry in required fields
- Error messages for invalid submissions

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for all screen sizes
- Custom scrollbar styling

## Development

### File Structure
- `index.html`: Main application structure
- `styles.css`: Modern dark theme styling
- `script.js`: Application logic and functionality

### Dependencies
- Google Fonts (JetBrains Mono)
- No other external dependencies

## Credits
Created by Omar Abbas

## License
[Add your license information here]