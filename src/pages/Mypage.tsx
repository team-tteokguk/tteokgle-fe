import { useEffect, useState } from 'react';

import { useAuth } from '../features/auth/hooks/useAuth';
import { ConfirmModal } from '../features/members/components/ConfirmModal';
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
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  useEffect(() => {
    setNickname(myProfile?.nickname ?? '');
    setProfileImage(myProfile?.profileImage ?? '');
  }, [myProfile?.nickname, myProfile?.profileImage]);

  useEffect(() => {
    setStoreName(myStore?.name ?? '');
  }, [myStore?.name]);

  const handleSaveNickname = async () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    try {
      setErrorMessage(null);
      await updateProfile({ nickname: trimmedNickname });
    } catch (_error) {
      setErrorMessage('닉네임 변경에 실패했습니다.');
    }
  };

  const handleSaveStoreName = async () => {
    const trimmedStoreName = storeName.trim();
    if (!trimmedStoreName) {
      setErrorMessage('상점 이름을 입력해주세요.');
      return;
    }

    try {
      setErrorMessage(null);
      await updateMyStore({ name: trimmedStoreName });
    } catch (_error) {
      setErrorMessage('상점 이름 변경에 실패했습니다.');
    }
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setErrorMessage('PNG, JPG, WEBP, GIF 이미지 파일만 업로드할 수 있습니다.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrorMessage('이미지 용량은 최대 5MB까지 업로드할 수 있습니다.');
      event.target.value = '';
      return;
    }

    try {
      setErrorMessage(null);
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
    } catch (_error) {
      setErrorMessage('프로필 이미지 업로드에 실패했습니다.');
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
        <div className="flex w-full flex-col gap-4">
          <div className="text-font-main mt-4 flex flex-col gap-2 font-bold">
            <label className="text-sm leading-5 tracking-[-0.15px]" htmlFor="username">
              닉네임
            </label>
            <div className="flex gap-2">
              <input
                className="border-disabled w-full rounded-2xl border-2 px-4 py-3 text-base leading-6 tracking-[-0.312px]"
                id="username"
                onChange={(event) => setNickname(event.target.value)}
                type="text"
                value={nickname}
              />
              <button
                className="bg-brand-main edit-button-base text-white disabled:bg-gray-300"
                disabled={isFormActionPending}
                onClick={handleSaveNickname}
                type="button"
              >
                저장
              </button>
            </div>
          </div>
          <div className="text-font-main flex flex-col gap-2 font-bold">
            <label
              className="flex items-center gap-2 text-sm leading-5 tracking-[-0.15px]"
              htmlFor="store-name"
            >
              <img alt="store-icon" className="h-4 w-4" src={storeIcon} />
              상점 이름
            </label>
            <div className="flex gap-2">
              <input
                className="border-disabled w-full rounded-2xl border-2 px-4 py-3 text-base leading-6 tracking-[-0.312px]"
                id="store-name"
                onChange={(event) => setStoreName(event.target.value)}
                type="text"
                value={storeName}
              />
              <button
                className="bg-brand-main edit-button-base text-white disabled:bg-gray-300"
                disabled={isFormActionPending}
                onClick={handleSaveStoreName}
                type="button"
              >
                저장
              </button>
            </div>
          </div>
        </div>
        {isProfileError && (
          <p className="text-warning mt-3 text-sm">프로필을 불러오지 못했습니다.</p>
        )}
        {errorMessage && <p className="text-warning mt-3 text-sm">{errorMessage}</p>}
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
