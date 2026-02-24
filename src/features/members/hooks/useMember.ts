import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMyProfile, updateNickname, withdrawMember } from '../api/memberApi';
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
    mutationFn: updateNickname,
    onError: (error) => {
      console.error('닉네임 변경 실패:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.me() });
      console.log('닉네임 변경 완료!');
    },
  });
};

export const useWithdrawMember = () => {
  return useMutation({
    mutationFn: withdrawMember,
    onSuccess: () => {
      // TODO: 나중에 수정
      alert('탈퇴되었습니다.');
      // TODO: 토큰 삭제 및 로그인 페이지 이동 처리
    },
  });
};
