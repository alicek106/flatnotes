<template>
  <div class="d-flex justify-content-between align-items-center">
    <!-- Logo -->
    <a :href="constants.basePaths.home" @click.prevent="navigate(constants.basePaths.home, $event)">
      <Logo :class="{ invisible: !showLogo }" responsive></Logo>
    </a>

    <div class="d-flex">
      <!-- New Note -->
      <a v-if="showNewButton" :href="constants.basePaths.new" class="bttn"
        @click.prevent="navigate(constants.basePaths.new, $event)">
        <b-icon icon="plus-circle"></b-icon><span>New Note</span>
      </a>

      <a v-if="showLogOutButton" class="bttn" @click="$emit('logout')">
        <b-icon icon="box-arrow-right" font-scale="0.8" class="mr-2"></b-icon>
        <span>Log Out</span>
      </a>
      <!-- Menu -->
    </div>
  </div>
</template>

<style lang="scss">
// Use visibility hidden instead of v-show to maintain consistent height
.invisible {
  visibility: hidden;
}

.menu {
  background-color: var(--colour-background);
  color: var(--colour-text);
  border: 1px solid var(--colour-border);

  hr {
    border-top: 1px solid var(--colour-border);
  }
}

.keyboard-shortcut {
  background-color: var(--colour-background-elevated);
  padding: 0.1em 0.75em;
  border: 1px solid var(--colour-border);
  border-radius: 4px;
  font-size: 0.75em;
}
</style>

<script>
import * as constants from "../constants.js";

import EventBus from "../eventBus.js";
import Logo from "./Logo.vue";

export default {
  components: {
    Logo,
  },

  props: {
    showLogo: {
      type: Boolean,
      default: true,
    },
    authType: { type: String, default: null },
    darkTheme: { type: Boolean, default: false },
  },

  computed: {
    azHref: function () {
      let params = new URLSearchParams();
      params.set(constants.params.searchTerm, "*");
      params.set(constants.params.sortBy, constants.searchSortOptions.title);
      params.set(constants.params.showHighlights, false);
      return `${constants.basePaths.search}?${params.toString()}`;
    },

    showLogOutButton: function () {
      return (
        this.authType != null &&
        ![constants.authTypes.none, constants.authTypes.readOnly].includes(
          this.authType
        )
      );
    },

    showNewButton: function () {
      return (
        this.authType != null && this.authType != constants.authTypes.readOnly
      );
    },
  },

  methods: {
    navigate: function (href, event) {
      EventBus.$emit("navigate", href, event);
    },
  },

  created: function () {
    this.constants = constants;
  },
};
</script>
