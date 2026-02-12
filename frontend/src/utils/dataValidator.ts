/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - 데이터 검증 유틸리티
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 각 페이지/컴포넌트가 요구하는 데이터 구조를 런타임에서 검증
 * 
 * @version 1.0
 * @since 2025-02-03
 */

import type { Scenario } from '@/data/scenarios/types';
import type { ACWData } from '@/data/afterCallWorkData/types';
import { scenarios } from '@/data/scenarios';
import { getAllACWData } from '@/data/afterCallWorkData';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 중분류 15개 옵션 (후처리 페이지 요구사항)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VALID_SUBCATEGORIES = [
  '조회/안내',
  '신청/등록',
  '변경',
  '취소/해지',
  '처리/실행',
  '발급',
  '확인서',
  '배송',
  '즉시출금',
  '상향/증액',
  '이체/전환',
  '환급/반환',
  '정지/해제',
  '결제일',
  '기타',
] as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 검증 결과 타입
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ValidationError {
  location: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationReport {
  passed: boolean;
  totalChecks: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  summary: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Scenario 데이터 검증
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function validateScenario(scenario: Scenario, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const location = `Scenario ${index + 1} (${scenario.id})`;

  // 필수 필드 검증
  if (!scenario.id) {
    errors.push({
      location,
      field: 'id',
      message: 'ID가 없습니다',
      severity: 'error',
    });
  }

  if (!scenario.category) {
    errors.push({
      location,
      field: 'category',
      message: '카테고리가 없습니다',
      severity: 'error',
    });
  }

  // Customer 정보 검증
  if (!scenario.customer) {
    errors.push({
      location,
      field: 'customer',
      message: '고객 정보가 없습니다',
      severity: 'error',
    });
  } else {
    if (!scenario.customer.name) {
      errors.push({
        location,
        field: 'customer.name',
        message: '고객명이 없습니다',
        severity: 'error',
      });
    }

    if (!scenario.customer.phone) {
      errors.push({
        location,
        field: 'customer.phone',
        message: '전화번호가 없습니다',
        severity: 'error',
      });
    }

    if (!scenario.customer.grade) {
      errors.push({
        location,
        field: 'customer.grade',
        message: '고객 등급이 없습니다',
        severity: 'error',
      });
    }
  }

  // STT 대화 검증
  if (!scenario.sttDialogue || scenario.sttDialogue.length === 0) {
    errors.push({
      location,
      field: 'sttDialogue',
      message: 'STT 대화 데이터가 없습니다',
      severity: 'error',
    });
  } else {
    scenario.sttDialogue.forEach((dialogue, idx) => {
      if (!dialogue.speaker) {
        errors.push({
          location,
          field: `sttDialogue[${idx}].speaker`,
          message: '발화자 정보가 없습니다',
          severity: 'error',
        });
      }

      if (!dialogue.message) {
        errors.push({
          location,
          field: `sttDialogue[${idx}].message`,
          message: '메시지 내용이 없습니다',
          severity: 'error',
        });
      }
    });
  }

  // Steps 검증 (Phase 1-3)
  if (!scenario.steps || scenario.steps.length < 3) {
    errors.push({
      location,
      field: 'steps',
      message: 'Phase 1-3 단계가 부족합니다 (최소 3개 필요)',
      severity: 'error',
    });
  } else {
    scenario.steps.forEach((step, stepIdx) => {
      // Phase 1: 키워드 검증
      if (stepIdx === 0) {
        if (!step.keywords || step.keywords.length === 0) {
          errors.push({
            location,
            field: `steps[${stepIdx}].keywords`,
            message: 'Phase 1 키워드가 없습니다',
            severity: 'warning',
          });
        }

        if (!step.currentSituationCards || step.currentSituationCards.length === 0) {
          errors.push({
            location,
            field: `steps[${stepIdx}].currentSituationCards`,
            message: 'Phase 1 상황 분석 카드가 없습니다',
            severity: 'error',
          });
        } else {
          step.currentSituationCards.forEach((card, cardIdx) => {
            if (!card.documentType) {
              errors.push({
                location,
                field: `steps[${stepIdx}].currentSituationCards[${cardIdx}].documentType`,
                message: 'documentType이 없습니다',
                severity: 'error',
              });
            }

            if (!card.fullText) {
              errors.push({
                location,
                field: `steps[${stepIdx}].currentSituationCards[${cardIdx}].fullText`,
                message: 'fullText가 없습니다',
                severity: 'error',
              });
            }
          });
        }
      }

      // Phase 2: 대응 방안 검증
      if (stepIdx === 1) {
        if (!step.actionCards || step.actionCards.length === 0) {
          errors.push({
            location,
            field: `steps[${stepIdx}].actionCards`,
            message: 'Phase 2 대응 방안 카드가 없습니다',
            severity: 'error',
          });
        }
      }

      // Phase 3: 후처리 검증
      if (stepIdx === 2) {
        if (!step.nextSteps || step.nextSteps.length === 0) {
          errors.push({
            location,
            field: `steps[${stepIdx}].nextSteps`,
            message: 'Phase 3 다음 단계가 없습니다',
            severity: 'warning',
          });
        }
      }
    });
  }

  return errors;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. ACW 데이터 검증
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function validateACWData(acwData: ACWData, category: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const location = `ACW Data (${category})`;

  // AI 분석 데이터 검증
  if (!acwData.aiAnalysis) {
    errors.push({
      location,
      field: 'aiAnalysis',
      message: 'AI 분석 데이터가 없습니다',
      severity: 'error',
    });
    return errors;
  }

  const { aiAnalysis } = acwData;

  // 필수 필드 검증
  const requiredFields = [
    'title',
    'inboundCategory',
    'handledCategories',
    'subcategory',
    'summary',
    'followUpTasks',
    'handoffDepartment',
    'handoffNotes',
  ];

  requiredFields.forEach((field) => {
    if (!aiAnalysis[field as keyof typeof aiAnalysis]) {
      errors.push({
        location,
        field: `aiAnalysis.${field}`,
        message: `${field} 필드가 없습니다`,
        severity: field === 'handoffDepartment' || field === 'handoffNotes' ? 'warning' : 'error',
      });
    }
  });

  // 중분류 검증 (15개 옵션 중 하나여야 함)
  if (aiAnalysis.subcategory && !VALID_SUBCATEGORIES.includes(aiAnalysis.subcategory as any)) {
    errors.push({
      location,
      field: 'aiAnalysis.subcategory',
      message: `유효하지 않은 중분류: "${aiAnalysis.subcategory}". 15개 옵션 중 하나여야 합니다.`,
      severity: 'error',
    });
  }

  // 처리 타임라인 검증
  if (!acwData.processingTimeline || acwData.processingTimeline.length === 0) {
    errors.push({
      location,
      field: 'processingTimeline',
      message: '처리 타임라인이 없습니다',
      severity: 'error',
    });
  } else {
    acwData.processingTimeline.forEach((item, idx) => {
      if (!item.time) {
        errors.push({
          location,
          field: `processingTimeline[${idx}].time`,
          message: '시간 정보가 없습니다',
          severity: 'error',
        });
      }

      if (!item.action) {
        errors.push({
          location,
          field: `processingTimeline[${idx}].action`,
          message: '처리 내역이 없습니다',
          severity: 'error',
        });
      }
    });
  }

  // 상담 전문 검증
  if (!acwData.callTranscript || acwData.callTranscript.length === 0) {
    errors.push({
      location,
      field: 'callTranscript',
      message: '상담 전문이 없습니다',
      severity: 'error',
    });
  } else {
    acwData.callTranscript.forEach((item, idx) => {
      if (!item.speaker) {
        errors.push({
          location,
          field: `callTranscript[${idx}].speaker`,
          message: '발화자 정보가 없습니다',
          severity: 'error',
        });
      }

      if (!item.message) {
        errors.push({
          location,
          field: `callTranscript[${idx}].message`,
          message: '메시지 내용이 없습니다',
          severity: 'error',
        });
      }

      if (!item.timestamp) {
        errors.push({
          location,
          field: `callTranscript[${idx}].timestamp`,
          message: '타임스탬프가 없습니다',
          severity: 'error',
        });
      }
    });
  }

  return errors;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 전체 데이터 검증 실행
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function validateAllData(): ValidationReport {
  const allErrors: ValidationError[] = [];

  // 1. 모든 시나리오 검증
  scenarios.forEach((scenario, index) => {
    const scenarioErrors = validateScenario(scenario, index);
    allErrors.push(...scenarioErrors);
  });

  // 2. 모든 ACW 데이터 검증
  const acwDataMap = getAllACWData();
  Object.entries(acwDataMap).forEach(([category, acwData]) => {
    const acwErrors = validateACWData(acwData, category);
    allErrors.push(...acwErrors);
  });

  // 결과 정리
  const errors = allErrors.filter((e) => e.severity === 'error');
  const warnings = allErrors.filter((e) => e.severity === 'warning');

  return {
    passed: errors.length === 0,
    totalChecks: allErrors.length,
    errors,
    warnings,
    summary: `검증 완료: ${errors.length}개 오류, ${warnings.length}개 경고`,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. 콘솔 출력용 리포트 생성
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function printValidationReport(report: ValidationReport): void {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 CALL:ACT 데이터 검증 리포트');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`✅ 전체 검증: ${report.passed ? '통과' : '실패'}`);
  console.log(`📊 총 검사 항목: ${report.totalChecks}개`);
  console.log(`❌ 오류: ${report.errors.length}개`);
  console.log(`⚠️  경고: ${report.warnings.length}개\n`);

  if (report.errors.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ 오류 상세');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    report.errors.forEach((error, index) => {
      console.log(`${index + 1}. [${error.location}]`);
      console.log(`   필드: ${error.field}`);
      console.log(`   내용: ${error.message}\n`);
    });
  }

  if (report.warnings.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  경고 상세');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    report.warnings.forEach((warning, index) => {
      console.log(`${index + 1}. [${warning.location}]`);
      console.log(`   필드: ${warning.field}`);
      console.log(`   내용: ${warning.message}\n`);
    });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. 브라우저 콘솔에서 실행
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 개발 모드에서 자동 실행
if (import.meta.env.DEV) {
  // @ts-ignore - 브라우저 전역 객체에 추가
  window.validateCallActData = () => {
    const report = validateAllData();
    printValidationReport(report);
    return report;
  };

  console.log('💡 개발 모드: 브라우저 콘솔에서 validateCallActData() 실행 가능');
}
