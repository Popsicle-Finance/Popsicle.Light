<template>
  <div
    class="footer"
    :class="{ 'footer-transparent': isTransparentBackground }"
  >
    <ul class="social-list">
      <li class="social-item" v-for="(social, idx) in socialItems" :key="idx">
        <a :href="social.link" target="_blank">
          <img class="social-icon" :src="social.icon" :alt="social.title" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    isTransparentBackground: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({ socialItems: "getSocialItems" }),
  },
};
</script>

<style lang="scss" scoped>
.footer {
  height: 60px;
  background: $clrBg2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-top: 1px solid #252423;
  z-index: 1;
}

.footer-transparent {
  position: fixed;
  bottom: 0;
  left: 0;
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.social-list {
  display: flex;
}

.social-item {
  list-style: none;
}

.social-item:not(:last-child) {
  margin-right: 30px;
}

.social-icon {
  opacity: 0.6;
}

.social-icon:hover {
  opacity: 1;
}

@media screen and (max-width: 600px) {
  .social-list {
    width: 100%;
    justify-content: center;
  }
}
</style>
