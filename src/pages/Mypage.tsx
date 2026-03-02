import { useEffect, useState } from 'react';

import { useAuth } from '../features/auth/hooks/useAuth';
import { ConfirmModal } from '../features/members/components/ConfirmModal';
import { InputWithLabel } from '../features/members/components/InputWithLabel';
import {
  useMyProfile,
  useUpdateNickname,
  useUpdateProfileImage,
  useWithdrawMember,
} from '../features/members/hooks/useMember';
import {
  createImagePresignedUrl,
  uploadImageToPresignedUrl,
} from '../features/stores/api/storeApi';
import { useGetMyStore, useUpdateMyStore } from '../features/stores/hooks/useStore';
import cameraIcon from '../shared/assets/icons/camera.png';
import defaultProfileIcon from '../shared/assets/icons/default-profile.png';
import logoutIcon from '../shared/assets/icons/logout.png';
import storeIcon from '../shared/assets/icons/store.png';
import warnIcon from '../shared/assets/icons/warn.png';
import { TitleCard } from '../shared/components/TitleCard';
import { useModalStore } from '../store/useModalStore';

const ALLOWED_IMAGE_TYPES = new Set(['image/gif', 'image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const Mypage = () => {
  const { logout } = useAuth();
  const { openModal } = useModalStore();
  const { data: myProfile, isError: isProfileError, isPending: isProfilePending } = useMyProfile();
  const { data: myStore } = useGetMyStore();
  const { isPending: isUpdateStorePending, mutateAsync: updateMyStore } = useUpdateMyStore();
  const { isPending: isUpdatePending, mutateAsync: updateProfile } = useUpdateNickname();
  const { isPending: isUpdateProfileImagePending, mutateAsync: updateProfileImage } =
    useUpdateProfileImage();
  const { isPending: isWithdrawPending, mutateAsync: withdrawMember } = useWithdrawMember();

  const [nickname, setNickname] = useState('');
  const [storeName, setStoreName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState<null | string>(null);
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('');

  useEffect(() => {
    setNickname(myProfile?.nickname ?? '');
    setProfileImage(myProfile?.profileImage ?? '');
  }, [myProfile?.nickname, myProfile?.profileImage]);

  useEffect(() => {
    setStoreName(myStore?.name ?? '');
  }, [myStore?.name]);

  const handleSaveNickname = async (value: string) => {
    const nextNickname = value;
    const lowerNickname = nextNickname.toLowerCase();

    if (nextNickname.length < 2 || nextNickname.length > 12) {
      setNicknameErrorMessage('닉네임은 2자 이상 12자 이하로 입력해주세요.');
      throw new Error('닉네임 길이 오류');
    }

    if (
      nextNickname.includes('관리자') ||
      nextNickname.includes('운영자') ||
      lowerNickname.includes('admin')
    ) {
      setNicknameErrorMessage('닉네임에 사용할 수 없는 단어가 포함되어 있습니다.');
      throw new Error('닉네임 금지어 오류');
    }

    try {
      setNicknameErrorMessage('');
      await updateProfile({ nickname: nextNickname });
      setNickname(nextNickname);
      alert('닉네임이 변경되었습니다.');
    } catch (_error) {
      setNicknameErrorMessage('닉네임 변경에 실패했습니다. (중복 닉네임일 수 있습니다.)');
      throw new Error('닉네임 변경 실패');
    }
  };

  const handleSaveStoreName = async (value: string) => {
    const trimmedStoreName = value.trim();
    if (trimmedStoreName.length === 0) {
      setStoreNameErrorMessage('상점 이름은 공백만 입력할 수 없습니다.');
      throw new Error('상점 이름 공백 오류');
    }

    if (trimmedStoreName.length < 2 || trimmedStoreName.length > 20) {
      setStoreNameErrorMessage('상점 이름은 2자 이상 20자 이하로 입력해주세요.');
      throw new Error('상점 이름 길이 오류');
    }

    try {
      setStoreNameErrorMessage('');
      await updateMyStore({ name: trimmedStoreName });
      setStoreName(trimmedStoreName);
      alert('상점 이름이 변경되었습니다.');
    } catch (_error) {
      setStoreNameErrorMessage('상점 이름 변경에 실패했습니다.');
      throw new Error('상점 이름 변경 실패');
    }
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setImageErrorMessage('PNG, JPG, WEBP, GIF 이미지 파일만 업로드할 수 있습니다.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageErrorMessage('이미지 용량은 최대 5MB까지 업로드할 수 있습니다.');
      event.target.value = '';
      return;
    }

    try {
      setImageErrorMessage(null);
      setIsUploadingImage(true);

      const presigned = await createImagePresignedUrl({
        contentType: file.type,
        fileName: file.name,
      });

      await uploadImageToPresignedUrl(presigned.uploadUrl, file, file.type);
      await updateProfileImage({
        profileImage: presigned.fileUrl,
      });
      setProfileImage(presigned.fileUrl);
      alert('프로필 이미지가 변경되었습니다.');
    } catch (_error) {
      setImageErrorMessage('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleWithdraw = () => {
    openModal(
      <ConfirmModal
        onConfirm={async () => {
          await withdrawMember();
          await logout();
        }}
      />,
    );
  };

  const isFormActionPending =
    isUpdatePending ||
    isUpdateStorePending ||
    isUpdateProfileImagePending ||
    isUploadingImage ||
    isProfilePending;

  return (
    <>
      <TitleCard sub="내 정보를 관리하세요" title="마이페이지" />
      <div className="mt-4 flex flex-col items-center rounded-4xl border border-white/50 bg-white/90 p-6.25 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <div className="relative h-24 w-24">
          <img
            alt="profile"
            className="h-24 w-24 rounded-full border-4 border-white object-cover"
            src={profileImage || defaultProfileIcon}
          />
          <input
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            id="profile"
            onChange={handleProfileImageChange}
            type="file"
          />
          <label
            className="bg-brand-main absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
            htmlFor="profile"
          >
            <img alt="camera-icon" className="w-4" src={cameraIcon} />
          </label>
        </div>
        <div className="mt-4 flex w-full flex-col gap-4">
          <InputWithLabel
            defaultValue={nickname}
            disabled={isFormActionPending}
            errorMessage={nicknameErrorMessage}
            id="username"
            label="닉네임"
            onSave={handleSaveNickname}
            placeholder="닉네임을 입력해주세요"
          />
          <InputWithLabel
            defaultValue={storeName}
            disabled={isFormActionPending}
            errorMessage={storeNameErrorMessage}
            icon={storeIcon}
            id="store-name"
            label="상점 이름"
            onSave={handleSaveStoreName}
            placeholder="상점 이름을 입력해주세요"
          />
        </div>
        {isProfileError && (
          <p className="text-warning mt-3 text-sm">프로필을 불러오지 못했습니다.</p>
        )}
        {imageErrorMessage && <p className="text-warning mt-3 text-sm">{imageErrorMessage}</p>}
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-4xl border border-white/50 bg-white/90 p-6.25 shadow-xl">
        <button
          className="mypage-button-base bg-disabled text-font-gray-dark"
          onClick={logout}
          type="button"
        >
          <img alt="logout-icon" className="w-5" src={logoutIcon} />
          로그아웃
        </button>
        <button
          className="mypage-button-base text-warning bg-warning-pink disabled:opacity-60"
          disabled={isWithdrawPending}
          onClick={handleWithdraw}
          type="button"
        >
          <img alt="withdrawal-icon" className="w-5" src={warnIcon} />
          회원 탈퇴
        </button>
      </div>
    </>
  );
};
