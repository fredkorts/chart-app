import { test, expect } from '@playwright/test';

const TASK_NAME = 'Test Task';
const UPDATED_TASK_NAME = 'Updated Task';
const START_DATE = '01.01.2024';
const END_DATE = '05.01.2024';

async function createTask(page, name = TASK_NAME) {
  await page.getByRole('button', { name: 'Lisa ülesanne' }).click();
  await page.getByPlaceholder('Sisestage ülesande nimi').fill(name);
  await page.getByPlaceholder('Alguskuupäev').fill(START_DATE);
  await page.getByPlaceholder('Lõppkuupäev').fill(END_DATE);
  await page.getByRole('button', { name: 'Lisa ülesanne' }).click();
}

test.describe('Task management', () => {
  test('user creates new task', async ({ page }) => {
    await page.goto('/');
    await createTask(page);
    await expect(page.getByText(TASK_NAME)).toBeVisible();
  });

  test('user creates new task and modifies it', async ({ page }) => {
    await page.goto('/');
    await createTask(page, 'Task To Edit');
    await page.getByText('Task To Edit').click();
    await page.getByRole('button', { name: 'Muuda' }).click();
    await page.getByPlaceholder('Sisestage ülesande nimi').fill(UPDATED_TASK_NAME);
    await page.getByRole('button', { name: 'Salvesta muudatused' }).click();
    await expect(page.getByText(UPDATED_TASK_NAME)).toBeVisible();
  });

  test('user creates new task, modifies it and deletes it', async ({ page }) => {
    await page.goto('/');
    await createTask(page, 'Task To Delete');
    await page.getByText('Task To Delete').click();
    await page.getByRole('button', { name: 'Muuda' }).click();
    await page.getByPlaceholder('Sisestage ülesande nimi').fill(UPDATED_TASK_NAME);
    await page.getByRole('button', { name: 'Salvesta muudatused' }).click();
    await page.getByText(UPDATED_TASK_NAME).click();
    await page.getByRole('button', { name: 'Kustuta' }).click();
    await page.getByRole('button', { name: 'Jah' }).click();
    await expect(page.getByText(UPDATED_TASK_NAME)).toHaveCount(0);
  });
});
