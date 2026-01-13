class DynamicIsland {
  constructor(options = {}) {
    this.duration = options.duration || 5000;
    this.position = options.position || "top-center";
    this.counterInterval = null;
    this.init();
  }

  init() {
    this.injectStyles();
    this.createElements();
    this.setupObservers();
  }

  injectStyles() {
    const style = document.createElement("style");
    style.id = "di-library-styles";
    style.textContent = `
                    .di-container { position: fixed; z-index: 9999; pointer-events: none; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
                    
                    /* Posisi-posisi kustom */
                    .di-pos-top-center { top: 24px; left: 50%; transform: translateX(-50%); }
                    .di-pos-top-left { top: 24px; left: 24px; transform: none; }
                    .di-pos-top-right { top: 24px; right: 24px; transform: none; }
                    
                    .di-pos-bottom-center { bottom: 24px; left: 50%; transform: translateX(-50%); }
                    .di-pos-bottom-left { bottom: 24px; left: 24px; transform: none; }
                    .di-pos-bottom-right { bottom: 24px; right: 24px; transform: none; }

                    .di-base { pointer-events: auto; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1.2); background: #000; min-width: 120px; height: 36px; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); border: 0.5px solid rgba(255,255,255,0.1); position: relative; cursor: pointer; }
                    .di-base.active { min-width: 360px; height: 84px; border-radius: 38px; padding: 0 20px; cursor: default; }
                    .di-base.idle { width: 124px; height: 38px; }
                    
                    .di-base.idle { animation: di-float 3s ease-in-out infinite; }
                    @keyframes di-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

                    .di-progress-outer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0; transition: opacity 0.3s ease; }
                    .di-base.active .di-progress-outer { opacity: 1; }
                    .di-rect-outer { fill: none; stroke: rgba(255, 255, 255, 0.15); stroke-width: 2; stroke-linecap: round; }
                    .di-content { opacity: 0; transition: opacity 0.2s ease; display: none; width: 100%; z-index: 10; align-items: center; justify-content: space-between; }
                    .di-base.active .di-content { opacity: 1; display: flex; }
                    .di-idle-view { display: flex; align-items: center; gap: 4px; }
                    .di-dot { width: 6px; height: 6px; background: #444; border-radius: 50%; }
                    .di-close-btn { position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; z-index: 20; }
                    .di-counter-text { font-size: 11px; font-weight: 800; color: rgba(255, 255, 255, 0.9); transition: all 0.2s ease; }
                    .di-close-icon { position: absolute; opacity: 0; transform: scale(0.5) rotate(-45deg); transition: all 0.2s ease; display: flex; align-items: center; }
                    .di-close-btn:hover .di-counter-text { opacity: 0; transform: scale(0.4); }
                    .di-close-btn:hover .di-close-icon { opacity: 1; transform: scale(1) rotate(0deg); }
                    .di-btn-svg { position: absolute; transform: rotate(-90deg); width: 36px; height: 36px; }
                    .di-btn-circle { fill: none; stroke: white; stroke-width: 2.5; stroke-dasharray: 88; stroke-dashoffset: 0; stroke-linecap: round; transition: stroke-dashoffset 0.1s linear; }
                    .di-spinner { width: 22px; height: 22px; border: 3px solid rgba(255,255,255,0.2); border-radius: 50%; border-top-color: #fff; animation: di-spin 0.8s linear infinite; }
                    @keyframes di-spin { to { transform: rotate(360deg); } }
                    @keyframes di-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
                    .di-pulse { animation: di-pulse 0.3s ease-out; }
                `;
    document.head.appendChild(style);
  }

  createElements() {
    this.container = document.createElement("div");
    this.container.className = `di-container di-pos-${this.position}`;
    this.container.innerHTML = `
                    <div id="di-base" class="di-base idle">
                        <svg class="di-progress-outer"><rect class="di-rect-outer" x="0" y="0"></rect></svg>
                        <div class="di-idle-view">
                            <div class="di-dot"></div><div class="di-dot"></div>
                        </div>
                        <div class="di-content">
                            <div class="flex items-center gap-4 w-full">
                                <div id="di-icon" class="flex-shrink-0"></div>
                                <div class="flex flex-col overflow-hidden">
                                    <span id="di-title" class="font-bold text-sm truncate tracking-tight"></span>
                                    <span id="di-msg" class="text-xs text-white/50 truncate pr-2"></span>
                                </div>
                                <div class="ml-auto">
                                    <div id="di-close" class="di-close-btn">
                                        <svg class="di-btn-svg"><circle class="di-btn-circle" cx="18" cy="18" r="14"></circle></svg>
                                        <span id="di-counter" class="di-counter-text"></span>
                                        <div class="di-close-icon">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    document.body.appendChild(this.container);

    this.base = this.container.querySelector("#di-base");
    this.closeBtn = this.container.querySelector("#di-close");
    this.base.onclick = (e) => this.handleBaseClick(e);
    this.closeBtn.onclick = (e) => this.handleCloseClick(e);
  }

  setupObservers() {
    const rectOuter = this.base.querySelector(".di-rect-outer");
    const svgOuter = this.base.querySelector(".di-progress-outer");

    const resizeObserver = new ResizeObserver(() => {
      const w = this.base.offsetWidth;
      const h = this.base.offsetHeight;
      const rx = parseInt(getComputedStyle(this.base).borderRadius);

      svgOuter.setAttribute("viewBox", `0 0 ${w} ${h}`);
      rectOuter.setAttribute("width", w);
      rectOuter.setAttribute("height", h);
      rectOuter.setAttribute("rx", rx);
      rectOuter.setAttribute("ry", rx);
    });
    resizeObserver.observe(this.base);
  }

  setPosition(newPos) {
    this.container.className = `di-container di-pos-${newPos}`;
    this.position = newPos;
  }

  notify({ type, title, message }) {
    clearInterval(this.counterInterval);

    if (this.base.classList.contains("active")) {
      this.base.classList.remove("di-pulse");
      void this.base.offsetWidth;
      this.base.classList.add("di-pulse");
    }

    const content = this.base.querySelector(".di-content");
    content.style.opacity = "0";

    setTimeout(() => {
      this.container.querySelector("#di-title").innerText = title;
      this.container.querySelector("#di-msg").innerText = message;
      this.container.querySelector("#di-icon").innerHTML = this.getIcon(type);

      content.style.opacity = "1";

      if (type !== "loading") {
        this.closeBtn.style.visibility = "visible";
        this.startCounter();
      } else {
        this.closeBtn.style.visibility = "hidden";
      }
    }, 100);

    this.base.classList.remove("idle");
    this.base.classList.add("active");
    this.base.querySelector(".di-idle-view").style.display = "none";
  }

  getIcon(type) {
    const icons = {
      success:
        '<div class="di-icon-success"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>',
      error:
        '<div class="di-icon-error"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg></div>',
      loading: '<div class="di-spinner"></div>',
      info: '<div class="di-icon-info"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg></div>',
    };
    return icons[type] || icons.info;
  }

  startCounter() {
    let timeLeft = this.duration;
    const display = this.container.querySelector("#di-counter");
    const circle = this.base.querySelector(".di-btn-circle");

    display.innerText = Math.ceil(timeLeft / 1000);
    circle.style.strokeDashoffset = 0;

    this.counterInterval = setInterval(() => {
      timeLeft -= 100;
      circle.style.strokeDashoffset = 88 - (timeLeft / this.duration) * 88;
      display.innerText = Math.ceil(timeLeft / 1000);

      if (timeLeft <= 0) this.close();
    }, 100);
  }

  close() {
    clearInterval(this.counterInterval);
    this.base.classList.remove("active", "di-pulse");
    this.base.classList.add("idle");
    setTimeout(() => {
      if (this.base.classList.contains("idle")) {
        this.base.querySelector(".di-idle-view").style.display = "flex";
      }
    }, 400);
  }

  handleCloseClick(e) {
    e.stopPropagation();
    this.close();
  }

  handleBaseClick(e) {
    if (this.base.classList.contains("idle")) {
      this.notify({
        type: "info",
        title: "Sistem",
        message: "Berjalan normal.",
      });
    }
  }
}
