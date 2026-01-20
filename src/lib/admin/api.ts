const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export interface AdminStats {
    totalUsers: number;
    totalAdmins: number;
    totalVisits: number;
    uniqueVisitors: number;
    dbStatus: string;
}

export interface Announcement {
    _id: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'alert';
    isActive: boolean;
    createdAt: string;
}

export const fetchAdminStats = async (): Promise<AdminStats> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
};

export const createAnnouncement = async (message: string, type: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/announcement`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, type })
    });
    if (!response.ok) throw new Error('Failed to create announcement');
    return response.json();
};

export const deleteAnnouncement = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/announcement/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete announcement');
    return response.json();
};

export const toggleAnnouncement = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/announcement/${id}/toggle`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to toggle announcement');
    return response.json();
};

export const fetchAdminAnnouncements = async (): Promise<Announcement[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/announcements/all`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch announcements');
    return response.json();
};

export const fetchPublicAnnouncements = async (): Promise<Announcement[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/announcements/public`);
    if (!response.ok) throw new Error('Failed to fetch announcements');
    return response.json();
};
