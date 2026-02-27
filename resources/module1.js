document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------
       INTRO AUDIO + REVEAL
    ----------------------------------------------------*/

    const startBtn = document.getElementById('start-course-button');

    startBtn.addEventListener('click', function() {
    // This hides the button completely from the layout
    this.style.display = 'none';
    });

    const introAudio = document.getElementById("intro-audio");
    const introItems = document.querySelectorAll(".module-intro > *");

    const introTimes = [0, 2, 3, 4];

    const startQuizBtn = document.getElementById("start-quiz-button");


    /* ---------------------------------------------------
       MODULE CONTENT ITEMS + AUDIO FILES
    ----------------------------------------------------*/

    const contentItems = document.querySelectorAll(".module-content .content-item");

    const contentAudios = [];
    for (let i = 1; i <= contentItems.length; i++) {
        const audio = document.getElementById(`content-audio-${i}`);
        if (audio) contentAudios.push(audio);
    }


    /* ---------------------------------------------------
       NAV BUTTONS
    ----------------------------------------------------*/

    const backNavBtn = document.querySelector("nav a:first-child");
    const homeNavBtn = document.querySelector("nav a:nth-child(2)");
    const nextNavBtn = document.querySelector("nav a:last-child");
    const navInstruction = document.getElementById("nav-instruction");

    // Initial nav state for Module 1
    backNavBtn.classList.add("disabled");
    homeNavBtn.classList.remove("disabled");
    nextNavBtn.classList.add("disabled");


    /* ---------------------------------------------------
       AUTOPLAY REQUIREMENT
    ----------------------------------------------------*/

    document.body.addEventListener("click", () => {
        if (introAudio.paused) introAudio.play();
    }, { once: true });


    /* ---------------------------------------------------
       INTRO AUDIO PROGRESS → Reveal intro items
    ----------------------------------------------------*/

    introAudio.addEventListener("timeupdate", () => {
        const t = introAudio.currentTime;

        introItems.forEach((item, i) => {
            if (t >= introTimes[i]) {
                item.classList.add("visible");
            }
        });
    });


    /* ---------------------------------------------------
       WHEN INTRO AUDIO ENDS → Start first content audio
    ----------------------------------------------------*/

    introAudio.addEventListener("ended", () => {
        playContentAudio(0);
    });


    /* ---------------------------------------------------
       SCROLL FUNCTION
    ----------------------------------------------------*/

    function scrollToItem(el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 150;
        window.scrollTo({ top: y, behavior: "smooth" });
    }


    /* ---------------------------------------------------
       PLAY CONTENT AUDIO SEQUENTIALLY
    ----------------------------------------------------*/

    function playContentAudio(index) {

        if (index >= contentAudios.length) {
            startQuizBtn.classList.add("visible");
            scrollToItem(startQuizBtn);
            return;
        }

        const audio = contentAudios[index];
        const item = contentItems[index];

        audio.addEventListener("play", () => {
            item.classList.add("visible");
            scrollToItem(item);
        }, { once: true });

        audio.addEventListener("ended", () => {
            playContentAudio(index + 1);
        }, { once: true });

        audio.play();
    }


    /* ---------------------------------------------------
       QUIZ LOGIC
    ----------------------------------------------------*/

    const quizSection = document.getElementById("quiz-section");
    const submitQuizBtn = document.getElementById("submit-quiz-button");

    const modal = document.getElementById("quiz-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalScore = document.getElementById("modal-score");
    const modalClose = document.getElementById("modal-close");

    const answers = {
        q1: "A",
        q2: "B",
        q3: "B",
        q4: "B"
    };


    /* ---------------------------------------------------
       START QUIZ
    ----------------------------------------------------*/

    startQuizBtn.addEventListener("click", () => {
        quizSection.classList.remove("hidden");
        submitQuizBtn.classList.remove("hidden");

        startQuizBtn.classList.add("disabled");
        scrollToItem(quizSection);
    });


    /* ---------------------------------------------------
       ENABLE SUBMIT WHEN ALL QUESTIONS ANSWERED
    ----------------------------------------------------*/

    document.querySelectorAll("input[type=radio]").forEach(radio => {
        radio.addEventListener("change", () => {
            const allAnswered = [...document.querySelectorAll(".quiz-question")].every(q =>
                q.querySelector("input[type=radio]:checked")
            );

            if (allAnswered) {
                submitQuizBtn.classList.remove("disabled");
            }
        });
    });


    /* ---------------------------------------------------
       SUBMIT QUIZ
    ----------------------------------------------------*/

    submitQuizBtn.addEventListener("click", () => {

        // If in Retry mode
        if (submitQuizBtn.textContent === "Retry") {
            resetQuiz();
            return;
        }

        let score = 0;

        Object.keys(answers).forEach(q => {
            const selected = document.querySelector(`input[name=${q}]:checked`);
            if (selected && selected.value === answers[q]) score++;
        });

        const pass = score >= 3;

        modalTitle.textContent = pass ? "Congratulations, you passed!" : "Not quite, please try again.";
        modalScore.textContent = `You scored ${score} out of 4.`;

        modal.classList.remove("hidden");

        if (pass) {
            // Enable Next
            nextNavBtn.classList.remove("disabled");
            nextNavBtn.classList.add("flash");

            // Show instruction text
            navInstruction.textContent = "Great job! Click Next to continue.";
            navInstruction.classList.remove("hidden");

            submitQuizBtn.classList.add("disabled");

        } else {
            nextNavBtn.classList.add("disabled");

            submitQuizBtn.textContent = "Retry";
            submitQuizBtn.classList.remove("disabled");
        }
    });


    /* ---------------------------------------------------
       RESET QUIZ (Retry)
    ----------------------------------------------------*/

    function resetQuiz() {

        document.querySelectorAll("input[type=radio]:checked")
            .forEach(r => r.checked = false);

        submitQuizBtn.textContent = "Submit";
        submitQuizBtn.classList.add("disabled");

        modal.classList.add("hidden");

        scrollToItem(quizSection);
    }


    /* ---------------------------------------------------
       CLOSE MODAL
    ----------------------------------------------------*/

    modalClose.addEventListener("click", () => {
        modal.classList.add("hidden");

        if (submitQuizBtn.textContent === "Retry") {
            submitQuizBtn.classList.remove("disabled");
        }
    });


    /* ---------------------------------------------------
       NEXT BUTTON CLICK → STOP FLASHING
    ----------------------------------------------------*/

    nextNavBtn.addEventListener("click", () => {
        nextNavBtn.classList.remove("flash");
        navInstruction.classList.add("hidden");
    });

});
