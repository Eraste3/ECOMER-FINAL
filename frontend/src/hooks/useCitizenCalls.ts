import { useState, useEffect } from 'react';
import { citizenCallService, type CitizenCall, type CreateCitizenCall, type UpdateCitizenCall } from '../services/citizenCallService';

export function useCitizenCalls() {
  const [calls, setCalls] = useState<CitizenCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await citizenCallService.getCitizenCalls();
      setCalls(data);
    } catch (err) {
      setError('Failed to fetch citizen calls');
      console.error('Error fetching citizen calls:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCall = async (data: CreateCitizenCall): Promise<CitizenCall> => {
    try {
      const newCall = await citizenCallService.createCitizenCall(data);
      setCalls(prev => [...prev, newCall]);
      return newCall;
    } catch (err) {
      console.error('Error creating citizen call:', err);
      throw err;
    }
  };

  const updateCall = async (id: string, data: UpdateCitizenCall): Promise<CitizenCall> => {
    try {
      const updated = await citizenCallService.updateCitizenCall(id, data);
      setCalls(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      console.error('Error updating citizen call:', err);
      throw err;
    }
  };

  const registerParticipant = async (callId: string): Promise<CitizenCall> => {
    try {
      const updated = await citizenCallService.registerParticipant(callId);
      setCalls(prev => prev.map(c => c.id === callId ? updated : c));
      return updated;
    } catch (err) {
      console.error('Error registering participant:', err);
      throw err;
    }
  };

  const startCall = async (id: string): Promise<CitizenCall> => {
    try {
      const updated = await citizenCallService.startCall(id);
      setCalls(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      console.error('Error starting call:', err);
      throw err;
    }
  };

  const completeCall = async (id: string): Promise<CitizenCall> => {
    try {
      const updated = await citizenCallService.completeCall(id);
      setCalls(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      console.error('Error completing call:', err);
      throw err;
    }
  };

  const cancelCall = async (id: string): Promise<CitizenCall> => {
    try {
      const updated = await citizenCallService.cancelCall(id);
      setCalls(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      console.error('Error cancelling call:', err);
      throw err;
    }
  };

  const deleteCall = async (id: string): Promise<void> => {
    try {
      await citizenCallService.deleteCitizenCall(id);
      setCalls(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting citizen call:', err);
      throw err;
    }
  };

  const getCallById = (id: string): CitizenCall | undefined => {
    return calls.find(c => c.id === id);
  };

  const getOpenCalls = (): CitizenCall[] => {
    return calls.filter(c => c.status === 'ouvert');
  };

  return {
    calls,
    loading,
    error,
    fetchCalls,
    createCall,
    updateCall,
    registerParticipant,
    startCall,
    completeCall,
    cancelCall,
    deleteCall,
    getCallById,
    getOpenCalls
  };
}
