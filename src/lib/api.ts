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
    } catch { }
    throw new Error(message);
  }
  return res.json();
}

// ============ TYPES ============
export interface LoginRequest {
  email?: string;
  password?: string;
  walletAddress?: string;
  aadhaarNumber?: string;
  name?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'voter';
  walletAddress?: string;
  aadhaarNumber?: string;
  isVerified?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface Voter {
  id: string;
  name: string;
  email: string;
  aadhaarNumber?: string;
  walletAddress?: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface Election {
  _id: string;
  name: string;
  type?: 'village' | 'mla' | 'mlc' | 'municipal';
  description?: string;
  startsAt: string;
  endsAt: string;
  status?: 'active' | 'upcoming' | 'closed';
  createdAt?: string;
}

export interface Candidate {
  _id: string;
  election: string;
  name: string;
  party?: string;
  symbol?: string;
  manifesto?: string;
  description?: string;
}

export interface Vote {
  _id: string;
  election: Election;
  candidate: Candidate;
  voter: string;
  createdAt?: string;
}

export interface DashboardStats {
  voters: number;
  elections: number;
  votes: number;
}

export interface ElectionResult {
  candidate: Candidate;
  votes: number;
}

// ============ AUTH ============
export async function health() {
  return api('/health');
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return api('/auth/login', { method: 'POST', body: credentials });
}

export async function getMe(token: string): Promise<MeResponse> {
  return api('/auth/me', { token });
}

// ============ ADMIN: VOTERS ============
export async function addVoter(data: { name: string; email: string; password: string }, token: string) {
  return api('/voters', { method: 'POST', body: data, token });
}

export async function listVoters(token: string): Promise<{ voters: Voter[] }> {
  const result = await api<{ voters: any[] }>('/voters', { token });
  return {
    voters: result.voters.map(v => ({
      ...v,
      id: v._id // Map MongoDB _id to id expected by frontend
    }))
  };
}

export async function verifyVoter(voterId: string, isVerified: boolean, token: string) {
  return api(`/voters/${voterId}/verify`, { method: 'PATCH', body: { isVerified }, token });
}

// ============ ELECTIONS ============
export async function createElection(data: { name: string; description?: string; startsAt: string; endsAt: string }, token: string) {
  return api('/elections', { method: 'POST', body: data, token });
}

export async function listElections(token: string): Promise<{ elections: Election[] }> {
  return api('/elections', { token });
}

export async function getActiveElections(token: string): Promise<{ elections: Election[] }> {
  return api('/elections/active', { token });
}

export async function getElection(id: string, token: string): Promise<{ election: Election; candidates: Candidate[]; totalVotes: number }> {
  return api(`/elections/${id}`, { token });
}

export async function addCandidate(electionId: string, data: { name: string; party?: string; symbol?: string; manifesto?: string; description?: string }, token: string) {
  return api(`/elections/${electionId}/candidates`, { method: 'POST', body: data, token });
}

export async function updateElection(electionId: string, data: { name?: string; description?: string; type?: string; startsAt?: string; endsAt?: string; status?: string }, token: string) {
  return api(`/elections/${electionId}`, { method: 'PUT', body: data, token });
}

export async function deleteCandidate(electionId: string, candidateId: string, token: string) {
  return api(`/elections/${electionId}/candidates/${candidateId}`, { method: 'DELETE', token });
}

// ============ VOTING ============
export async function castVote(data: { electionId: string; candidateId: string }, token: string) {
  return api('/votes', { method: 'POST', body: data, token });
}

export async function getMyVotes(token: string): Promise<{ votes: Vote[] }> {
  return api('/votes/my', { token });
}

// ============ RESULTS ============
export async function getElectionResults(electionId: string, token: string): Promise<{ totalVotes: number; results: ElectionResult[] }> {
  return api(`/results/${electionId}`, { token });
}

// ============ DASHBOARD ============
export async function getDashboardStats(token: string): Promise<DashboardStats> {
  return api('/dashboard', { token });
}

// ============ BLOCKCHAIN ============
export async function getBlockchain(token: string) {
  return api('/blockchain', { token });
}
