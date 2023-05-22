import { useCallback, useState } from 'react';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { readFileMime } from '~/utils/fileUtil';
import { useProgress } from './useProgress';

class MimeError extends Error {
  public filename: string;
  public mime: string;

  constructor(filename: string, mime: string) {
    super(`Unsupported mime type ${mime} of ${filename}`);
    this.filename = filename;
    this.mime = mime;
  }
}

export const useSelectImages = () => {
  const { progress: validationProgress, withProgress: withValidationProgress } =
    useProgress();

  const [images, setImages] = useState<{ file: File; mime: string }[]>([]);
  const sb = useSnackbarContext();

  const select = useCallback(
    (files: File[]) => {
      return withValidationProgress(async () => {
        setImages([]);

        if (files?.length > 20) {
          sb.alert('한번에 20개를 초과하여 업로드 할 수 없습니다.');
          throw new Error('Cannot upload more than 20 files');
        }

        try {
          const mimeFiles = await Promise.all(
            files.map(async (f) => ({
              file: f,
              mime: await readFileMime(f),
            }))
          );

          const unsupported = mimeFiles.find((item) => item.mime === 'unknown');
          if (unsupported) {
            throw new MimeError(unsupported.file.name, unsupported.mime);
          }

          setImages(mimeFiles);
          return mimeFiles;
        } catch (e) {
          setImages([]);

          if (e instanceof MimeError) {
            sb.alert(`${e.filename}의 형식이 올바르지 않습니다.`);
            return null;
          } else {
            sb.alert('파일 업로드에 실패했습니다.');
            throw e;
          }
        }
      });
    },
    [sb, withValidationProgress]
  );

  return { select, images, validating: validationProgress };
};
