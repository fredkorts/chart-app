import { test, expect } from '@playwright/test';

const TASK_NAME = 'Test Task';
const UPDATED_TASK_NAME = 'Updated Task';

async function createTask(page, name = TASK_NAME) {
  // Open the add task form
  await page.getByRole('button', { name: '+ Lisa ülesanne' }).click();
  
  // Fill task name
  await page.getByRole('textbox', { name: 'Sisestage ülesande nimi' }).click();
  await page.getByRole('textbox', { name: 'Sisestage ülesande nimi' }).fill(name);
  
  // Handle date picker
  await page.getByRole('textbox', { name: 'Alguskuupäev' }).click();
  await page.getByTitle('-09-01').locator('div').click();
  await page.getByTitle('-10-31').locator('div').click();
  
  // Submit the form
  await page.getByRole('button', { name: 'Lisa ülesanne' }).click();
}

test.describe('Task management', () => {
  test('user creates new task', async ({ page }) => {
    await page.goto('/');
    await createTask(page);
    
    // Wait for success notification
    await expect(page.getByText('Lisasite uue ülesande')).toBeVisible();
    
    // Check that the task appears in the chart
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
