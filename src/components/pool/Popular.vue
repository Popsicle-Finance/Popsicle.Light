<template>
  <section class="popular">
    <h1 class="title">Popular</h1>
    <div class="popular-skeleton" v-show="!isCreateSlider">
      <div
        class="popular-item"
        v-for="skeleton in skeletonSliderLength"
        :key="skeleton"
      >
        <PoolItem :type="1" />
      </div>
    </div>

    <div
      class="swiper-container"
      v-show="isCreateSlider"
      ref="swiperContainerPopular"
    >
      <div
        class="swiper-wrapper"
        :class="{ 'not-slider': populars.length < 4 }"
        ref="swiperWrapper"
      >
        <div class="swiper-slide" v-for="popular in populars" :key="popular.id">
          <PoolItem :pool="popular" :loaded="isLoadPopular" :type="1" />
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </section>
</template>

<script>
const PoolItem = () => import("@/components/ui/PoolItem");
import Swiper from "swiper";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper/core";
SwiperCore.use([Navigation, Pagination, Autoplay]);

export default {
  props: {
    populars: {
      type: Array,
      require: true,
    },

    isLoadPopular: {
      type: Boolean,
      require: true,
    },
  },

  data() {
    return {
      swiper: "",
      skeletonSliderLength: 4,
      isCreateSlider: false,
    };
  },

  watch: {
    async populars() {
      if (!this.isCreateSlider && this.populars.length >= 4) {
        this.createSwiper();
        this.isCreateSlider = true;
      } else if (this.populars.length > 0 && this.populars.length < 4) {
        if (this.isLoadPopular === false) {
          this.isCreateSlider = true;
        }
      }
    },

    isLoadPopular() {
      this.isCreateSlider = true;
    },
  },

  methods: {
    createSwiper() {
      this.swiper = new Swiper(this.$refs.swiperContainerPopular, {
        direction: "horizontal",
        autoplay: true,
        observer: true,
        observeParents: true,
        breakpoints: {
          1024: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 3,
          },
          600: {
            slidesPerView: 2,
          },
          1: {
            slidesPerView: 1,
            autoplay: true,
          },
        },
        // pagination: {
        //   el: ".swiper-pagination",
        //   type: "bullets",
        //   clickable: true,
        // },
      });

      this.swiper.on("resize", () => {
        console.log("slide resize");
        this.swiper.update(true);
      });
    },
  },

  async created() {
    if (window.innerWidth <= 1024 && window.innerWidth >= 769) {
      this.skeletonSliderLength = 3;
    } else if (window.innerWidth <= 768 && window.innerWidth >= 601) {
      this.skeletonSliderLength = 2;
    } else if (window.innerWidth <= 600) {
      this.skeletonSliderLength = 1;
    }
  },

  mounted() {
    if (this.populars.length >= 4) {
      if (!this.swiper) {
        this.createSwiper();
      } else {
        this.swiper.update(true);
      }
      this.isCreateSlider = true;
    } else if (this.populars.length > 0 && this.populars.length < 4) {
      if (this.isLoadPopular === false) {
        this.isCreateSlider = true;
      }
    }
  },

  components: {
    PoolItem,
  },
};
</script>

<style lang="scss" scoped>
.popular {
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 30px;
}

.popular-skeleton {
  display: flex;
  margin-bottom: 30px;
}

.popular-item {
  width: 100%;
  .card {
    margin: 0 auto;
  }
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  margin: 0 0 30px;
}

.swiper-container {
  max-width: 895px;
  width: 100%;
  height: 245px;
  padding: 5px 0 0;

  @media screen and (max-width: 600px) {
    height: 300px;
  }

  .swiper-slide {
    .card {
      margin: 0 auto;
    }
  }

  .swiper-pagination-bullets {
    bottom: 0;
  }

  .swiper-pagination-bullet {
    background: rgba(134, 134, 134, 0.4);
    width: 10px;
    height: 10px;
    &-active {
      background: #868686;
    }
  }
}

.not-slider {
  width: 25%;
}

@media screen and (max-width: 600px) {
  .swiper-container {
    height: 300px;
  }
}
</style>
