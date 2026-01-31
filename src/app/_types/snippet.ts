export interface SnippetsData {
  snippets: {
    tags: {
      tag: {
        id: number;
        name: string;
      };
    }[];
    category: {
      id: number;
      name: string;
    };
    name: string;
    description: string;
    contentBlocks: {
      id: number;
      content: string | null;
      order: number;
      preview?: {
        template?: string;
        code: string;
        files?: Record<string, { code: string }>;
      };
      type: "markdown" | "text" | "preview";
    }[];
    id: number;
    isPublic: boolean;
    title: string;
    updatedAt: string;
  }[];
}

export interface SnippetData {
  snippet: {
    user: {
      id: number;
      userName: string;
      iconUrl: string;
    };
    tags: {
      tag: {
        id: number;
        name: string;
      };
    }[];
    category: {
      id: number;
      name: string;
    };
    name: string;
    description: string;
    contentBlocks: {
      id: number;
      content: string | null;
      order: number;
      preview?: {
        template?: string;
        code: string;
        files?: Record<string, { code: string }>;
      };
      type: "markdown" | "text" | "preview";
    }[];
    id: number;
    isPublic: boolean;
    likes: {
      id: number;
      userId: number;
      snippetId: number;
    }[];
    favorites: {
      id: number;
      userId: number;
      snippetId: number;
    }[];
    title: string;
    createdAt: string;
    updatedAt: string;
  };
}
