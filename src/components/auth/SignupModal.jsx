import { useState } from "react";
import {
  signupWithEmail,
  loginWithGoogle,
} from "../../services/authService";

export default function SignupModal({
  open,
  onClose,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSignup(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await signupWithEmail(
        name,
        email,
        password
      );

      onClose();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  async function handleGoogleSignup() {
    setLoading(true);
    setError("");

    try {
      await loginWithGoogle();

      onClose();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="glass w-full max-w-md rounded-3xl p-8">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account 🚀
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-300 rounded-xl p-3 mb-5">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSignup}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="primary-btn w-full"
          >
            {loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>

        </form>

        <div className="my-5 text-center text-slate-300">
          OR
        </div>

        <button
          onClick={handleGoogleSignup}
          className="secondary-btn w-full"
        >
          Continue with Google
        </button>

        <button
          onClick={onClose}
          className="mt-5 w-full text-slate-300 hover:text-white"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}