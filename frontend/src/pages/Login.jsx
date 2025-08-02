import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    if (onLogin) onLogin();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center background-color">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-gray-900 font-bold mb-6 text-center text-2xl">
          Log in to QuickShow
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl"
              required
            />
            <div className="text-right mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 hover:bg-primary-dull rounded-xl"
          >
            Log in
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-800">
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
