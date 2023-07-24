/**
 * @jest-environment jsdom
*/

import TooltipFactory from '../js/TooltipFactory';

test('tooltip должен появиться на странице и исчезать после повторного нажатия', () => {
  document.body.innerHTML = `
        <div class="container">
            <button class="btn">Какая-то кнопка</button>
        </div>`;

  const btn = document.querySelector('.btn');
  const tooltip = new TooltipFactory();

  btn.addEventListener('click', () => {
    tooltip.showTooltip({ title: '', text: '' }, btn);
  });

  let element = document.querySelector('.tooltip');
  expect(element).toBe(null);
  btn.click();
  element = document.querySelector('.tooltip');
  expect(element.classList.contains('tooltip')).toBe(true);

  btn.click();
  element = document.querySelector('.tooltip');
  expect(element).toBe(null);
});

test('tooltip должен правильно отображать заголовок и текст сообщения', () => {
  document.body.innerHTML = `
        <div class="container">
            <button class="btn">Какая-то кнопка</button>
        </div>`;

  const btn = document.querySelector('.btn');
  const message = {
    title: 'Заголовок',
    text: 'Какой-то текст. Ещё какой-то текст',
  };

  const tooltip = new TooltipFactory();
  btn.addEventListener('click', () => {
    tooltip.showTooltip(message, btn);
  });

  btn.click();
  const element = document.querySelector('.tooltip');

  const title = element.querySelector('.tooltipTitle');
  expect(title.textContent).toBe(message.title);

  const text = element.querySelector('.tooltipText');
  expect(text.textContent).toBe(message.text);
});
