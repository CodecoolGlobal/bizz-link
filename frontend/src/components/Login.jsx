import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { Link } from "react-router-dom";
import "./css_files/Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const userModel = { email, password };

    const routeChange = () => {
        navigate("/api/v1/resetpassword/");
    };

    const errorRoute = () => {
        navigate("/api/v1/error");
    };

    function checkEmail() {
        const errorMessage = "It should be a valid email address!";
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        !email.match(mailFormat) && email.length > 3
            ? setEmailError(errorMessage)
            : setEmailError("");
    }
    function checkPassword() {
        const errorMessage =
            " Password should be min 8-10 characters and includes 1 leter 1 number 1 special character!";
        const passwordFormat =
            /^(?=.*\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        !password.match(passwordFormat) && password.length > 7
            ? setPasswordError(errorMessage)
            : setPasswordError("");
    }

    const handleCLick = async () => {
        const response = await fetch("http://localhost:8080/api/v1/login", {
            method: "POST",
            body: JSON.stringify(userModel),
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res);
        console.log(response);
        let message = await response;
        console.log(message);
        if (response.status === 401) {
            return alert(message);
        }
        if (response.status === 404) {
            return errorRoute();
        } else {
            alert("Hello user");
        }
        
    };

    useEffect(() => {
        checkEmail();
        checkPassword();
    }, [email, password]);

    return (
        <CssVarsProvider>
            <Sheet
                sx={{
                    width: 300,
                    mx: "auto", // margin left & right
                    my: 4, // margin top & botom
                    py: 3, // padding top & bottom
                    px: 2, // padding left & right
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    borderRadius: "sm",
                    boxShadow: "md",
                }}
            >
                <div>
                    <Typography level="h4" component="h1" textAlign={"center "}>
                        Welcome!
                    </Typography>
                    <Typography level="body2" textAlign={"center "}>
                        Sign in to continue.
                    </Typography>
                </div>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        // html input attribute
                        name="email"
                        type="email"
                        placeholder="johndoe@email.com"
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="on"
                    />
                    <span className="mail">{emailError}</span>
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <form>
                        <Input
                            name="password"
                            type="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="on"
                        />
                        <span className="password">{passwordError}</span>
                    </form>
                </FormControl>
                <Button sx={{ mt: 1 /* margin top */ }} onClick={handleCLick}>
                    Log in
                </Button>
                <Button sx={{ mt: 1 /* margin top */ }} onClick={routeChange}>
                    Forgot Password?
                </Button>
                <Typography
                    endDecorator={<Link to="/api/v1/signup/">Sign up</Link>}
                    fontSize="sm"
                    sx={{ alignSelf: "center" }}
                >
                    Don't have an account?
                </Typography>
            </Sheet>
        </CssVarsProvider>
    );
}

export default Login;