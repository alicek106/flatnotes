import * as constants from "../constants.js";
import * as helpers from "../helpers.js";

import { clearToken, loadToken } from "../tokenStorage.js";

import EventBus from "../eventBus.js";
import LoadingIndicator from "./LoadingIndicator.vue";
import Login from "./Login.vue";
import Logo from "./Logo.vue";
import Mousetrap from "mousetrap";
import NavBar from "./NavBar.vue";
import NoteViewerEditor from "./NoteViewerEditor.vue";
import RecentlyModified from "./RecentlyModified.vue";
import SearchInput from "./SearchInput.vue";
import SearchResults from "./SearchResults.vue";
import api from "../api.js";

export default {
  name: "App",

  components: {
    LoadingIndicator,
    Login,
    NavBar,
    SearchInput,
    Logo,
    NoteViewerEditor,
    SearchResults,
    RecentlyModified,
  },

  data: function () {
    return {
      authType: null,

      views: {
        login: 0,
        home: 1,
        note: 2,
        search: 3,
      },
      currentView: 1,

      noteTitle: null,
      searchTerm: null,
      darkTheme: false,
    };
  },

  watch: {
    darkTheme: function () {
      if (this.darkTheme) {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }
    },
  },

  methods: {
    loadConfig: function () {
      let parent = this;
      api
        .get("/api/config")
        .then(function (response) {
          parent.authType = response.data.authType;
        })
        .catch(function (error) {
          if (!error.handled) {
            parent.unhandledServerErrorToast();
          }
        });
    },

    route: function () {
      let path = window.location.pathname.split("/");
      let basePath = `/${path[1]}`;

      this.$bvModal.hide("search-modal");

      // Search
      if (basePath == constants.basePaths.search) {
        this.updateDocumentTitle("Search");
        this.searchTerm = helpers.getSearchParam(constants.params.searchTerm);
        this.currentView = this.views.search;
      }

      // New Note
      else if (basePath == constants.basePaths.new) {
        this.updateDocumentTitle("New Note");
        this.currentView = this.views.note;
      }

      // Note
      else if (basePath == constants.basePaths.note) {
        this.noteTitle = decodeURIComponent(path[2]);
        this.updateDocumentTitle(this.noteTitle);
        this.currentView = this.views.note;
      }

      // Login
      else if (basePath == constants.basePaths.login) {
        this.updateDocumentTitle("Log In");
        this.currentView = this.views.login;
      }
    },

    navigate: function (href, e) {
      if (e != undefined && e.ctrlKey == true) {
        window.open(href);
      } else {
        history.pushState(null, "", href);
        this.noteTitle = null;
        this.searchTerm = null;
        this.route();
      }
    },

    updateDocumentTitle: function (suffix) {
      window.document.title = "My Diary";
    },

    logout: function () {
      clearToken();
      this.navigate(constants.basePaths.login);
    },

    showToast: function (variant, message, title = null) {
      const options = {
        variant: variant,
        noCloseButton: true,
        toaster: "b-toaster-bottom-right",
      };
      if (title != null) {
        options.title = title;
      }
      this.$bvToast.toast(message, options);
    },

    focusSearchInput: function () {
      let input = document.getElementById("search-input");
      input.focus();
      input.select();
    },

    openSearch: function () {
      if ([this.views.home, this.views.search].includes(this.currentView)) {
        this.focusSearchInput();
        EventBus.$emit("highlight-search-input");
      } else if (this.currentView != this.views.login) {
        this.$bvModal.show("search-modal");
      }
    },

    unhandledServerErrorToast: function () {
      this.showToast(
        "danger",
        "Unknown error communicating with the server. Please try again.",
        "Unknown Error",
      );
    },

    toggleTheme: function () {
      this.darkTheme = !this.darkTheme;
      localStorage.setItem("darkTheme", this.darkTheme);
    },

    updateNoteTitle: function (title) {
      this.noteTitle = title;
      this.updateDocumentTitle(title);
    },
  },

  created: function () {
    let parent = this;

    this.constants = constants;

    EventBus.$on("navigate", this.navigate);
    EventBus.$on("showToast", this.showToast);
    EventBus.$on("unhandledServerErrorToast", this.unhandledServerErrorToast);
    EventBus.$on("updateNoteTitle", this.updateNoteTitle);

    Mousetrap.bind("/", function () {
      parent.openSearch();
      return false;
    });

    this.loadConfig();
    loadToken();

    let darkTheme = localStorage.getItem("darkTheme");
    if (darkTheme != null) {
      this.darkTheme = darkTheme == "true";
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.darkTheme = true;
    }

    this.route();
  },

  mounted: function () {
    let parent = this;

    window.addEventListener("popstate", this.route);

    this.$root.$on("bv::modal::shown", function (_, modalId) {
      if (modalId == "search-modal") {
        parent.focusSearchInput();
      }
    });
  },
};
