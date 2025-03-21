import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes as Rutas, Navigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import {Inicio} from "../views/Inicio.jsx";
import {Login} from "../views/Login.jsx";
import NotesButton from "../views/NotesButton.jsx";
import Administrador from "../views/user/Administrador.jsx";
import Error404 from "../views/Error404.jsx";
import EventoRecinto from "../views/Eventos/EventosRecinto/EventoRecinto.jsx";

const Routes = () => {
    const { getAuth, authenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(true); //Esto sirve para que cuando la funcion getAuth termine entonces define si habia una sesion o no,
                                                  // se refresque la pagina y funcione la condicion correctamente

    useEffect(()=>{
        getAuth()
        setLoading(false);
    },[]);

    return (
        <Router>
        <Rutas>
            <Route exact path="/" element={(loading) ? <></> : ((authenticated) ? <Inicio /> : <Navigate to="/login" />)} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/admin" element={<Administrador />} />
            <Route exact path="/evento-recinto" element={<EventoRecinto />} />
            <Route exact path="/*" element={<Error404 />} />
        </Rutas>
    </Router>
    );
}

export default Routes;