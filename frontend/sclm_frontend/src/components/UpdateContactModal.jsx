import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const UpdateContactModal = ({ isOpen, onClose, onUpdate, contact }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    emailAddresses: [{ email: '', type: 'WORK' }],
    phoneNumbers: [{ number: '', type: 'WORK' }],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        title: contact.title || '',
        emailAddresses: contact.emailAddresses?.length > 0 
          ? contact.emailAddresses 
          : [{ email: '', type: 'WORK' }],
        phoneNumbers: contact.phoneNumbers?.length > 0 
          ? contact.phoneNumbers 
          : [{ number: '', type: 'WORK' }],
      });
    }
  }, [contact]);

  if (!isOpen || !contact) return null;

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
      await onUpdate(contact.id, formData);
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Update Contact</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-500 rounded"></div>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title/Position
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Email Addresses */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded"></div>
                Email Addresses
              </h3>
              <button
                type="button"
                onClick={addEmail}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
                <select
                  value={email.type}
                  onChange={(e) => handleEmailChange(index, 'type', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
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
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded"></div>
                Phone Numbers
              </h3>
              <button
                type="button"
                onClick={addPhone}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
                <select
                  value={phone.type}
                  onChange={(e) => handlePhoneChange(index, 'type', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
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
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateContactModal;