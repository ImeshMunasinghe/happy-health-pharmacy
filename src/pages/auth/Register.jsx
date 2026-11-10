import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

const CATEGORIES = [
  "Medicine",
  "Equipment",
  "Surgical Supplies",
  "Baby Items",
  "Skin Care",
];

const inputCls = (err) =>
  `w-full px-4 py-3 rounded-xl border-2 text-sm text-slate-800 outline-none transition-all
   disabled:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed
   ${
     err
       ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100"
       : "border-slate-200 focus:border-[#16734B] focus:ring-4 focus:ring-[#16734B]/10"
   }`;

const Field = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = true,
  disabled,
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-slate-800">
      {label} {required && <span className="text-red-500">*</span>}
      {!required && (
        <span className="text-slate-400 font-normal"> (Optional)</span>
      )}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={inputCls(error)}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

const PasswordRequirements = ({ password }) => {
  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least one number", met: /[0-9]/.test(password) },
    {
      label: "At least one special character (!@#$%^&*)",
      met: /[!@#$%^&*]/.test(password),
    },
  ];
  return (
    <div className="mt-1 flex flex-col gap-1">
      {rules.map((rule) => (
        <div key={rule.label} className="flex items-center gap-2">
          <span
            className={`text-xs font-bold ${rule.met ? "text-emerald-500" : "text-slate-400"}`}
          >
            {rule.met ? "✓" : "✗"}
          </span>
          <span
            className={`text-xs ${rule.met ? "text-emerald-600" : "text-slate-400"}`}
          >
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = true,
  disabled,
  showReqs = false,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
        {!required && (
          <span className="text-slate-400 font-normal"> (Optional)</span>
        )}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputCls(error) + " pr-11"}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#16734B] transition-colors focus:outline-none"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {showReqs && value.length > 0 && (
        <PasswordRequirements password={value} />
      )}
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState("customer");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Customer fields
  const [formData, setFormData] = useState({
    // shared
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    // supplier only
    contactPerson: "",
    businessRegNo: "",
    businessAddress: "",
    categories: [],
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    // pharmacist only
    nicNumber: "",
    licenseNumber: "",
    licenseExpiry: "",
    specialization: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleCategory = (cat) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Sri Lanka phone: 07XXXXXXXX or +94XXXXXXXXX
  const validatePhone = (phone) =>
    /^(\+94)[0-9]{9}$/.test(phone) || /^07[0-9]{8}$/.test(phone);

  // NIC: old 9 digits + V/X, or new 12 digits
  const validateNIC = (nic) =>
    /^[0-9]{9}[VvXx]$/.test(nic) || /^[0-9]{12}$/.test(nic);

  const validatePassword = (password, errs, field = "password") => {
    if (!password) errs[field] = "Password is required";
    else if (password.length < 8) errs[field] = "Minimum 8 characters";
    else if (!/[A-Z]/.test(password))
      errs[field] = "Must contain an uppercase letter";
    else if (!/[0-9]/.test(password)) errs[field] = "Must contain a number";
    else if (!/[!@#$%^&*]/.test(password))
      errs[field] = "Must contain a special character (!@#$%^&*)";
  };

  const validate = () => {
    const e = {};

    if (role === "customer") {
      if (!formData.fullName.trim()) e.fullName = "Full name is required";
      if (!formData.email.trim()) e.email = "Email is required";
      else if (!validateEmail(formData.email))
        e.email = "Invalid email address";
      validatePassword(formData.password, e);
      if (!formData.confirmPassword)
        e.confirmPassword = "Please confirm password";
      else if (formData.password !== formData.confirmPassword)
        e.confirmPassword = "Passwords do not match";
      // Phone is optional but must be valid format if provided
      if (formData.phone.trim() && !validatePhone(formData.phone.trim()))
        e.phone = "Enter a valid phone number (e.g. 0771234567 or +94771234567)";
    }

    if (role === "supplier") {
      if (!formData.companyName.trim())
        e.companyName = "Company name is required";
      if (!formData.email.trim()) e.email = "Email is required";
      else if (!validateEmail(formData.email))
        e.email = "Invalid email address";
      validatePassword(formData.password, e);
      if (!formData.confirmPassword)
        e.confirmPassword = "Please confirm password";
      else if (formData.password !== formData.confirmPassword)
        e.confirmPassword = "Passwords do not match";
      if (!formData.contactPerson.trim())
        e.contactPerson = "Contact person is required";
      if (!formData.phone.trim()) {
        e.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone.trim())) {
        e.phone = "Enter a valid phone number (e.g. 0771234567 or +94771234567)";
      }
      if (!formData.businessRegNo.trim())
        e.businessRegNo = "Business registration number is required";
      else if (formData.businessRegNo.trim().length < 5)
        e.businessRegNo = "Enter a valid registration number (min 5 characters)";
      if (!formData.businessAddress.trim())
        e.businessAddress = "Business address is required";
      if (!formData.bankName.trim()) e.bankName = "Bank name is required";
      if (!formData.accountNumber.trim()) {
        e.accountNumber = "Account number is required";
      } else if (!/^[0-9]{8,16}$/.test(formData.accountNumber.trim())) {
        e.accountNumber = "Account number must be 8–16 digits only";
      }
      if (!formData.accountHolderName.trim())
        e.accountHolderName = "Account holder name is required";
    }

    if (role === "pharmacist") {
      if (!formData.fullName.trim()) e.fullName = "Full name is required";
      if (!formData.email.trim()) e.email = "Email is required";
      else if (!validateEmail(formData.email))
        e.email = "Invalid email address";
      validatePassword(formData.password, e);
      if (!formData.confirmPassword)
        e.confirmPassword = "Please confirm password";
      else if (formData.password !== formData.confirmPassword)
        e.confirmPassword = "Passwords do not match";
      if (!formData.phone.trim()) {
        e.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone.trim())) {
        e.phone = "Enter a valid phone number (e.g. 0771234567 or +94771234567)";
      }
      if (!formData.nicNumber.trim()) {
        e.nicNumber = "NIC number is required";
      } else if (!validateNIC(formData.nicNumber.trim())) {
        e.nicNumber = "Enter a valid NIC (e.g. 987654321V or 200012345678)";
      }
      if (!formData.licenseNumber.trim()) {
        e.licenseNumber = "License number is required";
      } else if (!/^[A-Za-z0-9\-]{5,}$/.test(formData.licenseNumber.trim())) {
        e.licenseNumber = "Enter a valid license number (e.g. PH-12345-2024)";
      }
      if (!formData.licenseExpiry) {
        e.licenseExpiry = "License expiry date is required";
      } else if (new Date(formData.licenseExpiry) <= new Date()) {
        e.licenseExpiry = "License expiry date must be a future date";
      }
      if (!formData.specialization.trim())
        e.specialization = "Specialization is required";
    }

    if (role === "admin") {
      if (!formData.fullName.trim()) e.fullName = "Full name is required";
      if (!formData.email.trim()) e.email = "Email is required";
      else if (!validateEmail(formData.email))
        e.email = "Invalid email address";
      validatePassword(formData.password, e);
      if (!formData.confirmPassword)
        e.confirmPassword = "Please confirm password";
      else if (formData.password !== formData.confirmPassword)
        e.confirmPassword = "Passwords do not match";
      if (formData.phone.trim() && !validatePhone(formData.phone.trim()))
        e.phone = "Enter a valid phone number (e.g. 0771234567 or +94771234567)";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});
    if (!validate()) return;

    setLoading(true);
    try {
      // Pass formData directly with role
      await register({ ...formData, role });

      setSuccessMessage("Registration successful! Welcome to Happy Health!");
      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else if (role === "supplier") navigate("/supplier");
        else if (role === "pharmacist") navigate("/pharmacist");
        else navigate("/customer");
      }, 1500);
    } catch (error) {
      setErrors({
        submit: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoData = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    if (role === "customer") {
      setFormData({
        fullName: "Test Customer",
        email: `customer${randomSuffix}@happyhealth.lk`,
        phone: "0771234567",
        password: "Password@123",
        confirmPassword: "Password@123",
        companyName: "",
        contactPerson: "",
        businessRegNo: "",
        businessAddress: "",
        categories: [],
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        nicNumber: "",
        licenseNumber: "",
        licenseExpiry: "",
        specialization: "",
      });
    } else if (role === "pharmacist") {
      setFormData({
        fullName: "Dr. Sanduni Perera",
        email: `pharmacist${randomSuffix}@happyhealth.lk`,
        phone: "0719876543",
        password: "Password@123",
        confirmPassword: "Password@123",
        nicNumber: "199512345678",
        licenseNumber: "PH-88990-2025",
        licenseExpiry: "2028-12-31",
        specialization: "Clinical Pharmacy & Dispensing",
        companyName: "",
        contactPerson: "",
        businessRegNo: "",
        businessAddress: "",
        categories: [],
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
      });
    } else if (role === "supplier") {
      setFormData({
        companyName: "Ceylon MediSupply Ltd",
        email: `supplier${randomSuffix}@happyhealth.lk`,
        contactPerson: "Nalaka Fernando",
        phone: "0765544332",
        password: "Password@123",
        confirmPassword: "Password@123",
        businessRegNo: "PV/99882/2021",
        businessAddress: "45 Dharmapala Mawatha, Colombo 07",
        categories: ["Medicine", "Surgical Supplies"],
        bankName: "Commercial Bank",
        accountNumber: "10023456789",
        accountHolderName: "Ceylon MediSupply Ltd",
        fullName: "",
        nicNumber: "",
        licenseNumber: "",
        licenseExpiry: "",
        specialization: "",
      });
    } else if (role === "admin") {
      setFormData({
        fullName: "Prof. K. Wickramasinghe",
        email: `admin${randomSuffix}@happyhealth.lk`,
        phone: "0778899001",
        password: "Password@123",
        confirmPassword: "Password@123",
        companyName: "",
        contactPerson: "",
        businessRegNo: "",
        businessAddress: "",
        categories: [],
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        nicNumber: "",
        licenseNumber: "",
        licenseExpiry: "",
        specialization: "",
      });
    }
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10573A] via-[#16734B] to-[#238C5D] px-4 py-8 relative overflow-hidden">
      <div className="absolute top-[-90px] right-[-90px] w-72 h-72 rounded-full bg-white/10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-140px] left-[-140px] w-96 h-96 rounded-full bg-white/10 animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 right-[8%] w-52 h-52 rounded-full bg-white/10 animate-pulse pointer-events-none" />

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-lg px-6 sm:px-10 py-8 sm:py-12 animate-[slideUp_0.5s_ease]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#10573A] to-[#16734B] bg-clip-text text-transparent">
            Happy Health
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Pharmacy Management Information System
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-7">
          <Link
            to="/login"
            className="flex-1 py-3 rounded-xl text-center text-sm font-bold border-2 border-slate-200 bg-slate-50 text-slate-500 hover:bg-[#EBF5EE] hover:text-[#16734B] transition-colors"
          >
            Login
          </Link>
          <span className="flex-1 py-3 rounded-xl text-center text-sm font-bold bg-gradient-to-r from-[#16734B] to-[#10573A] text-white shadow-md shadow-[#16734B]/20">
            Register
          </span>
        </div>

        {/* Role Dropdown */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-800">
              Register As
            </label>
            <button
              type="button"
              onClick={fillDemoData}
              className="text-xs font-semibold text-[#16734B] hover:text-[#10573A] bg-[#EBF5EE] hover:bg-[#d8ede0] px-2.5 py-1 rounded-lg border border-[#16734B]/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              ⚡ Fill Sample Test Data
            </button>
          </div>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setErrors({});
              setSuccessMessage("");
              setFormData({
                fullName: "",
                companyName: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
                contactPerson: "",
                businessRegNo: "",
                businessAddress: "",
                categories: [],
                bankName: "",
                accountNumber: "",
                accountHolderName: "",
                nicNumber: "",
                licenseNumber: "",
                licenseExpiry: "",
                specialization: "",
              });
            }}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-800 outline-none focus:border-[#16734B] focus:ring-4 focus:ring-[#16734B]/10 transition-all bg-white disabled:opacity-60"
          >
            <option value="customer">Customer (Patient Storefront)</option>
            <option value="pharmacist">Pharmacist (Clinical Operations)</option>
            <option value="supplier">Supplier (Supply Chain)</option>
            <option value="admin">Administrator (Management & MIS)</option>
          </select>
        </div>

        {/* Instant test notice */}
        <div className="flex items-start gap-3 bg-[#EBF5EE] border-2 border-[#16734B]/20 text-[#10573A] rounded-xl px-4 py-3 mb-6 text-xs font-medium">
          <span className="text-base mt-0.5">⚡</span>
          <span>
            <strong>Direct Role Provisioning Active:</strong> Account credentials will be immediately activated with full portal access.
          </span>
        </div>

        {/* Success */}
        {successMessage && (
          <div className="flex items-start gap-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 rounded-xl px-5 py-4 mb-6 text-sm font-medium">
            <span className="text-lg">✓</span>
            {successMessage}
          </div>
        )}

        {/* Error */}
        {errors.submit && (
          <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6 text-sm font-medium">
            <span className="text-lg">⚠</span>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* ── CUSTOMER FIELDS ── */}
          {role === "customer" && (
            <>
              <Field
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Field
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required={false}
              />
              <PasswordField
                label="Password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                showReqs={true}
              />
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </>
          )}

          {/* ── SUPPLIER FIELDS ── */}
          {role === "supplier" && (
            <>
              <Field
                label="Company Name"
                name="companyName"
                placeholder="e.g. ABC Pharmaceuticals Ltd"
                value={formData.companyName}
                onChange={handleChange}
                error={errors.companyName}
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="company@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Field
                label="Contact Person Name"
                name="contactPerson"
                placeholder="Contact person full name"
                value={formData.contactPerson}
                onChange={handleChange}
                error={errors.contactPerson}
              />
              <Field
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <Field
                label="Business Registration Number"
                name="businessRegNo"
                placeholder="e.g. PV/00123/2020"
                value={formData.businessRegNo}
                onChange={handleChange}
                error={errors.businessRegNo}
              />
              <Field
                label="Business Address"
                name="businessAddress"
                placeholder="Full business address"
                value={formData.businessAddress}
                onChange={handleChange}
                error={errors.businessAddress}
              />

              {/* Categories */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-800">
                  Product Categories{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      disabled={loading}
                      className={`py-2 px-3 rounded-xl border-2 text-xs font-semibold transition-all disabled:opacity-50
                        ${
                          formData.categories.includes(cat)
                            ? "bg-[#16734B] text-white border-[#16734B]"
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-[#EBF5EE]"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <Field
                label="Bank Name"
                name="bankName"
                placeholder="e.g. Commercial Bank"
                value={formData.bankName}
                onChange={handleChange}
                error={errors.bankName}
              />
              <Field
                label="Account Number"
                name="accountNumber"
                placeholder="e.g. 1234567890"
                value={formData.accountNumber}
                onChange={handleChange}
                error={errors.accountNumber}
              />
              <Field
                label="Account Holder Name"
                name="accountHolderName"
                placeholder="Name on bank account"
                value={formData.accountHolderName}
                onChange={handleChange}
                error={errors.accountHolderName}
              />

              <PasswordField
                label="Password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                showReqs={true}
              />
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </>
          )}

          {/* ── PHARMACIST FIELDS ── */}
          {role === "pharmacist" && (
            <>
              <Field
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Field
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <Field
                label="NIC Number"
                name="nicNumber"
                placeholder="e.g. 200012345678"
                value={formData.nicNumber}
                onChange={handleChange}
                error={errors.nicNumber}
              />
              <Field
                label="Pharmacist License Number"
                name="licenseNumber"
                placeholder="e.g. PH-12345-2024"
                value={formData.licenseNumber}
                onChange={handleChange}
                error={errors.licenseNumber}
              />
              <Field
                label="License Expiry Date"
                name="licenseExpiry"
                type="date"
                value={formData.licenseExpiry}
                onChange={handleChange}
                error={errors.licenseExpiry}
              />
              <Field
                label="Specialization"
                name="specialization"
                placeholder="e.g. Clinical Pharmacy, General"
                value={formData.specialization}
                onChange={handleChange}
                error={errors.specialization}
              />

              <PasswordField
                label="Password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                showReqs={true}
              />
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </>
          )}

          {/* ── ADMIN FIELDS ── */}
          {role === "admin" && (
            <>
              <Field
                label="Full Name"
                name="fullName"
                placeholder="e.g. Prof. K. Wickramasinghe"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="admin@happyhealth.lk"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Field
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required={false}
              />
              <PasswordField
                label="Password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                showReqs={true}
              />
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 py-4 rounded-2xl bg-gradient-to-r from-[#16734B] to-[#10573A] text-white text-base font-extrabold shadow-lg shadow-[#16734B]/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#16734B]/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Register;
