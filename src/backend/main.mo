import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // --- Types ---

  public type SkillLevel = {
    #beginner;
    #intermediate;
    #advanced;
    #expert;
  };

  public type ProjectCategory = {
    #album;
    #game;
    #comic;
    #novel;
    #movie;
    #shortFilm;
    #musicVideo;
    #other : Text;
  };

  public type ProjectRole = {
    name : Text;
    description : Text;
    requiredSkills : [Text];
    experienceLevel : SkillLevel;
  };

  public type ProjectStatus = {
    #open;
    #inProgress;
    #completed;
    #cancelled;
  };

  public type ProjectPosting = {
    id : Nat;
    title : Text;
    description : Text;
    creator : Principal;
    category : ProjectCategory;
    genres : [Text];
    vibes : [Text];
    goals : [Text];
    timeline : Int;
    rolesNeeded : [ProjectRole];
    externalLinks : [(Text, Text)]; // (type, URL)
    status : ProjectStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type CreativeProfile = {
    displayName : Text;
    bio : Text;
    skillTags : [Text];
    skillLevel : SkillLevel;
    genres : [Text];
    goals : [Text];
    availability : Text;
    moodTags : [Text];
    inspirations : [Text];
    portfolioLinks : [(Text, Text)]; // (type, URL)
    lookingFor : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type CollaborationRating = {
    communication : Nat8;
    reliability : Nat8;
    skillAccuracy : Nat8;
    reviewer : Principal;
  };

  public type StoredRating = CollaborationRating;

  module ProjectPosting {
    public func compare(a : ProjectPosting, b : ProjectPosting) : Order.Order {
      Int.compare(a.id, b.id);
    };
  };

  // --- State Variables ---

  let ratingsMap = Map.empty<Principal, List.List<StoredRating>>();
  let profiles = Map.empty<Principal, CreativeProfile>();
  let projects = Map.empty<Nat, ProjectPosting>();
  var nextProjectId = 1;

  // Persistent Task Board State (For Collaboration Spaces)
  let taskBoards = Map.empty<Nat, List.List<Text>>();

  // Persistent Message Board State (For Collaboration Spaces)
  let messageBoards = Map.empty<Nat, List.List<(Principal, Text, Time.Time)>>();

  // Project collaborators tracking
  let projectCollaborators = Map.empty<Nat, Set.Set<Principal>>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- Helper Functions ---

  func isProjectOwner(projectId : Nat, caller : Principal) : Bool {
    switch (projects.get(projectId)) {
      case (null) { false };
      case (?project) { Principal.equal(project.creator, caller) };
    };
  };

  func isProjectCollaborator(projectId : Nat, caller : Principal) : Bool {
    switch (projectCollaborators.get(projectId)) {
      case (null) { false };
      case (?collaborators) { collaborators.contains(caller) };
    };
  };

  func hasProjectAccess(projectId : Nat, caller : Principal) : Bool {
    isProjectOwner(projectId, caller) or isProjectCollaborator(projectId, caller);
  };

  // --- Creative Profile ---

  public shared ({ caller }) func saveOrUpdateCreativeProfile(profile : CreativeProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(
      caller,
      {
        profile with
        createdAt = Time.now();
        updatedAt = Time.now();
      },
    );
  };

  public query ({ caller }) func getCreativeProfile(user : Principal) : async CreativeProfile {
    // Any authenticated user can view profiles (public discovery feature)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?CreativeProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : CreativeProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(
      caller,
      {
        profile with
        createdAt = Time.now();
        updatedAt = Time.now();
      },
    );
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?CreativeProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  // Role Management (Admin-Only)
  public shared ({ caller }) func updateUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // --- Ratings ---

  public shared ({ caller }) func addCollaborationRating(targetUser : Principal, projectId : Nat, rating : CollaborationRating) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add ratings");
    };

    // Verify the caller was a collaborator on the project
    if (not hasProjectAccess(projectId, caller)) {
      Runtime.trap("Unauthorized: You must be a project collaborator to rate");
    };

    // Verify the target user was also a collaborator
    if (not hasProjectAccess(projectId, targetUser)) {
      Runtime.trap("Invalid: Target user was not a collaborator on this project");
    };

    // Verify project is completed
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        switch (project.status) {
          case (#completed) {};
          case (_) { Runtime.trap("Unauthorized: Can only rate after project completion") };
        };
      };
    };

    let storedRating : StoredRating = { rating with reviewer = caller };

    switch (ratingsMap.get(targetUser)) {
      case (null) {
        let newList = List.singleton<StoredRating>(storedRating);
        ratingsMap.add(targetUser, newList);
      };
      case (?existingList) {
        existingList.add(storedRating);
      };
    };
  };

  public query ({ caller }) func getCollaborationRatings(user : Principal) : async [CollaborationRating] {
    // Ratings are public for discovery purposes
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ratings");
    };
    switch (ratingsMap.get(user)) {
      case (null) { [] };
      case (?ratings) {
        ratings.toArray();
      };
    };
  };

  // Project Matching -- Collab Board Integration

  func getFilteredProjectsByGenreInternal(desiredGenres : [Text]) : [ProjectPosting] {
    let iter = projects.values();
    iter.toArray().filter(
      func(p) {
        p.genres.any(
          func(genre) {
            desiredGenres.any(
              func(desired) {
                genre.contains(#text desired) or desired.contains(#text genre);
              }
            );
          }
        );
      }
    );
  };

  func arrayToSet(array : [Text]) : Set.Set<Text> {
    let set = Set.empty<Text>();
    for (text in array.values()) {
      set.add(text);
    };
    set;
  };

  public query ({ caller }) func getFilteredProjectsByGenre(desiredGenres : [Text]) : async [ProjectPosting] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse projects");
    };
    getFilteredProjectsByGenreInternal(desiredGenres);
  };

  // --- Collaboration Spaces (Persistent Task & Message Boards) ---

  public shared ({ caller }) func addTask(projectId : Nat, task : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add tasks");
    };

    // Verify caller has access to this project
    if (not hasProjectAccess(projectId, caller)) {
      Runtime.trap("Unauthorized: You must be a project member to add tasks");
    };

    let tasks = switch (taskBoards.get(projectId)) {
      case (null) { List.empty<Text>() };
      case (?existing) { existing };
    };
    tasks.add(task);
    taskBoards.add(projectId, tasks);
  };

  public query ({ caller }) func getTasks(projectId : Nat) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    // Verify caller has access to this project
    if (not hasProjectAccess(projectId, caller)) {
      Runtime.trap("Unauthorized: You must be a project member to view tasks");
    };

    switch (taskBoards.get(projectId)) {
      case (null) { [] };
      case (?tasks) { tasks.toArray() };
    };
  };

  public shared ({ caller }) func addMessage(projectId : Nat, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add messages");
    };

    // Verify caller has access to this project
    if (not hasProjectAccess(projectId, caller)) {
      Runtime.trap("Unauthorized: You must be a project member to add messages");
    };

    let msg = (caller, message, Time.now());
    let messages = switch (messageBoards.get(projectId)) {
      case (null) { List.empty<(Principal, Text, Time.Time)>() };
      case (?existing) { existing };
    };
    messages.add(msg);
    messageBoards.add(projectId, messages);
  };

  public query ({ caller }) func getMessages(projectId : Nat) : async [(Principal, Text, Time.Time)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    // Verify caller has access to this project
    if (not hasProjectAccess(projectId, caller)) {
      Runtime.trap("Unauthorized: You must be a project member to view messages");
    };

    switch (messageBoards.get(projectId)) {
      case (null) { [] };
      case (?messages) { messages.toArray() };
    };
  };

  // --- Project Listings ---

  public query ({ caller }) func getAllProjects() : async [ProjectPosting] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse projects");
    };
    projects.values().toArray().sort();
  };

  public shared ({ caller }) func createProject(project : ProjectPosting) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };

    let projectId = nextProjectId;
    nextProjectId += 1;
    projects.add(
      projectId,
      {
        project with
        id = projectId;
        creator = caller;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
    );

    // Initialize project owner as first collaborator
    let collaborators = Set.empty<Principal>();
    collaborators.add(caller);
    projectCollaborators.add(projectId, collaborators);

    projectId;
  };

  public query ({ caller }) func getProject(projectId : Nat) : async ProjectPosting {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) { project };
    };
  };

  public shared ({ caller }) func updateProject(projectId : Nat, updatedProject : ProjectPosting) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };

    // Verify caller is the project owner
    if (not isProjectOwner(projectId, caller)) {
      Runtime.trap("Unauthorized: Only project owner can update project");
    };

    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?existingProject) {
        projects.add(
          projectId,
          {
            updatedProject with
            id = projectId;
            creator = existingProject.creator;
            createdAt = existingProject.createdAt;
            updatedAt = Time.now();
          },
        );
      };
    };
  };

  public shared ({ caller }) func addProjectCollaborator(projectId : Nat, collaborator : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add collaborators");
    };

    // Verify caller is the project owner
    if (not isProjectOwner(projectId, caller)) {
      Runtime.trap("Unauthorized: Only project owner can add collaborators");
    };

    switch (projectCollaborators.get(projectId)) {
      case (null) {
        let collaborators = Set.empty<Principal>();
        collaborators.add(collaborator);
        projectCollaborators.add(projectId, collaborators);
      };
      case (?collaborators) {
        collaborators.add(collaborator);
      };
    };
  };

  public shared ({ caller }) func removeProjectCollaborator(projectId : Nat, collaborator : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove collaborators");
    };

    // Verify caller is the project owner
    if (not isProjectOwner(projectId, caller)) {
      Runtime.trap("Unauthorized: Only project owner can remove collaborators");
    };

    switch (projectCollaborators.get(projectId)) {
      case (null) { Runtime.trap("Project has no collaborators") };
      case (?collaborators) {
        collaborators.remove(collaborator);
      };
    };
  };

  public shared ({ caller }) func markProjectCompleted(projectId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark projects completed");
    };

    // Verify caller is the project owner
    if (not isProjectOwner(projectId, caller)) {
      Runtime.trap("Unauthorized: Only project owner can mark project completed");
    };

    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        projects.add(
          projectId,
          {
            project with
            status = #completed;
            updatedAt = Time.now();
          },
        );
      };
    };
  };
};
