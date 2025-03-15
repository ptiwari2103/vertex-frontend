import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const { auth } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Unauthorized! Please log in.");
                setTimeout(() => navigate("/login"), 2000);
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);
            } catch (err) {
                setError("Invalid or expired token. Please log in again.");
                localStorage.removeItem("token");
                setTimeout(() => navigate("/login"), 2000);
            }
        };

        fetchProfile();
    }, [navigate]);

    return (
        <div>
            <h2>Profile</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {user ? (
                <div>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</button>
                </div>
            ) : (
                !error && <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
