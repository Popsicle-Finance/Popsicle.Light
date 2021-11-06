<template>
  <div class="optimizer">
    <!-- Popular -->
    <section class="optimizer-section popular">
      <div class="title">
        <h1>Popular</h1>
      </div>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="card in popular" :key="card.id">
            <PoolItem
              :id="card.id"
              :type="1"
              :apr="card.apr"
              :pair="card.pairName"
              :image="card.image"
            />
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </section>

    <!-- All -->
    <section class="optimizer-section opportunity">
      <div class="title">
        <h1>All opportunity</h1>
      </div>
      <SearchBar @toggleView="toggleView" />
      <div class="list" :class="inline && 'list-inline'">
        <PoolItem
          v-for="card in opportunity"
          :id="card.id"
          :type="2"
          :apr="card.apr"
          :pair="card.pairName"
          :image="card.image"
          :inline="inline"
          :key="card.id"
        />
      </div>
    </section>
  </div>
</template>

<script>
const SearchBar = () => import("@/components/searchBar/SearchBar");
const PoolItem = () => import("@/components/ui/PoolItem");

import Swiper from "swiper";
import SwiperCore, { Navigation, Pagination } from "swiper/core";
SwiperCore.use([Navigation, Pagination]);

export default {
  components: {
    PoolItem,
    SearchBar,
  },
  data() {
    return {
      inline: false,
      popular: [
        {
          id: 0,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 1,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 2,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 3,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 4,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 5,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
      ],
      opportunity: [
        {
          id: 0,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 1,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 2,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 3,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 4,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 5,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 6,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
        {
          id: 7,
          pairName: "ETH/fUSDT",
          apr: 1000,
          image: "Token_ETH_FUSDT.svg",
        },
      ],
    };
  },
  props: ["slides"],
  methods: {
    toggleView() {
      this.inline = !this.inline;
    },
  },
  mounted() {
    const swiper = new Swiper(".swiper-container", {
      direction: "horizontal",
      loop: false,
      breakpoints: {
        1024: {
          slidesPerView: 4,
        },
        768: {
          slidesPerView: 3,
        },
        500: {
          slidesPerView: 2,
        },
        1: {
          slidesPerView: 1,
        },
      },
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
    });
  },
};
</script>

<style lang="scss" scoped>
.optimizer {
  margin: 30px 0;
  padding: 40px 30px;
  border-radius: 12px;
  background: #2c2c2c;

  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-gap: 30px;

  &-section {
    display: grid;
    grid-template-rows: repeat(2, auto);
    grid-gap: 30px;

    .title {
      h1 {
        font-size: 20px;
        font-weight: 500;
        margin: 0;
      }
    }

    .list {
      display: grid;
      grid-template-columns: repeat(4, auto);
      grid-gap: 15px;
      @media screen and (max-width: 1024px) {
        grid-template-columns: repeat(3, auto);
      }
      @media screen and (max-width: 768px) {
        grid-template-columns: repeat(2, auto);
      }
      @media screen and (max-width: 500px) {
        grid-template-columns: repeat(1, auto);
      }

      &-inline {
        grid-template-columns: 1fr;
      }
    }
  }

  .popular {
    padding-bottom: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .opportunity {
    .card {
      margin: 0 auto;
      width: 100%;
    }
  }
}

@media screen and (max-width: 500px) {
  .list {
    grid-template-columns: 1fr !important;
  }
}
</style>
<style lang="scss">
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
  @media screen and(max-width: 500px) {
    .card {
      margin: 0 auto;
    }
  }
}
</style>
