import { API_BASE_URL } from '../config/api';

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  category?: 'signalement' | 'intervention' | 'autorisation' | 'ecoshop' | 'gamification' | 'system';
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface CreateNotification {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  category?: Notification['category'];
  actionUrl?: string;
}

class NotificationService {
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private notifications: Notification[] = [];
  private ws: WebSocket | null = null;

  async getNotifications(userId: string): Promise<Notification[]> {
    // Mock implementation
    const mockNotifications: Notification[] = [
      {
        id: 'NOTIF-001',
        userId: userId,
        type: 'success',
        title: 'Intervention validée',
        message: 'Votre intervention INT-001 a été validée par l\'administrateur.',
        category: 'intervention',
        actionUrl: '/ONG/interventions/INT-001',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'NOTIF-002',
        userId: userId,
        type: 'info',
        title: 'Nouveau périmètre disponible',
        message: 'Un nouveau périmètre PER-004 est disponible à Ngambio.',
        category: 'signalement',
        actionUrl: '/ONG/carte',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'NOTIF-003',
        userId: userId,
        type: 'warning',
        title: 'Échéance proche',
        message: 'L\'intervention INT-002 arrive à échéance dans 3 jours.',
        category: 'intervention',
        actionUrl: '/ONG/interventions/INT-002',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 300));
    this.notifications = mockNotifications;
    return mockNotifications;
  }

  async markAsRead(id: string): Promise<void> {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notifyListeners();
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  async markAllAsRead(userId: string): Promise<void> {
    this.notifications = this.notifications.map(n => 
      n.userId === userId ? { ...n, read: true } : n
    );
    this.notifyListeners();
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  async deleteNotification(id: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // WebSocket connection for real-time notifications
  connectWebSocket(userId: string): void {
    // In a real implementation, this would connect to a WebSocket server
    // For now, we'll simulate it with a placeholder
    console.log(`WebSocket connection for user ${userId} would be established here`);
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Simulate receiving a new notification (for testing)
  simulateNewNotification(notification: Notification): void {
    this.notifications = [notification, ...this.notifications];
    this.notifyListeners();
  }
}

export const notificationService = new NotificationService();
