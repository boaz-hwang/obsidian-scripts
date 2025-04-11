# Obsidian Template Project

This project contains templates and automation scripts for Obsidian.

## Usage Guide

Watch the tutorial video: https://youtu.be/S68BMI3vCoY(Korean)

### Creating Daily Notes

1. Create a new note in Obsidian
2. Select `Daily notes.md` as the template
3. Habit checklist and schedule will be automatically added

## Project Structure

```
.
├── Daily notes.md      # Daily note template
├── TOC.md             # Table of contents auto-generator
├── scripts/           # External scripts
│   ├── credentials.json
│   └── external_schedule_fetcher.js
└── user_functions/    # Obsidian user functions
    └── today_schedule.js
```

## Key Features

### 1. Daily Note Template

- Habit tracking (Rowing machine, Shema time, Fruit juice, Video recording, Development)
- Automatic todo list generation
- Tag system integration

### 2. Automatic Table of Contents

- Automatically extracts headers to generate table of contents
- Maintains hierarchical structure
- Automatic link generation

### 3. External Schedule Integration

- Automatically fetches and adds external schedules to daily notes
- Node.js based script implementation

## Setup Instructions

1. Install Obsidian
2. Install Templater plugin
3. Copy this template to your Obsidian vault
4. Install required dependencies in the `scripts` directory:
   ```bash
   cd scripts
   npm install
   ```
5. Configure authentication information in `credentials.json`

## License

This project is distributed under the MIT License.
