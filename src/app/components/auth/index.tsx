import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, Fab, Stack, TextField } from "@mui/material";
import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/auth.css";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "relative",
  },
}));

const ModalImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const classes = useStyles();
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const { setAuthMember } = useGlobals();

  /** HANDLERS **/

  const handleUsername = (e: T) => {
    setMemberNick(e.target.value);
  }

  const handlePhone = (e: T) => {
    setMemberPhone(e.target.value);
  }

  const handlePassword = (e: T) => {
    setMemberPassword(e.target.value);
  }

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) {
      handleSignupRequest().then();
    } else if (e.key === "Enter" && loginOpen) {
      handleLoginRequest().then();
    }
  };

  const handleSignupRequest = async () => {
    try {
      const isFullFill =
        memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFullFill) {
        throw new Error(Messages.error3);
      }

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.signup(signupInput);

      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      console.log(err);
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  // handleLoginRequest
  const handleLoginRequest = async () => {
    try {
      const isFullFill =
        memberNick !== "" && memberPassword !== "";
      if (!isFullFill) {
        throw new Error(Messages.error3);
      }

      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);

      setAuthMember(result);
      setMemberPassword("");
      handleLoginClose();
    } catch (err) {
      console.log(err);
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          className: "auth-modal-backdrop",
        }}
      >
        <Fade in={signupOpen}>
          <Stack
            className={`${classes.paper} auth-modal-paper`}
            direction={"row"}
            sx={{ width: "800px" }}
          >
            <Box className="auth-modal-img-wrap" sx={{ flex: "0 0 45%", minHeight: 420 }}>
              <ModalImg src={"/img/auth.jpg"} alt="camera" className="auth-modal-img" />
            </Box>
            <Stack className="auth-modal-form" sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <h2 className="auth-modal-title">Signup Form</h2>
              <TextField
                fullWidth
                sx={{ marginTop: "7px", maxWidth: 280 }}
                id="signup-username"
                label="username"
                variant="outlined"
                onChange={handleUsername}
              />
              <TextField
                fullWidth
                sx={{ my: "17px", maxWidth: 280 }}
                id="signup-phone"
                label="phone number"
                variant="outlined"
                onChange={handlePhone}
              />
              <TextField
                fullWidth
                sx={{ maxWidth: 280 }}
                id="signup-password"
                label="password"
                variant="outlined"
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "30px", width: "120px" }}
                variant="extended"
                color="primary"
                onClick={handleSignupRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Signup
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          className: "auth-modal-backdrop",
        }}
      >
        <Fade in={loginOpen}>
          <Stack
            className={`${classes.paper} auth-modal-paper`}
            direction={"row"}
            sx={{ width: "700px" }}
          >
            <Box className="auth-modal-img-wrap" sx={{ flex: "0 0 45%", minHeight: 380 }}>
              <ModalImg src={"/img/auth.jpg"} alt="camera" className="auth-modal-img" />
            </Box>
            <Stack
              className="auth-modal-form"
              sx={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h2 className="auth-modal-title">Login Form</h2>
              <TextField
                fullWidth
                id="login-username"
                label="username"
                variant="outlined"
                sx={{ my: "10px", maxWidth: 280 }}
                onChange={handleUsername}
              />
              <TextField
                fullWidth
                id="login-password"
                label="password"
                variant="outlined"
                type="password"
                sx={{ maxWidth: 280 }}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "27px", width: "120px" }}
                variant={"extended"}
                color={"primary"}
                onClick={handleLoginRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>
    </div>
  );
}
