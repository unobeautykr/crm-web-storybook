import { FileData } from '~/api/resources/driveApi';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';

export const useImageEditorWindow = () => {
  const sb = useSnackbarContext();

  const openLocal = ({
    imageUrl,
    name,
    onSave,
  }: {
    imageUrl: string;
    name: string;
    onSave: (file: File) => void;
  }) => {
    const editorWindow = window.open(`/image/local`);

    if (!editorWindow) {
      throw new Error('Failed to open window');
    }

    (editorWindow as any).onSaveCallback = (blob: Blob, name: string) => {
      const file = new File([blob], name);
      onSave(file as File);
    };

    (editorWindow as any).onLoaded = () => {
      (editorWindow as any).setImage({ url: imageUrl, name });
    };
  };

  const openFile = async (
    file: FileData,
    onSave: (imageId: number) => void
  ) => {
    const broken = file.image.thumbnailStatus === 'FAILED';

    if (broken) {
      sb.alert('지원하지 않는 이미지 파일입니다.');
      return;
    }

    if (!file.image.originalUrl) {
      sb.alert('이미지 업로드가 아직 완료되지 않았습니다.');
      return;
    }

    const win: any = window.open(`/image/${file.id}`) as Window;
    win.onSaveCallback = (imageId: number) => {
      onSave(imageId);
    };
  };

  return {
    openLocal,
    openFile,
  };
};
