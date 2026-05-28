export type TransactionStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE';

export interface Transaction {
  id: number;
  bookId: number;
  bookTitle: string;
  bookIsbn: string;
  memberId: number;
  memberName: string;
  memberEmail: string;
  issuedAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: TransactionStatus;
}

export interface IssueRequest {
  bookId: number;
  memberId: number;
}

export interface ReturnRequest {
  transactionId: number;
}
