import { ContentBlock } from "../new/_types/contentBlock";
import { ContentBlockActions } from "../new/_components/ContentBlockActions";
import { MarkdownEditor } from "../new/_components/MarkdownEditor";
import { TiptapEditor } from "../new/_components/TiptapEditor";
import CustomSandpack from "../new/_components/CustomSandpack";

interface ContentBlockListProps {
  contentBlocks: ContentBlock[];
  isSubmitting: boolean;
  onMarkdownChange: (id: number, newValue: string) => void;
  onTextChange: (id: number, newValue: string) => void;
  onPreviewChange: (
    id: number,
    newCode: string,
    template: string,
    files: Record<string, { code: string }>
  ) => void;
  onDelete: (id: number) => void;
  onOrderChange: (order: number) => void;
}

export const ContentBlockList: React.FC<ContentBlockListProps> = ({
  contentBlocks,
  isSubmitting,
  onMarkdownChange,
  onTextChange,
  onPreviewChange,
  onDelete,
  onOrderChange,
}) => {
  return (
    <>
      {contentBlocks.map((contentBlock) => (
        <div
          className="mt-4"
          key={contentBlock.id}
          id={`${contentBlock.order}`}
        >
          {contentBlock.type === "markdown" && (
            <>
              <ContentBlockActions
                contentBlockDelete={() => onDelete(contentBlock.id)}
                contentBlockOrder={() => onOrderChange(contentBlock.order)}
                disabled={isSubmitting}
              />
              <MarkdownEditor
                onChange={(newValue) =>
                  onMarkdownChange(contentBlock.id, newValue)
                }
                value={contentBlock.content}
                disabled={isSubmitting}
              />
            </>
          )}
          {contentBlock.type === "text" && (
            <>
              <ContentBlockActions
                contentBlockDelete={() => onDelete(contentBlock.id)}
                contentBlockOrder={() => onOrderChange(contentBlock.order)}
                disabled={isSubmitting}
              />
              <TiptapEditor
                sentence={contentBlock.content}
                setSentence={(newValue) =>
                  onTextChange(contentBlock.id, newValue)
                }
                disabled={isSubmitting}
              />
            </>
          )}
          {contentBlock.type === "preview" && (
            <>
              <ContentBlockActions
                contentBlockDelete={() => onDelete(contentBlock.id)}
                contentBlockOrder={() => onOrderChange(contentBlock.order)}
                disabled={isSubmitting}
              />
              <CustomSandpack
                contentCode={contentBlock.code}
                initialFiles={contentBlock.files}
                initialTemplate={contentBlock.template}
                onCodeChange={(newCode, template, files) =>
                  onPreviewChange(
                    contentBlock.id,
                    newCode,
                    template,
                    files
                  )
                }
                disabled={isSubmitting}
              />
            </>
          )}
        </div>
      ))}
    </>
  );
};