// ✅ scenario1.ts 검증 테스트
import { scenario1 } from './scenario1';
import { scenario7 } from './scenario7';

console.log('=== Scenario1 검증 ===');
console.log('✅ ID:', scenario1.id);
console.log('✅ Category:', scenario1.category);
console.log('✅ Customer Name:', scenario1.customer.name);
console.log('✅ Steps Count:', scenario1.steps.length);
console.log('✅ STT Dialogue Count:', scenario1.sttDialogue.length);
console.log('✅ Recent Consultations:', scenario1.recentConsultations.length);

// 구조 검증
if (scenario1.id === 'scenario-1' && 
    scenario1.category === '카드분실' &&
    scenario1.customer.name === '김민지' &&
    scenario1.steps.length === 3) {
  console.log('\n🎉 scenario1.ts 완벽하게 붙여넣기 완료!');
} else {
  console.error('\n❌ 문제 발견! 내용을 다시 확인해주세요.');
}

console.log('\n\n=== Scenario7 검증 ===');
console.log('✅ ID:', scenario7.id);
console.log('✅ Category:', scenario7.category);
console.log('✅ Customer Name:', scenario7.customer.name);
console.log('✅ Steps Count:', scenario7.steps.length);
console.log('✅ STT Dialogue Count:', scenario7.sttDialogue.length);
console.log('✅ Recent Consultations:', scenario7.recentConsultations.length);

// Step별 키워드 확인
scenario7.steps.forEach((step, idx) => {
  console.log(`   Step ${step.stepNumber}: ${step.keywords.length}개 키워드 → [${step.keywords.map(k => k.text).join(', ')}]`);
});

// 구조 검증
if (scenario7.id === 'scenario-7' && 
    scenario7.category === '포인트/혜택' &&
    scenario7.steps.length === 3) {
  console.log('\n🎉 scenario7.ts 3개 Step 모두 정상!');
} else {
  console.error(`\n❌ scenario7 문제 발견! Steps: ${scenario7.steps.length} (예상: 3)`);
}
