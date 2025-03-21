import { useNavigate } from "react-router-dom";

const Error404 = () => {
    const navigate = useNavigate();

    return (
        <main className="d-flex flex-column h-90vh justify-content-center px-5">
            <h1><span className="fw-bolder">Ups..</span> <br/> no hemos encontrado <br /> la página que buscabas</h1>
            <button type="submit" className="botonLogin boton-error py-2 px-1" onClick={()=>navigate("/")}>
                Volver
            </button>
        </main>
    );
}

export default Error404;