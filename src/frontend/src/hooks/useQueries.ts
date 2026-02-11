import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CreativeProfile, ProjectPosting, CollaborationRating } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<CreativeProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CreativeProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserProfile(userId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CreativeProfile | null>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        const principal = Principal.fromText(userId);
        return await actor.getUserProfile(principal);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useGetCreativeProfile(userId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CreativeProfile | null>({
    queryKey: ['creativeProfile', userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        const principal = Principal.fromText(userId);
        return await actor.getCreativeProfile(principal);
      } catch (error) {
        console.error('Error fetching creative profile:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useSaveOrUpdateCreativeProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CreativeProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveOrUpdateCreativeProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['creativeProfile'] });
    },
  });
}

export function useGetAllProjects() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProjectPosting[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProject(projectId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProjectPosting | null>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      try {
        return await actor.getProject(BigInt(projectId));
      } catch (error) {
        console.error('Error fetching project:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!projectId,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: ProjectPosting) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, project }: { projectId: bigint; project: ProjectPosting }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProject(projectId, project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
}

export function useMarkProjectCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markProjectCompleted(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
}

export function useGetTasks(projectId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      if (!actor || !projectId) return [];
      try {
        return await actor.getTasks(BigInt(projectId));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching && !!projectId,
    refetchInterval: 10000,
  });
}

export function useAddTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, task }: { projectId: bigint; task: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTask(projectId, task);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId.toString()] });
    },
  });
}

export function useGetMessages(projectId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[Principal, string, bigint]>>({
    queryKey: ['messages', projectId],
    queryFn: async () => {
      if (!actor || !projectId) return [];
      try {
        return await actor.getMessages(BigInt(projectId));
      } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching && !!projectId,
    refetchInterval: 5000,
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, message }: { projectId: bigint; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMessage(projectId, message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.projectId.toString()] });
    },
  });
}

export function useGetCollaborationRatings(userId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CollaborationRating[]>({
    queryKey: ['ratings', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        const principal = Principal.fromText(userId);
        return await actor.getCollaborationRatings(principal);
      } catch (error) {
        console.error('Error fetching ratings:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useAddCollaborationRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      targetUser,
      projectId,
      rating,
    }: {
      targetUser: Principal;
      projectId: bigint;
      rating: CollaborationRating;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCollaborationRating(targetUser, projectId, rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    },
  });
}

export function useAddProjectCollaborator() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, collaborator }: { projectId: bigint; collaborator: Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProjectCollaborator(projectId, collaborator);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
}
