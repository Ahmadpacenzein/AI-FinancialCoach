/* ==========================================================================
   AI FINANCIAL COACH - MINIMALIST PREMIUM JS SPECIFICATION
   Design Language: OpenAI + Apple + Linear (Matte Glassmorphism)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. DOM Elements Discovery
    const neuralCanvas = document.getElementById("neuralCanvas");
    const orbWrapper = document.getElementById("orbWrapper");
    const currentTimeEl = document.getElementById("currentTime");
    const resetBtn = document.getElementById("resetBtn");
    
    // Forms & Settings
    const financialForm = document.getElementById("financialForm");
    const expensesContainer = document.getElementById("expensesContainer");
    const addExpenseBtn = document.getElementById("addExpenseBtn");
    const submitBtn = document.getElementById("submitBtn");
    
    // Dashboard Modules
    const dashboardPlaceholder = document.getElementById("dashboardPlaceholder");
    const dashboardContent = document.getElementById("dashboardContent");
    const sumIncome = document.getElementById("sumIncome");
    const sumExpenses = document.getElementById("sumExpenses");
    const sumRemaining = document.getElementById("sumRemaining");
    const sumSavingRate = document.getElementById("sumSavingRate");
    
    // Circular score indicators
    const healthScoreNum = document.getElementById("healthScoreNum");
    const scoreCircleProgress = document.getElementById("scoreCircleProgress");
    const healthScoreLabel = document.getElementById("healthScoreLabel");
    const healthScoreDesc = document.getElementById("healthScoreDesc");
    
    // Analyses
    const spendingAnalysisText = document.getElementById("spendingAnalysisText");
    const categoryBarsList = document.getElementById("categoryBarsList");
    
    // Goal plans
    const dashGoalName = document.getElementById("dashGoalName");
    const dashGoalPrice = document.getElementById("dashGoalPrice");
    const goalAnalysisText = document.getElementById("goalAnalysisText");
    const goalProgressBar = document.getElementById("goalProgressBar");
    const goalMonthsResult = document.getElementById("goalMonthsResult");
    
    // SVG savings projection chart
    const svgChartWrapper = document.getElementById("svgChartWrapper");
    const budgetMethodSuggestion = document.getElementById("budgetMethodSuggestion");
    const aiRecommendationsMarkdown = document.getElementById("aiRecommendationsMarkdown");
    
    // Chat Interface
    const chatMessages = document.getElementById("chatMessages");
    const chatThinking = document.getElementById("chatThinking");
    const chatInput = document.getElementById("chatInput");
    const chatSendBtn = document.getElementById("chatSendBtn");
    const chatForm = document.getElementById("chatForm");

    // Internal State Memory
    let globalAnalysisData = null;
    let mousePos = { x: 0, y: 0 };
    let targetParallax = { x: 0, y: 0 };
    let currentParallax = { x: 0, y: 0 };

    // --- 2. Digital Header Clock ---
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        currentTimeEl.textContent = `${hrs}:${mins}:${secs}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 3. Subtle Neural Network Background (Canvas) ---
    const ctx = neuralCanvas.getContext("2d");
    let nodes = [];
    let mouseParticles = [];
    const MAX_NODES = 50; // Clean, sparse layout
    const CONNECT_DIST = 160;
    const PARTICLE_LIFETIME = 50;

    function resizeCanvas() {
        neuralCanvas.width = window.innerWidth;
        neuralCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Spawn clean sparse neural node vectors
    for (let i = 0; i < MAX_NODES; i++) {
        nodes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.2, // slow, gentle float
            vy: (Math.random() - 0.5) * 0.2,
            r: Math.random() * 1.5 + 0.5,     // smaller, crisp dots
            pulse: Math.random() * Math.PI
        });
    }

    // Parallax & Trail trackers
    window.addEventListener("mousemove", (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        
        // Parallax offset vectors (Subtle Apple-style shifts)
        const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        
        targetParallax.x = -normX * 8; // gentle shifts
        targetParallax.y = -normY * 8;
        
        // Minimalist zinc trailing particles
        if (Math.random() < 0.25) {
            const glowColors = ["rgba(139, 92, 246, 0.4)", "rgba(59, 130, 246, 0.4)", "rgba(244, 244, 245, 0.4)"];
            const color = glowColors[Math.floor(Math.random() * glowColors.length)];
            mouseParticles.push({
                x: e.clientX,
                y: e.clientY,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2 - 0.4,
                size: Math.random() * 1.2 + 0.6,
                life: PARTICLE_LIFETIME,
                maxLife: PARTICLE_LIFETIME,
                color: color
            });
        }
    });

    // Draw Loop (60 FPS, GPU-accelerated)
    function drawNeuralBackground() {
        ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
        
        // Smooth linear interpolation for parallax shifts
        currentParallax.x += (targetParallax.x - currentParallax.x) * 0.05;
        currentParallax.y += (targetParallax.y - currentParallax.y) * 0.05;
        
        // Update glow blobs parallax
        const glowLeft = document.querySelector(".glow-left");
        const glowRight = document.querySelector(".glow-right");
        if (glowLeft && glowRight) {
            glowLeft.style.transform = `translate3d(${-currentParallax.x * 1.2}px, ${-currentParallax.y * 1.2}px, 0)`;
            glowRight.style.transform = `translate3d(${-currentParallax.x * 1.4}px, ${-currentParallax.y * 1.4}px, 0)`;
        }
        
        // Update cards parallax
        const cards = document.querySelectorAll(".matte-card");
        cards.forEach((card) => {
            if (!card.matches(':hover')) {
                card.style.transform = `translate3d(${currentParallax.x * 0.5}px, ${currentParallax.y * 0.5}px, 0)`;
            }
        });

        // Determine if AI is active (Speed up nodes slightly)
        const isOrbActive = orbWrapper.classList.contains("thinking") || orbWrapper.classList.contains("responding");
        const speedMult = isOrbActive ? 2.2 : 1.0;
        const opacityMult = isOrbActive ? 1.6 : 1.0;

        ctx.save();
        ctx.translate(currentParallax.x * 0.3, currentParallax.y * 0.3); // network grid parallax offset
        
        // A. Draw very faint connection lines
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeB = nodes[j];
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - (dist / CONNECT_DIST)) * 0.045 * opacityMult;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.stroke();
                }
            }
        }
        
        // B. Draw faint cursor connections
        if (mousePos.x > 0 && mousePos.y > 0) {
            const localMouseX = mousePos.x - currentParallax.x * 0.3;
            const localMouseY = mousePos.y - currentParallax.y * 0.3;
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const dx = localMouseX - node.x;
                const dy = localMouseY - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const alpha = (1 - (dist / 120)) * 0.05 * opacityMult;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(localMouseX, localMouseY);
                    ctx.stroke();
                }
            }
        }
        
        // C. Draw nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            node.x += node.vx * speedMult;
            node.y += node.vy * speedMult;
            node.pulse += 0.012 * speedMult;
            
            // Loop coordinate margins
            if (node.x < 0) node.x = neuralCanvas.width;
            if (node.x > neuralCanvas.width) node.x = 0;
            if (node.y < 0) node.y = neuralCanvas.height;
            if (node.y > neuralCanvas.height) node.y = 0;
            
            const alpha = (0.06 + Math.sin(node.pulse) * 0.03) * opacityMult;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r + Math.sin(node.pulse) * 0.2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
        
        // D. Draw Faint Particle Trails
        for (let i = mouseParticles.length - 1; i >= 0; i--) {
            const p = mouseParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            
            if (p.life <= 0) {
                mouseParticles.splice(i, 1);
                continue;
            }
            
            const alpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha * 0.6;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1;
        }
        
        requestAnimationFrame(drawNeuralBackground);
    }
    
    orbWrapper.className = "voice-orb-wrapper idle";
    drawNeuralBackground();

    // --- 4. Soft Card 3D Tilt Effect (Apple/Linear Style) ---
    function initCardTilt() {
        const cards = document.querySelectorAll(".matte-card");
        cards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const px = (x / rect.width) - 0.5;
                const py = (y / rect.height) - 0.5;
                
                // Very gentle tilt limits (-4deg to 4deg)
                const rotX = -(py * 7).toFixed(2);
                const rotY = (px * 7).toFixed(2);
                
                card.style.setProperty("--rx", `${rotX}deg`);
                card.style.setProperty("--ry", `${rotY}deg`);
                card.style.transform = `scale(1.015) rotateX(var(--rx)) rotateY(var(--ry))`;
            });
            
            card.addEventListener("mouseleave", () => {
                card.style.setProperty("--rx", `0deg`);
                card.style.setProperty("--ry", `0deg`);
                card.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
            });
        });
    }

    // --- 5. Dynamic Expense Forms ---
    addExpenseBtn.addEventListener("click", () => {
        const row = document.createElement("div");
        row.className = "expense-entry-row";
        row.innerHTML = `
            <input type="text" class="exp-name" placeholder="Kategori" required>
            <input type="number" class="exp-val" placeholder="Jumlah (Rp)" required>
            <button type="button" class="btn-remove-entry"><i class="fa-solid fa-xmark"></i></button>
        `;
        expensesContainer.appendChild(row);
        
        row.querySelector(".btn-remove-entry").addEventListener("click", () => {
            row.remove();
        });
    });

    document.querySelectorAll(".btn-remove-entry").forEach((btn) => {
        btn.addEventListener("click", (e) => e.currentTarget.parentElement.remove());
    });

    // --- 6. Helper: Custom Markdown Parser ---
    function parseMarkdown(text) {
        if (!text) return "";
        let html = text.trim();
        const lines = html.split('\n');
        let inList = false;
        let result = [];
        
        for (let line of lines) {
            let trimmed = line.trim();
            
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                if (!inList) {
                    result.push('<ul>');
                    inList = true;
                }
                result.push(`<li>${parseInlineMarkdown(trimmed.substring(2))}</li>`);
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                
                if (trimmed.startsWith('### ')) {
                    result.push(`<h3>${parseInlineMarkdown(trimmed.substring(4))}</h3>`);
                } else if (trimmed.startsWith('## ')) {
                    result.push(`<h2>${parseInlineMarkdown(trimmed.substring(3))}</h2>`);
                } else if (trimmed.startsWith('# ')) {
                    result.push(`<h1>${parseInlineMarkdown(trimmed.substring(2))}</h1>`);
                } else if (trimmed !== '') {
                    result.push(`<p>${parseInlineMarkdown(trimmed)}</p>`);
                }
            }
        }
        if (inList) result.push('</ul>');
        return result.join('\n');
    }

    function parseInlineMarkdown(text) {
        let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
        parsed = parsed.replace(/`(.*?)`/g, '<code class="hud-inline-code">$1</code>');
        return parsed;
    }

    // --- 7. Minimalist SVG Chart projection ---
    function drawProjectionChart(income, remaining, savings20, goalAmount) {
        svgChartWrapper.innerHTML = "";
        
        const width = svgChartWrapper.clientWidth;
        const height = svgChartWrapper.clientHeight;
        const margin = { top: 15, right: 20, bottom: 20, left: 55 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        let currentSavingsData = [];
        let idealSavingsData = [];
        for (let m = 0; m <= 12; m++) {
            currentSavingsData.push({ month: m, value: Math.max(0, remaining * m) });
            idealSavingsData.push({ month: m, value: savings20 * m });
        }

        const maxVal = Math.max(
            currentSavingsData[12].value, 
            idealSavingsData[12].value, 
            goalAmount
        );
        const maxY = maxVal > 0 ? maxVal * 1.15 : 10000000;

        const getX = (m) => margin.left + (m / 12) * plotWidth;
        const getY = (v) => margin.top + plotHeight - (v / maxY) * plotHeight;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = `
            <linearGradient id="areaGradCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.16"/>
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0"/>
            </linearGradient>
            <linearGradient id="areaGradIdeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.10"/>
                <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.0"/>
            </linearGradient>
        `;
        svg.appendChild(defs);

        // A. Draw Grid lines
        const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        for (let i = 0; i <= 4; i++) {
            const v = (maxY / 4) * i;
            const y = getY(v);
            
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", margin.left);
            line.setAttribute("y1", y);
            line.setAttribute("x2", width - margin.right);
            line.setAttribute("y2", y);
            line.setAttribute("class", i === 0 ? "chart-axis-line" : "chart-grid-line");
            gridGroup.appendChild(line);
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", margin.left - 8);
            text.setAttribute("y", y + 2.5);
            text.setAttribute("class", "chart-axis-text");
            text.setAttribute("style", "text-anchor: end;");
            text.textContent = v >= 1000000 ? `Rp ${(v / 1000000).toFixed(1)}jt` : `Rp ${(v / 1000).toFixed(0)}rb`;
            gridGroup.appendChild(text);
        }

        const xMonths = [0, 3, 6, 9, 12];
        xMonths.forEach((m) => {
            const x = getX(m);
            
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", margin.top);
            line.setAttribute("x2", x);
            line.setAttribute("y2", margin.top + plotHeight);
            line.setAttribute("class", m === 0 ? "chart-axis-line" : "chart-grid-line");
            gridGroup.appendChild(line);
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x);
            text.setAttribute("y", margin.top + plotHeight + 12);
            text.setAttribute("class", "chart-axis-text");
            text.textContent = `Bln ${m}`;
            gridGroup.appendChild(text);
        });
        svg.appendChild(gridGroup);

        // B. Goal target line
        if (goalAmount > 0) {
            const goalY = getY(goalAmount);
            if (goalY >= margin.top && goalY <= margin.top + plotHeight) {
                const goalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", margin.left);
                line.setAttribute("y1", goalY);
                line.setAttribute("x2", width - margin.right);
                line.setAttribute("y2", goalY);
                line.setAttribute("class", "chart-path-goal");
                goalGroup.appendChild(line);
                
                const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
                label.setAttribute("x", width - margin.right - 5);
                label.setAttribute("y", goalY - 5);
                label.setAttribute("class", "chart-axis-text");
                label.setAttribute("style", "text-anchor: end; fill: #f59e0b; font-weight: 500;");
                label.textContent = "TARGET";
                goalGroup.appendChild(label);
                
                svg.appendChild(goalGroup);
            }
        }

        // C. Coordinates
        let currentPathD = `M ${getX(0)} ${getY(0)}`;
        let idealPathD = `M ${getX(0)} ${getY(0)}`;
        for (let m = 1; m <= 12; m++) {
            currentPathD += ` L ${getX(m)} ${getY(currentSavingsData[m].value)}`;
            idealPathD += ` L ${getX(m)} ${getY(idealSavingsData[m].value)}`;
        }
        const currentAreaD = currentPathD + ` L ${getX(12)} ${getY(0)} Z`;
        const idealAreaD = idealPathD + ` L ${getX(12)} ${getY(0)} Z`;

        // D. Areas
        const areaIdeal = document.createElementNS("http://www.w3.org/2000/svg", "path");
        areaIdeal.setAttribute("d", idealAreaD);
        areaIdeal.setAttribute("class", "chart-area-ideal");
        svg.appendChild(areaIdeal);

        const areaCurrent = document.createElementNS("http://www.w3.org/2000/svg", "path");
        areaCurrent.setAttribute("d", currentAreaD);
        areaCurrent.setAttribute("class", "chart-area-current");
        svg.appendChild(areaCurrent);

        // E. Paths
        const pathIdeal = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathIdeal.setAttribute("d", idealPathD);
        pathIdeal.setAttribute("class", "chart-path-ideal");
        svg.appendChild(pathIdeal);

        const pathCurrent = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathCurrent.setAttribute("d", currentPathD);
        pathCurrent.setAttribute("class", "chart-path-current");
        svg.appendChild(pathCurrent);

        // F. Tooltips & Milestones
        const pointsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const tooltip = document.createElement("div");
        tooltip.className = "chart-tooltip hidden";
        svgChartWrapper.appendChild(tooltip);

        const milestones = [0, 3, 6, 9, 12];
        milestones.forEach((m) => {
            const x = getX(m);
            
            const valC = currentSavingsData[m].value;
            const yC = getY(valC);
            const dotC = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dotC.setAttribute("cx", x);
            dotC.setAttribute("cy", yC);
            dotC.setAttribute("r", 3);
            dotC.setAttribute("class", "chart-point-marker point-blue");
            
            dotC.addEventListener("mouseenter", () => {
                tooltip.classList.remove("hidden");
                tooltip.innerHTML = `<strong>Bln ${m}</strong><br/>Tabungan: Rp ${valC.toLocaleString("id-ID")}`;
                tooltip.style.left = `${x - 50}px`;
                tooltip.style.top = `${yC - 42}px`;
            });
            dotC.addEventListener("mouseleave", () => tooltip.classList.add("hidden"));
            pointsGroup.appendChild(dotC);

            const valI = idealSavingsData[m].value;
            const yI = getY(valI);
            const dotI = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dotI.setAttribute("cx", x);
            dotI.setAttribute("cy", yI);
            dotI.setAttribute("r", 3);
            dotI.setAttribute("class", "chart-point-marker point-green");
            
            dotI.addEventListener("mouseenter", () => {
                tooltip.classList.remove("hidden");
                tooltip.innerHTML = `<strong>Metode 50/30/20</strong><br/>Bln ${m}: Rp ${valI.toLocaleString("id-ID")}`;
                tooltip.style.left = `${x - 50}px`;
                tooltip.style.top = `${yI - 42}px`;
            });
            dotI.addEventListener("mouseleave", () => tooltip.classList.add("hidden"));
            pointsGroup.appendChild(dotI);
        });
        svg.appendChild(pointsGroup);

        // Slow clean trace animation
        const animatePath = (path) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.getBoundingClientRect();
            path.style.transition = "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)";
            path.style.strokeDashoffset = "0";
        };
        animatePath(pathCurrent);
        animatePath(pathIdeal);

        svgChartWrapper.appendChild(svg);
    }

    // --- 8. Score Counter Animation ---
    function animateHealthScore(targetScore, category) {
        let currentVal = 0;
        const duration = 1200;
        const startTime = performance.now();
        const maxOffset = 263.89; // Circle perimeter
        
        const cleanCatClass = category.toLowerCase().replace(" ", "-");
        scoreCircleProgress.className = `circle-indicator status-${cleanCatClass}`;
        healthScoreLabel.className = `health-badge status-${cleanCatClass}`;
        
        function updateScore(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = progress * (2 - progress);
            currentVal = Math.round(easeProgress * targetScore);
            
            healthScoreNum.textContent = currentVal;
            const offset = maxOffset * (1 - (currentVal / 100));
            scoreCircleProgress.style.strokeDashoffset = offset;
            
            if (progress < 1) {
                requestAnimationFrame(updateScore);
            } else {
                healthScoreNum.textContent = targetScore;
            }
        }
        
        healthScoreLabel.textContent = category.toUpperCase();
        
        if (targetScore >= 81) {
            healthScoreDesc.textContent = "Sangat prima. Anda memiliki kestabilan untuk berinvestasi.";
        } else if (targetScore >= 61) {
            healthScoreDesc.textContent = "Kondisi keuangan sehat. Pertahankan rasio menabung Anda.";
        } else if (targetScore >= 41) {
            healthScoreDesc.textContent = "Agak rentan. Pertimbangkan memotong biaya keinginan non-primer.";
        } else {
            healthScoreDesc.textContent = "Kondisi defisit/kritis. Kurangi pengeluaran gaya hidup sekarang.";
        }
        
        requestAnimationFrame(updateScore);
    }

    // --- 9. Stagger Elements Reveal (IntersectionObserver) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px"
    });

    function showDashboardElements() {
        dashboardPlaceholder.classList.add("hidden");
        dashboardContent.classList.remove("hidden");
        
        const cardElements = dashboardContent.querySelectorAll(".anim-fade-up");
        cardElements.forEach((el, index) => {
            el.classList.remove("visible");
            el.style.transitionDelay = `${index * 0.1}s`;
            revealObserver.observe(el);
            
            el.addEventListener("transitionend", () => {
                el.style.transitionDelay = "0s";
            }, { once: true });
        });
    }

    // --- 10. API Call: Trigger Financial Analysis ---
    financialForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        orbWrapper.className = "voice-orb-wrapper thinking";
        submitBtn.disabled = true;
        submitBtn.textContent = "Menganalisis data...";
        
        const name = document.getElementById("userName").value;
        const age = parseInt(document.getElementById("userAge").value);
        const income = parseFloat(document.getElementById("userIncome").value);
        const goal_name = document.getElementById("goalName").value;
        const goal_amount = parseFloat(document.getElementById("goalAmount").value);
        
        const expenses = {};
        const items = expensesContainer.querySelectorAll(".expense-entry-row");
        items.forEach((item) => {
            const key = item.querySelector(".exp-name").value;
            const val = parseFloat(item.querySelector(".exp-val").value);
            if (key && !isNaN(val)) {
                expenses[key] = val;
            }
        });
        
        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, age, income, expenses, goal_name, goal_amount })
            });
            
            const result = await response.json();
            
            if (result.status === "success") {
                const report = result.data;
                globalAnalysisData = report;
                
                orbWrapper.className = "voice-orb-wrapper pulse-trigger";
                setTimeout(() => orbWrapper.className = "voice-orb-wrapper idle", 800);
                
                // Metrics
                sumIncome.textContent = `Rp ${report.income.toLocaleString("id-ID")}`;
                sumExpenses.textContent = `Rp ${report.total_expenses.toLocaleString("id-ID")}`;
                sumRemaining.textContent = `Rp ${report.remaining_money.toLocaleString("id-ID")}`;
                sumSavingRate.textContent = `${report.saving_rate.toFixed(1)}%`;
                
                if (report.remaining_money < 0) {
                    sumRemaining.className = "metric-value text-red";
                } else {
                    sumRemaining.className = "metric-value text-blue";
                }
                
                // Health Ring
                animateHealthScore(report.health_score, report.health_category);
                
                // Bars Breakdown
                spendingAnalysisText.textContent = report.spending_analysis_text;
                categoryBarsList.innerHTML = "";
                Object.entries(report.expenses).forEach(([cat, amt]) => {
                    const pct = report.expense_percentages[cat] || 0;
                    const isLargest = (cat === report.largest_expense_category);
                    
                    const barRow = document.createElement("div");
                    barRow.className = "category-bar-row";
                    barRow.innerHTML = `
                        <div class="bar-meta">
                            <span class="bar-name">${cat}</span>
                            <span class="bar-val">Rp ${amt.toLocaleString("id-ID")} (${pct.toFixed(1)}%)</span>
                        </div>
                        <div class="bar-track">
                            <div class="bar-fill ${isLargest ? 'largest' : ''}" style="width: 0%;"></div>
                        </div>
                    `;
                    categoryBarsList.appendChild(barRow);
                    
                    setTimeout(() => {
                        barRow.querySelector(".bar-fill").style.width = `${Math.min(100, (amt / report.income * 100))}%`;
                    }, 250);
                });
                
                // Goal
                dashGoalName.textContent = report.goal_name;
                dashGoalPrice.textContent = `Rp ${report.goal_amount.toLocaleString("id-ID")}`;
                goalAnalysisText.textContent = report.goal_analysis;
                if (report.months_to_goal > 0) {
                    const percentage = Math.max(5, Math.min(100, (12 / report.months_to_goal) * 100));
                    goalProgressBar.style.width = `${percentage}%`;
                    goalMonthsResult.textContent = report.months_to_goal.toFixed(1);
                } else {
                    goalProgressBar.style.width = "0%";
                    goalMonthsResult.textContent = "∞";
                }
                
                // Chart
                setTimeout(() => {
                    const idealSavingsRate = report.income * 0.20;
                    drawProjectionChart(report.income, report.remaining_money, idealSavingsRate, report.goal_amount);
                }, 300);
                
                // Markdown AI Text
                budgetMethodSuggestion.innerHTML = parseInlineMarkdown(report.budget_method_suggestion.replace(/\n/g, "<br/>"));
                aiRecommendationsMarkdown.innerHTML = parseMarkdown(report.recommendations);
                
                showDashboardElements();
                initCardTilt();
                
                // Enable Chat
                chatInput.disabled = false;
                chatSendBtn.disabled = false;
                chatInput.placeholder = "Tanyakan tips finansial ke AI Coach...";
                
            } else {
                alert(`Error: ${result.message}`);
                orbWrapper.className = "voice-orb-wrapper idle";
            }
        } catch (error) {
            console.error(error);
            alert("Koneksi gagal. Pastikan server Flask berjalan.");
            orbWrapper.className = "voice-orb-wrapper idle";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Analisis Keuangan AI";
        }
    });

    // --- 11. SSE Streaming Chat Reader ---
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const question = chatInput.value.trim();
        if (!question) return;
        
        const timeStr = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
        const userMsgHTML = `
            <div class="chat-bubble user">
                <span class="bubble-sender">${globalAnalysisData ? globalAnalysisData.name : 'Anda'}</span>
                <div class="bubble-content">${question}</div>
                <span class="bubble-time">${timeStr}</span>
            </div>
        `;
        chatMessages.insertAdjacentHTML("beforeend", userMsgHTML);
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        chatInput.disabled = true;
        chatSendBtn.disabled = true;
        chatThinking.classList.remove("hidden");
        orbWrapper.className = "voice-orb-wrapper thinking";
        
        const aiMsgId = `ai-msg-${Date.now()}`;
        const coachMsgHTML = `
            <div class="chat-bubble assistant" id="${aiMsgId}-wrap">
                <span class="bubble-sender">AI Financial Coach</span>
                <div class="bubble-content" id="${aiMsgId}">...</div>
                <span class="bubble-time">STREAMING</span>
            </div>
        `;
        chatMessages.insertAdjacentHTML("beforeend", coachMsgHTML);
        const aiMsgEl = document.getElementById(aiMsgId);
        
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: question })
            });
            
            if (!response.ok) throw new Error("Terjadi kesalahan server");
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let coachReply = "";
            let done = false;
            
            chatThinking.classList.add("hidden");
            orbWrapper.className = "voice-orb-wrapper responding";
            
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                
                const lines = chunkValue.split("\n");
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const dataStr = line.slice(6).trim();
                        if (dataStr === "[DONE]") {
                            done = true;
                            break;
                        }
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.content) {
                                coachReply += data.content;
                                aiMsgEl.innerHTML = parseMarkdown(coachReply);
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }
                        } catch (err) {}
                    }
                }
            }
            
            const wrapEl = document.getElementById(`${aiMsgId}-wrap`);
            const timeEl = wrapEl.querySelector(".bubble-time");
            timeEl.textContent = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
            
            orbWrapper.className = "voice-orb-wrapper pulse-trigger";
            setTimeout(() => orbWrapper.className = "voice-orb-wrapper idle", 800);
            
        } catch (error) {
            console.error(error);
            aiMsgEl.innerHTML = `<span class="text-red">[Offline: Sambungan dengan AI terputus.]</span>`;
            chatThinking.classList.add("hidden");
            orbWrapper.className = "voice-orb-wrapper idle";
        } finally {
            chatInput.disabled = false;
            chatSendBtn.disabled = false;
            chatInput.focus();
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    // --- 12. Reset Session & UI ---
    resetBtn.addEventListener("click", async () => {
        if (!confirm("Apakah Anda ingin menghapus profil finansial saat ini?")) return;
        
        try {
            const response = await fetch("/api/reset", { method: "POST" });
            const result = await response.json();
            if (result.status === "success") {
                globalAnalysisData = null;
                financialForm.reset();
                expensesContainer.innerHTML = `
                    <div class="expense-entry-row">
                        <input type="text" class="exp-name" placeholder="Kategori (Makan)" required value="Makan">
                        <input type="number" class="exp-val" placeholder="Jumlah (Rp)" required value="1500000">
                        <button type="button" class="btn-remove-entry"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="expense-entry-row">
                        <input type="text" class="exp-name" placeholder="Kategori (Transport)" required value="Transport">
                        <input type="number" class="exp-val" placeholder="Jumlah (Rp)" required value="700000">
                        <button type="button" class="btn-remove-entry"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                `;
                document.querySelectorAll(".btn-remove-entry").forEach((btn) => {
                    btn.addEventListener("click", (e) => e.currentTarget.parentElement.remove());
                });
                
                dashboardContent.classList.add("hidden");
                dashboardPlaceholder.classList.remove("hidden");
                
                chatInput.disabled = true;
                chatSendBtn.disabled = true;
                chatInput.value = "";
                chatInput.placeholder = "Lengkapi data finansial di panel kiri...";
                
                chatMessages.innerHTML = `
                    <div class="chat-bubble assistant">
                        <span class="bubble-sender">AI Financial Coach</span>
                        <div class="bubble-content">
                            Profil finansial telah di-reset. Silakan lengkapi kembali formulir untuk memulai analisis neural baru.
                        </div>
                        <span class="bubble-time">SYSTEM RESET SUCCESSFUL</span>
                    </div>
                `;
                
                orbWrapper.className = "voice-orb-wrapper pulse-trigger";
                setTimeout(() => orbWrapper.className = "voice-orb-wrapper idle", 800);
            }
        } catch (err) {
            console.error(err);
            alert("Gagal me-reset.");
        }
    });
});
