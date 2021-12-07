const cards = document.querySelectorAll('.calendar-card');
let flippedCard = false;

const GiftImages = {
    "supergift": "/back/background_card/fog.png",
    "gift": ["/back/background_card/classic_gift.png", "/back/background_card/card_sloth.png"],
    "food": ["/back/background_card/cat_gift.png"],
}

const Gifts = {
    "White": ["supergift", "supergift", "gift", "gift", "gift", "gift"],
    "Usiko": ["gift", "supergift", "gift"]
};
const Version = 3;

const CurrentUser = "Usiko"

const UserDataKey = 'UserData'
const GiftsDataKey = 'Gifts'
const CardsDataKey = 'Card'
const VersionDataKey = 'Version'

function getRandomInt(upperBound) {
    return Math.floor(Math.random() * upperBound)
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getUserData(user) {
    const userData = JSON.parse(localStorage.getItem(UserDataKey));
    if (userData) {
        return userData[user];
    }
    return null;
}

function setUserData(user, data) {
    let userData = JSON.parse(localStorage.getItem(UserDataKey)) || {};
    userData[user] = data;
    localStorage.setItem(UserDataKey, JSON.stringify(userData));
}

function setGifts(user, gifts) {
    let userData = getUserData(user) || {};
    userData[GiftsDataKey] = gifts;
    setUserData(user, userData);
}

function initRandomGifts(user) {
    let userGifts = Gifts[user].slice();
    shuffleArray(userGifts);
    console.log("Gift sequence for user " + user + ": " + userGifts);
    setGifts(user, userGifts);
    return userGifts;
}

function getGifts(user) {
    const userData = getUserData(user);
    if (userData) {
        const giftsData = userData[GiftsDataKey];
        if (giftsData) {
            return giftsData;
        }
    }
    return initRandomGifts(user);
}

function popGift(user) {
    let gifts = getGifts(user);
    if (gifts.length > 0) {
        let gift = gifts.shift();
        setGifts(user, gifts);
        return gift;
    }
    return null;
}

function getCardsInfo(user) {
    const userData = getUserData(user);
    return userData[CardsDataKey];
}

function setCardsInfo(user, cardsInfo) {
    let userData = getUserData(user);
    userData[CardsDataKey] = cardsInfo;
    setUserData(userData);
}

function getVersion(user) {
    const userData = getUserData(user);
    if (!userData) {
        return 0;
    }
    return userData[VersionDataKey] || 0;
}

function setVersion(user, version) {
    const oldVersion = getVersion(user);
    if (oldVersion >= version) {
        return;
    }

    let userData = getUserData(user);
    userData[VersionDataKey] = version;
    console.log('Version updated: ' + oldVersion + " -> " + version);
    setUserData(user, userData);
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

    setGiftImage: function(target) {
        const gift = popGift(CurrentUser) || "food";
        this.setImage(target, gift);
        return gift
    },

    setImage: function (target, gift) {
        const images = GiftImages[gift];
        let image = images;
        if (Array.isArray(images)) {
            const imageIndex = getRandomInt(images.length);
            image = images[imageIndex];
        }
        this.setOnTarget(target, image);
    }
};

function forceUpdateGiftsIfNeeded(user) {
    const version = getVersion(user);
    if (Version <= version) {
        return;
    }

    initRandomGifts(user);
    setVersion(user, Version);
}

function initField(user) {
    const userData = getUserData(user);
    if (!userData) {
        return;
    }

    forceUpdateGiftsIfNeeded(user);

    const cardsInfo = userData[CardsDataKey];
    if (!cardsInfo) {
        return;
    }

    cardsInfo.forEach(cardInfo => {
        const domElement = document.getElementById(cardInfo.id)
        if (cardInfo.open) {
            domElement.classList.add('flip');
            imageController.setImage(domElement, cardInfo.gift);
        }
    });
}

function updateCard(user, id, gift) {
    let userData = getUserData(user);
    const cards = userData[CardsDataKey] || [];
    const newCard = {id:id, open:true, gift:gift};
    const newCards = [...cards, newCard];
    userData[CardsDataKey] = newCards;
    setUserData(user, userData)
}

initField(CurrentUser);

const flipCard = event => {
    const target = event.target;
    target.classList.add('flip');
    const gift = imageController.setGiftImage(target);
    target.removeEventListener('click', flipCard);

    updateCard(CurrentUser, target.id, gift);

    console.log('EVENT ON CARD CLICK', target, target.id);
}
cards.forEach(card => {
    // Add Event Listener to every card
    card.addEventListener('click', flipCard)

})