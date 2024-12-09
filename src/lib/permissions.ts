import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/userStore';
import { Card } from '../types';

export class PermissionManager {
  private user: any;
  private profile: any;

  constructor(user: any, profile: any) {
    this.user = user;
    this.profile = profile;
  }

  get isAdmin() {
    return this.profile?.role === 'admin';
  }

  get isManager() {
    return this.profile?.role === 'manager';
  }

  get isUser() {
    return this.profile?.role === 'user';
  }

  canViewPipeline(pipeline: string) {
    if (this.isAdmin) return true;
    return this.profile?.pipelines?.includes(pipeline) || false;
  }

  canViewLead(lead: Card) {
    if (this.isAdmin || this.isManager) return true;
    return lead.responsible === this.user?.id;
  }

  canEditLead(lead: Card) {
    if (this.isAdmin) return true;
    if (this.isManager && this.canViewPipeline(lead.pipeline)) return true;
    return lead.responsible === this.user?.id;
  }

  canDeleteLead(lead: Card) {
    return this.isAdmin;
  }

  canCreateUser() {
    return this.isAdmin;
  }

  canEditUser(userId: string) {
    if (this.isAdmin) return true;
    return userId === this.user?.id;
  }

  canViewAllUsers() {
    return this.isAdmin || this.isManager;
  }

  canAssignLeads() {
    return this.isAdmin || this.isManager;
  }

  canAccessReports() {
    return this.isAdmin || this.isManager;
  }

  canConfigureSystem() {
    return this.isAdmin;
  }

  getAccessiblePipelines() {
    if (this.isAdmin) {
      return ['hunting', 'carteira', 'positivacao', 'resgate', 'lixeira'];
    }
    return this.profile?.pipelines || [];
  }

  filterAccessibleLeads(leads: Card[]) {
    if (this.isAdmin || this.isManager) return leads;
    return leads.filter(lead => lead.responsible === this.user?.id);
  }
}

export function usePermissions() {
  const { user } = useAuth();
  const profile = useUserStore(state => state.profile);
  const permissions = new PermissionManager(user, profile);

  return {
    isAdmin: permissions.isAdmin,
    isManager: permissions.isManager,
    isUser: permissions.isUser,
    canViewPipeline: permissions.canViewPipeline.bind(permissions),
    canViewLead: permissions.canViewLead.bind(permissions),
    canEditLead: permissions.canEditLead.bind(permissions),
    canDeleteLead: permissions.canDeleteLead.bind(permissions),
    canCreateUser: permissions.canCreateUser.bind(permissions),
    canEditUser: permissions.canEditUser.bind(permissions),
    canViewAllUsers: permissions.canViewAllUsers.bind(permissions),
    canAssignLeads: permissions.canAssignLeads.bind(permissions),
    canAccessReports: permissions.canAccessReports.bind(permissions),
    canConfigureSystem: permissions.canConfigureSystem.bind(permissions),
    getAccessiblePipelines: permissions.getAccessiblePipelines.bind(permissions),
    filterAccessibleLeads: permissions.filterAccessibleLeads.bind(permissions),
  };
}