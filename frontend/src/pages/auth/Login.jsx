import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FiUser, FiLock, FiAlertCircle, FiHeart } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await login(email, password);

      if (!result.success) {
        setError(result.message || "Invalid email or password");
      } else {
        // ✅ Navigate here only after success
        const role = result.role;
        if (role === "admin") navigate("/admin");
        else if (role === "coordinator") navigate("/coordinator");
        else if (role === "nurse") navigate("/nurse");
        else if (role === "carer") navigate("/carer");
        else if (role === "resident") navigate("/resident");
        else if (role === "family") navigate("/family");
        else navigate("/");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role) => {
    switch (role) {
      case "admin":
        setEmail("admin@care.com");
        setPassword("admin123");
        break;
      case "coordinator":
        setEmail("coordinator@ihealth.com");
        setPassword("coordinator123");
        break;
      case "nurse":
        setEmail("nurse@ihealth.com");
        setPassword("nurse123");
        break;
      case "carer":
        setEmail("carer@ihealth.com");
        setPassword("carer123");
        break;
      case "family":
        setEmail("family@ihealth.com");
        setPassword("family123");
        break;
      case "resident":
        setEmail("resident@ihealth.com");
        setPassword("resident123");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <FiHeart className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900">
            Welcome to IHealth
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            We care for your family ❤️
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="text-2xl font-display font-semibold text-center text-gray-900">
                Sign in to your account
              </h2>
            </div>

            {error && (
              <div className="mt-6 flex items-center p-4 bg-red-50 rounded-lg text-sm text-red-800">
                <FiAlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-shadow duration-200 "
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-shadow duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" color="white" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Quick Login
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("coordinator")}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Coordinator Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("nurse")}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Nurse Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("carer")}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Carer Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("family")}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Family Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("resident")}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  Resident Demo
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New to Care Connect?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Create a family account →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a
              href="#terms"
              className="text-primary-600 hover:text-primary-700"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#privacy"
              className="text-primary-600 hover:text-primary-700"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
