// 中心点位置
var centerX = 360;
var centerY = 360;
// h,m,s对应小时、分钟、秒钟,t表示秒单位累积时间
var h, m, s, t;
// 记录计时函数的id
var timeid;
// 记录闹钟是否打开
var ifalarm = 0;

// hp,mp,sp分别对应时针、分针、秒针
var hp = document.getElementById("houPointer");
addHouRot(hp);

var mp = document.getElementById("minPointer");
addMinRot(mp);

var sp = document.getElementById("secPointer");
addSecRot(sp);

// 准备就绪，时间恢复
resetTime();
addTime();

// 秒表部件
var seUp = 0;
var seId;
var butStart = document.getElementById("start");
var butPause = document.getElementById("pause");
var seText = document.getElementById("seDigital");
// 重置秒表
function resetSe() {
    clearTimeout(seId);
    seUp = 0;
    seText.innerHTML = formatSe();
    butPause.style.display = "none";
    butStart.style.display = "block";
}
// 继续按钮按下
function started() {
    butPause.style.display = "block";
    butStart.style.display = "none";
    addSe();
}
// 暂停键按下
function paused() {
    butPause.style.display = "none";
    butStart.style.display = "block";
    clearTimeout(seId);
}
// 秒表增加
function addSe() {
    seUp++;
    seId = setTimeout(addSe, 10);
    seText.innerHTML = formatSe();
}
// 格式化秒表计数
function formatSe() {
    var seM = Math.floor(seUp / 6000);
    var seS = Math.floor((seUp % 6000) / 100);
    var seCs = Math.floor(seUp % 100);
    if (seM < 10) {
        seM = "0" + seM;
    }
    if (seS < 10) {
        seS = "0" + seS;
    }
    if (seCs < 10) {
        seCs = "0" + seCs;
    }
    return seM + ":" + seS + "." + seCs;
}

// 计时器部件
var total;
var counterOn = false;
var cutId;
var coText = document.getElementById("counterOut");
var coIn = document.getElementById("counterIn");
var coButS = document.getElementById("startC");
var coButP = document.getElementById("pauseC");
// 重置计时器
function resetCounter() {
    clearTimeout(cutId);
    counterOn = false;
    coText.style.display = "none";
    coIn.style.display = "block";
    coButP.style.display = "none";
    coButS.style.display = "block";
}
// 按开始
function startedCounter() {
    coButP.style.display = "block";
    coButS.style.display = "none";
    if (counterOn == false) {
        total = 3600 * document.getElementById("counterH").valueAsNumber +
            60 * document.getElementById("counterM").valueAsNumber +
            document.getElementById("counterS").valueAsNumber;
        counterOn = true;
        coText.style.display = "block";
        coIn.style.display = "none";
    }
    cut();
}
// 按暂停
function pausedCounter() {
    coButP.style.display = "none";
    coButS.style.display = "block";
    clearTimeout(cutId);
}
// 开始计时
function cut() {
    total--;
    coText.innerHTML = formatCo();
    if (total <= 0) {
        confirm("Count Time's up!!!");
        return;
    }
    cutId = setTimeout(cut, 1000);
}
// 格式化计时器
function formatCo() {
    var ch = Math.floor(total / 3600);
    var cm = Math.floor((total % 3600) / 60);
    var cs = total % 60;
    if (ch < 10) {
        ch = "0" + ch;
    }
    if (cm < 10) {
        cm = "0" + cm;
    }
    if (cs < 10) {
        cs = "0" + cs;
    }
    return ch + ":" + cm + ":" + cs;
}


// 参数调整时间
function confirmClock() {
    h = document.getElementById("clockH").valueAsNumber;
    m = document.getElementById("clockM").valueAsNumber;
    s = document.getElementById("clockS").valueAsNumber;
    t = h * 3600 + m * 60 + s;
    setTime();
}

// 重置时间功能
function resetTime() {
    date = new Date();
    h = date.getHours();// >= 12 ? (date.getHours() - 12) : date.getHours();
    m = date.getMinutes();
    s = date.getSeconds();
    t = h * 3600 + m * 60 + s;
}
// 时间按格式输出
function formatTime(h, m, s) {
    var hour = h, min = m, sec = s;
    if (h < 10) {
        hour = "0" + h;
    }
    if (m < 10) {
        min = "0" + m;
    }
    if (s < 10) {
        sec = "0" + s;
    }
    return hour + ":" + min + ":" + sec;
}
// 无秒
function formatHM() {
    var hour = h, min = m;
    if (h < 10) {
        hour = "0" + h;
    }
    if (m < 10) {
        min = "0" + m;
    }
    return hour + ":" + min;
}
// 时间增加功能
function addTime() {
    // 有延迟所以设置为900ms
    timeid = setTimeout(addTime, 1000);
    t++;
    h = Math.floor(t / 3600);
    m = Math.floor((t % 3600) / 60);
    s = t % 60;
    document.getElementById("digital").innerText = formatTime(h, m, s);
    setPointers();
    if (ifalarm == 1) {
        var al = document.getElementById("alarmTime").value;
        if (al == formatHM()) {
            confirm("Alarm Time's up!!!");
            ifalarm = 0;
            document.getElementsByName("alarm")[1].checked = true;
        }
    }
}
// 时间刷新
function setTime() {
    // 保持24小时
    if (t > 86400) {
        t = t % 86400;
    }
    h = Math.floor(t / 3600);
    m = Math.floor((t % 3600) / 60);
    s = t % 60;
    document.getElementById("digital").innerText = formatTime(h, m, s);
}
// 刷新指针
function setPointers() {
    // 秒针部件
    var secR = Math.floor(s * 6);
    sp.setAttribute("transform", "rotate(" + secR + " " + centerX + " " + centerY + ")");
    // 分针部件
    var minR = Math.floor(m * 6 + s / 10);
    mp.setAttribute("transform", "rotate(" + minR + " " + centerX + " " + centerY + ")");
    // 时针部件
    var houR = Math.floor(h * 30 + m / 2);
    hp.setAttribute("transform", "rotate(" + houR + " " + centerX + " " + centerY + ")");
}
// 添加鼠标拨动功能
function addSecRot(p) {
    // 鼠标按下开始
    p.addEventListener("mouseup", addTime);
    p.addEventListener("mousedown", function (event) {
        var lastAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
        clearTimeout(timeid);
        var accu = 0;
        var ot = t;

        // 移动时调用函数
        document.addEventListener("mousemove", rotatePointer);

        // 抬起时删除移动函数
        document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", rotatePointer);
        });

        function rotatePointer(event) {
            var currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
            var added = currentAngle - lastAngle;
            if (currentAngle > 90 && lastAngle < -90) {
                added -= 360;
            }
            if (currentAngle < -90 && lastAngle > 90) {
                added += 360;
            }
            accu += added;
            t = ot + Math.floor(accu / 6);
            setTime();
            lastAngle = currentAngle;
            var rotation = currentAngle + 90;
            p.setAttribute("transform", "rotate(" + rotation + " " + centerX + " " + centerY + ")");
        }
    });
}
function addMinRot(p) {
    // 鼠标按下开始
    p.addEventListener("mouseup", addTime);
    p.addEventListener("mousedown", function (event) {
        var lastAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
        clearTimeout(timeid);
        var accu = 0;
        var ot = t;

        // 移动时调用函数
        document.addEventListener("mousemove", rotatePointer);

        // 抬起时删除移动函数
        document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", rotatePointer);
        });

        function rotatePointer(event) {
            var currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
            var added = currentAngle - lastAngle;
            if (currentAngle > 90 && lastAngle < -90) {
                added -= 360;
            }
            if (currentAngle < -90 && lastAngle > 90) {
                added += 360;
            }
            accu += added;
            t = ot + Math.floor(accu * 10);
            setTime();
            lastAngle = currentAngle;
            var rotation = currentAngle + 90;
            p.setAttribute("transform", "rotate(" + rotation + " " + centerX + " " + centerY + ")");
        }
    });
}
function addHouRot(p) {
    // 鼠标按下开始
    p.addEventListener("mouseup", addTime);
    p.addEventListener("mousedown", function (event) {
        var lastAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
        clearTimeout(timeid);
        var accu = 0;
        var ot = t;

        // 移动时调用函数
        document.addEventListener("mousemove", rotatePointer);

        // 抬起时删除移动函数
        document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", rotatePointer);
        });

        function rotatePointer(event) {
            var currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
            var added = currentAngle - lastAngle;
            if (currentAngle > 90 && lastAngle < -90) {
                added -= 360;
            }
            if (currentAngle < -90 && lastAngle > 90) {
                added += 360;
            }
            accu += added;
            t = ot + Math.floor(accu * 120);
            setTime();
            lastAngle = currentAngle;
            var rotation = currentAngle + 90;
            p.setAttribute("transform", "rotate(" + rotation + " " + centerX + " " + centerY + ")");
        }
    });
}
// 闹钟函数
function alarmon() {
    ifalarm = 1;
}
function alarmoff() {
    ifalarm = 0;
}