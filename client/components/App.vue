<template>
  <div class="container d-flex flex-column h-100">
    <!-- Search Modal -->
    <b-modal id="search-modal" centered hide-footer hide-header>
      <div>
        <SearchInput></SearchInput>
      </div>
    </b-modal>

    <!-- Nav Bar -->
    <NavBar v-if="currentView != views.login" class="w-100 mb-5" :show-logo="currentView != views.home"
      :auth-type="authType" :dark-theme="darkTheme" @logout="logout()" @toggleTheme="toggleTheme()"
      @search="openSearch()"></NavBar>

    <!-- Login -->
    <Login v-if="currentView == views.login" class="flex-grow-1" :auth-type="authType"></Login>

    <!-- Search Results -->
    <div v-if="currentView == views.search" class="flex-grow-1 search-results-view d-flex flex-column">
      <SearchResults :search-term="searchTerm" class="flex-grow-1"></SearchResults>
    </div>

    <!-- Note -->
    <NoteViewerEditor v-if="currentView == this.views.note" class="flex-grow-1" :titleToLoad="noteTitle"
      :auth-type="authType" @note-deleted="showToast('success', 'Note deleted ✓')"></NoteViewerEditor>
  </div>
</template>

<style lang="scss" scoped>
@import "../colours";

.home-view {
  max-width: 500px;
}

.search-results-view {
  max-width: 700px;
}

.search-input {
  box-shadow: 0 0 20px var(--colour-shadow);
}

.recently-modified {
  // Prevent UI from moving during load
  min-height: 190px;
}
</style>

<script>
export { default } from "./App.js";
</script>
