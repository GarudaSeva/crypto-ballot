const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function api<T = any>(path: string, options: { method?: Method; body?: any; token?: string } = {}): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

// ============ HEALTH CHECK ============
export async function health() {
  return api('/health');
}

// ============ AUTH APIs ============
export interface LoginRequest {
  email?: string;
  password?: string;
  walletAddress?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'voter';
    walletAddress?: string;
  };
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return api('/auth/login', { method: 'POST', body: data });
}

export async function getMe(token: string) {
  return api('/auth/me', { token });
}

// ============ ELECTION APIs ============
export interface Election {
  _id: string;
  name: string;
  description?: string;
  type?: 'village' | 'mla' | 'mlc' | 'municipal';
  startsAt: string;
  endsAt: string;
  status?: 'upcoming' | 'active' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateElectionRequest {
  name: string;
  description?: string;
  type?: 'village' | 'mla' | 'mlc' | 'municipal';
  startsAt: string;
  endsAt: string;
}

export async function createElection(data: CreateElectionRequest, token: string) {
  return api<{ election: Election }>('/elections', { method: 'POST', body: data, token });
}

export async function listElections(token: string) {
  return api<{ elections: Election[] }>('/elections', { token });
}

export async function getElection(id: string, token: string) {
  return api<{ election: Election; candidates: Candidate[]; totalVotes: number }>(`/elections/${id}`, { token });
}

export async function updateElection(id: string, data: Partial<CreateElectionRequest> & { status?: string }, token: string) {
  return api<{ election: Election }>(`/elections/${id}`, { method: 'PUT', body: data, token });
}

export async function deleteElection(id: string, token: string) {
  return api<{ message: string }>(`/elections/${id}`, { method: 'DELETE', token });
}

export async function getActiveElections(token: string) {
  return api<{ elections: Election[] }>('/elections/active', { token });
}

// ============ CANDIDATE APIs ============
export interface Candidate {
  _id: string;
  election: string;
  name: string;
  party?: string;
  symbol?: string;
  manifesto?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCandidateRequest {
  name: string;
  party?: string;
  symbol?: string;
  manifesto?: string;
  description?: string;
}

export async function addCandidate(electionId: string, data: CreateCandidateRequest, token: string) {
  return api<{ candidate: Candidate }>(`/elections/${electionId}/candidates`, { method: 'POST', body: data, token });
}

export async function deleteCandidate(electionId: string, candidateId: string, token: string) {
  return api<{ message: string }>(`/elections/${electionId}/candidates/${candidateId}`, { method: 'DELETE', token });
}

// ============ VOTE APIs ============
export interface CastVoteRequest {
  electionId: string;
  candidateId: string;
}

export async function castVote(data: CastVoteRequest, token: string) {
  return api<{ voteId: string }>('/votes', { method: 'POST', body: data, token });
}

export async function getMyVotes(token: string) {
  return api<{ votes: any[] }>('/votes/my', { token });
}

// ============ RESULTS APIs ============
export async function getElectionResults(electionId: string, token: string) {
  return api<{ totalVotes: number; results: Array<{ candidate: Candidate; votes: number }> }>(`/results/${electionId}`, { token });
}

// ============ VOTER APIs (Admin Only) ============
export interface CreateVoterRequest {
  name: string;
  email: string;
  password: string;
}

export async function addVoter(data: CreateVoterRequest, token: string) {
  return api<{ id: string; name: string; email: string }>('/voters', { method: 'POST', body: data, token });
}

export async function listVoters(token: string) {
  return api<{ voters: any[] }>('/voters', { token });
}

// ============ DASHBOARD APIs (Admin Only) ============
export async function getDashboardStats(token: string) {
  return api<{ voters: number; elections: number; votes: number }>('/dashboard', { token });
}
