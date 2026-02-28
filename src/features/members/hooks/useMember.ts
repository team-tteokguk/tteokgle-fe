import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMyProfile, updateProfile, updateProfileImage, withdrawMember } from '../api/memberApi';
import { memberKeys } from '../api/memberKeys';

export const useMyProfile = () => {
  return useQuery({
    queryFn: getMyProfile,
    queryKey: memberKeys.me(),
  });
};

export const useMyPoint = (enabled = true) => {
  return useQuery({
    enabled,
    queryFn: getMyProfile,
    queryKey: memberKeys.me(),
    select: (profile) => profile.point,
  });
};

export const useUpdateNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      console.error('변경 실패:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.me() });
      console.log('변경 완료!');
    },
  });
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileImage,
    onError: (error) => {
      console.error('프로필 이미지 변경 실패:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.me() });
      console.log('프로필 이미지 변경 완료!');
    },
  });
};

export const useWithdrawMember = () => {
  return useMutation({
    mutationFn: withdrawMember,
  });
};
