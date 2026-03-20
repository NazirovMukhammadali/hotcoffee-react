import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, Button, IconButton, Stack, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
}));

interface AuthenticationModalProps {
  authOpen: boolean;
  onClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { authOpen, onClose } = props;
  const classes = useStyles();
  const [view, setView] = useState<"login" | "signup">("login");
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const { setAuthMember } = useGlobals();

  const handleUsername = (e: T) => setMemberNick(e.target.value);
  const handlePhone = (e: T) => setMemberPhone(e.target.value);
  const handlePassword = (e: T) => setMemberPassword(e.target.value);

  const handleClose = () => {
    setView("login");
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    onClose();
  };

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && view === "signup") handleSignupRequest();
    else if (e.key === "Enter" && view === "login") handleLoginRequest();
  };

  const handleSignupRequest = async () => {
    try {
      const isFullFill = memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFullFill) throw new Error(Messages.error3);

      const signupInput: MemberInput = {
        memberNick,
        memberPhone,
        memberPassword,
      };
      const member = new MemberService();
      const result = await member.signup(signupInput);
      setAuthMember(result);
      handleClose();
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      const isFullFill = memberNick !== "" && memberPassword !== "";
      if (!isFullFill) throw new Error(Messages.error3);

      const loginInput: LoginInput = { memberNick, memberPassword };
      const member = new MemberService();
      const result = await member.login(loginInput);
      setAuthMember(result);
      setMemberPassword("");
      handleClose();
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Modal
      aria-labelledby="auth-modal-title"
      className={classes.modal}
      open={authOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500, className: "auth-modal-backdrop" }}
    >
      <Fade in={authOpen}>
        <Box className="auth-modal-glass">
          <IconButton className="auth-modal-close" onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>

          {view === "login" ? (
            <Stack className="auth-modal-content" spacing={2}>
              <h2 className="auth-modal-title">Welcome Back</h2>
              <p className="auth-modal-subtitle">Sign in to continue</p>
              <TextField
                fullWidth
                placeholder="Username"
                value={memberNick}
                onChange={handleUsername}
                className="auth-modal-input"
                variant="outlined"
              />
              <TextField
                fullWidth
                placeholder="Password"
                type="password"
                value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
                className="auth-modal-input"
                variant="outlined"
              />
              <Button
                fullWidth
                variant="outlined"
                className="auth-modal-btn"
                onClick={handleLoginRequest}
              >
                LOGIN
              </Button>
              <p className="auth-modal-footer">
                Don&apos;t have an account?{" "}
                <button type="button" className="auth-modal-link" onClick={() => setView("signup")}>
                  SIGN UP
                </button>
              </p>
            </Stack>
          ) : (
            <Stack className="auth-modal-content" spacing={2}>
              <h2 className="auth-modal-title">Create Account</h2>
              <p className="auth-modal-subtitle">Join us for the best coffee</p>
              <TextField
                fullWidth
                placeholder="Username"
                value={memberNick}
                onChange={handleUsername}
                className="auth-modal-input"
                variant="outlined"
              />
              <TextField
                fullWidth
                placeholder="Phone number"
                value={memberPhone}
                onChange={handlePhone}
                className="auth-modal-input"
                variant="outlined"
              />
              <TextField
                fullWidth
                placeholder="Password"
                type="password"
                value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
                className="auth-modal-input"
                variant="outlined"
              />
              <Button
                fullWidth
                variant="outlined"
                className="auth-modal-btn"
                onClick={handleSignupRequest}
              >
                SIGN UP
              </Button>
              <p className="auth-modal-footer">
                Already have an account?{" "}
                <button type="button" className="auth-modal-link" onClick={() => setView("login")}>
                  LOGIN
                </button>
              </p>
            </Stack>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
