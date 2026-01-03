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
  };
}
