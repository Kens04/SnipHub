import toast from "react-hot-toast";

interface ModalProps {
  handleDeleteCancel: () => void;
  onDeleteSuccess: () => void;
  title: string;
  snippetId: number | null;
  token: string | null;
}

export const Modal: React.FC<ModalProps> = ({
  handleDeleteCancel,
  onDeleteSuccess,
  snippetId,
  title,
  token,
}) => {
  const handleDeleteConfirm = async () => {
    try {
      toast.loading(`「${title}」のスニペットを削除中です・・・`);

      const res = await fetch(`/api/snippet/${snippetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.remove();

      if (res.ok) {
        toast.success(`「${title}」のスニペットを削除しました`);
        onDeleteSuccess();
      } else {
        toast.error(`「${title}」のスニペットの削除に失敗しました`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-color-text-gray-light bg-opacity-50 absolute inset-0 w-full h-full z-50">
      <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-color-white w-4/5 md:w-3/5 h-1/2 rounded-lg shadow-md z-50">
        <div className="p-4 md:p-5 flex flex-col justify-center items-center h-full">
          <div className="text-xl md:text-2xl font-bold text-center">
            スニペットの削除
          </div>
          <div className="text-base md:text-2xl mt-5 text-center">
            「{title}」のスニペットを削除しますか？
          </div>
          <div className="flex gap-4 flex-wrap justify-center items-center mt-5">
            <button
              className="text-white bg-color-primary hover:bg-color-primary-hover font-bold rounded-md md:rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center flex gap-2 items-center justify-center w-full md:w-auto"
              onClick={handleDeleteCancel}
            >
              キャンセル
            </button>
            <button
              className="text-white bg-color-danger hover:bg-color-danger-hover transition-opacity font-bold rounded-md md:rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center flex gap-2 items-center justify-center w-full md:w-auto"
              onClick={handleDeleteConfirm}
            >
              削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
