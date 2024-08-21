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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Login() {
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useRedirect("/homepage");

  const { logInAccount, getUserDetails } = useAuth();

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
    const validEmail = EMAIL_REGEX.test(email);
    // const validPwd = PWD_REGEX.test(password);

    // if (!validEmail || !validPwd) {
    if (!validEmail) {
      toast.error("Invalid. Please check your email again.");
      return;
    }
    //   if (!validPwd) {
    //     toast.error("Invalid. Please check your password again.");
    //   }
    //   throw new Error("Login failed");
    // }

    const result = await logInAccount({
      email: email,
      password: password,
    });

    if (result.success) {
      const userDetails = await getUserDetails(result.token);

      // display notification
      toast.info(`Welcome back, ${userDetails.username}!`);

      // reset form data
      setEmail("");
      setPassword("");

      // redirect to home page
      navigate("/homepage");
    } else {
      toast.error(result.message || "Login failed");
      throw new Error(result.message || "Login failed");
    }
  };

  const handleSignUpBtn = () => {
    // reset data
    setEmail("");
    setPassword("");

    navigate("/register");
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
            Sign in
          </Typography>
        </Box>

        <Box sx={{ mt: 1, mb: 4, width: "400px" }}>
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
            onClick={() => handleSignUpBtn()}
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
            {"Don't have an account? Sign Up"}
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
            Sign In
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
