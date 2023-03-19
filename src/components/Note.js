import React from "react";

const Note=({note,updateImportance})=>{

    //
    const label=(()=>{
        if(note.important===true)
            return 'make not important'
        else    
            return 'make important'
    })()

    return(
        <li>
            {note.content} <button onClick={updateImportance}>{label}</button>
        </li>
    )
}

export default Note