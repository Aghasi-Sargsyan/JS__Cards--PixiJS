import * as PIXI from 'pixi'
import {TweenMax} from "gsap"

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

const app = new Application({width: 1600, height: 900});

document.body.appendChild(app.view);

const {renderer, stage} = app;


const cardFrontPath = "./assets/Card 02-01.png";
const cardBackPath = "./assets/card_back.png";

loader
    .add(cardBackPath)
    .add(cardFrontPath)
    .load(setup);

function setup() {

    const MAX_CARD_COUNT = 7;

    const cardBack = new Sprite(resources[cardBackPath].texture);
    const cardFront = new Sprite(resources[cardFrontPath].texture);

    const card = {
        sprite: {
            back: cardBack,
            front: cardFront
        }
    };

    setCardParams(card.sprite.back,
        {x: app.view.width / 2, y: app.view.height / 2}
    );

    stage.addChild(card.sprite.back);

    const deck = makeDeck(MAX_CARD_COUNT, card);

    setTimeout(() => moveCards(deck), 2000);
    renderer.render(stage);

}

function moveCards(deck) {
    let firstCardX = deck[0].sprite.back.x - 300;

    for (let i = 0; i < deck.length; i++) {
        let sprite = deck[i].sprite;

        TweenMax.to(sprite.back, 1, {
            y: 800, x:firstCardX + (i * 100), onComplete: () => {
                setCardParams(sprite.front, {x: sprite.back.x, y: sprite.back.y})
                stage.removeChildAt(i);
                stage.addChildAt(sprite.front, i)
            }
        });
    }
}

//args must be an objects with x and y props
function setCardParams(card, position, scale = {x: 0.3, y: 0.3}, anchor = {x: 0.5, y: 0.5}) {
    card.scale.set(scale.x, scale.y);
    card.anchor.set(anchor.x, anchor.y);
    card.position.set(position.x, position.y);
}


function makeDeck(maxCardCount, firsCard) {

    const cardArr = [firsCard];

    for (let i = 1; i < maxCardCount; i++) {

        let previousCard = cardArr[i - 1];

        const cardFront = new Sprite(PIXI.loader.resources[cardFrontPath].texture);
        const cardBack = new Sprite(PIXI.loader.resources[cardBackPath].texture);
        let card = {sprite: {back: cardBack, front: cardFront}};

        setCardParams(card.sprite.back, {
            x: previousCard.sprite.back.position.x + 1,
            y: previousCard.sprite.back.position.y + 1
        });
        stage.addChild(card.sprite.back);
        cardArr.push(card);
    }
    return cardArr;
}