<template>
  <div style="text-align: center; margin-bottom: 1rem">
    <img src="../assets/main.gif" style="width: 80%;">
  </div>
</template>

<style lang="scss" scoped>
@import "../colours";

@media screen and (max-width: 500px) {
  .responsive-hide {
    display: none;
  }
}

.part-icon {
  color: var(--colour-brand);
}

.part-name {
  color: var(--colour-text-muted);
}
</style>

<script>
export default {
  props: {
    responsive: { type: Boolean, default: false },
  },
};
</script>
