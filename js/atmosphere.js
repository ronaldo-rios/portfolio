(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    function createCanvas(parent, className) {
        const canvas = document.createElement("canvas");
        canvas.className = className;
        canvas.setAttribute("aria-hidden", "true");
        parent.appendChild(canvas);
        return canvas;
    }

    function resizeCanvas(canvas, parent) {
        const rect = parent.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx, width: rect.width, height: rect.height };
    }

    /* Nevasca por seção */
    function initSectionSnow(selector, count) {
        const container = document.querySelector(selector);
        if (!container) return;

        const canvas = createCanvas(container, "fx-canvas fx-canvas--snow");
        const flakes = Array.from({ length: count }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 2 + 0.6,
            speed: Math.random() * 0.7 + 0.3,
            wind: Math.random() * 0.3 - 0.15,
            opacity: Math.random() * 0.5 + 0.2,
        }));

        function draw() {
            const { ctx, width, height } = resizeCanvas(canvas, container);
            ctx.clearRect(0, 0, width, height);

            flakes.forEach(f => {
                f.y += f.speed / height;
                f.x += f.wind / width;
                if (f.y > 1) { f.y = 0; f.x = Math.random(); }
                if (f.x > 1) f.x = 0;
                if (f.x < 0) f.x = 1;

                ctx.beginPath();
                ctx.arc(f.x * width, f.y * height, f.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220, 235, 245, ${f.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }

        draw();
        window.addEventListener("resize", () => resizeCanvas(canvas, container));
    }

    function initStarField(sectionSelector, density = 1) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;

        const canvas = createCanvas(section, "fx-canvas fx-canvas--stars");
        const count = Math.floor((isMobile ? 40 : 90) * density);
        const stars = [];

        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random() * 0.75,
                r: Math.random() * 1.4 + 0.4,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.005,
            });
        }

        let time = 0;

        function draw() {
            const { ctx, width, height } = resizeCanvas(canvas, section);
            ctx.clearRect(0, 0, width, height);
            time += 0.016;

            stars.forEach(s => {
                const twinkle = 0.4 + Math.sin(time * s.speed * 60 + s.phase) * 0.35;
                ctx.beginPath();
                ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 248, 230, ${twinkle})`;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }

        draw();
        window.addEventListener("resize", () => resizeCanvas(canvas, section));
    }

    function initWater() {
        const section = document.querySelector("#about");
        if (!section) return;

        const canvas = createCanvas(section, "fx-canvas fx-canvas--water");
        let offset = 0;

        function draw() {
            const { ctx, width, height } = resizeCanvas(canvas, section);
            ctx.clearRect(0, 0, width, height);

            const baseY = height * 0.82;
            const layers = [
                { amp: 14, freq: 0.008, speed: 0.03, color: "rgba(60, 110, 140, 0.35)" },
                { amp: 10, freq: 0.012, speed: 0.045, color: "rgba(80, 140, 170, 0.25)" },
                { amp: 6, freq: 0.018, speed: 0.06, color: "rgba(100, 170, 200, 0.15)" },
            ];

            layers.forEach((layer, li) => {
                ctx.beginPath();
                ctx.moveTo(0, height);
                for (let x = 0; x <= width; x += 3) {
                    const y = baseY + li * 12
                        + Math.sin(x * layer.freq + offset * layer.speed) * layer.amp
                        + Math.sin(x * layer.freq * 1.7 + offset * layer.speed * 0.7) * (layer.amp * 0.4);
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(width, height);
                ctx.closePath();
                ctx.fillStyle = layer.color;
                ctx.fill();
            });

            offset += 1;
            requestAnimationFrame(draw);
        }

        draw();
        window.addEventListener("resize", () => resizeCanvas(canvas, section));
    }

    function initAuroraParallax() {
        const aurora = document.querySelector(".hero__aurora");
        const hero = document.querySelector("#hero");
        if (!aurora || !hero) return;

        hero.addEventListener("mousemove", (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            aurora.style.transform = `translate(${x * 30}px, ${y * 15}px)`;
        });

        hero.addEventListener("mouseleave", () => {
            aurora.style.transform = "";
        });
    }

    if (prefersReducedMotion) return;

    initSectionSnow(".hero__atmosphere", isMobile ? 35 : 70);
    initSectionSnow("#cta", isMobile ? 25 : 50);
    initSectionSnow("footer", isMobile ? 15 : 30);
    initStarField("#hero");
    initStarField("#cta", 0.6);
    initWater();
    initAuroraParallax();
})();
