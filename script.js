let nameValue = "";
let gamePlayed = false;

// HÀM TẠO TIẾNG TÍT TO RÕ
function playTickSound(freq, volume = 0.2) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        
        osc.connect(g);
        g.connect(ctx.destination);
        
        // Kiểu sóng 'square' hoặc 'triangle' sẽ nghe to và rõ hơn 'sine' mặc định
        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02); // Tăng volume ở đây
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
        console.log("Audio Error: ", e);
    }
}


function playFlySound(volume = 0.3) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 1.2);
        
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
        
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
    } catch(e) { console.log("Audio Error:", e); }
}

// HÀM ÂM THANH CHƯỞNG "BÙM"
function playBeamSound(volume = 0.4) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch(e) { console.log("Audio Error:", e); }
}

function initCountdown() {
    const btn = document.getElementById('start-btn');
    const numEl = document.getElementById('countdown-number');
    const screen = document.getElementById('countdown-screen');
    
    // Tiếng bíp khởi động cực mạnh khi click
    playTickSound(600, 0.3); 
    
    btn.style.display = 'none';
    numEl.style.display = 'block';

    let count = 5;
    const timer = setInterval(() => {
        if (count > 0) {
            numEl.innerText = count;
            playTickSound(440, 0.25); // Tiếng tít tít to rõ
            count--;
        } else {
            clearInterval(timer);
            numEl.innerText = "OPEN";
            playTickSound(880, 0.4); // Tiếng bíp kết thúc vang dội
            
            setTimeout(() => {
                screen.style.opacity = '0';
                setTimeout(() => {
                    screen.style.display = 'none';
                    startBattleScene(); // Bắt đầu animation battle
                }, 1000);
            }, 800);
        }
    }, 1000);
}

// Battle Scene Animation
function startBattleScene() {
    const battleScene = document.getElementById('battle-scene');
    const battleText = document.getElementById('battle-text');
    const monster = document.getElementById('sadness-monster');
    const monsterName = document.querySelector('.monster-name');
    const hero = document.getElementById('hero');
    const beam = document.getElementById('power-beam');
    
    // Hiện battle scene
    battleScene.classList.remove('hidden');
    
    // Bước 1: Hiện chữ chạy từ từ, và chuỗi animation sau đó
    typeWriter("Nếu một ngày cậu cảm thấy buồn...", "battle-text", () => {
        // Callback này chạy khi chữ đã viết xong

        // Bước 2: Hiện chữ "Thì..."
        setTimeout(() => {
            battleText.innerHTML += "<br>Thì...";
        }, 200);

        // Bước 3: Làm mờ và ẩn dòng chữ sau 1 giây
        setTimeout(() => {
            battleText.classList.add('text-fade-out');
        }, 1200);

        // Bước 4: Yêu quái xuất hiện sau khi chữ bắt đầu mờ đi
        setTimeout(() => {
            monster.style.opacity = '1';
            monsterName.style.opacity = '1';
        }, 1700); // 0.5s after text starts fading

        // Bước 5: Superman bay vào từ bên trái
        setTimeout(() => {
            hero.classList.remove('hidden');
            playFlySound(); // Âm thanh superman bay
            hero.classList.add('hero-appear');
        }, 2200); // 0.5s after monster appears

        // Bước 6: Superman tấn công
        setTimeout(() => {
            hero.classList.remove('hero-appear');
            hero.classList.add('hero-attack');
            
            // Bắn chưởng sau khi lao tới 1 chút
            setTimeout(() => {
                playBeamSound(); // Âm thanh chưởng
                beam.classList.add('beam-active');
                monster.classList.add('monster-fly-away');
                monsterName.classList.add('monster-fly-away');
            }, 400); // 400ms sau khi bắt đầu attack
        }, 3700); // 1.5s sau khi superman xuất hiện

        // Bước 7: Dọn dẹp và chuyển cảnh
        setTimeout(() => {
            battleScene.classList.add('hidden');
            document.getElementById("screen0").classList.remove("hidden");
            
            // Reset lại trạng thái để nếu có chạy lại thì không bị lỗi
            battleText.innerHTML = '';
            battleText.classList.remove('text-fade-out');
            monster.style.opacity = '0';
            monster.classList.remove('monster-fly-away');
            monsterName.style.opacity = '0';
            monsterName.classList.remove('monster-fly-away');
            hero.classList.add('hidden');
            hero.classList.remove('hero-attack');
            beam.classList.remove('beam-active');
        }, 5500);
    });
}


function saveName() {
    const val = document.getElementById("userName").value.trim();
    if (!val) return;
    nameValue = val;
    document.querySelectorAll(".display-name").forEach(el => el.innerText = nameValue);
    transitionScreen("screen0", "screen1");
}

function openLetter() {
    playTickSound(1000, 0.2); // Tiếng "tách" khi mở thư
    document.querySelector('.envelope-wrapper').classList.add('open');
    document.getElementById("music").play().catch(e => console.log("Music blocked"));
    setTimeout(() => transitionScreen("screen1", "screen2"), 1600);
}

function selectFlower(num) {
    document.getElementById("flowerSection").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
    const wishes = {
        1: (n) => `✨ Chúc <span class="highlight-name">${n}</span> sống BÌNH THƯỜNG nhưng không TẦM THƯỜNG , luôn xinh đẹp hơn nhỏ mình ghét nhaaaa 🌷`,
        2: (n) => `🌈 Chúc <span class="highlight-name">${n}</span> luôn cười thật tươi , giữ được cái đầu lạnh với mấy thằng trai tồi nhaa  🌼`,
        3: (n) => `🌹 Chúc <span class="highlight-name">${n}</span> đánh nền không mốc , không khóc vì đàn ông . Đẹp gái thì làm ơn đừng có buồn dùm taooo 💝`
    };
    typeWriter(wishes[num](nameValue), "wishText", () => {
        document.getElementById("btn-next").style.display = "inline-flex";
    });
}

function nextToFinalWish() {
    transitionScreen("screen2", "screen3");
    setTimeout(() => {
        typeWriter(`🍀 <span class="highlight-name">${nameValue}</span> dù có là bông hoa nào đi chăng nữa thì cũng phải là phiên bản tốt nhất của bản thân mình nha ❤️`, "final-message", () => {
            const btnGame = document.getElementById("btn-to-game");
            btnGame.classList.remove("hidden-btn");
            btnGame.style.opacity = "1";
            btnGame.style.pointerEvents = "auto";
        });
    }, 500);
}

function goToGame() { transitionScreen("screen3", "screen-game"); }

function handleGame(el) {
    if (gamePlayed) return;
    gamePlayed = true;
    
    playTickSound(150, 0.3); // Tiếng hụt quà trầm và to
    
    el.classList.add('opened');
    document.querySelectorAll('.gift-item').forEach(g => { if(g !== el) g.classList.add('disabled'); });
    
    setTimeout(() => {
        document.getElementById("game-status").innerText = "Chúc bạn may mắn lần sau...xui ghê huhu 😢";
        const btnConsolation = document.getElementById("btn-consolation");
        btnConsolation.style.display = "flex";
        btnConsolation.style.margin = "20px auto";
    }, 600);
}

function showMystery() {
    document.getElementById("screen-game").classList.add("hidden");
    const overlay = document.getElementById("mystery-overlay");
    overlay.classList.remove("hidden");
    typeWriter("NHƯNG MÀ... TỚ CÓ QUÀ AN ỦI SIÊU CẤP VÍP PRO CHO CẬU ĐÂY...", "mystery-text", () => {
        setTimeout(() => {
            overlay.classList.add("hidden");
            document.getElementById("flower-bouquet-screen").classList.remove("hidden");
            placeNamesOnTulips();
        }, 1500);
    });a
}

function placeNamesOnTulips() {
    const overlay = document.getElementById("names-overlay");
    overlay.innerHTML = "";
    const positions = [{t:'24%',l:'26%'},{t:'19%',l:'46%'},{t:'25%',l:'71%'},{t:'47%',l:'18%'},{t:'42%',l:'46%'},{t:'43%',l:'82%'},{t:'65%',l:'38%'},{t:'61%',l:'84%'}];
    positions.forEach(pos => {
        const span = document.createElement('span');
        span.className = 'name-on-flower';
        span.style.top = pos.t; span.style.left = pos.l;
        span.innerText = nameValue;
        overlay.appendChild(span);
    });
}

function typeWriter(text, elementId, callback) {
    let i = 0; const el = document.getElementById(elementId); el.innerHTML = "";
    function typing() {
        if (i < text.length) {
            if (text.charAt(i) === "<") { let end = text.indexOf(">", i); el.innerHTML += text.substring(i, end+1); i = end+1; }
            else { el.innerHTML += text.charAt(i); i++; }
            setTimeout(typing, 50);
        } else if (callback) callback();
    }
    typing();
}

function transitionScreen(hide, show) {
    const h = document.getElementById(hide); const s = document.getElementById(show);
    h.style.animation = "cardExit 0.4s forwards";
    setTimeout(() => { 
        h.classList.add("hidden"); 
        s.classList.remove("hidden"); 
        s.style.animation = "cardEnter 0.6s forwards"; 
    }, 400);
}

window.onload = () => {
    const container = document.getElementById('petals-container');
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div'); p.className = 'petal';
        p.style.left = Math.random() * 100 + 'vw'; p.style.animationDuration = (Math.random() * 3 + 4) + 's';
        container.appendChild(p);
    }
};
