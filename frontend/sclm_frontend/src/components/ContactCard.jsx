import React from 'react';
import { Mail, Phone, Briefcase, Edit2, Trash2 } from 'lucide-react';

const ContactCard = ({ contact, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24 relative">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-700">
              {contact.firstName?.[0] || ''}{contact.lastName?.[0] || ''}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 px-6 pb-6">
        {/* Name */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-1">
          {contact.firstName} {contact.lastName}
        </h3>

        {/* Title */}
        {contact.title && (
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
            <Briefcase size={16} />
            <p className="text-sm">{contact.title}</p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Contact Info */}
        <div className="space-y-3">
          {/* Emails */}
          {contact.emailAddresses && contact.emailAddresses.length > 0 && (
            <div className="space-y-2">
              {contact.emailAddresses.map((email, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Mail size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 truncate">{email.email}</p>
                    <span className="text-xs text-gray-400 uppercase">{email.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Phones */}
          {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
            <div className="space-y-2">
              {contact.phoneNumbers.map((phone, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Phone size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-700">{phone.number}</p>
                    <span className="text-xs text-gray-400 uppercase">{phone.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => onEdit(contact)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;