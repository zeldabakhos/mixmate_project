import React, { useState } from "react";
import LabelComp from "../components/LabelComp";
import InputForm from "../components/InputForm";
import.meta.env.VITE_API_URL

const fieldConfig = [
  { name: "firstName", label: "First Name", type: "text", id: "firstNameInput" },
  { name: "lastName", label: "Last Name", type: "text", id: "lastNameInput" },
  { name: "email", label: "Email", type: "email", id: "emailInput" },
  { name: "password", label: "Password", type: "password", id: "passwordInput" },
  // { name: "role", label: "Role", type: "text", id: "roleInput" }, // Remove this line
  { name: "avatar", label: "Avatar", type: "file", id: "avatarInput" },
];

const VITE_API_URL = import.meta.env.VITE_API_URL;

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
  });
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (field) => (e) => {
    if (field === "avatar") {
      setFormData((prev) => ({
        ...prev,
        avatar: e.target.files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  // Handle role select dropdown
  const handleRoleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  // SUBMIT HANDLER
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Error checks
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill out all fields.");
      return;
    }
    if (!formData.role) {
      setError("Please select a role.");
      return;
    }
    if (!formData.avatar) {
      setError("Please select an avatar picture.");
      return;
    }
    setError(""); // Clear error if all good

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch(`${VITE_API_URL}/api/users/signup`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        alert("User created!");
        // Redirect or clear form here
        window.location.href = "/login"; // Optional: Redirect to login
      } else {
        setError(result.message || "Sign-up failed.");
      }
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  return (
    <form
      className="card shadow-sm p-4 w-100"
      style={{ maxWidth: "480px", margin: "auto" }}
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">Sign up</h1>
      {fieldConfig.map(({ name, label, type, id }) => {
        // Skip role here, handle separately
        if (name === "avatar") {
          return (
            <div className="mb-3" key={name}>
              <LabelComp htmlFor={id} displayText={label} />
              <InputForm
                id={id}
                type={type}
                onChange={handleChange(name)}
                accept="image/*"
              />
            </div>
          );
        }
        if (name === "role") return null;
        return (
          <div className="mb-3" key={name}>
            <LabelComp htmlFor={id} displayText={label} />
            <InputForm
              id={id}
              type={type}
              value={formData[name]}
              onChange={handleChange(name)}
              aria-describedby={`${id}Help`}
            />
          </div>
        );
      })}

      {/* Role dropdown */}
      <div className="mb-3">
        <LabelComp htmlFor="roleInput" displayText="Role" />
        <select
          id="roleInput"
          className="form-control"
          value={formData.role}
          onChange={handleRoleChange}
        >
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {error && (
        <div className="alert alert-danger mb-2">{error}</div>
      )}

      <button type="submit" className="btn btn-primary w-100">
        Sign up
      </button>
    </form>
  );
};

export default SignUpPage;
