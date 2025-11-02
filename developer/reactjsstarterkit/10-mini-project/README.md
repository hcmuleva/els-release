# 🎯 Iteration 10: Mini Project - Notes App

## 🎊 Congratulations!
You've made it to the final iteration! Now it's time to combine everything you've learned into a complete application.

## 🎯 Project Goal
Build a **Notes Application** with full CRUD functionality (Create, Read, Update, Delete) and local storage persistence.

## ✨ Features to Implement

### Must Have (MVP)
- ✅ Add new notes
- ✅ Display all notes
- ✅ Delete notes
- ✅ Save notes to localStorage (persist on page reload)
- ✅ Responsive design

### Nice to Have (Stretch Goals)
- 🎨 Edit existing notes
- 🏷️ Add categories/tags
- 🔍 Search notes
- 🎨 Color-code notes
- 📅 Show creation date
- ⭐ Mark notes as favorite
- 📊 Notes counter
- 🌓 Dark mode toggle

## 📁 Project Structure

```
notes-app/
├── src/
│   ├── components/
│   │   ├── NoteCard.jsx
│   │   ├── NoteForm.jsx
│   │   ├── NoteList.jsx
│   │   └── Header.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
└── package.json
```

## 💻 Complete Implementation

### 1. App.jsx - Main Component

```javascript
// src/App.jsx
import { useState, useEffect } from 'react';
import Header from './components/Header';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);
  
  // Add new note
  const addNote = (title, content, color) => {
    const newNote = {
      id: Date.now(),
      title,
      content,
      color,
      createdAt: new Date().toISOString(),
      isFavorite: false
    };
    setNotes([newNote, ...notes]);
  };
  
  // Delete note
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  // Toggle favorite
  const toggleFavorite = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };
  
  // Edit note
  const editNote = (id, updatedTitle, updatedContent) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, title: updatedTitle, content: updatedContent }
        : note
    ));
  };
  
  // Filter notes by search term
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="App">
      <Header
        noteCount={notes.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <div className="container">
        <NoteForm addNote={addNote} />
        
        <div className="stats">
          <p>
            📝 Total: {notes.length} | 
            ⭐ Favorites: {notes.filter(n => n.isFavorite).length} |
            🔍 Showing: {filteredNotes.length}
          </p>
        </div>
        
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <h2>📭 No notes yet!</h2>
            <p>Create your first note above to get started.</p>
          </div>
        ) : (
          <NoteList
            notes={filteredNotes}
            deleteNote={deleteNote}
            toggleFavorite={toggleFavorite}
            editNote={editNote}
          />
        )}
      </div>
    </div>
  );
}

export default App;
```

### 2. Header Component

```javascript
// src/components/Header.jsx
import './Header.css';

function Header({ noteCount, searchTerm, setSearchTerm }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>📓 My Notes App</h1>
        <p className="subtitle">
          {noteCount === 0 ? 'Start taking notes!' : `${noteCount} notes`}
        </p>
      </div>
      
      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search notes..."
          className="search-input"
        />
      </div>
    </header>
  );
}

export default Header;
```

### 3. NoteForm Component

```javascript
// src/components/NoteForm.jsx
import { useState } from 'react';
import './NoteForm.css';

function NoteForm({ addNote }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#fff3cd');
  
  const colors = [
    '#fff3cd', '#d1ecf1', '#d4edda', '#f8d7da', '#e7d4f5', '#ffeaa7'
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim() === '' || content.trim() === '') {
      alert('Please fill in both title and content!');
      return;
    }
    
    addNote(title, content, selectedColor);
    
    // Reset form
    setTitle('');
    setContent('');
    setSelectedColor('#fff3cd');
  };
  
  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="form-input title-input"
      />
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content..."
        className="form-input content-input"
        rows="4"
      />
      
      <div className="form-footer">
        <div className="color-picker">
          {colors.map(color => (
            <button
              key={color}
              type="button"
              className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        
        <button type="submit" className="submit-btn">
          ➕ Add Note
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
```

### 4. NoteList Component

```javascript
// src/components/NoteList.jsx
import NoteCard from './NoteCard';
import './NoteList.css';

function NoteList({ notes, deleteNote, toggleFavorite, editNote }) {
  // Sort: favorites first, then by date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  return (
    <div className="note-grid">
      {sortedNotes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          deleteNote={deleteNote}
          toggleFavorite={toggleFavorite}
          editNote={editNote}
        />
      ))}
    </div>
  );
}

export default NoteList;
```

### 5. NoteCard Component

```javascript
// src/components/NoteCard.jsx
import { useState } from 'react';
import './NoteCard.css';

function NoteCard({ note, deleteNote, toggleFavorite, editNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  
  const handleSave = () => {
    if (editTitle.trim() && editContent.trim()) {
      editNote(note.id, editTitle, editContent);
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="note-card" style={{ background: note.color }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-input"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="edit-textarea"
            rows="4"
          />
          <div className="edit-buttons">
            <button onClick={handleSave} className="save-btn">✓ Save</button>
            <button onClick={handleCancel} className="cancel-btn">✗ Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="note-header">
            <h3>{note.title}</h3>
            <button
              onClick={() => toggleFavorite(note.id)}
              className="favorite-btn"
            >
              {note.isFavorite ? '⭐' : '☆'}
            </button>
          </div>
          
          <p className="note-content">{note.content}</p>
          
          <div className="note-footer">
            <span className="note-date">{formatDate(note.createdAt)}</span>
            <div className="note-actions">
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                ✏️ Edit
              </button>
              <button onClick={() => deleteNote(note.id)} className="delete-btn">
                🗑️ Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NoteCard;
```

## 🎨 Complete CSS (App.css)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.App {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.stats {
  text-align: center;
  color: white;
  margin: 20px 0;
  font-size: 18px;
}

.empty-state {
  text-align: center;
  color: white;
  padding: 80px 20px;
}

.empty-state h2 {
  font-size: 48px;
  margin-bottom: 10px;
}
```

## 🎯 Your Tasks

1. **Set up the project**
   ```bash
   npm create vite@latest notes-app -- --template react
   cd notes-app
   npm install
   ```

2. **Create all components** following the structure above

3. **Add CSS styling** for each component

4. **Test all features**:
   - Add notes
   - Delete notes
   - Edit notes
   - Search notes
   - Mark favorites
   - Refresh page (localStorage persistence)

5. **Customize and enhance**:
   - Change colors
   - Add your own features
   - Improve the design

## 🏆 Challenges

### Challenge 1: Categories
Add category tags to notes and filter by category.

### Challenge 2: Export/Import
Add ability to export notes as JSON and import them back.

### Challenge 3: Markdown Support
Allow writing notes in Markdown format.

### Challenge 4: Dark Mode
Add a dark/light theme toggle.

## ✅ Completion Checklist

- [ ] All components created
- [ ] Add note functionality works
- [ ] Delete note functionality works
- [ ] Edit note functionality works
- [ ] Search functionality works
- [ ] Favorite toggle works
- [ ] localStorage persistence works
- [ ] Responsive design implemented
- [ ] CSS styling complete
- [ ] No console errors

## 🎉 Congratulations!

You've completed the entire JavaScript + React Starter Kit! You now have:

- ✅ Solid JavaScript fundamentals
- ✅ Understanding of ES6+ features
- ✅ React component skills
- ✅ State management knowledge
- ✅ API fetching experience
- ✅ A complete portfolio project

## 🚀 What's Next?

1. **Deploy your app**: Netlify, Vercel, or GitHub Pages
2. **Learn more**: React Router, Context API, Redux
3. **Build more projects**: Weather app, E-commerce, Blog
4. **Learn TypeScript**: Add type safety to your code
5. **Explore frameworks**: Next.js, Remix, Gatsby

---

**You did it! 🎊 Keep building and learning!**
