// ✅ scenario7.ts 검증 스크립트
import { scenario7 } from './scenario7';

console.log('\n=== 🔍 Scenario7 상세 검증 ===\n');
console.log('✅ ID:', scenario7.id);
console.log('✅ Category:', scenario7.category);
console.log('✅ Customer Name:', scenario7.customer.name);
console.log('✅ STT Dialogue Count:', scenario7.sttDialogue.length);
console.log('✅ Recent Consultations:', scenario7.recentConsultations.length);
console.log('\n📊 Steps 배열 상세 정보:');
console.log(`   전체 Steps 개수: ${scenario7.steps.length}`);

scenario7.steps.forEach((step, idx) => {
  console.log(`\n   [Step ${step.stepNumber}]`);
  console.log(`      - Keywords: ${step.keywords.length}개 → [${step.keywords.map(k => k.text).join(', ')}]`);
  console.log(`      - Current Cards: ${step.currentSituationCards.length}개`);
  console.log(`      - Next Cards: ${step.nextStepCards.length}개`);
  console.log(`      - Guidance: "${step.guidanceScript.substring(0, 30)}..."`);
});

console.log('\n🔑 전체 키워드 수집:');
const allKeywords: string[] = [];
scenario7.steps.forEach(step => {
  allKeywords.push(...step.keywords.map(k => k.text));
});
console.log(`   총 ${allKeywords.length}개: [${allKeywords.join(', ')}]`);

// 구조 검증
if (scenario7.id === 'scenario-7' && 
    scenario7.category === '포인트/혜택' &&
    scenario7.steps.length === 3) {
  console.log('\n✅ ✅ ✅ scenario7.ts 완벽! 3개 Step 모두 정상 로드됨! ✅ ✅ ✅\n');
} else {
  console.error(`\n❌ scenario7 문제 발견!`);
  console.error(`   예상 Steps: 3개`);
  console.error(`   실제 Steps: ${scenario7.steps.length}개`);
  console.error(`\n   steps 배열 내용:`);
  console.error(JSON.stringify(scenario7.steps.map(s => ({ stepNumber: s.stepNumber, keywordCount: s.keywords.length })), null, 2));
}
