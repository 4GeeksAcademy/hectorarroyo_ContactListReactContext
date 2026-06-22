import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { ContactCard } from "../components/Contactcard.jsx";

const AGENDA = "Hector";

export const Contact = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const agendaResp = await fetch(`https://playground.4geeks.com/contact/agendas/${AGENDA}`);
                if (agendaResp.status === 404) {
                    await fetch(`https://playground.4geeks.com/contact/agendas/${AGENDA}`, { method: "POST" });
                }
                const response = await fetch(`https://playground.4geeks.com/contact/agendas/${AGENDA}/contacts`);
                if (!response.ok) throw new Error("Error al obtener los contactos");
                const data = await response.json();
                dispatch({ type: "get_contacts", payload: data.contacts });
            } catch (error) {
                console.error("Error al cargar los contactos:", error);
            }
        };
        loadContacts();
    }, []);

    return (
        <div style={{ minHeight: "calc(100vh - 60px)", backgroundColor: "#12121f", padding: "2rem" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h1 style={{ color: "#e0e0ff", fontWeight: "600", fontSize: "1.5rem", margin: 0 }}>
                        Mis Contactos
                        <span style={{
                            marginLeft: "0.6rem",
                            fontSize: "0.85rem",
                            backgroundColor: "#2e2e4a",
                            color: "#a0b4ff",
                            borderRadius: "12px",
                            padding: "2px 10px",
                            fontWeight: "500"
                        }}>
                            {store.contacts.length}
                        </span>
                    </h1>
                    
                </div>

                {store.contacts.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666", marginTop: "4rem" }}>
                        No hay contactos todavía.{" "}
                        <Link to="/add-contact" style={{ color: "#a0b4ff" }}>¡Agrega uno!</Link>
                    </p>
                ) : (
                    store.contacts.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                    ))
                )}
            </div>
        </div>
    );
};