const slides = document.querySelectorAll('.slide')
const track = document.querySelector('#sliderTrack')
const dotsContainer = document.getElementById("dots")
const prev = document.querySelector('#prev')
const next = document.querySelector('#next')
const slideRotationInterval = 3000;
let currentSlideIndex = 0;

let slideRotation = null;
function startRotation() {
    slideRotation = setInterval(nextSlide, slideRotationInterval);

}

function ShowSlide(idx) { 
    track.style.transform = `translateX(-${idx * 824}px)`;

    currentSlideIndex = idx

}

function initDots() {
    
    slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dotsContainer.append(dot)

        if (index === currentSlideIndex) {
            dot.classList.add("active")
        }
        dot.addEventListener("click", _ => {
            clearInterval(slideRotation)
            ShowSlide(index);
            updateDots(index)
            startRotation()
        })
    
    });
}


function updateDots(dotIndex) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots.forEach((dot, index) => {
        if (index === dotIndex) {
            dot.classList.add('active')
        } 
    })
    

}
function nextSlide() {
    currentSlideIndex = currentSlideIndex >= slides.length - 1 ? 0 :
    ++currentSlideIndex;

    ShowSlide(currentSlideIndex)
    updateDots(currentSlideIndex);

}

function prevSlide() {
    currentSlideIndex = currentSlideIndex <= 0 ? slides.length - 1:
    --currentSlideIndex;

    ShowSlide(currentSlideIndex)
    updateDots(currentSlideIndex);

}

function handleBackForward(direction = true) {
    clearInterval(slideRotation)
    if (direction) nextSlide()
    else prevSlide();
    startRotation()
}


next.addEventListener('click', function () {
    handleBackForward()
})

prev.addEventListener('click', function () {
    handleBackForward(false)

});

let startX = 0;
let moving = false
track.addEventListener('touchstart', (event) => {
    clearInterval(slideRotation)

    if (event.touches.length > 1) {
        return
    }
    startX = event.touches[0].clientX;
    moving = true
})
track.addEventListener('touchmove', (event) => {
    if (!moving) return 

    let dx = event.touches[0].clientX - startX

    track.style.transform = `translateX(${-currentSlideIndex * 960 + dx}px)`;
})
track.addEventListener('touchend', (event) => {
    if (!moving) return 

    moving = false;

    const endX = event.changedTouches[0].clientX;

    const dx = endX-startX;

    if (dx > 200) {
        prevSlide();
    
    } else if (dx < -200){
        nextSlide()
    } else {
        ShowSlide(currentSlideIndex)
    }
    startRotation()
})

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        clearInterval(slideRotation)
        nextSlide(); 
        startRotation()
    }
    if (event.key === "ArrowLeft") {
        clearInterval(slideRotation)
        prevSlide(); 
        startRotation()
    }
});

ShowSlide(currentSlideIndex)
startRotation()
initDots()

