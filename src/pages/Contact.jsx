import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { ContactCard } from "../components/Contactcard.jsx";

const AGENDA_SLUG = "astrid"; // cambia esto por tu propio slug

export const Contact = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        const loadContacts = async () => {
            try {
                // Verifica si la agenda existe, si no, la crea
                const agendaResp = await fetch(`https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}`);
                if (agendaResp.status === 404) {
                    await fetch(`https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}`, {
                        method: "POST"
                    });
                }

                const response = await fetch(`https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts`);
                if (!response.ok) {
                    throw new Error("Error al obtener los contactos");
                }
                const data = await response.json();

                dispatch({
                    type: "get_contacts",
                    payload: data.contacts
                });
            } catch (error) {
                console.error("Error al cargar los contactos:", error);
            }
        };
        loadContacts();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mis Contactos</h1>
                <Link to="/add-contact" className="btn btn-primary">
                    + Agregar contacto
                </Link>
            </div>

            {store.contacts.length === 0 ? (
                <p className="text-center text-muted">No hay contactos todavía.</p>
            ) : (
                <div className="list-group">
                    {store.contacts.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                    ))}
                </div>
            )}
        </div>
    );
};