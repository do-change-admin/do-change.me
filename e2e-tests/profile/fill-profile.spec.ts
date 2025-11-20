// Загрузка аватара
//   const filePath = join(process.cwd(), 'e2e-tests', 'fixtures', 'profile.jpg');
//
//
//   console.log(filePath)
//
//   if (!existsSync(filePath)) {
//     throw new Error(`Файл не найден: ${filePath}`);
//   }
//
//   const fileInput = page.getByTestId('changePhoto');
//
//   try {
//     await fileInput.setInputFiles(filePath);
//     console.log('Файл загружен успешно');
//   } catch (error) {
//     console.error('Ошибка загрузки файла:', error);
//     await page.screenshot({path: 'upload-error.png'});
//     throw error;
//   }
//
//   // Заполнение формы
//   await page.getByTestId('firstName').fill('Иван');
//   await page.getByTestId('lastName').fill('Иванов');
//   await page.getByTestId('birthDate').fill('1987-04-04'); // YYYY-MM-DD
//   await page.getByTestId('phone').fill('+79991234567');
//   await page.getByTestId('address').fill('ул. Примерная, д. 1, кв. 2');
//   await page.getByTestId('zipCode').fill('123456');
//
//   // Для селекта
//   await page.getByTestId('state').click(); // Открываем выпадающий список
//
// // Ждём появления пункта (ищем по тексту)
//   const option = page.getByText('Alabama (AL)', {exact: true});
//   await expect(option).toBeVisible({timeout: 5000});
//
// // Кликаем по пункту
//   await option.click();
//
//   await page.getByTestId('bio').fill('Это мой профиль. Люблю путешествовать и читать книги.');