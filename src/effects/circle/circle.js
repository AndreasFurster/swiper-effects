import { bindModuleMethods } from "../../utils";
import EffectBase from "../effectBase";

const CircleEffectOptions = {
  containerName: "circle",

  initSlide(swiper, $slideEl) {
    $slideEl.css({
      "transition-property": "opacity, clip-path",
    });
  },

  translateSlide(swiper, $slideEl, progress) {
    const circleSize = progress * 150;

    const circlePositionX = swiper.params.circleEffect.positionX
    const circlePositionY = swiper.params.circleEffect.positionY

    const opacity = swiper.params.circleEffect.faded ? progress : 1;

    $slideEl.css({
      opacity: opacity,
      "clip-path": `circle(${circleSize}% at ${circlePositionX} ${circlePositionY}`,
    });
  },
};

export const CircleEffectPlugin = {
  name: "effect-circle",
  params: {
    circleEffect: {
        faded: false,
        positionX: '50%',
        positionY: '50%'
    },
  },
  create() {
    const swiper = this;
    bindModuleMethods(swiper, {
      circleEffect: new EffectBase(swiper, CircleEffectOptions),
    });
  },
  on: {
    beforeInit(swiper) {
      if (swiper.params.effect !== "circle") return;
      swiper.circleEffect.beforeInit();
    },
    init(swiper) {
      if (swiper.params.effect !== "circle") return;
      swiper.circleEffect.init();
    },
    setTranslate(swiper) {
      if (swiper.params.effect !== "circle") return;
      swiper.circleEffect.setTranslate();
    },
    setTransition(swiper, duration) {
      if (swiper.params.effect !== "circle") return;
      swiper.circleEffect.setTransition(duration);
    },
  },
};
