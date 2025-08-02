import { useNavigate } from "react-router-dom";

const Register = ({ onRegister }) => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    if (onRegister) onRegister();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-gray-900 font-bold mb-6 text-center text-2xl">
          Sign up for QuickShow
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary-dull transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-800">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;