import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav style={{
            backgroundColor: "#1a1a2e",
            borderBottom: "1px solid #2e2e4a",
            padding: "0.85rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
        }}>
            <Link to="/" style={{
                fontWeight: "700",
                fontSize: "1.1rem",
                color: "#a0b4ff",
                textDecoration: "none",
                letterSpacing: "0.03em"
            }}>
                My Contacts
            </Link>

            <Link to="/add-contact" style={{
                fontSize: "0.85rem",
                color: "#a0b4ff",
                textDecoration: "none",
                fontWeight: "500"
            }}>
                + New Contact
            </Link>
        </nav>
    );
};