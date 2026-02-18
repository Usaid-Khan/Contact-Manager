import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const CreateContactModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    emailAddresses: [{ email: '', type: 'WORK' }],
    phoneNumbers: [{ number: '', type: 'WORK' }],
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (index, field, value) => {
    const newEmails = [...formData.emailAddresses];
    newEmails[index][field] = value;
    setFormData({ ...formData, emailAddresses: newEmails });
  };

  const handlePhoneChange = (index, field, value) => {
    const newPhones = [...formData.phoneNumbers];
    newPhones[index][field] = value;
    setFormData({ ...formData, phoneNumbers: newPhones });
  };

  const addEmail = () => {
    setFormData({
      ...formData,
      emailAddresses: [...formData.emailAddresses, { email: '', type: 'WORK' }],
    });
  };

  const removeEmail = (index) => {
    const newEmails = formData.emailAddresses.filter((_, i) => i !== index);
    setFormData({ ...formData, emailAddresses: newEmails });
  };

  const addPhone = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, { number: '', type: 'WORK' }],
    });
  };

  const removePhone = (index) => {
    const newPhones = formData.phoneNumbers.filter((_, i) => i !== index);
    setFormData({ ...formData, phoneNumbers: newPhones });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        title: '',
        emailAddresses: [{ email: '', type: 'WORK' }],
        phoneNumbers: [{ number: '', type: 'WORK' }],
      });
    } catch (error) {
      console.error('Error creating contact:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bg-gray-900 inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-gray-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Create New Contact</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors bgColor"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded"></div>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border text-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border text-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Title/Position
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          {/* Email Addresses */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                Email Addresses
              </h3>
              <button
                type="button"
                onClick={addEmail}
                className="flex items-center gap-2 px-3 py-1.5 bgGray bg-gray-900 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Add Email
              </button>
            </div>

            {formData.emailAddresses.map((email, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="email"
                  value={email.email}
                  onChange={(e) => handleEmailChange(index, 'email', e.target.value)}
                  className="flex-1 px-4 py-2 border text-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="email@example.com"
                />
                <select
                  value={email.type}
                  onChange={(e) => handleEmailChange(index, 'type', e.target.value)}
                  className="px-4 py-2 border text-gray-500 border-gray-300 rounded-lg focus:ring-2 bg-black focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                >
                  <option value="WORK">Work</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="OTHER">Other</option>
                </select>
                {formData.emailAddresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Phone Numbers */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                Phone Numbers
              </h3>
              <button
                type="button"
                onClick={addPhone}
                className="flex items-center gap-2 px-3 py-1.5 bgGray text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Add Phone
              </button>
            </div>

            {formData.phoneNumbers.map((phone, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="tel"
                  value={phone.number}
                  onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                  className="flex-1 px-4 py-2 border text-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="+1 (555) 123-4567"
                />
                <select
                  value={phone.type}
                  onChange={(e) => handlePhoneChange(index, 'type', e.target.value)}
                  className="px-4 py-2 border text-gray-500 border-gray-300 rounded-lg focus:ring-2 bg-black focus:ring-blue-950 focus:border-transparent outline-none transition-all"
                >
                  <option value="WORK">Work</option>
                  <option value="HOME">Home</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="OTHER">Other</option>
                </select>
                {formData.phoneNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border bgGray border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-900 to-gray-700 text-white rounded-lg hover:from-gray-650 hover:to-blue-950 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContactModal;