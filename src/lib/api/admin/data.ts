import { baseUrl, getAuthHeaders } from '../baseUrl';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  plan: string;
  isGenerationBlocked: boolean;
  blueprintCount: number;
  createdAt?: string | null;
}

export interface AdminTransaction {
  _id: string;
  transactionId: string;
  userEmail: string;
  amount: number;
  currency: string;
  planName: string;
  createdAt: string;
}

export interface UserRouteStats {
  freeUsers: number;
  proUsers: number;
  blockedUsers: number;
  totalBlueprints: number;
}

export interface TransactionRouteStats {
  totalAmount: number;
}

export interface GetAdminUsersParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetAdminUsersResponse {
  users: AdminUser[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  stats?: UserRouteStats;
}

export interface GetAdminTransactionsParams {
  page?: number;
  limit?: number;
}

export interface GetAdminTransactionsResponse {
  transactions: AdminTransaction[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  stats?: TransactionRouteStats;
}

export const getAdminUsers = async (
  params?: GetAdminUsersParams
): Promise<GetAdminUsersResponse> => {
  try {
    const authHeaders = await getAuthHeaders();
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search.trim());
    if (params?.role && params.role !== 'all') query.set('role', params.role);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    const url = `${baseUrl}/api/admin/users${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { users: [], total: 0, totalPages: 1, page: 1, limit: 10 };
    }
    const data = await res.json();
    return {
      users: data.users || [],
      total: data.total || 0,
      totalPages: data.totalPages || 1,
      page: data.page || 1,
      limit: data.limit || 10,
      stats: data.stats,
    };
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return { users: [], total: 0, totalPages: 1, page: 1, limit: 10 };
  }
};

export const getAdminTransactions = async (
  params?: GetAdminTransactionsParams
): Promise<GetAdminTransactionsResponse> => {
  try {
    const authHeaders = await getAuthHeaders();
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    const url = `${baseUrl}/api/admin/transactions${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { transactions: [], total: 0, totalPages: 1, page: 1, limit: 10 };
    }
    const data = await res.json();
    return {
      transactions: data.transactions || [],
      total: data.total || 0,
      totalPages: data.totalPages || 1,
      page: data.page || 1,
      limit: data.limit || 10,
      stats: data.stats,
    };
  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    return { transactions: [], total: 0, totalPages: 1, page: 1, limit: 10 };
  }
};
