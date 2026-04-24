import { test, expect } from '../fixtures/base';

test.describe('Company post create form', () => {
  test('/company/posts/create 에 4개 섹션 헤딩이 있다', async ({ page }) => {
    await page.goto('/company/posts/create');
    for (const title of ['기본 정보', '근무 조건', '모집 기간', '담당자 정보']) {
      await expect(page.getByText(title).first()).toBeVisible();
    }
  });

  test('빈 상태에서 "공고 등록하기" 클릭 시 필수 필드 에러 메시지가 표시되고 URL 이 변경되지 않는다', async ({ page }) => {
    await page.goto('/company/posts/create');
    const before = page.url();
    const submit = page.getByRole('button', { name: /공고 등록하기/ }).first();
    await submit.click();
    const errors = page.locator('[role="alert"], .text-red-500, [class*="error"]');
    await expect(errors.first()).toBeVisible({ timeout: 5_000 });
    expect(page.url()).toBe(before);
  });

  test('"공고 제목을 입력해주세요" 같은 구체 메시지가 노출된다', async ({ page }) => {
    await page.goto('/company/posts/create');
    await page.getByRole('button', { name: /공고 등록하기/ }).first().click();
    await expect(page.getByText(/공고 제목을 입력/).first()).toBeVisible();
  });

  test.fixme('P2: 에러 필드에 aria-invalid="true" 가 설정된다', async ({ page }) => {
    await page.goto('/company/posts/create');
    await page.getByRole('button', { name: /공고 등록하기/ }).first().click();
    const invalidInputs = page.locator('input[aria-invalid="true"], textarea[aria-invalid="true"]');
    expect(await invalidInputs.count()).toBeGreaterThan(0);
  });

  test.fixme('P3: "공고 등록하기" submit 버튼이 DOM 에 1개만 존재한다', async ({ page }) => {
    await page.goto('/company/posts/create');
    const submits = page.getByRole('button', { name: /공고 등록하기/ });
    expect(await submits.count()).toBe(1);
  });

  test('현재 submit 버튼 개수 baseline (P3 모니터링용)', async ({ page }) => {
    await page.goto('/company/posts/create');
    const count = await page.getByRole('button', { name: /공고 등록하기/ }).count();
    expect(count).toBeGreaterThan(0);
    console.log(`[baseline] submit 버튼 DOM 개수: ${count}`);
  });
});
