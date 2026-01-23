## 🤖 AI Change Summary for PR #11

### Chunk 1/1
### 개요
이번 변경 사항은 방명록 기능과 상점 정보 관련 API 및 훅을 추가하고, 기존의 상점 API 및 훅을 수정하여 방명록과 상점 정보를 관리할 수 있도록 개선한 내용입니다.

### 주요 변경 사항
1. **방명록 API 추가**:
   - `getGuestBook`, `createGuestBook`, `updateGuestBook`, `deleteGuestBook` 함수가 `guestBookApi.ts` 파일에 추가됨.
   
2. **방명록 키 추가**:
   - `guestBookKeys` 객체가 `guestBookKeys.ts` 파일에 추가되어 방명록 관련 쿼리 키를 정의함.

3. **방명록 훅 추가**:
   - `useGuestBook`, `useCreateGuestBook`, `useUpdateGuestBook`, `useDeleteGuestBook` 훅이 `useGuestBook.ts` 파일에 추가되어 방명록의 CRUD 작업을 지원함.

4. **상점 API 수정**:
   - `storeApi.ts` 파일에 `getStore`, `subscribe`, `unsubscribe` 함수가 추가됨.
   - 기존의 `getItems` 함수와 함께 상점 정보를 가져오는 기능을 포함함.

5. **상점 키 수정**:
   - `storeKeys` 객체가 수정되어 상점 관련 쿼리 키를 보다 명확하게 정의함.

6. **상점 훅 수정**:
   - `useStore`, `useDeleteItem`, `useToggleSubscribe` 훅이 추가 및 수정되어 상점 정보를 가져오고, 아이템 삭제 및 즐겨찾기 상태를 토글하는 기능을 지원함.

7. **타입 정의 추가**:
   - `GuestBookRequest`, `GuestBookResponse`, `StoreResponse` 인터페이스가 `types` 폴더에 추가되어 데이터 구조를 정의함.

### 위험/영향
- 새로운 API와 훅이 추가됨에 따라, 기존 코드와의 호환성 문제는 없지만, 새로운 기능이 추가됨에 따라 테스트가 필요함.
- 방명록과 상점 기능이 서로 연결되어 있으므로, 이들 간의 의존성을 고려해야 함.

### 테스트/검증
- 각 API와 훅의 기능이 정상적으로 작동하는지 확인하기 위해 단위 테스트 및 통합 테스트를 수행해야 함.
- 방명록 CRUD 작업과 상점 정보 조회 및 즐겨찾기 기능에 대한 테스트 케이스를 작성하고 실행해야 함.

### 후속 조치
- 추가된 API와 훅에 대한 문서화를 진행하여 개발자들이 쉽게 이해하고 사용할 수 있도록 해야 함.
- 사용자 피드백을 수집하여 방명록 및 상점 기능의 개선점을 파악하고, 필요한 경우 추가적인 수정 작업을 계획해야 함.
