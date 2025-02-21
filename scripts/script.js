// Инициализация
Telegram.WebApp.ready();

Telegram.WebApp.setHeaderColor("#000000");
Telegram.WebApp.setBackgroundColor("#000000");
Telegram.WebApp.setBottomBarColor("#000000");


const stickers = [
    {
        element: document.getElementById('sticker1'),
        data: 'stickers/lips.json' // Утка
    },
    {
        element: document.getElementById('sticker2'),
        data: 'stickers/keks.json' // Праздник
    },
    {
        element: document.getElementById('sticker3'),
        data: 'stickers/book.json' // Фейерверк
    }
];

let currentIndex = 0;
let isAnimating = false;

// анимации
stickers.forEach((sticker, index) => {
    lottie.loadAnimation({
        container: sticker.element,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: sticker.data
    });

    // Создание точек пагинации
    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => showSticker(index));
    document.getElementById('pagination').appendChild(dot);
});

// Показать стикер
function showSticker(index) {
    if (isAnimating || index === currentIndex) return;
    Telegram.WebApp.HapticFeedback.impactOccurred('soft');
    isAnimating = true;
    stickers[currentIndex].element.classList.remove('active');
    stickers[index].element.classList.add('active');


    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentIndex = index;
    setTimeout(() => isAnimating = false, 300);
}

// Свайп
let touchStartX = 0;
document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < 50) return;

    if (deltaX > 0) {
        showSticker((currentIndex - 1 + stickers.length) % stickers.length);
    } else {
        showSticker((currentIndex + 1) % stickers.length);
    }
});


document.addEventListener('click', e => {
    const screenWidth = window.innerWidth;
    if (e.clientX > screenWidth / 2) {
        showSticker((currentIndex + 1) % stickers.length);
    } else {
        showSticker((currentIndex - 1 + stickers.length) % stickers.length);
    }
});

// Старт
stickers[0].element.classList.add('active');
stickers.forEach(sticker => sticker.element.style.display = 'block');

Telegram.WebApp.MainButton.setText("Set emoji status");
Telegram.WebApp.MainButton.setParams({ color: "#111" });
Telegram.WebApp.MainButton.show();

// кнопка
Telegram.WebApp.MainButton.onClick(async function () {
    if (currentIndex === 0) {
        await Telegram.WebApp.setEmojiStatus('5456505321046434137');
    }

    if (currentIndex === 1) {
        await Telegram.WebApp.setEmojiStatus('5251377180478304833');
    }

    if (currentIndex === 2) {
        await Telegram.WebApp.setEmojiStatus('5265075583531900971');
    }
});