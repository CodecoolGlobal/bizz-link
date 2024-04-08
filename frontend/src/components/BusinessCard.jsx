import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import "./css_files/BusinessCard.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import defaultPicture from "./pictures/PngItem_1468295.png";

const BusinessCard = () => {
    const [param] = useSearchParams();
    const [userData, setUserData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        linkedin: "",
        facebook: "",
        picture: "",
        token: "",
    });
    const profilePic = `data:image/jpg;base64,${userData.picture}`;

    const navigate = useNavigate();

    const fetchData = async () => {
        await fetch(
            `${
                import.meta.env.VITE_APP_API_URL
            }/business-card/?userId=${param.get("userId")}`,
            {
                method: "GET",
                mode: "cors",
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to show contact  details");
                }
            })
            .then((user) => {
                setUserData({
                    ...user,
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddButton = (event) => {
        event.preventDefault();
        try {
            fetch(`${import.meta.env.VITE_APP_API_URL}/contacts/add-contact`, {
                method: "POST",
                body: JSON.stringify(userData),
                mode: "cors",
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to add contact");
                }
            });
            navigate(`/dashboard/${userData.username}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container my-4 d-flex justify-content-center">
            <div className="card business-card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <img
                                style={{ height: 50, width: 50 }}
                                src={profilePic ? profilePic : defaultPicture}
                                alt="Profile"
                                className="img-fluid rounded-circle profile-pic"
                            />
                            <h2 className="card-title">{`${userData.firstname} ${userData.lastname}`}</h2>
                            <p className="card-text">Phone: {userData.phone}</p>
                            <p className="card-text">Email: {userData.email}</p>
                            <div className="links">
                                <a
                                    href={userData.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href={userData.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Facebook
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-center">
                        <div className="d-flex flex-column align-items-center">
                            <QRCode
                                style={{ height: 50, width: 50 }}
                                value={userData.email}
                            />
                            <button
                                className="btn btn-primary mt-3"
                                onClick={(event) => handleAddButton(event)}
                                style={{
                                    backgroundColor: "black",
                                    border: "black",
                                }}
                            >
                                Add to Contacts
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessCard;
