## 🤖 AI Change Summary for PR #2

### 개요
이번 변경 사항은 GitHub Issue 템플릿 추가, CI/CD 워크플로우 설정, ESLint 구성 수정, 패키지 의존성 업데이트 및 `src/App.tsx` 파일의 텍스트 수정을 포함합니다. 이를 통해 버그 및 작업 요청을 체계적으로 관리하고, 코드 품질을 향상시키며, 자동화된 요약 기능을 추가했습니다.

### 주요 변경 사항
1. **버그 리포트 템플릿 추가**: `.github/ISSUE_TEMPLATE/bug_report.yml` 파일 추가.
2. **작업/기능 템플릿 추가**: `.github/ISSUE_TEMPLATE/task-feature.yml` 파일 추가.
3. **CI/CD 워크플로우 추가**: `.github/workflows/ai-change_summary.yml` 파일 추가.
4. **Husky 스크립트 수정**: 커밋 메시지에 이슈 번호 자동 추가 로직 개선.
5. **ESLint 구성 수정**: ESLint 설정 업데이트 및 새로운 플러그인 추가.
6. **패키지 의존성 업데이트**: `package-lock.json` 파일에 ESLint 관련 패키지 추가 및 업데이트.
7. **의존성 추가**: `eslint-config-prettier`, `eslint-plugin-perfectionist`, `natural-orderby` 패키지 추가.
8. **App 컴포넌트 수정**: `<h1>` 태그의 텍스트 수정 및 세미콜론 제거.

### 위험/영향
- **템플릿 추가**: 새로운 템플릿으로 이슈 보고가 명확해지나, 기존 방식에 적응 필요.
- **CI/CD 워크플로우**: 자동 요약 기능 추가로 가독성 향상, 민감한 정보 노출 주의.
- **ESLint 구성 변경**: 기존 코드에서 경고 발생 가능성, 개발자 수정 필요.
- **의존성 추가**: ESLint 관련 패키지로 코드 품질 향상 기대, 기존 코드 스타일과 충돌 가능성.
- **Node.js 호환성**: `natural-orderby` 패키지 추가로 Node.js 버전 18 이상에서만 작동할 수 있음.

### 테스트/검증
- **템플릿 검증**: 새로운 Issue 템플릿의 정상 작동 확인.
- **CI/CD 워크플로우 테스트**: Pull Request 생성 후 자동 요약 기능 검증.
- **ESLint 검사**: 코드베이스에 대해 ESLint 실행하여 새로운 규칙 적용 확인.
- **App.tsx 검증**: 수정된 텍스트가 올바르게 반영되었는지 확인.

### 후속 조치
- **템플릿 사용 교육**: 팀원들에게 새로운 Issue 템플릿 사용법 교육.
- **CI/CD 모니터링**: 자동 요약 기능 성능 모니터링 및 조정.
- **코드 품질 개선**: ESLint 경고 해결 및 코드 품질 지속적 개선.
- **코드 스타일 점검**: 추가된 ESLint 설정 기반으로 코드 스타일 점검 및 수정.
- **기능 테스트 케이스 작성**: `natural-orderby` 패키지 사용 시 테스트 케이스 작성 필요.
