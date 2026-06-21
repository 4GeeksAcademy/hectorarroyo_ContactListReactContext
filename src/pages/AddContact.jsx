import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState, useEffect } from "react";

const AGENDA_SLUG = "astrid"; // mismo slug que usas en Contact.jsx y ContactCard.jsx

export const AddContact = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const { contactId } = useParams(); // si existe, estamos editando

    const [data, setData] = useState({
        name: "",
        phone: "",
        email: "",
        address: ""
    });

    // Si venimos de "Editar", precargamos los datos del contacto
    useEffect(() => {
        if (!contactId) return;

        const loadContact = async () => {
            try {
                const response = await fetch(
                    `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts/${contactId}`
                );
                if (!response.ok) {
                    throw new Error("Error al obtener el contacto");
                }
                const contact = await response.json();
                setData({
                    name: contact.name || "",
                    phone: contact.phone || "",
                    email: contact.email || "",
                    address: contact.address || ""
                });
            } catch (error) {
                console.error("Error al cargar el contacto:", error);
            }
        };
        loadContact();
    }, [contactId]);

    const formChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const formSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = contactId
                ? `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts/${contactId}`
                : `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts`;

            const response = await fetch(url, {
                method: contactId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    agenda_slug: AGENDA_SLUG
                })
            });

            if (!response.ok) {
                throw new Error(contactId ? "Error al actualizar el contacto" : "Error al crear el contacto");
            }

            const savedContact = await response.json();

            dispatch({
                type: contactId ? "update_contact" : "add_contact",
                payload: savedContact
            });

            navigate("/");
        } catch (error) {
            console.error("Error al guardar el contacto:", error);
            alert("Hubo un error al guardar el contacto");
        }
    };

    return (
        <div className="text-center mt-5 container">
            <h1>{contactId ? "Editar Contacto" : "Add a new Contact"}</h1>
            <form className="row g-3" onSubmit={formSubmit}>
                <div className="col-md-6">
                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail4" value={data.email} onChange={formChange} name="email" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputPhone" className="form-label">Phone</label>
                    <input type="text" className="form-control" id="inputPhone" value={data.phone} onChange={formChange} name="phone" />
                </div>
                <div className="col-12">
                    <label htmlFor="inputAddress" className="form-label">Address</label>
                    <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" value={data.address} onChange={formChange} name="address" />
                </div>
                <div className="col-12">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Full Name" value={data.name} onChange={formChange} name="name" />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                        {contactId ? "Guardar cambios" : "Send"}
                    </button>
                </div>
            </form>
        </div>
    );
};