import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const AGENDA = "Hector";

const iconCircle = {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#2a4a8a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "0.95rem",
    flexShrink: 0,
};

export const ContactCard = ({ contact }) => {
    const { dispatch } = useGlobalReducer();
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await fetch(
                `https://playground.4geeks.com/contact/agendas/${AGENDA}/contacts/${contact.id}`,
                { method: "DELETE" }
            );
            if (!response.ok) throw new Error("Error al eliminar el contacto");
            dispatch({ type: "delete_contact", payload: contact.id });
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Hubo un error al eliminar el contacto");
        } finally {
            setDeleting(false);
            setShowModal(false);
        }
    };

    return (
        <>
            <div style={{
                backgroundColor: "#1e1e32",
                borderRadius: "10px",
                padding: "1rem 1.5rem",
                marginBottom: "0.75rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
            }}>
                {/* Avatar + nombre */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "0 0 auto" }}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || "?")}&background=3a4a8a&color=fff&size=64`}
                        alt={contact.name}
                        style={{ width: "52px", height: "52px", borderRadius: "50%", flexShrink: 0 }}
                    />
                    <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "#e0e0ff", whiteSpace: "nowrap" }}>
                        {contact.name}
                    </span>
                </div>

                {/* Iconos de info */}
                <div style={{ display: "flex", gap: "1.2rem", flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
                    {contact.address && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#9090bb", minWidth: 0 }}>
                            <div style={iconCircle}>📍</div>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "140px" }}>
                                {contact.address}
                            </span>
                        </div>
                    )}
                    {contact.phone && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#9090bb" }}>
                            <div style={iconCircle}>📞</div>
                            <span style={{ whiteSpace: "nowrap" }}>{contact.phone}</span>
                        </div>
                    )}
                    {contact.email && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#9090bb", minWidth: 0 }}>
                            <div style={iconCircle}>✉️</div>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                                {contact.email}
                            </span>
                        </div>
                    )}
                </div>

                {/* Botones */}
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <Link
                        to={`/edit-contact/${contact.id}`}
                        style={{
                            padding: "0.3rem 0.8rem",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            border: "1px solid #4a4a6a",
                            color: "#a0b4ff",
                            backgroundColor: "transparent",
                            textDecoration: "none",
                        }}
                    >
                        Editar
                    </Link>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            padding: "0.3rem 0.8rem",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            border: "1px solid #6a2a2a",
                            color: "#ff8080",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            {showModal && (
                <>
                    <div className="modal d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content" style={{
                                backgroundColor: "#1e1e32",
                                border: "1px solid #2e2e4a",
                                color: "#e0e0ff",
                            }}>
                                <div className="modal-header" style={{ borderBottom: "1px solid #2e2e4a" }}>
                                    <h5 className="modal-title">Confirmar eliminación</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}
                                        style={{ filter: "invert(1)" }}></button>
                                </div>
                                <div className="modal-body">
                                    ¿Seguro que quieres eliminar a <strong>{contact.name}</strong>? Esta acción no se puede deshacer.
                                </div>
                                <div className="modal-footer" style={{ borderTop: "1px solid #2e2e4a" }}>
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={deleting}>
                                        Cancelar
                                    </button>
                                    <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                                        {deleting ? "Eliminando..." : "Sí, eliminar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop show" style={{ opacity: 0.7 }}></div>
                </>
            )}
        </>
    );
};