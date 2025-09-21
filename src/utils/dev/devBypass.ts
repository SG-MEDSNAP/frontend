import { Image } from 'react-native';

// 개발용 더미 이미지
const DEV_DUMMY_IMAGE = require('../../../assets/images/SampleImage1.png');

// 카메라 촬영 우회 함수
export const getDevBypassPhoto = () => {
  // ImagePickerAsset 형식을 따르되, source를 직접 전달
  return {
    assetId: null,
    base64: null,
    duration: null,
    exif: null,
    height: 1000,
    width: 1000,
    type: 'image',
    uri: Image.resolveAssetSource(DEV_DUMMY_IMAGE).uri,
    fileName: 'dev-photo.jpg',
    fileSize: 0,
  };
};

// 약 등록 API 응답 우회
export const getDevBypassMedicationResponse = () => {
  return {
    success: true,
    data: {
      id: 'dev-medication-id',
      name: '개발용 약품',
    },
  };
};
