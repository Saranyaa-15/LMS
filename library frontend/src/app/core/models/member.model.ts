export type MemberStatus = 'ACTIVE' | 'INACTIVE';

export interface Member {
  id: number;
  name: string;
  email: string;
  status: MemberStatus;
  createdAt: string;
}

export interface MemberRequest {
  name: string;
  email: string;
}
