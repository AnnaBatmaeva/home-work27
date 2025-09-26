class Slider {
    #currentSlideIndex = null;
    #startX = null;
    #moving = null;

    #slideRotation = null;
    #slides = null;
    #track = null;
    #dotsContainer = null;
    #prev = null;
    #next = null;
    #sliderContainer = null;
    #sliderWindow = null;
    #timeout = null;

    #slideWidth = null;
    #sliderWidth = null;

    #ratio = 1.45

    constructor(option = {}) {
        this.#dotsContainer = document.getElementById(option.dotsContainerId)
        this.#sliderContainer = document.getElementById(option.sliderContainer)
        this.#sliderWindow = document.querySelector(option.sliderWindow)

        this.#prev = document.querySelector(option.prevId)
        this.#next = document.querySelector(option.nextId)

        this.#track = document.querySelector(option.trackId)
        this.#slides = document.querySelectorAll(option.slideClass)

        this.#startX = option.startX;
        this.#currentSlideIndex = option.currentSlideIndex;
        this.#moving = option.moving;

        this.slideRotationInterval = option.slideRotationInterval;

        this.#setSliderDimensions(option.sliderWidth)

        this.#sliderWidth = option.sliderWidth;


        // Initialization
        this.startRotation()
        this.#initDots()
        this.#attachEventListener()

        this.#ShowSlide(this.#currentSlideIndex)
    }

    startRotation() {
        this.#slideRotation = setInterval(() => this.#nextSlide(), this.slideRotationInterval);
    }

    stopRotation() {
        if (this.#slideRotation) {
            clearInterval(this.#slideRotation);
            this.#slideRotation = null
        }
    }

    #setSliderDimensions(basicWidth) {
        this.#sliderContainer.style.width = basicWidth + "px";

        this.#slideWidth = basicWidth - 126;


        this.#sliderWindow.style.width = this.#slideWidth + "px";
        this.#sliderWindow.style.height = Math.floor(this.#slideWidth / this.#ratio) + "px";

        this.#slides.forEach((slide) => {
            slide.style.width = this.#slideWidth + "px";
            slide.style.height = Math.floor(this.#slideWidth / this.#ratio) + "px";

        });


    }

    #ShowSlide(idx) {
        this.#track.style.transform = `translateX(-${idx * this.#slideWidth}px)`;
        this.#currentSlideIndex = idx
    }

    #initDots() {
        this.#slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            this.#dotsContainer.append(dot)

            if (index === this.#currentSlideIndex) {
                dot.classList.add("active")
            }
            dot.addEventListener("click", _ => {
                clearInterval(this.#slideRotation)
                this.#ShowSlide(index);
                this.#updateDots(index)
                this.startRotation()
            })
        });
    }

    #updateDots(dotIndex) {
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots.forEach((dot, index) => {
            if (index === dotIndex) {
                dot.classList.add('active')
            }
        })
    }

    #nextSlide() {
        this.#currentSlideIndex = this.#currentSlideIndex >= this.#slides.length - 1 ? 0 :
            ++this.#currentSlideIndex;

        this.#ShowSlide(this.#currentSlideIndex)
        this.#updateDots(this.#currentSlideIndex)
    }

    #prevSlide() {
        this.#currentSlideIndex = this.#currentSlideIndex <= 0 ? this.#slides.length - 1 :
            --this.#currentSlideIndex;

        this.#ShowSlide(this.#currentSlideIndex)
        this.#updateDots(this.#currentSlideIndex)
    }

    #handleBackForward(direction = true) {
        clearInterval(this.#slideRotation)
        if (direction) this.#nextSlide()
        else this.#prevSlide();
        this.startRotation()
    }

    #attachEventListener() {
        this.#next.addEventListener('click', () => {
            this.#handleBackForward()
        })

        this.#prev.addEventListener('click', () => {
            this.#handleBackForward(false)
        });

        this.#track.addEventListener('touchstart', (event) => {
            clearInterval(this.#slideRotation)

            if (event.touches.length > 1) {
                return
            }
            this.#startX = event.touches[0].clientX;
            this.#moving = true
        })

        this.#track.addEventListener('touchmove', (event) => {
            if (!this.#moving) return

            let dx = event.touches[0].clientX - this.#startX
            this.#track.style.transform = `translateX(${-this.#currentSlideIndex * this.#slideWidth + dx}px)`;
        })

        this.#track.addEventListener('touchend', (event) => {
            if (!this.#moving) return

            this.#moving = false;

            const endX = event.changedTouches[0].clientX;
            const dx = endX - this.#startX;

            if (dx > 200) {
                this.#prevSlide();
            } else if (dx < -200) {
                this.#nextSlide()
            } else {
                this.#ShowSlide(this.#currentSlideIndex)
            }
            this.startRotation()
        })

        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                clearInterval(this.#slideRotation)
                this.#nextSlide();
                this.startRotation()
            }
            if (event.key === "ArrowLeft") {
                clearInterval(this.#slideRotation)
                this.#prevSlide();
                this.startRotation()
            }
        });

        window.addEventListener('resize', (e) => {
            clearTimeout(this.#timeout)
            this.#timeout = setTimeout(() => {
                this.#setSliderDimensions(e.target.innerWidth > 955 ? 950 : e.target.innerWidth)
            }, 500)

        })


        this.#sliderWindow.addEventListener('pointerenter', () => clearInterval(this.#slideRotation));
        this.#sliderWindow.addEventListener('pointerleave', () => this.startRotation());
    }
}


const slider = new Slider({
    slideClass: '.slide',
    trackId: '#sliderTrack',
    dotsContainerId: "dots",
    prevId: '#prev',
    nextId: '#next',
    slideRotationInterval: 3000,
    sliderWidth: 950,
    sliderContainer: 'slider-container',
    currentSlideIndex: 0,
    startX: 0,
    moving: false,
    sliderWindow: '.slider',

})

