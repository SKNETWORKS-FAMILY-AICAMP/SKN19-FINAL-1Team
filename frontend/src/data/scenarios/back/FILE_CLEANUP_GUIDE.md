# 📁 시나리오 폴더 정리 가이드

## 📌 정리 목적
시나리오 파일 모듈화 리팩토링 완료 후, 작업 과정에서 생성된 백업 및 중복 파일들을 `back/` 폴더로 정리

---

## 📦 이동 대상 파일 목록 (총 14개)

### ✅ _for_copy 백업 파일 (8개)
```
scenario1_for_copy.ts
scenario2_for_copy.ts
scenario3_for_copy.ts
scenario4_for_copy.ts
scenario5_for_copy.ts
scenario6_for_copy.ts
scenario7_for_copy.ts
scenario8_for_copy.ts
```

### ✅ 중복/이전 버전 파일 (2개)
```
scenario3_이지은_수수료문의.ts     (이전 scenario3)
scenario6_한지민_결제일변경.ts     (이전 scenario6)
```

### ✅ NEW 시나리오 파일 (2개)
```
scenario_NEW2_최우식_한도증액.ts   (이미 scenario2에 적용됨)
scenario_NEW3_박서준_해외결제.ts   (이미 scenario3에 적용됨)
```

### ✅ 테스트 파일 (2개)
```
__test__.ts
__validate_scenario7__.ts
```

---

## 🚀 터미널 명령어 (한 번에 실행)

```bash
# /src/data/scenarios/ 폴더에서 실행
cd /src/data/scenarios

# 백업 파일 이동
mv scenario1_for_copy.ts back/
mv scenario2_for_copy.ts back/
mv scenario3_for_copy.ts back/
mv scenario4_for_copy.ts back/
mv scenario5_for_copy.ts back/
mv scenario6_for_copy.ts back/
mv scenario7_for_copy.ts back/
mv scenario8_for_copy.ts back/

# 중복 파일 이동
mv scenario3_이지은_수수료문의.ts back/
mv scenario6_한지민_결제일변경.ts back/

# NEW 파일 이동
mv scenario_NEW2_최우식_한도증액.ts back/
mv scenario_NEW3_박서준_해외결제.ts back/

# 테스트 파일 이동
mv __test__.ts back/
mv __validate_scenario7__.ts back/
```

---

## ✅ 정리 후 최종 폴더 구조

```
/src/data/scenarios/
  ├── scenario1.ts              ✅ 유지
  ├── scenario2.ts              ✅ 유지
  ├── scenario3.ts              ✅ 유지
  ├── scenario4.ts              ✅ 유지
  ├── scenario5.ts              ✅ 유지
  ├── scenario6.ts              ✅ 유지
  ├── scenario7.ts              ✅ 유지
  ├── scenario8.ts              ✅ 유지
  ├── types.ts                  ✅ 유지
  ├── index.ts                  ✅ 유지
  ├── README.md                 ✅ 유지
  ├── VERIFICATION.md           ✅ 유지
  ├── FILE_CLEANUP_GUIDE.md     ✅ 유지 (이 파일)
  └── back/                     📦 백업 폴더
      ├── scenario1_for_copy.ts
      ├── scenario2_for_copy.ts
      ├── scenario3_for_copy.ts
      ├── scenario4_for_copy.ts
      ├── scenario5_for_copy.ts
      ├── scenario6_for_copy.ts
      ├── scenario7_for_copy.ts
      ├── scenario8_for_copy.ts
      ├── scenario3_이지은_수수료문의.ts
      ├── scenario6_한지민_결제일변경.ts
      ├── scenario_NEW2_최우식_한도증액.ts
      ├── scenario_NEW3_박서준_해외결제.ts
      ├── __test__.ts
      ├── __validate_scenario7__.ts
      └── scenarios_backup.ts   (Phase 2에서 생성 예정)
```

---

## 📝 작업 체크리스트

```
[ ] scenario1_for_copy.ts → back/
[ ] scenario2_for_copy.ts → back/
[ ] scenario3_for_copy.ts → back/
[ ] scenario4_for_copy.ts → back/
[ ] scenario5_for_copy.ts → back/
[ ] scenario6_for_copy.ts → back/
[ ] scenario7_for_copy.ts → back/
[ ] scenario8_for_copy.ts → back/
[ ] scenario3_이지은_수수료문의.ts → back/
[ ] scenario6_한지민_결제일변경.ts → back/
[ ] scenario_NEW2_최우식_한도증액.ts → back/
[ ] scenario_NEW3_박서준_해외결제.ts → back/
[ ] __test__.ts → back/
[ ] __validate_scenario7__.ts → back/
```

---

## ⚠️ 주의사항

- **삭제하지 마세요!** 모든 파일은 `back/` 폴더로 **이동**만 합니다.
- `scenario1.ts` ~ `scenario8.ts`, `types.ts`, `index.ts`는 **절대 이동하지 마세요!**
- 정리 후 프로젝트가 정상 동작하는지 확인하세요.

---

**작업 완료 후 이 파일도 `back/` 폴더로 이동하거나 삭제하셔도 됩니다.**
