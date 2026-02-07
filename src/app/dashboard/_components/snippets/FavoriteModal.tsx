import { useState } from "react";
import toast from "react-hot-toast";

interface ModalProps {
  handleDeleteCancel: () => void;
  onDeleteSuccess: () => void;
  title: string;
  snippetId: number | null;
  token: string | null;
}

export const FavoriteModal: React.FC<ModalProps> = ({
  handleDeleteCancel,
  onDeleteSuccess,
  snippetId,
  title,
  token,
}) => {
  const [disabled, setDisabled] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setDisabled(true);
      toast.loading(`「${title}」のお気に入りを解除中です・・・`);

      const res = await fetch(`/api/favorite/${snippetId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.remove();

      if (res.ok) {
        toast.success(`「${title}」のお気に入りを解除しました`);
        onDeleteSuccess();
      } else {
        toast.error(`「${title}」のお気に入りを解除に失敗しました`);
        setDisabled(false);
      }
    } catch (error) {
      console.log(error);
      setDisabled(false);
    }
  };

  return (
    <div className="bg-color-text-gray-light bg-opacity-50 absolute inset-0 w-full h-full z-50">
      <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-color-white w-4/5 md:w-3/5 h-1/2 rounded-lg shadow-md z-50">
        <div className="p-4 md:p-5 flex flex-col justify-center items-center h-full">
          <div className="text-xl md:text-2xl font-bold text-center">
            スニペットのお気に入りを解除
          </div>
          <div className="text-base md:text-2xl mt-5 text-center">
            「{title}」のお気に入りを解除しますか？
          </div>
          <div className="flex gap-4 flex-wrap justify-center items-center mt-5">
            <button
              className={
                disabled
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 font-bold rounded-md md:rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center flex gap-2 items-center justify-center w-full md:w-auto"
                  : `text-white bg-color-primary hover:bg-color-primary-hover font-bold rounded-md md:rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center flex gap-2 items-center justify-center w-full md:w-auto`
              }
              onClick={handleDeleteCancel}
              disabled={disabled}
            >
              キャンセル
            </button>
            <button
              className={
                disabled
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 font-bold rounded-md md:rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center flex gap-2 items-center justify-center w-full md:w-auto"
                  : `text-white bg-color-danger hover:bg-color-danger-hover transition-opacity font-bold rounded-md md:rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center flex gap-2 items-center justify-center w-full md:w-auto`
              }
              disabled={disabled}
              onClick={handleDeleteConfirm}
            >
              解除する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
