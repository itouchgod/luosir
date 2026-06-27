export type ProjectLink = {
  readonly github: string;
  readonly live: string;
};

export type Project = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly gradient: string;
  readonly links: ProjectLink;
};
