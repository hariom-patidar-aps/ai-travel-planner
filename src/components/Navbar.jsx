import { useState } from "react";

import useAuth from "../hooks/useAuth";

import LoginModal from "./auth/LoginModal";
import SignupModal from "./auth/SignupModal";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-2xl font-bold text-cyan-300">
            ✈ AI Travel Planner
          </h1>

          {loading ? (
            <p className="text-white">Loading...</p>
          ) : user ? (
            <div className="flex items-center gap-4">

              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full"
                />
              )}

              <div className="text-right">

                <p className="text-white font-semibold">
                  {user.displayName || "Traveler"}
                </p>

                <p className="text-slate-300 text-sm">
                  {user.email}
                </p>

              </div>

              <button
                onClick={logout}
                className="secondary-btn"
              >
                Logout
              </button>

            </div>
          ) : (
            <div className="flex gap-3">

              <button
                onClick={() => setShowLogin(true)}
                className="secondary-btn"
              >
                Login
              </button>

              <button
                onClick={() => setShowSignup(true)}
                className="primary-btn"
              >
                Sign Up
              </button>

            </div>
          )}

        </div>

      </nav>

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
      />

      <SignupModal
        open={showSignup}
        onClose={() => setShowSignup(false)}
      />
    </>
  );
}