<template>
  <v-app>
    <v-navigation-drawer
      app
      dark
      v-if="loggedIn"
      v-model="drawerState"
      :permanent="drawerState"
      :mini-variant.sync="mini"
    >
      <v-card tile elevation="0">
        <v-list color="primary" dark>
          <v-list-item>
            <v-list-item-action @click="mini = !mini">
              <v-icon>mdi-chevron-left</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                <h3 class="font-weight-thin">Welcome!</h3>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-list-item class="px-2" @click="mini = !mini">
        <v-list-item-avatar>
          <v-icon>mdi-account-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="overline text-truncate">
          <template v-if="$store.state.users.isJA">
            {{
              $store.state.users.info.FirstNameEng +
                ' ' +
                $store.state.users.info.LastNameEng
            }}
          </template>
          <template v-else>
            {{ $store.state.users.info.EmployeeName }}
          </template>
        </v-list-item-content>
        <v-btn icon small>
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="item in drawerItems"
          :key="item.title"
          :to="item.to"
        >
          <v-list-item-icon>
            <span>
              <v-icon>{{ item.icon }}</v-icon>
            </span>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-light ">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar v-if="loggedIn" app class="elevation-1">
      <v-app-bar-nav-icon @click.stop="drawerState = !drawerState" />
      <img
        :src="require('@/assets/scheduler.png')"
        alt="HRD Logo"
        height="45"
        contain
        @click="drawer = !drawer"
        class="myPointer"
      />
      <v-toolbar-title v-text="'Web Scheduler'" />
      <v-spacer />
      <v-btn text icon @click="logOut()" v-show="loggedIn">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main app>
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="pa-2">
        <!-- If using vue-router -->
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";

export default {
  name: 'App',

  components: {
    // HelloWorld
  },
  mounted() {
    if (Object.entries(this.$store.state.users.info).length === 0) {
      this.logOut()
    } else if (this.loggedIn) {
      this.$router.push('/calendar')
    }
  },
  watch: {
    loggedIn(newVal) {
      if (newVal) {
        this.$store.commit('drawer', true)
      } else {
        this.$store.commit('drawer', false)
      }
    },
  },
  created() {
    this.$http.interceptors.response.use(
      config => {
        return config
      },
      error => {
        if (error.response.status == 401) {
          this.logOut()
        }

        return Promise.reject(error)
      },
    )
    if (this.loggedIn) {
      this.$store.commit('drawer', true)
      this.$store
        .dispatch('users/validateSession', this.$http)
        .catch(err => alert(err))
      this.$http.interceptors.request.use(config => {
        return config
      })

      // console.log(this.$http.interceptors.request.use())
    } else {
      this.$store.commit('drawer', false)
    }
  },
  computed: {
    myState() {
      return this.$store.state.users.status
    },
    loggedIn() {
      return this.$store.getters['users/isLoggedIn']
    },
    drawerState: {
      get() {
        return this.$store.state.drawer
      },
      set(newVal) {
        this.$store.commit('drawer', newVal)
      },
    },
    //     loading() {
    //   return this.$store.getters["users/isLoggedIn"];
    // },
  },
  data: () => ({
    //
    mini: true,
    expandOnHover: true,
    drawerItems: [
      {
        title: 'Calendar',
        icon: 'mdi-calendar-multiselect',
        to: '/calendar',
      },
      // {
      //     title: "Plan Application",
      //     icon: "mdi-alpha-p-box",
      //     to: "/about"
      // }
    ],
  }),
  methods: {
    logOut() {
      this.$store.dispatch('users/logout', this.$http).then(() => {
        this.$router.push('/')
      })
    },
  },
}
</script>

<style scoped>
div.v-application--wrap {
  min-height: calc(100vh - 64px) !important;
}
/* .slide-leave-active {
        transition: opacity 0.2s ease;
        opacity: 0;
        animation: slide-out 0.2s ease-out forwards;
    }
 
    .slide-leave {
        opacity: 1;
        transform: translateX(0);
    }
 
    .slide-enter-active {
        animation: slide-in 1s ease-out forwards;
    }
 
    @keyframes slide-out {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-30px);
        }
    }
 
    @keyframes slide-in {
        0% {
            transform: translateY(-30px);
        }
        100% {
            transform: translateY(0);
        }
    } */
</style>
