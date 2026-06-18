"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [signUp, setSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = signUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    onClose();
    if (!pathname.startsWith("/settings")) {
      router.push("/for-you");
    }
  }

  async function handleGoogle() {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(pathname)}`,
      },
    });
  }

  async function handleForgotPassword() {
    setError(null);

    if (!email) {
      setError("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setError(null);
  }

  return (
    <div onClick={onClose} className="auth__wrapper">
      <div className="auth" onClick={(e) => e.stopPropagation()}>
        <div className="auth__content">
          <div className="auth__close--btn">
            <IoMdClose onClick={onClose} strokeWidth={0} />
          </div>
          {signUp ? (
            <div className="auth__title">Sign up to Summarist</div>
          ) : (
            <div className="auth__title">Log in to Summarist</div>
          )}
          {!signUp ? (
            <>
              <Link href="/for-you" className="btn guest__btn--wrapper">
                <figure className="google__icon--mask guest__icon--mask ">
                  <FaUser style={{ width: "24px", height: "24px" }} />
                </figure>
                Login as a Guest
              </Link>
              <div className="auth__separator">
                <span className="auth__separator--text">or</span>
              </div>
            </>
          ) : (
            <></>
          )}
          <button
            type="button"
            onClick={handleGoogle}
            className="btn google__btn--wrapper"
          >
            <figure className="google__icon--mask">
              <img className="google__icon" src="/google.png" alt="google" />
            </figure>
            {signUp ? "Sign up with Google" : "Login with Google"}
          </button>
          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>
          {error && <p>{error}</p>}
          <form onSubmit={handleSubmit} className="auth__main--form">
            <input
              className="auth__main--input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            ></input>
            <input
              className="auth__main--input"
              type="password"
              value={password}
              onChange={(p) => setPassword(p.target.value)}
              placeholder="Password"
            ></input>
            <button disabled={loading} className="btn">
              <span>{signUp ? "Sign up" : "Login"}</span>
            </button>
          </form>
        </div>
        {!signUp ? (
          <div
            role="button"
            onClick={handleForgotPassword}
            className="auth__forgot--password"
          >
            Forgot your password?
          </div>
        ) : null}
        <button
          onClick={() => {
            signUp ? setSignUp(false) : setSignUp(true);
          }}
          className="auth__switch--btn"
        >
          {!signUp ? "Don't have an account?" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
}
