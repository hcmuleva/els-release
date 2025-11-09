# Teacher Question and Exam Management System

## Overview
This React application provides a comprehensive Question Bank and Exam Management system for teachers. It integrates with Strapi v5 backend for seamless content management.

## Features Implemented

### 1. Question Bank Management (`/teacher/questions`)
- **View All Questions**: Grid-based display with responsive cards
- **Advanced Filtering**:
  - Filter by Course
  - Filter by Subject
  - Filter by Question Type (multiple-choice, true-false, short-answer, essay, fill-in-blank)
  - Filter by Difficulty Level (easy, medium, hard, expert)
- **CRUD Operations**:
  - Create new questions
  - Edit existing questions
  - Delete questions (with confirmation)
  - View question details
- **Visual Indicators**:
  - Color-coded difficulty badges (Easy: Green, Medium: Orange, Hard: Red, Expert: Purple)
  - Question type badges
  - Points display

### 2. Question Creation/Editing (`/teacher/questions/create`, `/teacher/questions/edit/:id`)
- **Flexible Question Types**:
  - **Multiple Choice**: Add/remove options, select correct answer with radio buttons
  - **True/False**: Preset 2 options
  - **Short Answer**: Text input for correct answer
  - **Essay**: Rich text support
  - **Fill in the Blank**: Template with blanks
- **Rich Features**:
  - Question text editor (textarea)
  - Course and Subject association
  - Difficulty level selection
  - Points allocation
  - Time limit (optional)
  - Explanation field (shown to students after answering)
  - Tags system (add/remove tags)
- **Form Validation**:
  - Required fields validation
  - Empty options check for multiple choice
  - Correct answer selection validation

### 3. Exam Management (`/teacher/exams`)
- **Exam List View**: Card-based grid layout
- **Filtering**:
  - By Course
  - By Subject
  - By Exam Type (quiz, midterm, final, practice, assignment)
- **Status Indicators**:
  - Upcoming (blue)
  - Active (green)
  - Completed (gray)
  - Scheduled (orange)
- **Exam Statistics**:
  - Question count
  - Duration
  - Total points
  - Passing score percentage
- **Date Management**: Display start and end dates
- **CRUD Operations**:
  - Create new exams
  - Edit existing exams
  - Delete exams (with confirmation)
  - View exam details

### 4. Exam Creation/Editing (`/teacher/exams/create`, `/teacher/exams/edit/:id`)
- **Multi-Step Wizard**:
  
  **Step 1: Basic Details**
  - Exam title (required)
  - Description (rich text)
  - Exam type selection
  - Course and Subject association
  - Instructions for students

  **Step 2: Select Questions**
  - Browse question bank with filters
  - Multi-select questions with checkboxes
  - Visual question preview (text, difficulty, type, points)
  - Real-time selection count
  - Advanced filtering by course, subject, type, difficulty

  **Step 3: Settings & Review**
  - Duration (minutes)
  - Total points
  - Passing score (percentage)
  - Maximum attempts
  - Start/End date and time
  - Options:
    - Shuffle questions
    - Show results to students
    - Show correct answers after submission
  - Review summary before submission

- **Validation**:
  - Required fields
  - At least one question must be selected
  - End date must be after start date
  - Numeric validations for points, duration, etc.

## API Integration

### Services Created

#### `questionService.js`
```javascript
- getAllQuestions(filters) // Get all questions with optional filters
- getQuestion(id) // Get single question
- createQuestion(questionData) // Create new question
- updateQuestion(id, questionData) // Update existing question
- deleteQuestion(id) // Delete question
- getQuestionsBySubject(subjectId) // Get questions by subject
- getQuestionsByCourse(courseId) // Get questions by course
```

#### `examService.js`
```javascript
- getAllExams(filters) // Get all exams with optional filters
- getExam(id) // Get single exam with questions
- createExam(examData) // Create new exam
- updateExam(id, examData) // Update existing exam
- deleteExam(id) // Delete exam
- getExamsByCourse(courseId) // Get exams by course
- getExamsBySubject(subjectId) // Get exams by subject
- getExamAttempts(examId) // Get all attempts for an exam
```

## Routes

### Question Management
- `/teacher/questions` - Question Bank list page
- `/teacher/questions/create` - Create new question
- `/teacher/questions/edit/:id` - Edit existing question

### Exam Management
- `/teacher/exams` - Exam list page
- `/teacher/exams/create` - Create new exam (3-step wizard)
- `/teacher/exams/edit/:id` - Edit existing exam

## Strapi v5 Content Types

### Question
- questionText (richtext, required)
- questionType (enum: multiple-choice, true-false, short-answer, essay, fill-in-blank, matching)
- difficultyLevel (enum: easy, medium, hard, expert)
- points (integer, min: 1)
- options (json - for multiple choice/true-false)
- correctAnswer (text)
- explanation (richtext)
- image (media)
- timeLimit (integer - seconds)
- tags (json array)
- Relations:
  - subject (manyToOne)
  - course (manyToOne)
  - exams (manyToMany)
  - createdBy (manyToOne user)

### Exam
- title (string, required)
- description (richtext)
- examType (enum: quiz, midterm, final, practice, assignment)
- duration (integer - minutes, required)
- totalPoints (integer, default: 100)
- passingScore (integer - percentage, default: 60)
- startDate (datetime)
- endDate (datetime)
- maxAttempts (integer, default: 1)
- shuffleQuestions (boolean)
- showResults (boolean)
- showCorrectAnswers (boolean)
- instructions (richtext)
- Relations:
  - course (manyToOne)
  - subject (manyToOne)
  - questions (manyToMany)
  - examAttempts (oneToMany)
  - createdBy (manyToOne user)

### ExamAttempt
- attemptNumber (integer, default: 1)
- startedAt (datetime)
- submittedAt (datetime)
- status (enum: in-progress, submitted, graded, expired)
- score (decimal)
- percentage (decimal)
- passed (boolean)
- timeTaken (integer - seconds)
- answers (json)
- feedback (richtext)
- Relations:
  - student (manyToOne user)
  - exam (manyToOne)

## Styling

All components have responsive CSS with:
- Mobile-first design
- Breakpoints at 768px
- Grid-based layouts
- Color-coded difficulty levels
- Hover effects and transitions
- Card-based UI
- Professional color scheme

## Usage

### For Teachers

1. **Creating Questions**:
   - Navigate to `/teacher/questions`
   - Click "Create New Question"
   - Fill in question details
   - Select question type (affects form fields)
   - Add options for multiple choice
   - Set difficulty and points
   - Add optional tags and explanation
   - Submit

2. **Creating Exams**:
   - Navigate to `/teacher/exams`
   - Click "Create New Exam"
   - Step 1: Enter basic details (title, type, course, subject)
   - Step 2: Browse and select questions from bank
   - Step 3: Configure settings (duration, points, dates, options)
   - Review summary and submit

3. **Managing Content**:
   - Use filters to find specific questions/exams
   - Edit existing content using the Edit button
   - Delete with confirmation dialog
   - View details for quick preview

## Development Notes

### Dependencies
- React 19.2.0
- react-router-dom 6.30.1
- axios 1.12.2
- Strapi v5.30.1

### Backend Configuration
- Strapi server: `http://localhost:1337`
- Authentication: Bearer token via AuthContext
- API format: Strapi v4/v5 standard (`data.attributes` structure)

### Future Enhancements (Recommended)
1. Question preview modal
2. Exam preview functionality
3. Bulk import/export questions
4. Question bank templates
5. Exam analytics dashboard
6. Student attempt tracking
7. Auto-grading for objective questions
8. Rich text editor (e.g., TinyMCE, CKEditor)
9. Image upload for questions
10. Question reordering in exams (drag-and-drop)
11. Exam duplication
12. Question statistics (usage, difficulty analysis)

## Testing

To test the implementation:

1. Start Strapi server: `cd lmsserver && npm run develop`
2. Start React client: `cd react_client1 && npm start`
3. Login with teacher credentials
4. Navigate to `/teacher/questions` to test question management
5. Navigate to `/teacher/exams` to test exam management

## Known Considerations

1. **Authentication**: All routes protected with token check
2. **Permissions**: Ensure teacher role has proper permissions in Strapi
3. **Relations**: Questions can belong to multiple exams (many-to-many)
4. **State Management**: Uses React hooks (useState, useEffect)
5. **Error Handling**: Basic error handling with alerts (can be enhanced with toast notifications)
6. **Validation**: Client-side validation implemented (server-side validation also required)

## Support

For issues or questions:
- Check Strapi admin panel for content type permissions
- Verify API endpoints in browser network tab
- Check console for error messages
- Ensure JWT token is valid
