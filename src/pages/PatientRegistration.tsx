import React, { useState } from 'react';
import { registerPatient } from '../services/DatabaseService';
import { useDatabaseContext } from '../context/DatabaseContext';

interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  medical_notes: string;
  insurance_provider: string;
  insurance_id: string;
}

const initialFormData: PatientFormData = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  medical_notes: '',
  insurance_provider: '',
  insurance_id: '',
};

const PatientRegistration: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<PatientFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof PatientFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.date_of_birth.trim()) {
      newErrors.date_of_birth = 'Date of birth is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerPatient(formData);
      setSubmitSuccess(true);
      setFormData(initialFormData);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error registering patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-transition max-w-3xl ">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Register New Patient</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter patient information to add them to the system
        </p>
      </header>

      {submitSuccess && (
        <div className="mb-6 bg-success-50 border-l-4 border-success-500 p-4 slide-in rounded">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-success-500 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-success-700 font-semibold">
              Patient registered successfully!
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg divide-y divide-gray-200"
      >
        {/* Personal Information Section */}
        <section className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`mt-1 block py-1 w-full rounded-md border ${
                  errors.first_name
                    ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                    : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'
                } shadow-sm sm:text-sm`}
                required
                autoComplete="given-name"
                aria-invalid={!!errors.first_name}
                aria-describedby="first_name-error"
              />
              {errors.first_name && (
                <p
                  className="mt-1 text-sm text-error-600"
                  id="first_name-error"
                  role="alert"
                >
                  {errors.first_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`mt-1 block py-1 w-full rounded-md border ${
                  errors.last_name
                    ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                    : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'
                } shadow-sm sm:text-sm`}
                required
                autoComplete="family-name"
                aria-invalid={!!errors.last_name}
                aria-describedby="last_name-error"
              />
              {errors.last_name && (
                <p
                  className="mt-1 text-sm text-error-600"
                  id="last_name-error"
                  role="alert"
                >
                  {errors.last_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="date_of_birth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth <span className="text-error-500">*</span>
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={`mt-1 py-1 block w-full rounded-md border ${
                  errors.date_of_birth
                    ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                    : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'
                } shadow-sm sm:text-sm`}
                required
                aria-invalid={!!errors.date_of_birth}
                aria-describedby="date_of_birth-error"
              />
              {errors.date_of_birth && (
                <p
                  className="mt-1 text-sm text-error-600"
                  id="date_of_birth-error"
                  role="alert"
                >
                  {errors.date_of_birth}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender <span className="text-error-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`mt-1 block py-1 w-full rounded-md border ${
                  errors.gender
                    ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                    : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'
                } shadow-sm sm:text-sm`}
                required
                aria-invalid={!!errors.gender}
                aria-describedby="gender-error"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p
                  className="mt-1 text-sm text-error-600"
                  id="gender-error"
                  role="alert"
                >
                  {errors.gender}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="p-6 space-y-6 bg-gray-50 rounded-b-lg">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full py-1 rounded-md py-1 border ${
                  errors.email
                    ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                    : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600'
                } shadow-sm sm:text-sm`}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p
                  className="mt-1 text-sm text-error-600"
                  id="email-error"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block py-1 w-full rounded-md border border-gray-300 focus:ring-primary-600 focus:border-primary-600 shadow-sm sm:text-sm"
                placeholder="(123) 456-7890"
                autoComplete="tel"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block py-1  w-full rounded-md border border-gray-300 focus:ring-primary-600 focus:border-primary-600 shadow-sm sm:text-sm"
                placeholder="Street address, city, state, zip"
                autoComplete="street-address"
              />
            </div>
          </div>
        </section>

        {/* Medical Information Section */}
        <section className="p-6 space-y-6 bg-white rounded-b-lg">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Medical Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="insurance_provider"
                className="block text-sm font-medium text-gray-700"
              >
                Insurance Provider
              </label>
              <input
                type="text"
                id="insurance_provider"
                name="insurance_provider"
                value={formData.insurance_provider}
                onChange={handleChange}
                className="mt-1 block w-full py-1 rounded-md border border-gray-300 focus:ring-primary-600 focus:border-primary-600 shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="insurance_id"
                className="block text-sm font-medium  text-gray-700"
              >
                Insurance ID
              </label>
              <input
                type="text"
                id="insurance_id"
                name="insurance_id"
                value={formData.insurance_id}
                onChange={handleChange}
                className="mt-1 block w-full py-1 rounded-md border border-gray-300 focus:ring-primary-600 focus:border-primary-600 shadow-sm sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="medical_notes"
                className="block text-sm font-medium text-gray-700"
              >
                Medical Notes
              </label>
              <textarea
                id="medical_notes"
                name="medical_notes"
                value={formData.medical_notes}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full  rounded-md border border-gray-300 focus:ring-primary-600 focus:border-primary-600 shadow-sm sm:text-sm resize-y"
                placeholder="Any important medical history or notes"
              />
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="px-6 py-4 bg-white rounded-b-lg flex justify-end gap-4">
          <button
            type="reset"
            onClick={() => {
              setFormData(initialFormData);
              setErrors({});
            }}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-600 disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
