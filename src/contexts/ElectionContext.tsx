import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '@/lib/api';
import { useAuth } from './AuthContext';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  symbol: string;
  description: string;
  votes: number;
}

export interface Election {
  id: string;
  name: string;
  type: 'village' | 'mla' | 'mlc' | 'municipal';
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'closed';
  candidates: Candidate[];
}

interface ElectionContextType {
  elections: Election[];
  votedElections: string[];
  loading: boolean;
  castVote: (electionId: string, candidateId: string) => Promise<boolean>;
  addElection: (election: Omit<Election, 'id' | 'candidates'>) => Promise<void>;
  addCandidate: (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => Promise<void>;
  removeCandidate: (electionId: string, candidateId: string) => Promise<void>;
  updateElectionStatus: (electionId: string, status: Election['status']) => Promise<void>;
  refreshElections: () => Promise<void>;
  getElectionDetails: (electionId: string) => Promise<void>;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};

// Helper function to convert backend election to frontend format
const convertElection = (backendElection: api.Election, candidates: api.Candidate[] = []): Election => {
  return {
    id: backendElection._id,
    name: backendElection.name,
    type: backendElection.type || 'village',
    description: backendElection.description || '',
    startDate: backendElection.startsAt,
    endDate: backendElection.endsAt,
    status: backendElection.status || 'upcoming',
    candidates: candidates.map(c => ({
      id: c._id,
      name: c.name,
      party: c.party || '',
      symbol: c.symbol || '🌟',
      description: c.description || c.manifesto || '',
      votes: 0, // Will be populated from results API
    })),
  };
};

// Helper function to convert election with results for closed elections
const convertElectionWithResults = async (backendElection: api.Election, candidates: api.Candidate[], token: string): Promise<Election> => {
  let candidatesWithVotes = candidates.map(c => ({
    id: c._id,
    name: c.name,
    party: c.party || '',
    symbol: c.symbol || '🌟',
    description: c.description || c.manifesto || '',
    votes: 0,
  }));

  // Fetch results for closed elections to get vote counts
  if (backendElection.status === 'closed') {
    try {
      const results = await api.getElectionResults(backendElection._id, token);
      // Update vote counts from results
      candidatesWithVotes = candidatesWithVotes.map(candidate => {
        const result = results.results.find((r: any) => r.candidate._id === candidate.id);
        return {
          ...candidate,
          votes: result ? result.votes : 0,
        };
      });
    } catch (error) {
      console.error('Failed to fetch results for election:', backendElection._id, error);
    }
  }

  return {
    id: backendElection._id,
    name: backendElection.name,
    type: backendElection.type || 'village',
    description: backendElection.description || '',
    startDate: backendElection.startsAt,
    endDate: backendElection.endsAt,
    status: backendElection.status || 'upcoming',
    candidates: candidatesWithVotes,
  };
};

export const ElectionProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [votedElections, setVotedElections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load elections on mount and when token changes
  useEffect(() => {
    if (token) {
      refreshElections();
      loadVotedElections();
    }
  }, [token]);

  const refreshElections = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await api.listElections(token);
      const electionsWithCandidates = await Promise.all(
        response.elections.map(async (election) => {
          try {
            const details = await api.getElection(election._id, token);
            return await convertElectionWithResults(election, details.candidates, token);
          } catch {
            return convertElection(election);
          }
        })
      );
      setElections(electionsWithCandidates);
    } catch (error) {
      console.error('Failed to load elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getElectionDetails = async (electionId: string) => {
    if (!token) return;
    try {
      const details = await api.getElection(electionId, token);
      setElections(prev => prev.map(election => {
        if (election.id === electionId) {
          return convertElection(details.election, details.candidates);
        }
        return election;
      }));
    } catch (error) {
      console.error('Failed to load election details:', error);
    }
  };

  const loadVotedElections = async () => {
    if (!token) return;
    try {
      const response = await api.getMyVotes(token);
      const votedIds = response.votes.map((v: any) => 
        typeof v.election === 'string' ? v.election : v.election._id
      );
      setVotedElections(votedIds);
    } catch (error) {
      console.error('Failed to load voted elections:', error);
    }
  };

  const castVote = async (electionId: string, candidateId: string): Promise<boolean> => {
    if (!token) return false;
    try {
      await api.castVote({ electionId, candidateId }, token);
      setVotedElections(prev => [...prev, electionId]);
      await refreshElections();
      return true;
    } catch (error) {
      console.error('Failed to cast vote:', error);
      throw error;
    }
  };

  const addElection = async (election: Omit<Election, 'id' | 'candidates'>) => {
    try {
      await api.createElection({
        name: election.name,
        description: election.description,
        type: election.type,
        startsAt: election.startDate,
        endsAt: election.endDate,
      }, token || '');
      await refreshElections();
    } catch (error) {
      console.error('Failed to create election:', error);
      throw error;
    }
  };

  const addCandidate = async (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => {
    try {
      await api.addCandidate(electionId, {
        name: candidate.name,
        party: candidate.party,
        symbol: candidate.symbol,
        description: candidate.description,
      }, token || '');
      await getElectionDetails(electionId);
    } catch (error) {
      console.error('Failed to add candidate:', error);
      throw error;
    }
  };

  const removeCandidate = async (electionId: string, candidateId: string) => {
    try {
      await api.deleteCandidate(electionId, candidateId, token || '');
      await getElectionDetails(electionId);
    } catch (error) {
      console.error('Failed to remove candidate:', error);
      throw error;
    }
  };

  const updateElectionStatus = async (electionId: string, status: Election['status']) => {
    try {
      await api.updateElection(electionId, { status }, token || '');
      await refreshElections();
    } catch (error) {
      console.error('Failed to update election status:', error);
      throw error;
    }
  };

  return (
    <ElectionContext.Provider value={{
      elections,
      votedElections,
      loading,
      castVote,
      addElection,
      addCandidate,
      removeCandidate,
      updateElectionStatus,
      refreshElections,
      getElectionDetails,
    }}>
      {children}
    </ElectionContext.Provider>
  );
};
