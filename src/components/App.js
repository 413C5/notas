import React, { useState, useEffect } from "react";
import Note from "./Note";
import axios from "axios";


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('Entro al Effect');
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('Entro al then');
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes');

  const addNote = (event) => {
    event.preventDefault()
    //console.log('button Clicked',event.target)
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5,
      id: notes.length + 1
    }

    //Agregar una nueva nota, enviandola al servidor
    axios
    .post('http://localhost:3001/notes',noteObject)
    .then(response=>{
      console.log(response.data)
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
  }

  //Agregar una nueva nota


  const handleNoteChanged = (event) => {
    //console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = (() => {
    if (showAll===true) {
      return notes
    } 
    else{
      return notes.filter(x => x.important)
    }
  })()

  const handleShowAll=()=>{
    setShowAll(!showAll)
  }

  const TextButton=({showAll})=>{
    if(showAll===true)
      return 'important'
    else if(showAll===false)
      return 'all'
  }


  const updateImportance=(id)=>{
    const url=(`http://localhost:3001/notes/${id}`)
    const note=notes.find(x=>x.id===id)
    const note2={ ...note, important: !note.important }

    axios
    .put(url,note2)
    .then(response=>{
      setNotes(notes.map((note)=>{
        if(note.id!=id)
          return note
        else
          return response.data
      }))
    })
    console.log('actualizar importancia de ',id)

  }

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={handleShowAll}>
        <TextButton showAll={showAll}/>
      </button>
      <ul>
        {notesToShow.map(x => {
          console.log(x.id, x.content);
          return (
            <Note 
              key={x.id} 
              note={x}
              /* Pasa directamente el evento */
              updateImportance={()=>updateImportance(x.id)} 
            />
          )
        })}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChanged} />
        <button type='submit'>Save</button>
      </form>
    </div>
  )
}

export default App