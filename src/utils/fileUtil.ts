const compareMagicNumber = (header: string) => {
  switch (header) {
    case '89504e47':
      return 'image/png';

    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';

    case '47494638': // image/gif
    default:
      return 'unknown';
  }
};

export const readFileMime = (f: File) => {
  return new Promise<string>((res, rej) => {
    const fileReader = new FileReader();
    fileReader.onloadend = function (e: any) {
      const arr = new Uint8Array(e.target.result).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }

      res(compareMagicNumber(header));
    };

    fileReader.onerror = () => {
      rej(new Error('filereader error'));
    };

    fileReader.onabort = () => {
      rej(new Error('filereader abort'));
    };

    fileReader.readAsArrayBuffer(f);
  });
};
