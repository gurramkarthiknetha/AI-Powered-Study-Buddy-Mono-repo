import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaFolder, FaFile, FaUpload, FaDownload } from 'react-icons/fa';
import './Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [folders, setFolders] = useState(['General', 'Math', 'Science', 'History']);
  const [activeFolder, setActiveFolder] = useState('General');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - in a real app, this would be fetched from an API
    const mockNotes = [
      { id: 1, title: 'Math Formulas', content: '# Math Formulas\n\n- Quadratic Formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n- Pythagorean Theorem: $a^2 + b^2 = c^2$', folder: 'Math', createdAt: new Date('2023-05-15') },
      { id: 2, title: 'Physics Notes', content: '# Physics Laws\n\n1. Newton\'s First Law: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n2. Newton\'s Second Law: $F = ma$', folder: 'Science', createdAt: new Date('2023-05-20') },
      { id: 3, title: 'Study Schedule', content: '# Weekly Schedule\n\n- Monday: Math (2 hours)\n- Tuesday: Science (2 hours)\n- Wednesday: History (1.5 hours)\n- Thursday: Math (2 hours)\n- Friday: Science (2 hours)', folder: 'General', createdAt: new Date('2023-05-25') },
    ];
    setNotes(mockNotes);
  }, []);

  const handleNoteSelect = (note) => {
    setActiveNote(note);
    setNoteContent(note.content);
    setNoteTitle(note.title);
    setIsEditing(false);
  };

  const handleNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      folder: activeFolder,
      createdAt: new Date()
    };
    setNotes([...notes, newNote]);
    handleNoteSelect(newNote);
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (!activeNote) return;
    
    const updatedNotes = notes.map(note => 
      note.id === activeNote.id 
        ? { ...note, title: noteTitle, content: noteContent } 
        : note
    );
    
    setNotes(updatedNotes);
    setActiveNote({ ...activeNote, title: noteTitle, content: noteContent });
    setIsEditing(false);
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    if (activeNote && activeNote.id === noteId) {
      setActiveNote(null);
      setNoteContent('');
      setNoteTitle('');
    }
  };

  const handleFolderSelect = (folder) => {
    setActiveFolder(folder);
  };

  const filteredNotes = notes.filter(note => 
    note.folder === activeFolder && 
    (searchTerm === '' || 
     note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Simple markdown-like rendering
  const renderContent = (content) => {
    if (!content) return '';
    
    // Replace headers
    let rendered = content.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    rendered = rendered.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    
    // Replace lists
    rendered = rendered.replace(/^- (.+)$/gm, '<li>$1</li>');
    rendered = rendered.replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>');
    
    // Replace paragraphs
    rendered = rendered.split('\n\n').map(para => 
      !para.startsWith('<h') && !para.startsWith('<li') 
        ? `<p>${para}</p>` 
        : para
    ).join('');
    
    // Wrap lists
    rendered = rendered.replace(/(<li>.+<\/li>)+/g, '<ul>$&</ul>');
    
    return rendered;
  };

  return (
    <div className="notes-container">
      <div className="notes-sidebar">
        <div className="notes-search">
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="folders-section">
          <h3>Folders</h3>
          <ul className="folders-list">
            {folders.map(folder => (
              <li 
                key={folder} 
                className={activeFolder === folder ? 'active' : ''}
                onClick={() => handleFolderSelect(folder)}
              >
                <FaFolder /> {folder}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="notes-list-header">
          <h3>Notes</h3>
          <button className="icon-button" onClick={handleNewNote}>
            <FaPlus />
          </button>
        </div>
        
        <ul className="notes-list">
          {filteredNotes.map(note => (
            <li 
              key={note.id} 
              className={activeNote && activeNote.id === note.id ? 'active' : ''}
              onClick={() => handleNoteSelect(note)}
            >
              <div className="note-item-header">
                <FaFile /> 
                <span className="note-title">{note.title}</span>
              </div>
              <div className="note-item-actions">
                <button 
                  className="icon-button small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="notes-editor">
        {activeNote ? (
          <>
            <div className="editor-header">
              {isEditing ? (
                <input 
                  type="text" 
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="note-title-input"
                />
              ) : (
                <h2>{activeNote.title}</h2>
              )}
              
              <div className="editor-actions">
                {isEditing ? (
                  <button className="btn" onClick={handleSaveNote}>Save</button>
                ) : (
                  <button className="icon-button" onClick={() => setIsEditing(true)}>
                    <FaEdit />
                  </button>
                )}
                <button className="icon-button">
                  <FaDownload />
                </button>
              </div>
            </div>
            
            <div className="editor-date">
              Last edited: {activeNote.createdAt.toLocaleDateString()}
            </div>
            
            {isEditing ? (
              <textarea 
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="note-content-editor"
                placeholder="Write your note here... (Supports basic Markdown)"
              />
            ) : (
              <div 
                className="note-content-preview"
                dangerouslySetInnerHTML={{ __html: renderContent(noteContent) }}
              />
            )}
          </>
        ) : (
          <div className="empty-state">
            <h2>No Note Selected</h2>
            <p>Select a note from the sidebar or create a new one.</p>
            <button className="btn" onClick={handleNewNote}>
              <FaPlus /> Create New Note
            </button>
          </div>
        )}
      </div>
      
      <div className="notes-resources">
        <h3>Resources</h3>
        <div className="upload-section">
          <button className="btn">
            <FaUpload /> Upload File
          </button>
          <p>Upload PDFs, images, or other study materials</p>
        </div>
        
        <div className="resources-list">
          <div className="resource-item">
            <FaFile /> Physics Textbook.pdf
            <button className="icon-button small">
              <FaDownload />
            </button>
          </div>
          <div className="resource-item">
            <FaFile /> Math Cheat Sheet.jpg
            <button className="icon-button small">
              <FaDownload />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
