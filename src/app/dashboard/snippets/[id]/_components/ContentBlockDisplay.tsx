import CustomSandpack from "../../new/_components/CustomSandpack";
import { ContentBlock } from "../../new/_types/contentBlock";
import { MarkdownEditor } from "../../new/_components/MarkdownEditor";

interface ContentBlockDisplayProps {
  contentBlocks: ContentBlock[];
}

export const ContentBlockDisplay: React.FC<ContentBlockDisplayProps> = ({
  contentBlocks,
}) => {
  return (
    <div className="space-y-6">
      {contentBlocks.map((contentBlock) => (
        <div key={contentBlock.id} className="mt-4">
          {contentBlock.type === "markdown" && (
            <div>
              <MarkdownEditor
                value={contentBlock.content || ""}
                onChange={() => {}}
                disabled={false}
              />
            </div>
          )}
          {contentBlock.type === "text" && (
            <div
              dangerouslySetInnerHTML={{ __html: contentBlock.content || "" }}
            />
          )}
          {contentBlock.type === "preview" && (
            <CustomSandpack
              contentCode={contentBlock.code}
              initialFiles={contentBlock.files}
              initialTemplate={contentBlock.template}
              onCodeChange={() => {}}
              disabled={false}
            />
          )}
        </div>
      ))}
    </div>
  );
};
