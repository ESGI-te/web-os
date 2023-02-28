export default class Watch {
  private watchElement: HTMLElement;
  private timeElement: HTMLElement;
  private alarmElement: HTMLElement;
  private intervalId: number | null;
  private alarmTime: Date | null;
  private isAlarmEnabled: boolean;
  private timerElement: HTMLElement;
  private startButton: HTMLButtonElement;
  private pauseButton: HTMLButtonElement;
  private resetButton: HTMLButtonElement;
  private startTime: Date | null;
  private elapsedTime: number;
  constructor() {
    this.watchElement = document.createElement("div");
    this.watchElement.classList.add("watch");

    this.timeElement = document.createElement("div");
    this.timeElement.id = "time";
    this.timeElement.classList.add("time");
    this.watchElement.appendChild(this.timeElement);

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
    this.timerElement = document.createElement("div");
    this.timerElement.classList.add("timer");
    const timerTimeElement = document.createElement("div");
    timerTimeElement.id = "timer"; 
    timerTimeElement.classList.add("time");
    timerTimeElement.textContent = "00:00:00";
    this.timerElement.appendChild(timerTimeElement);

    this.startButton = document.createElement("button");
    this.startButton.textContent = "Start";
    this.startButton.addEventListener("click", this.handleStartButtonClick);
    this.timerElement.appendChild(this.startButton);

    this.pauseButton = document.createElement("button");
    this.pauseButton.textContent = "Pause";
    this.pauseButton.addEventListener("click", this.handlePauseButtonClick);
    this.timerElement.appendChild(this.pauseButton);

    this.resetButton = document.createElement("button");
    this.resetButton.textContent = "Reset";
    this.resetButton.addEventListener("click", this.handleResetButtonClick);
    this.timerElement.appendChild(this.resetButton);

    this.watchElement.appendChild(this.timerElement);
    this.intervalId = null;
    this.alarmTime = null;
    this.isAlarmEnabled = false;
    this.startTime = null;
    this.elapsedTime = 0;

   
    alarmTimeInput.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.alarmTime = new Date(`1970-01-01T${target.value}:00`);
    });
    alarmEnableCheckbox.addEventListener("change", () => {
      this.isAlarmEnabled = alarmEnableCheckbox.checked;
    });
  
    setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      this.timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  
      if (this.isAlarmEnabled && this.alarmTime && now >= this.alarmTime) {
          this.triggerAlarm();
        }
      }, 1000);
    }
    
    public getElement = (): HTMLElement => {
      return this.watchElement;
    };
    
    private handlePauseButtonClick = () => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.elapsedTime += new Date().getTime() - this.startTime!.getTime();
        this.startTime = null;
      }
    };
    
    private handleStartButtonClick = () => {
      if (!this.startTime) {
        this.startTime = new Date();
      }
      const timerTimeElement = document.getElementById("timer");
      this.intervalId = setInterval(() => {
        const now = new Date();
        const elapsedMilliseconds = now.getTime() - this.startTime!.getTime() + this.elapsedTime;
        const hours = Math.floor(elapsedMilliseconds / (60 * 60 * 1000)).toString().padStart(2, "0");
        const minutes = Math.floor((elapsedMilliseconds % (60 * 60 * 1000)) / (60 * 1000)).toString().padStart(2, "0");
        const seconds = Math.floor((elapsedMilliseconds % (60 * 1000)) / 1000).toString().padStart(2, "0");
        timerTimeElement!.textContent = `${hours}:${minutes}:${seconds}`;
      }, 1000);
    };
    
    private handleResetButtonClick = () => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.startTime = null;
      this.elapsedTime = 0;
      const timerTimeElement = document.getElementById("timer");
      timerTimeElement!.textContent = "00:00:00";
    };
    private triggerAlarm = () => {
      const audio = new Audio("alarm.mp3");
      audio.play();
      alert("Alarm!");
  
      this.alarmTime = null;
      this.isAlarmEnabled = false;}
  
  }