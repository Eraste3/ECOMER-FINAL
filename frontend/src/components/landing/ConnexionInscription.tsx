import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { User, Mail, Lock, Facebook, Github, Linkedin, Chrome } from "lucide-react";
export default function LoginRegistration({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setMessage("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") || "").trim();

    if (isRegister) {
      setMessage(
        `Account ready for ${username}. Connect this form to your backend.`
      );
    } else {
      setMessage(`Login submitted for ${username}.`);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMessage("Password recovery can be connected to your backend.");
  };

  const handleSocialLogin = (provider: string) => {
    setMessage(`${provider} authentication selected.`);
  };

  return (
    <>
      <style>{`
* { box-sizing: border-box; margin: 0; padding: 0; }
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    color: #252525;
  }

  .auth-wrapper {
    width: min(1050px, 94vw);
    min-height: 610px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Desktop card */
  .card {
    width: 760px;
    min-height: 390px;
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 15px 35px rgba(73, 100, 150, .14);
    display: flex;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  .panel {
    width: 50%;
    padding: 42px 48px;
  }

  .form-panel { order: 2; }
  .welcome-panel {
    order: 1;
    background: #6f92e4;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 0 90px 90px 0;
  }

  h1 {
    font-size: 27px;
    margin-bottom: 22px;
    font-weight: 700;
  }

  .welcome-panel h2 {
    font-size: 27px;
    margin-bottom: 10px;
  }

  .welcome-panel p {
    font-size: 13px;
    margin-bottom: 18px;
  }

  .form {
    width: 100%;
  }

  .input-box {
    height: 37px;
    margin-bottom: 13px;
    position: relative;
  }

  .input-box input {
    width: 100%;
    height: 100%;
    border: 0;
    outline: none;
    border-radius: 5px;
    background: #eeeeee;
    padding: 0 40px 0 14px;
    font-size: 12px;
    color: #333;
  }

  .input-box input::placeholder { color: #8a8a8a; }

  .input-box .icon {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #777;
    font-size: 14px;
    pointer-events: none;
  }

  .forgot {
    display: block;
    text-align: center;
    color: #666;
    font-size: 11px;
    text-decoration: none;
    margin: 2px 0 14px;
  }

  .forgot:hover { text-decoration: underline; }

  .btn {
    width: 100%;
    height: 36px;
    border: 0;
    border-radius: 5px;
    background: #6f92e4;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    font-size: 12px;
    transition: .2s ease;
  }

  .btn:hover { background: #5c82dc; transform: translateY(-1px); }

  .social-title {
    text-align: center;
    font-size: 11px;
    color: #555;
    margin: 13px 0 10px;
  }

  .socials {
    display: flex;
    justify-content: center;
    gap: 9px;
  }

  .social {
    width: 35px;
    height: 34px;
    background: #fff;
    border: 1px solid #d2d2d2;
    border-radius: 5px;
    display: grid;
    place-items: center;
    color: #333;
    font-weight: 700;
    cursor: pointer;
    font-size: 13px;
  }

  .social:hover {
    background: #f3f6fd;
    border-color: #6f92e4;
  }

  .switch-btn {
    min-width: 116px;
    height: 35px;
    padding: 0 18px;
    color: white;
    background: transparent;
    border: 1px solid rgba(255,255,255,.95);
    border-radius: 5px;
    cursor: pointer;
    font-weight: 700;
    font-size: 12px;
  }

  .switch-btn:hover {
    background: rgba(255,255,255,.12);
  }

  /* Decorative background shapes matching the reference */
  .back-register {
    position: absolute;
    width: 610px;
    height: 395px;
    top: 25px;
    left: 155px;
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 15px 35px rgba(73, 100, 150, .10);
    z-index: 1;
    overflow: hidden;
  }

  .back-register .blue {
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
    height: 100%;
    background: #6f92e4;
    border-radius: 0 0 0 90px;
  }

  .back-register .fake-form {
    position: absolute;
    left: 28px;
    top: 34px;
    width: 43%;
    opacity: .72;
  }

  .fake-title {
    font-size: 25px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .fake-input {
    height: 35px;
    background: #eee;
    border-radius: 5px;
    margin-bottom: 13px;
  }

  .back-register .welcome-text {
    position: absolute;
    right: 45px;
    top: 125px;
    width: 42%;
    text-align: center;
    color: white;
  }

  .back-register .welcome-text h2 {
    font-size: 25px;
    margin-bottom: 9px;
  }

  .back-register .welcome-text p {
    font-size: 12px;
    margin-bottom: 17px;
  }

  /* Mobile phone-like preview on the right */
  .phone {
    position: absolute;
    right: 5px;
    top: 66px;
    width: 275px;
    height: 550px;
    background: #fdfdfd;
    border: 10px solid #86a4e8;
    border-radius: 34px;
    z-index: 3;
    box-shadow: 0 12px 25px rgba(70, 95, 140, .10);
    overflow: hidden;
  }

  .phone-top {
    height: 160px;
    background: #6f92e4;
    border-radius: 0 0 90px 90px;
    color: #fff;
    text-align: center;
    padding: 30px 20px 0;
  }

  .phone-top h2 { font-size: 22px; margin-bottom: 9px; }
  .phone-top p { font-size: 10px; margin-bottom: 13px; }

  .phone-content {
    padding: 35px 29px 20px;
  }

  .phone-content h1 {
    text-align: center;
    font-size: 25px;
    margin-bottom: 20px;
  }

  .phone .input-box { height: 36px; }
  .phone .btn { height: 36px; }

  .phone .social-title {
    margin-top: 13px;
    margin-bottom: 10px;
  }

  /* States */
  .card.register-mode .welcome-panel {
    order: 2;
    border-radius: 90px 0 0 90px;
  }

  .card.register-mode .form-panel { order: 1; }

  .message {
    min-height: 15px;
    text-align: center;
    font-size: 11px;
    margin-top: 7px;
    color: #5574bc;
  }

  @media (max-width: 950px) {
    .phone { display: none; }
    .back-register { left: 50%; transform: translateX(-50%); }
  }

  @media (max-width: 700px) {
    .modal-overlay { overflow: auto; padding: 25px 0; }
    .auth-wrapper { min-height: auto; }
    .back-register { display: none; }
    .card {
      width: min(430px, 92vw);
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .panel { width: 100%; }
    .welcome-panel,
    .card.register-mode .welcome-panel {
      order: 1;
      min-height: 220px;
      border-radius: 0 0 90px 90px;
      padding: 35px;
    }
    .form-panel,
    .card.register-mode .form-panel {
      order: 2;
      padding: 35px 32px 40px;
    }
    .card.register-mode { flex-direction: column; }
    .card.register-mode .welcome-panel { order: 2; }
    .card.register-mode .form-panel { order: 1; }
  }
      `}</style>

      {createPortal(
        <div className="modal-overlay">
          <div className="auth-wrapper relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 md:-right-12 md:top-0 text-white hover:text-slate-300 z-50 p-2"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main interactive form */}
            <section className={`card ${isRegister ? "register-mode" : ""}`}>
              <div className="panel welcome-panel">
                <h2>Salut, Bienvenue!</h2>

                <p>
                  {isRegister
                    ? "Tu as déjà un compte ?"
                    : "Tu n'as pas de compte ?"}
                </p>

                <button
                  className="switch-btn"
                  type="button"
                  onClick={toggleMode}
                >
                  {isRegister ? "Connexion" : "Inscription"}
                </button>
              </div>

              <div className="panel form-panel">
                <h1>{isRegister ? "Inscription" : "Connexion"}</h1>

                <form className="form" onSubmit={handleSubmit}>
                  <div className="input-box">
                    <input
                      name="username"
                      type="text"
                      placeholder="Nom d'utilisateur"
                      autoComplete="username"
                      required
                    />

                    <span className="icon"><User size={16} /></span>
                  </div>

                  {isRegister && (
                    <div className="input-box">
                      <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        required
                      />
                      <span className="icon"><Mail size={16} /></span>
                    </div>
                  )}

                  <div className="input-box">
                    <input
                      name="password"
                      type="password"
                      placeholder="Mot de passe"
                      autoComplete={
                        isRegister ? "new-password" : "current-password"
                      }
                      required
                    />
                    <span className="icon"><Lock size={16} /></span>
                  </div>

                  {!isRegister && (
                    <a
                      href="#"
                      className="forgot"
                      onClick={handleForgotPassword}
                    >
                      Oublié mot de passe?
                    </a>
                  )}

                  <button className="btn" type="submit">
                    {isRegister ? "Inscription" : "Connexion"}
                  </button>

                  <div className="message">{message}</div>

                  <div className="social-title">
                    Ou connecte-toi avec les réseaux sociaux
                  </div>

                  <div className="socials">
                    <button
                      className="social"
                      type="button"
                      aria-label="Google"
                      onClick={() => handleSocialLogin("Google")}
                    >
                      <Chrome size={18} />
                    </button>

                    <button
                      className="social"
                      type="button"
                      aria-label="Facebook"
                      onClick={() => handleSocialLogin("Facebook")}
                    >
                      <Facebook size={18} />
                    </button>

                    <button
                      className="social"
                      type="button"
                      aria-label="GitHub"
                      onClick={() => handleSocialLogin("GitHub")}
                    >
                      <Github size={18} />
                    </button>

                    <button
                      className="social"
                      type="button"
                      aria-label="LinkedIn"
                      onClick={() => handleSocialLogin("LinkedIn")}
                    >
                      <Linkedin size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
