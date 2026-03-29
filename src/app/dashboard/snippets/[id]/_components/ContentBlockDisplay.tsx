import CustomSandpack from "../../new/_components/CustomSandpack";
import { ContentBlock } from "../../new/_types/contentBlock";
import { MarkdownEditor } from "../../new/_components/MarkdownEditor";
import { RichTextViewer } from "../../new/_components/RichTextViewer";

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
                disabled={true}
                fitContent={true}
              />
            </div>
          )}
          {contentBlock.type === "text" && (
            <RichTextViewer content={contentBlock.content || ""} />
          )}
          {contentBlock.type === "preview" && (
            <CustomSandpack
              contentCode={contentBlock.code}
              initialFiles={contentBlock.files}
              initialTemplate={contentBlock.template}
              displayOnly={true}
              onCodeChange={() => {}}
              disabled={true}
            />
          )}
        </div>
      ))}
    </div>
  );
};
