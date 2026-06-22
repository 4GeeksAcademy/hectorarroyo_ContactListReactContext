import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState, useEffect } from "react";

const AGENDA = "Hector";

const inputStyle = {
    border: "none",
    borderBottom: "1px solid #3a3a5a",
    borderRadius: "0",
    padding: "8px 2px",
    outline: "none",
    boxShadow: "none",
    background: "transparent",
    fontSize: "0.95rem",
    color: "#e0e0ff",
};

const labelStyle = {
    fontSize: "0.75rem",
    color: "#6666aa",
    marginBottom: "2px",
    fontWeight: "500",
    letterSpacing: "0.03em",
};

export const AddContact = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const { contactId } = useParams();

    const [data, setData] = useState({ name: "", phone: "", email: "", address: "" });

    useEffect(() => {
        if (!contactId) return;
        // Busca el contacto directamente en el store — no hace falta otro fetch
        const existing = store.contacts.find(c => String(c.id) === String(contactId));
        if (existing) {
            setData({
                name: existing.name || "",
                phone: existing.phone || "",
                email: existing.email || "",
                address: existing.address || ""
            });
        }
    }, [contactId, store.contacts]);

    const formChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

    const formSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = contactId
                ? `https://playground.4geeks.com/contact/agendas/${AGENDA}/contacts/${contactId}`
                : `https://playground.4geeks.com/contact/agendas/${AGENDA}/contacts`;

            const response = await fetch(url, {
                method: contactId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, agenda_slug: AGENDA })
            });

            if (!response.ok) throw new Error("Error al guardar el contacto");
            const savedContact = await response.json();
            dispatch({ type: contactId ? "update_contact" : "add_contact", payload: savedContact });
            navigate("/");
        } catch (error) {
            console.error("Error al guardar el contacto:", error);
            alert("Hubo un error al guardar el contacto");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#12121f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
        }}>
            <div style={{
                backgroundColor: "#1e1e32",
                borderRadius: "4px",
                padding: "3rem 3.5rem",
                width: "100%",
                maxWidth: "520px",
                boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}>
                {/* Volver */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <Link to="/" style={{ fontSize: "0.82rem", color: "#6666aa", textDecoration: "none" }}>
                        ← Volver a contactos
                    </Link>
                </div>

                {/* Título */}
                <h2 style={{
                    textAlign: "center",
                    fontWeight: "400",
                    fontSize: "1.6rem",
                    marginBottom: "2rem",
                    letterSpacing: "0.02em",
                    color: "#e0e0ff",
                }}>
                    {contactId ? "Editar Contacto" : "Agregar Contacto"}
                </h2>

                <form onSubmit={formSubmit}>
                    {/* Nombre + Email */}
                    <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <label style={labelStyle}>Name *</label>
                            <input style={inputStyle} type="text" placeholder="Your name" name="name" value={data.name} onChange={formChange} required />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <label style={labelStyle}>Email</label>
                            <input style={inputStyle} type="email" placeholder="Your email" name="email" value={data.email} onChange={formChange} />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "1.5rem" }}>
                        <label style={labelStyle}>Phone</label>
                        <input style={inputStyle} type="text" placeholder="Your phone number" name="phone" value={data.phone} onChange={formChange} />
                    </div>

                    {/* Dirección */}
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "2.5rem" }}>
                        <label style={labelStyle}>Address</label>
                        <input style={inputStyle} type="text" placeholder="1234 Main St" name="address" value={data.address} onChange={formChange} />
                    </div>

                    {/* Botón */}
                    <div style={{ textAlign: "center" }}>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: "#6b8cff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "25px",
                                padding: "0.65rem 2.5rem",
                                fontSize: "0.8rem",
                                letterSpacing: "0.1em",
                                fontWeight: "600",
                                cursor: "pointer",
                                textTransform: "uppercase",
                            }}
                            onMouseOver={e => e.target.style.backgroundColor = "#5a7aee"}
                            onMouseOut={e => e.target.style.backgroundColor = "#6b8cff"}
                        >
                            {contactId ? "Guardar Cambios" : "Agregar Contacto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};