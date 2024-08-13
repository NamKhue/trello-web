import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { useSignIn } from "react-auth-kit";
// import { useFormik } from "formik";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { useAuth } from "~/hooks/useAuth";
import useRedirect from "~/components/authen/useRedirect";

// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Register() {
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useRedirect("/homepage");

  const { registerUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // check email and pwd
    // const validUsername = USER_REGEX.test(username);
    const validEmail = EMAIL_REGEX.test(email);
    // const validPwd = PWD_REGEX.test(password);

    // if (!validUsername || !validEmail || !validPwd) {
    //   if (!validUsername) {
    //     toast.error("Invalid. Please check your username.");
    //   }
    if (!validEmail) {
      toast.error("Invalid. Please check your email.");
      throw new Error("Registration failed");
    }
    //   if (!validPwd) {
    //     toast.error("Invalid. Please check your password.");
    //   }
    //   throw new Error("Registration failed");
    // }

    const result = await registerUser({
      username: username,
      email: email,
      password: password,
    });

    if (result.success) {
      // Handle success
      toast.success("You've successfully created new account!");

      // reset form data
      setUsername("");
      setEmail("");
      setPassword("");

      // redirect to login page
      navigate("/login");
    } else {
      toast.error(result.message || "Registration failed");
      throw new Error(result.message || "Registration failed");
    }
  };

  const handleLoginBtn = () => {
    // reset data
    setUsername("");
    setEmail("");
    setPassword("");

    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.trelloCustom.COLOR_3C1C64
            : theme.trelloCustom.COLOR_EAC9F5,
      }}
    >
      <Box>
        <Container component="main" maxWidth="xs">
          <CssBaseline />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: "secondary.main",
                  "&.MuiAvatar-root": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_51247C
                        : theme.trelloCustom.COLOR_7236AE,
                  },
                  "& .MuiSvgIcon-root": {
                    fill: (theme) => theme.trelloCustom.COLOR_F8F8F8,
                  },
                }}
              >
                <LockOutlinedIcon />
              </Avatar>

              <Typography component="h1" variant="h4">
                Register
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="text"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                sx={{
                  mt: 1,

                  "& .MuiInputBase-input.MuiOutlinedInput-input": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_F8F8F8
                        : theme.trelloCustom.COLOR_313131,
                  },
                  "& .MuiFormLabel-root.MuiInputLabel-root": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_F8F8F8
                        : theme.trelloCustom.COLOR_313131,
                    fontSize: ".9rem",
                  },
                  "& .MuiInputBase-root.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_F8F8F8
                          : theme.trelloCustom.COLOR_313131,
                    },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                sx={{
                  mt: 1,
                  "& .MuiInputBase-input.MuiOutlinedInput-input": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_F8F8F8
                        : theme.trelloCustom.COLOR_313131,
                  },
                  "& .MuiFormLabel-root.MuiInputLabel-root": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_F8F8F8
                        : theme.trelloCustom.COLOR_313131,
                    fontSize: ".9rem",
                  },
                  "& .MuiInputBase-root.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_F8F8F8
                          : theme.trelloCustom.COLOR_313131,
                    },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                sx={{
                  mt: 1,

                  "& .MuiInputBase-input.MuiOutlinedInput-input": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_F8F8F8
                        : theme.trelloCustom.COLOR_313131,
                  },
                  "& .MuiFormLabel-root.MuiInputLabel-root": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_F8F8F8
                        : theme.trelloCustom.COLOR_313131,
                    fontSize: ".9rem",
                  },
                  "& .MuiInputBase-root.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.trelloCustom.COLOR_F8F8F8
                          : theme.trelloCustom.COLOR_313131,
                    },
                }}
              />

              <Box
                onClick={() => handleLoginBtn()}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "35px",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.trelloCustom.COLOR_F8F8F8
                      : theme.trelloCustom.COLOR_313131,

                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {"Have an account? Log in"}
              </Box>

              <Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 1,
                    paddingTop: 1.5,
                    paddingBottom: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.trelloCustom.COLOR_F8F8F8
                        : theme.trelloCustom.COLOR_E6E6E6,
                    "&.MuiButtonBase-root": {
                      "&.MuiButton-root": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_51247C
                            : theme.trelloCustom.COLOR_7236AE,
                      },
                      "&.MuiButton-root:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.trelloCustom.COLOR_1E0734
                            : theme.trelloCustom.COLOR_790283,
                      },
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Register;
