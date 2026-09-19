import { useState, useEffect } from 'react';
import { authorizationRequestService, type AuthorizationRequest, type CreateAuthorizationRequest, type UpdateAuthorizationRequest } from '../services/authorizationRequestService';

export function useAuthorizationRequests() {
  const [requests, setRequests] = useState<AuthorizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authorizationRequestService.getAuthorizationRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch authorization requests');
      console.error('Error fetching authorization requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (data: CreateAuthorizationRequest): Promise<AuthorizationRequest> => {
    try {
      const newRequest = await authorizationRequestService.createAuthorizationRequest(data);
      setRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      console.error('Error creating authorization request:', err);
      throw err;
    }
  };

  const updateRequest = async (id: string, data: UpdateAuthorizationRequest): Promise<AuthorizationRequest> => {
    try {
      const updated = await authorizationRequestService.updateAuthorizationRequest(id, data);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      console.error('Error updating authorization request:', err);
      throw err;
    }
  };

  const approveRequest = async (id: string, reviewedBy: string): Promise<AuthorizationRequest> => {
    try {
      const updated = await authorizationRequestService.approveRequest(id, reviewedBy);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      console.error('Error approving request:', err);
      throw err;
    }
  };

  const rejectRequest = async (id: string, reviewedBy: string): Promise<AuthorizationRequest> => {
    try {
      const updated = await authorizationRequestService.rejectRequest(id, reviewedBy);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      console.error('Error rejecting request:', err);
      throw err;
    }
  };

  const deleteRequest = async (id: string): Promise<void> => {
    try {
      await authorizationRequestService.deleteAuthorizationRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting authorization request:', err);
      throw err;
    }
  };

  const getRequestById = (id: string): AuthorizationRequest | undefined => {
    return requests.find(r => r.id === id);
  };

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    approveRequest,
    rejectRequest,
    deleteRequest,
    getRequestById
  };
}
