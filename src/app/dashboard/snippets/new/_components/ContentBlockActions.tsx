interface ContentBlockActionsProps {
  contentBlockDelete: () => void;
  contentBlockOrder: () => void;
  disabled: boolean;
}

export const ContentBlockActions: React.FC<ContentBlockActionsProps> = ({
  contentBlockDelete,
  contentBlockOrder,
  disabled,
}) => {
  return (
    <>
      <button disabled={disabled} type="button" onClick={contentBlockDelete}>
        ✖️
      </button>
      <button disabled={disabled} type="button" onClick={contentBlockOrder}>
        ↑
      </button>
    </>
  );
};
