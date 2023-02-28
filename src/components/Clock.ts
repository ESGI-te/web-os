export default class Clock {
    private element: HTMLDivElement;
    private clockIntervalId: number;
    private stopwatchIntervalId: number;
    private startTime: Date | null;
    private elapsedTime: number;
  
    constructor() {
      this.element = document.createElement("div");
      this.element.className = "clock-container";
  
      const clockDiv = document.createElement("div");
      clockDiv.className = "clock";
      this.element.appendChild(clockDiv);
  
      const stopwatchDiv = document.createElement("div");
      stopwatchDiv.className = "stopwatch";
      this.element.appendChild(stopwatchDiv);
  
      this.clockIntervalId = window.setInterval(() => {
        this.updateClockTime();
      }, 1000);
  
      this.stopwatchIntervalId = 0;
      this.startTime = null;
      this.elapsedTime = 0;
    }
  
    getElement(): HTMLDivElement {
      return this.element;
    }
  
    private updateClockTime(): void {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const timeString = `${this.formatTime(hours)}:${this.formatTime(
        minutes
      )}:${this.formatTime(seconds)}`;
  
      const clockDiv = this.element.querySelector(".clock");
      if (clockDiv) {
        clockDiv.textContent = timeString;
      }
  
      if (this.startTime) {
        const elapsedMs = Date.now() - this.startTime.getTime() + this.elapsedTime;
        const stopwatchDiv = this.element.querySelector(".stopwatch");
        if (stopwatchDiv) {
          stopwatchDiv.textContent = this.formatTime(
            Math.floor(elapsedMs / 3600000)
          ).concat(
            ":",
            this.formatTime(Math.floor((elapsedMs % 3600000) / 60000)),
            ":",
            this.formatTime(Math.floor((elapsedMs % 60000) / 1000)),
            ".",
            this.formatTime(Math.floor((elapsedMs % 1000) / 10))
          );
        }
      }
    }
  
    private formatTime(timeValue: number): string {
      return timeValue.toString().padStart(2, "0");
    }
  
    startStopwatch(): void {
      if (!this.startTime) {
        this.startTime = new Date();
        this.stopwatchIntervalId = window.setInterval(() => {
          this.updateClockTime();
        }, 10);
      }
    }
  
    stopStopwatch(): void {
      if (this.startTime) {
        clearInterval(this.stopwatchIntervalId);
        this.elapsedTime += Date.now() - this.startTime.getTime();
        this.startTime = null;
      }
    }
  
    resetStopwatch(): void {
      clearInterval(this.stopwatchIntervalId);
      this.startTime = null;
      this.elapsedTime = 0;
      this.updateClockTime();
    }
  
    destroy(): void {
      clearInterval(this.clockIntervalId);
      clearInterval(this.stopwatchIntervalId);
      this.element.remove();
    }
  }
  