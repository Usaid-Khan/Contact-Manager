import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader, LogOut } from 'lucide-react';
import { contactAPI } from '../services/api';
import ContactCard from './ContactCard';
import CreateContactModal from './CreateContactModal';
import UpdateContactModal from './UpdateContactModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Fetch contacts
  const fetchContacts = async (page = 0, query = '') => {
    setLoading(true);
    try {
      let response;
      if (query.trim()) {
        response = await contactAPI.searchContacts(query, page, 9);
      } else {
        response = await contactAPI.getAllContacts(page, 9);
      }

      console.log("RAW RESPONSE:", response.data);
      console.log("PAGE DATA:", response.data.data);

      const pageData = response.data?.data || response.data;

      setContacts(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setTotalContacts(pageData.totalElements || 0);
      setCurrentPage(pageData.number || 0);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(0, searchQuery);
  }, []);

  // Search handler with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchContacts(0, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle page change
  const handlePageChange = (page) => {
    fetchContacts(page, searchQuery);
  };

  // Handle create contact
  const handleCreateContact = async (contactData) => {
    try {
      await contactAPI.createContact(contactData);
      setShowCreateModal(false);
      fetchContacts(currentPage, searchQuery);
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Failed to create contact. Please try again.');
    }
  };

  // Handle update contact
  const handleUpdateContact = async (contactId, contactData) => {
    try {
      await contactAPI.updateContact(contactId, contactData);
      setShowUpdateModal(false);
      setSelectedContact(null);
      fetchContacts(currentPage, searchQuery);
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact. Please try again.');
    }
  };

  // Handle delete contact
  const handleDeleteContact = async () => {
    setDeleteLoading(true);
    try {
      await contactAPI.deleteContact(selectedContact.id);
      setShowDeleteModal(false);
      setSelectedContact(null);

      // If last item on page, go to previous page
      if (contacts.length === 1 && currentPage > 0) {
        fetchContacts(currentPage - 1, searchQuery);
      } else {
        fetchContacts(currentPage, searchQuery);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open modals
  const openEditModal = (contact) => {
    setSelectedContact(contact);
    setShowUpdateModal(true);
  };

  const openDeleteModal = (contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 to-blue-950">
      {/* Header */}
      <div className="bg-gray-400 shadow-sm border-b ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact Management System</h1>
              <p className="text-gray-800 mt-3">
                {totalContacts} {totalContacts === 1 ? 'contact' : 'contacts'} total
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-900 to-gray-700 text-white rounded-lg hover:from-gray-650 hover:to-blue-950 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Plus size={20} />
              Create Contact
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bgColor text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-semibold"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border text-gray-300 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-gray-600">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-600 mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first contact'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-900 to-gray-700 text-white rounded-lg hover:from-gray-650 hover:to-blue-950 transition-all shadow-md font-medium"
              >
                <Plus size={20} />
                Create Your First Contact
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateContactModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateContact}
      />

      <UpdateContactModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedContact(null);
        }}
        onUpdate={handleUpdateContact}
        contact={selectedContact}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedContact(null);
        }}
        onConfirm={handleDeleteContact}
        contact={selectedContact}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ContactManagement;