import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import defaultPicture from "./pictures/PngItem_1468295.png";

import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBTypography,
} from "mdb-react-ui-kit";
import { useParams, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        phone: "",
        picture: "",
    });
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("id");
    const navigate = useNavigate();
    const param = useParams();

    const profilePic = `data:image/jpg;base64,${userData.picture}`;

    const fetchData = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/dashboard/?username=${
                param.username
            }`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.status !== 200) {
            navigate("*");
        } else {
            const data = await response.json();
            setUserData({ ...data });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditButton = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_API_URL}/dashboard/?username=${
                    param.username
                }`,
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status != 200) {
                navigate("*");
            } else {
                navigate(`/edit-user/${param.username}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="gradient-custom-2">
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="9" xl="7">
                        <MDBCard>
                            <div
                                className="rounded-top text-white d-flex flex-row"
                                style={{
                                    backgroundColor: "#000",
                                    height: "200px",
                                }}
                            >
                                <div
                                    className="ms-4 mt-5 d-flex flex-column"
                                    style={{ width: "150px" }}
                                >
                                    <MDBCardImage
                                        src={
                                            userData.picture
                                                ? profilePic
                                                : defaultPicture
                                        }
                                        alt="Profile"
                                        className="mt-4 mb-2 img-thumbnail"
                                        fluid
                                        style={{ width: "150px", zIndex: "1" }}
                                    />
                                </div>
                                <div
                                    className="ms-3"
                                    style={{ marginTop: "100px" }}
                                >
                                    <MDBTypography tag="h5">
                                        Hi {userData.username}, welcome!
                                    </MDBTypography>
                                    <MDBCardText>{userData.email}</MDBCardText>
                                    <MDBCardText>{userData.phone}</MDBCardText>
                                </div>
                            </div>
                            <div
                                className="p-4 text-black"
                                style={{ backgroundColor: "#f8f9fa" }}
                            >
                                <div className="d-flex justify-content-end text-center py-1">
                                    <MDBBtn
                                        color="dark"
                                        style={{
                                            height: "36px",
                                            overflow: "visible",
                                        }}
                                        onClick={(e) => handleEditButton(e)}
                                    >
                                        Edit profile
                                    </MDBBtn>
                                </div>
                            </div>
                            <MDBCardBody className="text-black p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <MDBCardText className="lead fw-normal mb-0">
                                        Recent Contacts
                                    </MDBCardText>
                                    <MDBCardText className="mb-0">
                                        <button
                                            className="btn btn-primary"
                                            style={{ backgroundColor: "#333" }}
                                            onClick={() => {
                                                navigate("/dashboard/contacts");
                                            }}
                                        >
                                            View All
                                        </button>
                                    </MDBCardText>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <MDBCardText className="lead fw-normal mb-0">
                                        Analytics
                                    </MDBCardText>
                                    <MDBCardText className="mb-0">
                                        <button
                                            className="btn btn-primary"
                                            style={{ backgroundColor: "#333" }}
                                        >
                                            View Details
                                        </button>
                                    </MDBCardText>
                                </div>
                                <MDBRow>
                                    <MDBCol className="mb-2">
                                        <QRCode
                                            style={{ height: 100, width: 100 }}
                                            value={`${
                                                import.meta.env
                                                    .VITE_APP_FRONTEND_URL
                                            }/#/business-card/?userId=${userId}`}
                                        />
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}
