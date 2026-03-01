## 🤖 AI Change Summary for PR #41

### 개요
이번 변경 사항은 상점 관련 API 및 상태 관리 로직 개선, 친구 찾기 기능 및 UI 추가, 아이템 배치 요청 구조 간소화, CSS 스타일 추가, 아이템 클릭 시 상세 모달 열기 기능을 포함하여 사용자 경험을 향상시키기 위한 것입니다.

### 주요 변경 사항
1. **API 수정**:
   - 즐겨찾기 API 경로 변경: `/store/{storeId}/subscription`에서 `/stores/{storeId}/subscribe`로 수정.
   - 새로운 API 메서드 추가:
     - `searchStores`: 상점 검색 기능.
     - `getMyFavoriteStores`: 사용자의 즐겨찾기 목록 조회 기능.
   - 아이템 배치 요청 수정: `ItemPlacementRequest`에서 불필요한 필드 제거 및 `mutationFn`에서 `body` 파라미터 삭제.

2. **상태 관리 키 추가**:
   - `storeKeys`에 즐겨찾기 및 검색 목록 관련 키 추가.
   - 친구 찾기 기능을 위한 상태 관리 키 추가.

3. **훅 추가**:
   - `useSearchStores`, `useGetFavoriteStores`, `useToggleStoreFavorite` 훅 추가.

4. **타입 정의 추가**:
   - `StoreFavoritesRequest`, `StoreListSliceResponse`, `StoreSearchRequest` 인터페이스 추가.

5. **스타일 및 아이콘 추가**:
   - 새로운 CSS 클래스 및 버튼 비활성화 시 커서 스타일 변경 규칙 추가.
   - 스크롤바 스타일 개선을 위한 `.pretty-scrollbar` 클래스 추가.

6. **새로운 페이지 및 컴포넌트 추가**:
   - `FindFriends.tsx` 페이지 및 `FindFriends` 컴포넌트 추가.
   - `MyTteok` 컴포넌트에 `ItemDetailModal` 임포트 및 클릭 시 모달 열기 기능 추가.

### 위험/영향
- API 경로 변경으로 기존 클라이언트 코드에서 오류 발생 가능성.
- 새로운 훅과 API 메서드 추가로 인한 기존 코드와의 호환성 문제.
- 상태 관리 로직 추가로 UI에 영향을 미칠 수 있는 복잡성 증가.
- 아이템 배치 요청 구조 변경으로 서버와의 통신 방식에 주의 필요.
- UI/UX 개선이 이루어질 수 있으나 기존 스타일과의 일관성 고려 필요.

### 테스트/검증
- API 경로 변경 및 아이템 배치 요청 정상 작동 여부 확인을 위한 단위 및 통합 테스트 필요.
- 친구 찾기, 검색 및 즐겨찾기 기능의 정상 작동 여부 확인.
- UI가 다양한 화면 크기에서 올바르게 표시되는지 검증.
- 버튼 비활성화 및 스크롤바 스타일 적용 여부 확인.
- 아이템 클릭 시 상세 모달 정상 작동 여부 확인.

### 후속 조치
- 클라이언트 코드에서 변경된 API 경로 반영 및 문서 업데이트 필요.
- 초기 사용자 피드백을 통해 버그 수정 및 개선 사항 반영.
- 성능 모니터링 및 추가 테스트 케이스 작성, 코드 리뷰를 통한 품질 보증.
