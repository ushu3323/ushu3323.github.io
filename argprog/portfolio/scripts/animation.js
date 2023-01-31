class TypewriterWorker {
  constructor(element, finalText, period) {
    this.finalText = finalText;
    this.actualText = '';
    this.el = element;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.tick();
  }

  tick() {
    const i = this.loopNum % this.finalText.length;
    const fullText = this.finalText.substring(0, i + 1);

    this.el.innerText = fullText;
    this.loopNum++;
    if (this.loopNum < this.finalText.length) {
      setTimeout(() => this.tick(), Math.min(100, Math.random() * 700));
    }
  }

}

const workers = []


let startWriteAnimations = function () {

  const elements = document.getElementsByClassName('typewrite');
  for (let i = 0; i < elements.length; i++) {
    let text = elements[i].getAttribute('data-text');
    let period = elements[i].getAttribute('data-period');
    if (text) {
      workers.push(new TypewriterWorker(elements[i], text, period));
    }
  }
}

