const cards = document.querySelectorAll('.calendar-card');
let test = cards.length;
console.log('--->', cards.length);
let flippedCard = false;

function getRandomInt(upperBound) {
    return Math.floor(Math.random() * upperBound)
}

let imageController = {
    imgs:['/back/background_card/cat.png', '/back/background_card/fog.png', 'back/background_card/cat_gift.png','back/background_card/classic_gift.png', 'back/background_card/card_sloth.png' ],
    set: function (image) {
        let backFlipCards = document.getElementsByClassName('calendar-card flip');

        [].forEach.call(backFlipCards, function (card) {
            card.style.backgroundImage = "url("+image+")";
        });
        // console.log('====' + document.getElementsByClassName('calendar-card flip'))
    },

    setOnTarget: function(target, image) {
        target.style.backgroundImage = "url("+image+")";
    },

    init: function() {
        const randomImage = getRandomInt(this.imgs.length);
        this.set(this.imgs[randomImage]);
    },

    initOnTarget: function(target) {
        const randomImage = getRandomInt(this.imgs.length);
        this.setOnTarget(target, this.imgs[randomImage]);
        return randomImage
    },

    setImage: function (target, imgIndex) {
        this.setOnTarget(target, this.imgs[imgIndex]);
    }
};

//[{id:1, isOpened:1}, []]
//чтение из локал сторэдж
const readFromLocalStore = () => {
    const currentLocalStorage = JSON.parse(localStorage.getItem('cardsInfo'))
    if(currentLocalStorage) {
        currentLocalStorage.forEach((el) => {
            console.log(el)
            const domEl = document.getElementById(el.id)
            if(el.isOpened) {
                domEl.classList.add('flip');
                imageController.setImage(domEl, el.randomImage);
            }
        })
    }
}

readFromLocalStore()

const flipCard = event => {
    const target = event.target;
    target.classList.add('flip');
    const randomImage = imageController.initOnTarget(target);
    target.removeEventListener('click', flipCard);
    // target.classList.remove('flip');
    //запись в локал сторэдж
    const currentLocalStorage = JSON.parse(localStorage.getItem('cardsInfo')) || []
    const newElement = {id:target.id, isOpened: true, randomImage: randomImage};
    const newLocalStorage = [...currentLocalStorage, newElement]
    localStorage.setItem('cardsInfo', JSON.stringify(newLocalStorage));
    console.log('EVENT ON CARD CLICK', target, target.id);
}
cards.forEach(card => {
    // Add Event Listener to every card
    card.addEventListener('click', flipCard)

})