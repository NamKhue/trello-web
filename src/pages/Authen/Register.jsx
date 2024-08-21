import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { useSignIn } from "react-auth-kit";
// import { useFormik } from "formik";

import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

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

    if (email == "") {
      toast.error("You should enter your email.");
      return;
    }
    if (password == "") {
      toast.error("You should enter your password.");
      return;
    }

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
      return;
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
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.trelloCustom.COLOR_3C1C64
            : theme.trelloCustom.COLOR_F9F4FD,
      }}
    >
      <Box
        sx={{
          width: "500px",
          py: 1,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          bgcolor: "#b061ff0a",

          border: "1px solid",
          borderColor: "transparent",
          borderRadius: "12px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mt: 5, mb: 2 }}>
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

        <Box sx={{ mt: 1, mb: 4, width: "400px" }}>
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

          <Box
            onClick={handleSubmit}
            sx={{
              cursor: "pointer",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              mt: 1,
              mb: 1,
              paddingTop: 1.5,
              paddingBottom: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",

              borderRadius: "6px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_F8F8F8
                  : theme.trelloCustom.COLOR_E6E6E6,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_51247C
                  : theme.trelloCustom.COLOR_7236AE,

              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.trelloCustom.COLOR_1E0734
                    : "#4f0283",
              },
            }}
          >
            Sign Up
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
