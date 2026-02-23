document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------
       INTRO AUDIO + ELEMENTS
    ----------------------------------------------------*/
    const introAudio = document.getElementById("intro-audio");
    const introItems = document.querySelectorAll(".module-intro > *");

    // Reveal timings for intro section (seconds)
    const introTimes = [0, 3, 7, 12];


    /* ---------------------------------------------------
       MODULE CONTENT ITEMS + AUDIO FILES
    ----------------------------------------------------*/
    const contentItems = document.querySelectorAll(".module-content .content-item");

    // Build array of audio elements dynamically
    const contentAudios = [];
    for (let i = 1; i <= contentItems.length; i++) {
        const audio = document.getElementById(`content-audio-${i}`);
        if (audio) contentAudios.push(audio);
    }

    const startQuizBtn = document.getElementById("start-quiz-button");


    /* ---------------------------------------------------
       AUTOPLAY REQUIREMENT (first click starts everything)
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
       FUNCTION: Play each content audio in sequence
    ----------------------------------------------------*/
    function playContentAudio(index) {

    // If we've played all audio files → show quiz button
    if (index >= contentAudios.length) {
        startQuizBtn.classList.add("visible");

        // Scroll to quiz button
        startQuizBtn.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }

    const audio = contentAudios[index];
    const item = contentItems[index];

    // Reveal the content item when its audio starts
    audio.addEventListener("play", () => {
        item.classList.add("visible");

        // Smooth scroll to the revealed item
        item.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, { once: true });

    // When this audio ends → play the next one
    audio.addEventListener("ended", () => {
        playContentAudio(index + 1);
    }, { once: true });

    audio.play();
}


});
