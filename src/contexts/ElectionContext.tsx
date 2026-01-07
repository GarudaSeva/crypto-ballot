import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  castVote: (electionId: string, candidateId: string) => Promise<boolean>;
  addElection: (election: Omit<Election, 'id' | 'candidates'>) => void;
  addCandidate: (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  removeCandidate: (electionId: string, candidateId: string) => void;
  updateElectionStatus: (electionId: string, status: Election['status']) => void;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};

const initialElections: Election[] = [
  {
    id: '1',
    name: 'Village Panchayat Election 2025',
    type: 'village',
    description: 'Election for Village Panchayat representatives. Choose your local leaders who will work for the development of our village.',
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    status: 'active',
    candidates: [
      { id: 'c1', name: 'Rajesh Kumar', party: 'Progressive Party', symbol: '🌾', description: 'Experienced leader with 10 years in public service', votes: 245 },
      { id: 'c2', name: 'Sunita Devi', party: 'People\'s Union', symbol: '🌻', description: 'Social worker dedicated to women empowerment', votes: 189 },
      { id: 'c3', name: 'Mohammed Ali', party: 'United Front', symbol: '🌿', description: 'Young leader focused on education and healthcare', votes: 156 },
    ],
  },
  {
    id: '2',
    name: 'State MLA Election 2025',
    type: 'mla',
    description: 'Election for Member of Legislative Assembly. Your vote will shape the future of our state.',
    startDate: '2025-02-01',
    endDate: '2025-02-05',
    status: 'upcoming',
    candidates: [
      { id: 'c4', name: 'Dr. Priya Sharma', party: 'National Democratic Party', symbol: '🏛️', description: 'Doctor turned politician, healthcare advocate', votes: 0 },
      { id: 'c5', name: 'Vikram Singh', party: 'State Development Party', symbol: '⚡', description: 'Infrastructure development specialist', votes: 0 },
    ],
  },
  {
    id: '3',
    name: 'MLC By-Election 2024',
    type: 'mlc',
    description: 'By-election for Member of Legislative Council seat. Cast your vote for legislative excellence.',
    startDate: '2024-12-01',
    endDate: '2024-12-05',
    status: 'closed',
    candidates: [
      { id: 'c6', name: 'Anand Rao', party: 'Reform Party', symbol: '📚', description: 'Education reform advocate', votes: 3421 },
      { id: 'c7', name: 'Lakshmi Naidu', party: 'Progressive Alliance', symbol: '🌟', description: 'Women rights activist', votes: 2876 },
    ],
  },
  {
    id: '4',
    name: 'Municipal Corporation Election',
    type: 'municipal',
    description: 'Election for Municipal Corporation Council members. Help shape urban development.',
    startDate: '2025-03-10',
    endDate: '2025-03-15',
    status: 'upcoming',
    candidates: [],
  },
];

export const ElectionProvider = ({ children }: { children: ReactNode }) => {
  const [elections, setElections] = useState<Election[]>(initialElections);
  const [votedElections, setVotedElections] = useState<string[]>([]);

  const castVote = async (electionId: string, candidateId: string): Promise<boolean> => {
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setElections(prev => prev.map(election => {
      if (election.id === electionId) {
        return {
          ...election,
          candidates: election.candidates.map(candidate => {
            if (candidate.id === candidateId) {
              return { ...candidate, votes: candidate.votes + 1 };
            }
            return candidate;
          }),
        };
      }
      return election;
    }));

    setVotedElections(prev => [...prev, electionId]);
    return true;
  };

  const addElection = (election: Omit<Election, 'id' | 'candidates'>) => {
    const newElection: Election = {
      ...election,
      id: Date.now().toString(),
      candidates: [],
    };
    setElections(prev => [...prev, newElection]);
  };

  const addCandidate = (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now().toString(),
      votes: 0,
    };
    setElections(prev => prev.map(election => {
      if (election.id === electionId) {
        return {
          ...election,
          candidates: [...election.candidates, newCandidate],
        };
      }
      return election;
    }));
  };

  const removeCandidate = (electionId: string, candidateId: string) => {
    setElections(prev => prev.map(election => {
      if (election.id === electionId) {
        return {
          ...election,
          candidates: election.candidates.filter(c => c.id !== candidateId),
        };
      }
      return election;
    }));
  };

  const updateElectionStatus = (electionId: string, status: Election['status']) => {
    setElections(prev => prev.map(election => {
      if (election.id === electionId) {
        return { ...election, status };
      }
      return election;
    }));
  };

  return (
    <ElectionContext.Provider value={{
      elections,
      votedElections,
      castVote,
      addElection,
      addCandidate,
      removeCandidate,
      updateElectionStatus,
    }}>
      {children}
    </ElectionContext.Provider>
  );
};
