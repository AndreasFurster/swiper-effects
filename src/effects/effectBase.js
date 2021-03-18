import { extend } from "../utils";

export default class EffectBase {
  constructor(swiper, options) {
    this.swiper = swiper
    this.containerName = options.containerName
    this.initSlide = options.initSlide
    this.translateSlide = options.translateSlide
  }
  
  beforeInit() {
    this.swiper.classNames.push(`${this.swiper.params.containerModifierClass}${this.containerName}`);
    const overwriteParams = {
      slidesPerView: 1,
      slidesPerColumn: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: true,
    };
    extend(this.swiper.params, overwriteParams);
    extend(this.swiper.originalParams, overwriteParams);
  }

  init() {
    const { slides } = this.swiper;
    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = this.swiper.slides.eq(i);
      this.initSlide(this.swiper, $slideEl)
    }
  }

  setTranslate() {
    const { slides } = this.swiper;
    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = this.swiper.slides.eq(i);
      const offset = $slideEl[0].swiperSlideOffset;
      let tx = -offset;
      if (!this.swiper.params.virtualTranslate) tx -= this.swiper.translate;

      let ty = 0;
      if (!this.swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }

      const progress = 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);

      this.translateSlide(this.swiper, $slideEl, progress);
      
      $slideEl.transform(`translate3d(${tx}px, ${ty}px, 0px)`);
    }
  }

  setTransition(duration) {
    const { slides, $wrapperEl } = this.swiper;
    slides.transition(duration);
    if (this.swiper.params.virtualTranslate && duration !== 0) {
      let eventTriggered = false;
      slides.transitionEnd(() => {
        if (eventTriggered) return;
        if (!swiper || this.swiper.destroyed) return;
        eventTriggered = true;
        this.swiper.animating = false;
        const triggerEvents = ["webkitTransitionEnd", "transitionend"];
        for (let i = 0; i < triggerEvents.length; i += 1) {
          $wrapperEl.trigger(triggerEvents[i]);
        }
      });
    }
  }
}
