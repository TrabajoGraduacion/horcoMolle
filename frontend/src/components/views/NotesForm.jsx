import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import * as Yup from "yup";
import clsx from "clsx";
import { useFormik } from "formik";
import { Button, Form } from "react-bootstrap";
import "../../css/notesButton.css";

const NotesForm = ({note, setPosting, handleCreate, user, type, handleSubmit, setResponseText, varietyId}) => {
    const noteSchema = Yup.object().shape({
        title: Yup.string()
            .required("Requerido")
            .min(3, "Título muy corto")
            .max(100, "Título muy largo")
            .trim(),
        text: Yup.string()
            .max(256, "Descripción muy larga")
            .trim(),
    });
    
    const initialValues = {
        title: note?.title || "",
        text: note?.text || "",
    };
    
    const formik = useFormik({
        initialValues,
        validationSchema: noteSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            let message = "";
            if(note) message = await handleSubmit({...values, writerId: user?._id, type: type, varietyId: varietyId}, note);
            else message = await handleSubmit({...values, writerId: user?._id, type: type, varietyId: varietyId});
            setPosting(true);
            setResponseText(message);
            setTimeout(() => {
                formik.resetForm();
                handleCreate();
                setPosting(false);
            },1500);
        },
    });

    return (
        <Form onSubmit={formik.handleSubmit} noValidate className="h-100 noteForm">
            <Form.Group className="mb-3">
                <Form.Label htmlFor="noteTitle" className="noteFormLabel">Título:</Form.Label>
                <Form.Control
                    type="text"
                    id="noteTitle"
                    maxLength={100}
                    minLength={3}
                    {...formik.getFieldProps("title")}
                    className={`form-control noteTitleForm ${clsx(
                    {
                        "is-invalid": formik.touched.title && formik.errors.title,
                    },
                    {
                        "is-valid": formik.touched.title && !formik.errors.title,
                    }
                    )}`}
                />
                {formik.touched.title && formik.errors.title && (
                    <div className="text-danger fw-bolder my-2">
                    <span rol="alert">{formik.errors.title}</span>
                    </div>
                )}
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="noteArea" className="noteFormLabel">Nota:</Form.Label>
                <Form.Control
                    as="textarea"
                    id="noteArea"
                    maxLength={256}
                    minLength={0}
                    rows={5}
                    {...formik.getFieldProps("text")}
                    className={`form-control noteArea ${clsx(
                    {
                        "is-invalid": formik.touched.text && formik.errors.text,
                    },
                    {
                        "is-valid": formik.touched.text && !formik.errors.text,
                    }
                    )}`}
                />
                {formik.touched.text && formik.errors.text && (
                    <div className="text-danger fw-bolder my-2">
                    <span rol="alert">{formik.errors.text}</span>
                    </div>
                )}
            </Form.Group>
            <Form.Group className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
                <Button
                variant="outline-light"
                type="button"
                onClick={() => {
                    formik.resetForm();
                    handleCreate();
                }}
                >
                Cancelar
                </Button>
                <Button
                variant= "outline-light"
                type="submit"
                >
                Guardar
                </Button>
            </Form.Group>
        </Form>
    );
}

export default NotesForm;