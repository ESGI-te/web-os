

export default class Calculator {


  constructor() {}

  public createCalculator = () => {
    const calculator = document.createElement('div');
    calculator.classList.add('calculator');
    const screen = document.createElement('div');
    screen.id = 'screen';
    screen.textContent = '0';
    screen.classList.add('calculator-screen');
    calculator.appendChild(screen);

    const keys = document.createElement('div');
    keys.classList.add('calculator-keys');

    const buttons = [
      { value: '7', text: '7' },
      { value: '8', text: '8' },
      { value: '9', text: '9' },
      { value: '/', text: '/', className: 'operator' },
      { value: '4', text: '4' },
      { value: '5', text: '5' },
      { value: '6', text: '6' },
      { value: '*', text: '*', className: 'operator' },
      { value: '1', text: '1' },
      { value: '2', text: '2' },
      { value: '3', text: '3' },
      { value: '-', text: '-', className: 'operator' },
      { value: '0', text: '0' },
      { value: '.', text: '.' },
      { value: 'C', text: 'C' },
      { value: '+', text: '+', className: 'operator' },
      { value: '=', text: '=', className: 'equal-sign' },
    ];

    buttons.forEach((button) => {
      const buttonEl = document.createElement('button');
      buttonEl.textContent = button.text;
      buttonEl.value = button.value;
      if (button.className) {
        buttonEl.classList.add(button.className);
      }
      buttonEl.addEventListener('click', () => this.onButtonClick(button.value));
      keys.appendChild(buttonEl);
    });

    calculator.appendChild(keys);
    return calculator;
  }

  private onButtonClick(value: string): void {
    const screen = document.querySelector('#screen') as HTMLElement;
    if (screen) {
      if (value === 'C') {
        screen.textContent = '0';
      } else if (value === '=') {
        const result = eval(screen.textContent as string);
        screen.textContent = result.toString();
      } else {
        if (screen.textContent === '0') {
          screen.textContent = value;
        } else {
          screen.textContent += value;
        }
      }
    }
  }
}
