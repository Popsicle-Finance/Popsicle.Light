<template>
  <div class="position-card">
    <div class="skeleton">
      <div class="my-position">
        <div class="my-position__icon"></div>
        <div class="my-position__text"></div>
        <div class="my-position__text-column">
          <div class="my-position__text-column-item"></div>
          <div class="my-position__text-column-item"></div>
          <div class="my-position__text-column-item"></div>
        </div>
        <div class="my-position__block"></div>
        <div class="my-position__block"></div>
        <div class="my-position__block my-position__block_last"></div>
      </div>
      <div class="my-position__btns">
        <div class="my-position__btn"></div>
        <div class="my-position__btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
$base-color: rgba(255, 255, 255, 0.05);
$shine-color: rgba(255, 255, 255, 0.1);
$skeleton-size: 1000px;
$skeleton-image: linear-gradient(
  90deg,
  $base-color 0px,
  $shine-color 60px,
  $base-color 120px
);
@mixin skeletonAnimation {
  background-image: $skeleton-image;
  background-size: $skeleton-size;
  animation: skeleton 1.6s infinite forwards;
}
.position-card {
  width: 100%;
  height: 110px;
  background: #252423;
  box-shadow: 0px 0px 5px rgba(25, 78, 202, 0.4);
  border-radius: 12px;
  padding: 10px 20px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-bottom: 10px;
  position: relative;
  @media (max-width: 768px) {
    padding: 10px;
  }
}

.skeleton {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  .my-position {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media screen and (max-width: 1024px) {
      justify-content: flex-start;
      gap: 5%;
    }
    &__icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      @include skeletonAnimation;
      @media (max-width: 768px) {
        width: 50px;
        height: 50px;
        min-width: 50px;
      }
      @media (max-width: 600px) {
        width: 50px;
        height: 50px;
        min-width: 50px;
        min-height: 50px;
      }
    }
    &__text {
      height: 21px;
      width: 72px;
      border-radius: 4px;
      @include skeletonAnimation;
      @media (max-width: 768px) {
        width: 62px;
        min-width: 62px;
      }
      @media (max-width: 600px) {
        display: none;
      }
    }
    &__text-column {
      display: none;
      @media (max-width: 600px) {
        display: block;
        &-item {
          width: 62px;
          min-width: 62px;
          border-radius: 4px;
          height: 19px;
          margin-bottom: 2px;
          @include skeletonAnimation;
          &:nth-child(2) {
            height: 13px;
            margin-bottom: 0;
          }
          &:nth-child(3) {
            display: none;
          }
        }
      }
    }
    &__block {
      border-radius: 12px;
      max-width: 170px;
      width: 100%;
      height: 65px;
      backdrop-filter: blur(20px);
      @include skeletonAnimation;
      @media screen and (max-width: 1024px) {
        max-width: 140px;
      }
      @media screen and (max-width: 600px) {
        display: none;
      }
      &_last {
        @media screen and (max-width: 1024px) {
          display: none;
        }
      }
    }
    &__btns {
      max-width: 110px;
      width: 100%;
      margin-left: 35px;
      height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    &__btn {
      width: 100%;
      height: 41px;
      border-radius: 12px;
      @include skeletonAnimation;
    }
  }
}
.column {
  .position-card {
    flex-direction: column;
    height: auto;
    max-width: 24%;
    min-width: 160px;
    padding: 15px 20px;
    position: relative;
    @media (max-width: 1024px) {
      max-width: 30%;
    }
    @media (max-width: 600px) {
      max-width: 48%;
    }
    @media (max-width: 440px) {
      max-width: 100%;
    }
  }

  .skeleton {
    display: flex;
    flex-direction: column;
    .my-position {
      flex-direction: column;
      justify-content: space-between;

      &__icon {
        margin-bottom: 8px;
      }
      &__block {
        display: none;
      }
      &__text {
        display: none;
      }
      &__text-column {
        display: block;
        &-item {
          @include skeletonAnimation;
          display: block;
          width: 110px;
          border-radius: 4px;
          &:nth-child(1) {
            height: 21px;
            margin-bottom: 3px;
          }
          &:nth-child(2) {
            height: 15px;
            margin-bottom: 3px;
          }
          &:nth-child(3) {
            height: 15px;
            margin-bottom: 8px;
            @media screen and (max-width: 600px) {
              display: none;
            }
          }
        }
      }
      &__btns {
        max-width: 100%;
        width: 100%;
        margin-left: 0;
        height: 90px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      &__btn {
        width: 100%;
        height: 41px;
        border-radius: 12px;
        @include skeletonAnimation;
      }
    }
  }
}

@keyframes skeleton {
  0% {
    background-position: -100px;
  }

  40%,
  100% {
    background-position: 180px;
  }
}

@keyframes skeleton-inline {
  0% {
    background-position: -100px;
  }

  40%,
  100% {
    background-position: 600px;
  }
}
</style>
