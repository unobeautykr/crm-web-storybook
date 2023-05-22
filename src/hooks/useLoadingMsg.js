import { useState, useEffect } from 'react';

export const useLoadingMsg = ({ loadingType }) => {
  const [loadingMsg, setLoadingMsg] = useState(null);
  const resetLoadingMsg = () => setLoadingMsg(null);

  useEffect(() => {
    setLoadingMsg(() => {
      switch (loadingType) {
        case 'form_save':
          return '저장중입니다.';
        case 'form_edit':
          return '수정내용을 저장중입니다.';
        case 'resize':
          return '이미지 업로드를 준비중입니다.';
        case 'create_folder':
          return '폴더를 생성중입니다.';
        case 'create_file':
          return '파일을 업로드중입니다.';
        case 'update_customer':
          return '고객정보를 업데이트 중입니다.';
        case 'update_appointment':
          return '예약정보를 업데이트 중입니다.';
        default:
          return null;
      }
    });
  }, [loadingType]);

  return { resetLoadingMsg, loadingMsg };
};
