import "./style.css";

export default {
  install(Vue, options) {
    Vue.directive("tooltip", function(el, binding, vnode) {
      const { left, right, top, bottom } = binding.modifiers;

      el.classList.add("tooltip");
      el.setAttribute("tooltip", binding.value);

      if (left) el.classList.add("left");
      if (right) el.classList.add("right");
      if (top) el.classList.add("top");
      if (bottom) el.classList.add("bottom");
    });
  },
};
