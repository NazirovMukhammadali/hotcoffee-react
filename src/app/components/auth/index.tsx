import React, { FormEvent, useState } from "react";
import { Backdrop, Fade, IconButton, Modal } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import BrandMark from "../common/BrandMark";
import "../../../css/auth.css";

interface AuthenticationModalProps {
  authOpen: boolean;
  onClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { authOpen, onClose } = props;
  const [view, setView] = useState<"login" | "signup">("login");
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { setAuthMember } = useGlobals();

  const handleClose = () => {
    setView("login");
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    onClose();
  };

  const handleSignupRequest = async () => {
    const isFullFill = memberNick !== "" && memberPhone !== "" && memberPassword !== "";
    if (!isFullFill) throw new Error(Messages.error3);

    const signupInput: MemberInput = { memberNick, memberPhone, memberPassword };
    const result = await new MemberService().signup(signupInput);
    setAuthMember(result);
    sweetTopSmallSuccessAlert(`Welcome to HotCoffee, ${result.memberNick}!`, 2000);
  };

  const handleLoginRequest = async () => {
    const isFullFill = memberNick !== "" && memberPassword !== "";
    if (!isFullFill) throw new Error(Messages.error3);

    const loginInput: LoginInput = { memberNick, memberPassword };
    const result = await new MemberService().login(loginInput);
    setAuthMember(result);
    sweetTopSmallSuccessAlert(`Welcome back, ${result.memberNick}!`, 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (view === "signup") await handleSignupRequest();
      else await handleLoginRequest();
      handleClose();
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    } finally {
      setSubmitting(false);
    }
  };

  const isLogin = view === "login";

  return (
    <Modal
      aria-labelledby="auth-modal-title"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
      open={authOpen}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 400, className: "auth-backdrop" } }}
    >
      <Fade in={authOpen}>
        <div className="auth-card">
          <aside className="auth-visual" aria-hidden="true" style={{ backgroundImage: "url(/img/events/latte-art.jpg)" }}>
            <div className="auth-visual-inner">
              <BrandMark size={44} />
              <h3>{isLogin ? "Your usual is waiting." : "Join the regulars."}</h3>
              <p>Order ahead, skip the queue and collect loyalty points with every paid order.</p>
            </div>
          </aside>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <IconButton className="auth-close" aria-label="Close" onClick={handleClose} size="small">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>

            <span className="eyebrow">{isLogin ? "Welcome back" : "New here?"}</span>
            <h2 id="auth-modal-title">{isLogin ? "Sign in" : "Create account"}</h2>
            <p className="auth-sub">
              {isLogin ? "Sign in to order and track your coffee." : "It takes less than a minute."}
            </p>

            <div className="field">
              <label htmlFor="auth-nick">Username</label>
              <input
                id="auth-nick"
                className="input"
                placeholder="e.g. sofia.latte"
                autoComplete="username"
                value={memberNick}
                onChange={(e) => setMemberNick(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="field">
                <label htmlFor="auth-phone">Phone</label>
                <input
                  id="auth-phone"
                  className="input"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  autoComplete="tel"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                className="input"
                type="password"
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={memberPassword}
                onChange={(e) => setMemberPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
              {submitting ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
            </button>

            <p className="auth-switch">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => setView(isLogin ? "signup" : "login")}>
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </form>
        </div>
      </Fade>
    </Modal>
  );
}
