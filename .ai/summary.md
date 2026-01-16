## 🤖 AI Change Summary for PR #3

### 개요
이번 변경 사항은 GitHub의 이슈 템플릿 및 CI/CD 워크플로우 추가, ESLint 설정 및 패키지 의존성 업데이트, React Query를 활용한 상태 관리 기능 통합을 포함합니다. 새로운 버그 리포트 및 작업/기능 템플릿이 추가되었으며, AI를 활용한 변경 요약 자동화 기능이 도입되었습니다. 또한, `App` 컴포넌트에 React Query가 통합되어 기본 쿼리 설정이 정의된 `queryClient.ts` 파일이 추가되었습니다.

### 주요 변경 사항
1. **이슈 템플릿 추가**:
   - `bug_report.yml`: 버그 리포트를 위한 템플릿 추가.
   - `task-feature.yml`: 새로운 작업 또는 기능을 등록하기 위한 템플릿 추가.

2. **CI/CD 워크플로우 추가**:
   - `ai-change_summary.yml`: Pull Request에 대한 자동 요약 기능을 추가하는 워크플로우 생성.

3. **ESLint 설정 수정 및 패키지 추가**:
   - ESLint 설정에서 불필요한 항목 제거 및 prettier 설정 추가.
   - ESLint 관련 패키지(`eslint-config-prettier`, `eslint-plugin-perfectionist`) 추가.

4. **의존성 업데이트**:
   - `@tanstack/react-query`와 `@tanstack/react-query-devtools`의 버전 업데이트.
   - `package-lock.json`에서 새로운 패키지 추가 및 기존 패키지 버전 업데이트.

5. **React Query 통합**:
   - `App.tsx` 파일에 `QueryClientProvider`와 `ReactQueryDevtools` 추가.
   - 기본 쿼리 및 뮤테이션 설정을 위한 `queryClient.ts` 파일 생성.

### 위험/영향
- **이슈 템플릿**: 사용자들이 보다 구조화된 방식으로 이슈를 제출할 수 있게 되어 이슈 관리가 용이해질 것으로 예상됨.
- **CI/CD 워크플로우**: 자동 요약 기능이 추가되어 Pull Request 문서화가 자동화됨, 개발자들의 작업 효율성이 향상될 수 있음.
- **의존성 및 ESLint 업데이트**: 새로운 의존성 추가로 인해 패키지 관리 및 빌드 과정에서 충돌 가능성이 존재하며, ESLint 설정 변경으로 인해 코드 품질과 스타일에 영향을 줄 수 있음.
- **React Query 도입**: 기존 상태 관리 방식과의 호환성 문제가 발생할 수 있음.

### 테스트/검증
- 새로운 이슈 템플릿이 정상적으로 작동하는지 확인하기 위해 GitHub에서 이슈 생성 테스트 필요.
- CI/CD 워크플로우가 Pull Request 이벤트에 대해 정상적으로 작동하는지 확인하기 위한 테스트 필요.
- 기존 기능이 정상적으로 작동하는지 확인하기 위해 전체 애플리케이션의 유닛 테스트 및 통합 테스트 수행 필요.
- ESLint 설정 변경 후 코드 린팅이 정상적으로 수행되는지 검증 필요.

### 후속 조치
- 이슈 템플릿 사용에 대한 피드백 수집 및 필요 시 수정.
- CI/CD 워크플로우의 성능 모니터링 및 개선 사항 적용.
- React Query의 사용에 따른 성능 및 안정성 모니터링 필요.
- ESLint 설정을 팀 내에서 공유하고, 코드 스타일 가이드를 업데이트해야 함.
- 추가적인 문서화 및 React Query 사용법에 대한 교육이 요구될 수 있음.
