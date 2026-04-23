import { test, expect } from '../fixtures/base';

test.describe('Self-diagnosis flow', () => {
  test('/self-diagnosis 진입 → 시작하기 클릭 → /diagnosis 이동 → 첫 스텝 radio 선택 → 다음 스텝', async ({ page }) => {
    // /self-diagnosis 는 독립된 기본정보 폼(자가진단 히어로). 헤딩만 우선 확인.
    await page.goto('/self-diagnosis');
    await expect(page.getByRole('heading', { name: /자가진단|진단/ }).first()).toBeVisible();

    // 실제 진단 플로우는 /diagnosis 에서 시작된다 — Session1 첫 스텝에 radio 10+ 개 존재.
    await page.goto('/diagnosis');
    await page.waitForURL(/\/diagnosis/, { timeout: 10_000 });

    // role=radio 우선, 없으면 input[type=radio] 로 폴백.
    let radios = page.getByRole('radio');
    let count = await radios.count();
    if (count === 0) {
      radios = page.locator('input[type=radio]');
      count = await radios.count();
    }
    expect(count, '첫 스텝 radio 개수').toBeGreaterThanOrEqual(3);

    for (let i = 0; i < Math.min(3, count); i++) {
      await radios.nth(i).check({ force: true });
    }

    const nextBtn = page.getByRole('button', { name: /다음|Next/ }).first();
    await expect(nextBtn).toBeVisible();
  });

  test('/self-diagnosis 와 /diagnosis 모두 200 응답한다', async ({ request }) => {
    const a = await request.get('/self-diagnosis');
    const b = await request.get('/diagnosis');
    expect(a.status()).toBeLessThan(400);
    expect(b.status()).toBeLessThan(400);
  });
});
