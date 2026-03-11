'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../context/AppContext';
import AppHeader from '../components/AppHeader';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerUser } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    invitationCode: searchParams?.get('invite') || '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'Image must be under 25MB.' }));
        return;
      }
      setErrors(prev => ({ ...prev, profileImage: '' }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.invitationCode.trim()) {
      newErrors.invitationCode = 'Invitation code is required';
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

    const socialLinks: any = {};
    if (formData.instagram) socialLinks.instagram = formData.instagram;
    if (formData.facebook) socialLinks.facebook = formData.facebook;
    if (formData.twitter) socialLinks.twitter = formData.twitter;
    if (formData.linkedin) socialLinks.linkedin = formData.linkedin;

    const success = await registerUser(
      {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || undefined,
        socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
        profileImage: profileImage || undefined,
        password: formData.password,
      },
      formData.invitationCode
    );

    setIsSubmitting(false);

    if (success) {
      // Redirect to profile page after successful registration
      // The user is automatically authenticated via local storage
      router.replace('/profile');
    } else {
      setErrors({ 
        invitationCode: 'Registration failed. Please check your invitation code and try again.' 
      });
    }
  };

  return (
    <div className="registration-page">
      <AppHeader />
      <div className="registration-content">
        <h1 className="page-title">Join Rendezvous</h1>
        <p className="page-subtitle">Register to become a member of our exclusive social club</p>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Profile Image Upload */}
          <div className="form-group">
            <label className="form-label">Profile Image (Optional)</label>
            <div className="image-upload-container">
              {profileImage ? (
                <div className="image-preview">
                  <img src={profileImage} alt="Profile preview" />
                  <button
                    type="button"
                    onClick={() => setProfileImage(null)}
                    className="remove-image-btn"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="image-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload-input"
                  />
                  <div className="image-upload-placeholder">
                    <span>📷</span>
                    <span>Upload Photo</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="your.email@example.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="At least 6 characters"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="+34 123 456 789"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Your address (optional)"
            />
          </div>

          {/* Social Links */}
          <div className="form-section">
            <h3 className="form-section-title">Social Links (Optional)</h3>
            
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="form-input"
                placeholder="@username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Facebook profile URL"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Twitter</label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="form-input"
                placeholder="@username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="form-input"
                placeholder="LinkedIn profile URL"
              />
            </div>
          </div>

          {/* Invitation Code */}
          <div className="form-group">
            <label className="form-label">
              Invitation Code <span className="required">*</span>
            </label>
            <input
              type="text"
              name="invitationCode"
              value={formData.invitationCode}
              onChange={handleInputChange}
              className={`form-input ${errors.invitationCode ? 'error' : ''}`}
              placeholder="Enter your invitation code"
            />
            {errors.invitationCode && (
              <span className="error-message">{errors.invitationCode}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;

