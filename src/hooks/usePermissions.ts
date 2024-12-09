import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/userStore';
import { Card } from '../types';

export function usePermissions() {
  const { user } = useAuth();
  const profile = useUserStore((state) => state.profile);

  const isAdmin = profile?.role === 'admin';
  const isManager = profile?.role === 'manager';
  const isRegularUser = profile?.role === 'user';

  const canViewAllPipelines = isAdmin;
  const canViewAssignedPipelines = isManager || isAdmin;
  const canCreateUsers = isAdmin;
  const canViewAllLeads = isAdmin || isManager;
  
  const canViewLead = (responsibleId: string) => {
    if (isAdmin || isManager) return true;
    return user?.id === responsibleId;
  };

  const canAccessPipeline = (pipeline: string) => {
    if (isAdmin) return true;
    if (!profile?.pipelines) return false;
    return profile.pipelines.includes(pipeline);
  };

  const canApproveClientRegistration = () => {
    if (!profile) return false;
    return profile.permissions?.includes('client_registration_approval') || profile.role === 'admin';
  };

  return {
    isAdmin,
    isManager,
    isRegularUser,
    canViewAllPipelines,
    canViewAssignedPipelines,
    canCreateUsers,
    canViewAllLeads,
    canViewLead,
    canAccessPipeline,
    canApproveClientRegistration,
    userPipelines: profile?.pipelines || [],
  };
}