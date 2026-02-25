export type UserRole = "admin" | "counsellor";
export type AccountStatus = "active" | "inactive";
export type SessionStatus = "active" | "completed";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Program {
  id: number;
  counsellor_id: number;
  counsellor_name?: string;
  title: string;
  description: string | null;
  session_date: string;
  meet_link: string | null;
  session_status: SessionStatus;
  approval_status: ApprovalStatus;
  created_at: string;
}

export interface Counsellor {
  id: number;
  name: string;
  email: string;
  account_status: AccountStatus;
}
