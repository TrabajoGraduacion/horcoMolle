import { useEffect, useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import "../../css/notesButton.css";
import NotesForm from "./NotesForm";
import { Button } from "react-bootstrap";

const NotesButton = ({type, isActive, onClick, varietyId}) => {
    const [writing, setWritting] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editing, setEditing] = useState(false);
    const [posting, setPosting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [wantDelete, setWantDelete] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [notes, setNotes] = useState([]);
    const URL = import.meta.env.VITE_API_USUARIO;
    const { user } = useContext(AuthContext);

    const handleClick = () => {
        if(!isActive) onClick();
    };

    const handleCreate = () => setWritting(!writing);

    const handleEdit = async (values ,note) => {
        const response = await axios.put(`${URL}notes/${note._id}`, values);
        const refreshResponse = await axios.get(`${URL}notes?type=${type}&varietyId=${varietyId}`);
        setNotes(refreshResponse.data.notes.reverse());
        return response.data.message;
    }

    const handleSubmit = async (values) => {
        const response = await axios.post(`${URL}notes`, values);
        const refreshResponse = await axios.get(`${URL}notes?type=${type}`);
        setNotes(refreshResponse.data.notes.reverse());
        return response.data.message;
    }

    const handleDelete = async (note) => {
        const deleteResponse = await axios.delete(`${URL}notes/${note._id}`);

        const refreshResponse = await axios.get(`${URL}notes?type=${type}`);
        setNotes(refreshResponse.data.notes.reverse());
        setDeleting(true);
        setResponseText(deleteResponse.data.message);
        setTimeout(() => {
            setDeleting(false);
            setWantDelete(false);
        },1500);
    }

    const getNotes = async () => {
        const response = await axios.get(`${URL}notes?type=${type}&varietyId=${varietyId}`);
        let notesList = response.data.notes.reverse();
        setNotes(notesList);
    }

    useEffect(()=>{
        getNotes();
    },[varietyId]);

    return (
        <div className="buttonNotesShape position-relative">
            <div className={`${(isActive)?"notesScreen":"notesButton"}`} onClick={handleClick}>
                {(isActive)?
                <>  
                    <article className="notesHeader">
                        <h3 className="notesTag">{(type==="noticia") && "Noticias:"}{(type==="negociacion") && "Negociaciones:"}</h3>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                            {
                                (writing)?
                                <svg onClick={handleCreate} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                    <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                </svg>
                                :
                                (user.isAdmin || user.isEditor)?
                                <svg onClick={handleCreate} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                                :
                                <>
                                </>
                            }
                            <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                        </div>
                    </article>
                    {
                        (writing && user)?
                            (!posting)?
                                <NotesForm type={type} varietyId={varietyId} user={user} handleCreate={handleCreate} setPosting={setPosting} handleSubmit={handleSubmit} setResponseText={setResponseText}/>
                                :
                                <div className="noteResponseMessage">
                                    <p>{responseText}</p>
                                </div>
                            :
                            (!wantDelete)?
                                        (!edit)?
                                        <>
                                        {notes.map((note)=>
                                            <article className="note" key={note._id}>
                                                <div className="notePanel">
                                                {
                                                    (user.isAdmin || user.isEditor)?
                                                    <>                                                    
                                                        <svg onClick={()=>setEdit(note)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                            <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                        </svg>
                                                        <svg onClick={()=> setWantDelete(note)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                        </svg>
                                                    </>
                                                    :
                                                    <></>
                                                }
                                                </div>
                                                <div className="noteTitle">
                                                    {note.title}
                                                </div>
                                                <div className="noteText">
                                                    {note.text}
                                                </div>
                                                <div className="noteWriter">
                                                    {(note.writer)? note.writer.username : "Autor no encontrado"}
                                                </div>
                                            </article>)}
                                        </>
                                        :
                                        (!editing)?
                                            <NotesForm type={type} user={user} handleCreate={()=> setEdit(false)} setPosting={setEditing} handleSubmit={handleEdit} setResponseText={setResponseText} note={edit}/>
                                        :
                                        <div className="noteResponseMessage">
                                            <p>{responseText}</p>
                                        </div>
                                :
                                (!deleting)?
                                    <div className="noteResponseMessage w-100">
                                        <p>¿Desea eliminar la nota?</p>
                                        <div className="d-flex flex-column flex-md-row justify-content-md-start gap-2">
                                            <Button type="button" onClick={() => setWantDelete(false)} variant="outline-light">Cancelar</Button>
                                            <Button type="button" onClick={() => handleDelete(wantDelete)} variant="outline-light">Eliminar</Button>
                                        </div>
                                    </div>
                                    :
                                    <div className="noteResponseMessage">
                                        <p>{responseText}</p>
                                    </div>
                    }
                </>
                :
                <p className="p-0 m-0 botonesGraficos">{(type==="noticia") && "Noticias"}{(type==="negociacion") && "Negociaciones"}</p>
                }
            </div>
        </div>
    );
}

export default NotesButton;