export default {
  state: {
    mobileMenu: false,
    showPopup: false,
    popupType: null,
    popupData: null,
  },
  mutations: {
    setMobileMenu(state, show) {
      state.mobileMenu = show;
    },

    setModalState(state, { type, isShow, data }) {
      state.popupData = data;
      state.popupType = type;
      state.showPopup = isShow;
    },

    closeModals(state) {
      state.popupType = null;
      state.showPopup = false;
      state.popupData = null;
    },
  },
  getters: {
    getMobileMenu: (state) => state.mobileMenu,
    getPopupState: (state) => state.showPopup,
    getPopupType: (state) => state.popupType,
    getPopupData: (state) => state.popupData,
  },
};
