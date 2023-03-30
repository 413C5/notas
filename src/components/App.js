import React, { useState, useEffect } from "react";
import Note from "./Note";
import noteService from "../Services/notes"
import Notification from "./Notification";


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage,setErrorMessage]=useState(null)

  useEffect(() => {
    noteService //equivalente de axios
      .getAll() //equivalente de .get de la dirección
      .then(response => {
        setNotes(response)
      })
  }, [])

  //console.log('render', notes.length, 'notes');

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
    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response))
        setNewNote('')
      })
  }



  const handleNoteChanged = (event) => {
    //console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = (() => {
    if (showAll === true) {
      return notes
    }
    else {
      return notes.filter(x => x.important)
    }
  })()

  const handleShowAll = () => {
    setShowAll(!showAll)
  }

  const TextButton = ({ showAll }) => {
    if (showAll === true)
      return 'important'
    else if (showAll === false)
      return 'all'
  }


  const updateImportance = (id) => {
    const note = notes.find(x => x.id === id)
    const note2 = { ...note, important: !note.important }

    noteService
      .update(id, note2)
      .then(response => {
        setNotes(notes.map((note) => {
          console.log(response)
          if (note.id !== id)
            return note
          else
            return response
        }))
      })
      .catch(error => {
        setErrorMessage(`the note '${note2.content}' was already deleted from server`)
        setTimeout(()=>{
          setErrorMessage(null)
        },5000)
        setNotes(notes.filter(x => x.id !== id))
      })
    console.log('actualizar importancia de ', id)

  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <button onClick={handleShowAll}>
        <TextButton showAll={showAll} />
      </button>
      <ul>
        {notesToShow.map(x => {
          //console.log(x.id, x.content);
          return (
            <Note
              key={x.id}
              note={x}
              /* Pasa directamente el evento */
              updateImportance={() => updateImportance(x.id)}
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