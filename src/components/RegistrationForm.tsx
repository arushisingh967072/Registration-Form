import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { validateEmail, isDisposableEmail } from '../utils/validation';
import { countryData } from '../data/locations';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  address: string;
  country: string;
  state: string;
  city: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

type PasswordStrength = 'Weak' | 'Medium' | 'Strong' | '';

function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    country: '',
    state: '',
    city: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const countries = Object.keys(countryData);
  const states = formData.country ? Object.keys(countryData[formData.country] || {}) : [];
  const cities = formData.country && formData.state
    ? countryData[formData.country]?.[formData.state] || []
    : [];

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (touched.firstName && !formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }

    if (touched.lastName && !formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }

    if (touched.email) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (isDisposableEmail(formData.email)) {
        newErrors.email = 'Disposable email addresses are not allowed';
      }
    }

    if (touched.phone) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!formData.phone.startsWith(countryCode)) {
        newErrors.phone = `Phone must start with ${countryCode}`;
      } else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
      }
    }

    if (touched.gender && !formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (touched.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (touched.confirmPassword) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (touched.terms && !formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);

    const requiredFieldsFilled =
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.gender &&
      formData.password &&
      formData.confirmPassword &&
      formData.terms;

    setIsFormValid(requiredFieldsFilled && Object.keys(newErrors).length === 0);
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return '';

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (name === 'country') {
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        state: '',
        city: '',
      }));

      const selectedCountry = countryData[value as keyof typeof countryData];
      if (selectedCountry) {
        const code = selectedCountry.__countryCode || '+1';
        setCountryCode(code);
        setFormData(prev => ({
          ...prev,
          country: value,
          phone: code,
          state: '',
          city: '',
        }));
      }
    } else if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        city: '',
      }));
    } else if (name === 'password') {
      setFormData(prev => ({ ...prev, [name]: newValue }));
      setPasswordStrength(calculatePasswordStrength(value));
    } else if (name === 'phone') {
      if (!value.startsWith(countryCode)) {
        setFormData(prev => ({ ...prev, [name]: countryCode }));
      } else {
        setFormData(prev => ({ ...prev, [name]: newValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }

    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allFields = Object.keys(formData);
    const newTouched: { [key: string]: boolean } = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    if (!isFormValid) {
      setGeneralError('Please fix all errors before submitting the form');
      return;
    }

    setGeneralError('');
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        address: '',
        country: '',
        state: '',
        city: '',
        password: '',
        confirmPassword: '',
        terms: false,
      });
      setTouched({});
      setPasswordStrength('');
      setCountryCode('+1');
    }, 3000);
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors";
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500`;
    }
    return `${baseClass} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case 'Weak': return 'w-1/3';
      case 'Medium': return 'w-2/3';
      case 'Strong': return 'w-full';
      default: return 'w-0';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Registration Form</h1>
          <p className="text-blue-100 mt-2">Please fill in all required fields to create your account</p>
        </div>

        {showSuccess && (
          <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3" id="success-message">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">Registration Successful!</h3>
              <p className="text-green-700 text-sm mt-1">Your profile has been submitted successfully.</p>
            </div>
          </div>
        )}

        {generalError && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3" id="error-message">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm mt-1">{generalError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8" id="registration-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('firstName')}
                placeholder="Enter your first name"
              />
              {errors.firstName && touched.firstName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('lastName')}
                placeholder="Enter your last name"
              />
              {errors.lastName && touched.lastName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('email')}
                placeholder="your.email@example.com"
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('phone')}
                placeholder={`${countryCode}1234567890`}
              />
              {errors.phone && touched.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('age')}
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('gender')}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && touched.gender && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gender}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('address')}
                placeholder="Enter your street address"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('country')}
              >
                <option value="">Select country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('state')}
                disabled={!formData.country}
              >
                <option value="">Select state</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('city')}
                disabled={!formData.state}
              >
                <option value="">Select city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div />

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName('password')}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Password Strength:</span>
                    <span className={`font-medium ${
                      passwordStrength === 'Weak' ? 'text-red-600' :
                      passwordStrength === 'Medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`} id="password-strength">{passwordStrength}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`} />
                  </div>
                </div>
              )}
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName('confirmPassword')}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                I accept the <span className="text-blue-600 font-medium">Terms and Conditions</span> <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.terms && touched.terms && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1 ml-8">
                <AlertCircle className="w-4 h-4" />
                {errors.terms}
              </p>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              id="submit-button"
              disabled={!isFormValid}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Registration
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  age: '',
                  gender: '',
                  address: '',
                  country: '',
                  state: '',
                  city: '',
                  password: '',
                  confirmPassword: '',
                  terms: false,
                });
                setTouched({});
                setPasswordStrength('');
                setGeneralError('');
                setCountryCode('+1');
              }}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Fields marked with <span className="text-red-500">*</span> are required</p>
      </div>
    </div>
  );
}

export default RegistrationForm;
