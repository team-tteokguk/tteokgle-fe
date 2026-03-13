## 🤖 AI Change Summary for PR #47

### 개요
이번 변경 사항은 방명록 및 아이템 관련 API와 훅의 데이터 처리 방식을 개선하고, 페이지네이션 및 무한 스크롤 기능을 추가하는 데 중점을 두었습니다. 또한, 의존성 업데이트와 새로운 타입 정의 파일 추가를 포함하여 API 응답 형식을 변경하였습니다.

### 주요 변경 사항
1. **의존성 업데이트**:
   - `@tanstack/react-query` 버전이 `5.90.17`에서 `5.90.21`로 업데이트됨.
   - `@testing-library/jest-dom` 패키지가 추가됨.
   - 여러 패키지의 버전이 업데이트됨.

2. **API 변경**:
   - `getGuestBook` 함수가 `storeId`와 `params`를 인자로 받아 페이지네이션을 지원하도록 변경됨.
   - `guestBookKeys`에서 `list` 메소드가 `params`를 인자로 받도록 수정됨.
   - `useGuestBook` 훅이 `storeId`와 `params`를 인자로 받아 페이지네이션을 지원하도록 변경됨.
   - `useUpdateGuestBook` 및 `useDeleteGuestBook` 훅에서 쿼리 키를 `guestBookKeys.list(storeId)`에서 `guestBookKeys.infiniteRoot(storeId)`로 변경.
   - `getPlacedItemList` 및 `getUnPlacedItemList`의 반환 타입을 수정하여 배열 형태로 반환.
   - `useGetItems` 훅에서 `StoreItemsParams`를 인자로 받아 페이지네이션을 지원하도록 변경.
   - 알림 쿼리 키를 `notificationKeys.lists(memberId)`에서 `notificationKeys.listRoot(memberId)`로 변경.

3. **타입 정의 추가**:
   - `storeParams.ts` 파일이 새로 추가되었으며, `StoreItemsParams` 타입이 정의됨.
   - `GuestBookParams` 및 `PageResponse` 타입을 새로 정의하여 무한 스크롤 기능을 지원.

4. **기타 변경**:
   - `guestBookHandlers`에서 GET 요청의 응답 형식이 변경되어 `content`, `last`, `number` 속성을 포함하는 객체로 수정됨.

### 위험/영향
- **호환성 문제**: API 변경으로 인해 기존에 `getGuestBook` 및 관련 훅을 호출하는 코드가 영향을 받을 수 있으며, 호출 방식이 변경되어 기존 코드와의 호환성 문제가 발생할 수 있음.
- **성능**: 무한 스크롤 기능 추가로 인해 데이터 로딩 및 캐싱 방식이 변경되므로, 성능에 미치는 영향을 모니터링해야 함.
- **타입 안정성**: 새로운 타입 정의는 코드의 타입 안정성을 향상시킬 수 있지만, 기존 코드에서 이 타입을 사용하는 부분이 없다면 즉각적인 영향은 없음.

### 테스트/검증
- 변경된 API와 훅의 동작을 검증하기 위해 단위 테스트 및 통합 테스트를 수행해야 함.
- 페이지네이션 및 무한 스크롤 기능이 정상적으로 작동하는지 확인하기 위해 다양한 `params` 값을 사용하여 테스트를 진행해야 함.
- 수정된 게스트북 핸들러의 GET 요청에 대한 통합 테스트를 수행하여 클라이언트가 새로운 응답 형식에 적절히 대응하는지 확인해야 함.

### 후속 조치
- 기존 코드에서 `getGuestBook` 호출 부분을 새로운 인자에 맞게 수정해야 함.
- 변경된 훅을 사용하는 부분을 점검하고, 필요한 경우 수정.
- 테스트 케이스를 업데이트하고, 새로운 기능에 대한 테스트를 추가해야 함.
- 성능 모니터링을 통해 무한 스크롤 기능이 시스템에 미치는 영향을 분석.
- 타입 정의를 사용하는 부분에 대한 검토 및 필요 시 리팩토링을 진행해야 함.
