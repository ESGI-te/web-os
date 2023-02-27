import '../styles/_watch.scss';

export default class Watch {
  private watchElement: HTMLElement;
  private timeElement: HTMLElement;
  private timerElement: HTMLElement;
  private alarmElement: HTMLElement;
  private intervalId: number | null;
  private alarmTime: Date | null;
  private isAlarmEnabled: boolean;

  constructor() {
    // create the main watch element
    this.watchElement = document.createElement("div");
    this.watchElement.classList.add("watch");

    // create the time part of the watch
    this.timeElement = document.createElement("div");
    this.timeElement.classList.add("time");
    this.watchElement.appendChild(this.timeElement);

    // create the timer part of the watch
    this.timerElement = document.createElement("div");
    this.timerElement.classList.add("timer");
    const timerTitle = document.createElement("h2");
    timerTitle.textContent = "Timer";
    this.timerElement.appendChild(timerTitle);
    const timerInput = document.createElement("input");
    timerInput.type = "number";
    timerInput.value = "0";
    this.timerElement.appendChild(timerInput);
    const timerStartButton = document.createElement("button");
    timerStartButton.textContent = "Start";
    this.timerElement.appendChild(timerStartButton);
    const timerStopButton = document.createElement("button");
    timerStopButton.textContent = "Stop";
    this.timerElement.appendChild(timerStopButton);
    this.watchElement.appendChild(this.timerElement);

    // create the alarm part of the watch
    this.alarmElement = document.createElement("div");
    this.alarmElement.classList.add("alarm");
    const alarmTitle = document.createElement("h2");
    alarmTitle.textContent = "Alarm";
    this.alarmElement.appendChild(alarmTitle);
    const alarmTimeInput = document.createElement("input");
    alarmTimeInput.type = "time";
    this.alarmElement.appendChild(alarmTimeInput);
    const alarmEnableCheckbox = document.createElement("input");
    alarmEnableCheckbox.type = "checkbox";
    const alarmEnableLabel = document.createElement("label");
    alarmEnableLabel.textContent = "Enable";
    alarmEnableLabel.insertBefore(alarmEnableCheckbox, alarmEnableLabel.firstChild);
    this.alarmElement.appendChild(alarmEnableLabel);
    this.watchElement.appendChild(this.alarmElement);

    // initialize properties
    this.intervalId = null;
    this.alarmTime = null;
    this.isAlarmEnabled = false;

    // add event listeners
    timerStartButton.addEventListener("click", () => this.startTimer(parseInt(timerInput.value)));
    timerStopButton.addEventListener("click", () => this.stopTimer());
    alarmTimeInput.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.alarmTime = new Date(`1970-01-01T${target.value}:00`);
    });
    alarmEnableCheckbox.addEventListener("change", () => {
      this.isAlarmEnabled = alarmEnableCheckbox.checked;
    });

    // update the time every second
    setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      this.timeElement.textContent = `${hours}:${minutes}:${seconds}`;

      // check if the alarm should be triggered
      if (this.isAlarmEnabled && this.alarmTime && now >= this.alarmTime) {
        this.triggerAlarm();
      }
    }, 1000);
  }

  public getElement = (): HTMLElement => {
    return this.watchElement;
  };

  private startTimer = (duration: number): void => {
    if (this.intervalId !== null) {
      return;
    }

    const startTime = new Date().getTime();
    let timeLeft = duration * 60 * 1000;
    let pausedTime = 0;

    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const elapsedTime = now - startTime - pausedTime;
      timeLeft -= elapsedTime;
      pausedTime = 0;

      if (timeLeft <= 0) {
        this.stopTimer();
        this.triggerAlarm();
      } else {
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        this.timeElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
    }, 500);

    const pauseButton = this.timerElement.querySelector(".pause-button") as HTMLButtonElement;
    pauseButton.addEventListener("click", () => {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        pausedTime = new Date().getTime() - startTime;
      }
    });
  };


  private stopTimer = () => {
// enable the timer input and start button
    const timerInput = this.timerElement.querySelector("input") as HTMLInputElement;
    const timerStartButton = this.timerElement.querySelector("button:first-of-type") as HTMLButtonElement;
    timerInput.disabled = false;
    timerStartButton.disabled = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private triggerAlarm = () => {
// play the alarm sound
    const audio = new Audio("alarm.mp3");
    audio.play();
    alert("Alarm!");

// reset the alarm
    this.alarmTime = null;
    this.isAlarmEnabled = false;}

}

