import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const AGENDA_SLUG = "astrid"; // mismo slug que usas en Contact.jsx y AddContact.jsx

export const ContactCard = ({ contact }) => {
    const { dispatch } = useGlobalReducer();
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await fetch(
                `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts/${contact.id}`,
                { method: "DELETE" }
            );
            if (!response.ok) {
                throw new Error("Error al eliminar el contacto");
            }
            dispatch({
                type: "delete_contact",
                payload: contact.id
            });
        } catch (error) {
            console.error("Error al eliminar el contacto:", error);
            alert("Hubo un error al eliminar el contacto");
        } finally {
            setDeleting(false);
            setShowModal(false);
        }
    };

    return (
        <>
            <div className="list-group-item d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || "?")}&background=0D6EFD&color=fff`}
                        alt={contact.name}
                        className="rounded-circle me-3"
                        width="60"
                        height="60"
                    />
                    <div>
                        <h5 className="mb-1">{contact.name}</h5>
                        <p className="mb-0 text-muted small">{contact.address}</p>
                        <p className="mb-0 text-muted small">{contact.phone}</p>
                        <p className="mb-0 text-muted small">{contact.email}</p>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <Link to={`/edit-contact/${contact.id}`} className="btn btn-outline-secondary btn-sm">
                        Editar
                    </Link>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => setShowModal(true)}>
                        Eliminar
                    </button>
                </div>
            </div>

            {showModal && (
                <>
                    <div className="modal d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmar eliminación</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    ¿Seguro que quieres eliminar a <strong>{contact.name}</strong> de tu agenda?
                                    Esta acción no se puede deshacer.
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                        disabled={deleting}
                                    >
                                        Cancelar
                                    </button>
                                    <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                                        {deleting ? "Eliminando..." : "Sí, eliminar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop show"></div>
                </>
            )}
        </>
    );
};