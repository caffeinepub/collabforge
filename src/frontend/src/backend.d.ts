import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProjectRole {
    experienceLevel: SkillLevel;
    name: string;
    description: string;
    requiredSkills: Array<string>;
}
export type Time = bigint;
export interface CreativeProfile {
    bio: string;
    displayName: string;
    createdAt: Time;
    skillTags: Array<string>;
    lookingFor: string;
    availability: string;
    updatedAt: Time;
    moodTags: Array<string>;
    goals: Array<string>;
    genres: Array<string>;
    skillLevel: SkillLevel;
    portfolioLinks: Array<[string, string]>;
    inspirations: Array<string>;
}
export interface CollaborationRating {
    communication: number;
    reliability: number;
    skillAccuracy: number;
    reviewer: Principal;
}
export type ProjectCategory = {
    __kind__: "movie";
    movie: null;
} | {
    __kind__: "album";
    album: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "game";
    game: null;
} | {
    __kind__: "comic";
    comic: null;
} | {
    __kind__: "musicVideo";
    musicVideo: null;
} | {
    __kind__: "shortFilm";
    shortFilm: null;
} | {
    __kind__: "novel";
    novel: null;
};
export interface ProjectPosting {
    id: bigint;
    status: ProjectStatus;
    title: string;
    creator: Principal;
    externalLinks: Array<[string, string]>;
    vibes: Array<string>;
    createdAt: Time;
    description: string;
    updatedAt: Time;
    goals: Array<string>;
    rolesNeeded: Array<ProjectRole>;
    genres: Array<string>;
    category: ProjectCategory;
    timeline: bigint;
}
export enum ProjectStatus {
    cancelled = "cancelled",
    open = "open",
    completed = "completed",
    inProgress = "inProgress"
}
export enum SkillLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced",
    expert = "expert"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCollaborationRating(targetUser: Principal, projectId: bigint, rating: CollaborationRating): Promise<void>;
    addMessage(projectId: bigint, message: string): Promise<void>;
    addProjectCollaborator(projectId: bigint, collaborator: Principal): Promise<void>;
    addTask(projectId: bigint, task: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(project: ProjectPosting): Promise<bigint>;
    getAllProjects(): Promise<Array<ProjectPosting>>;
    getCallerUserProfile(): Promise<CreativeProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCollaborationRatings(user: Principal): Promise<Array<CollaborationRating>>;
    getCreativeProfile(user: Principal): Promise<CreativeProfile>;
    getFilteredProjectsByGenre(desiredGenres: Array<string>): Promise<Array<ProjectPosting>>;
    getMessages(projectId: bigint): Promise<Array<[Principal, string, Time]>>;
    getProject(projectId: bigint): Promise<ProjectPosting>;
    getTasks(projectId: bigint): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<CreativeProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markProjectCompleted(projectId: bigint): Promise<void>;
    removeProjectCollaborator(projectId: bigint, collaborator: Principal): Promise<void>;
    saveCallerUserProfile(profile: CreativeProfile): Promise<void>;
    saveOrUpdateCreativeProfile(profile: CreativeProfile): Promise<void>;
    updateProject(projectId: bigint, updatedProject: ProjectPosting): Promise<void>;
    updateUserRole(user: Principal, role: UserRole): Promise<void>;
}
