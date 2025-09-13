export interface SnippetData {
  snippets: {
    tags: {
      tag: { name: string };
    }[];
    category: {
      name: string;
    };
    name: string;
    description: string;
    id: number;
    isPublic: boolean;
    title: string;
    updatedAt: string;
  }[];
}
