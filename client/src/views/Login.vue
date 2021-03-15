<template>
  <v-row align="center" justify="center">
    <v-col class="mt-8 mr-4" cols="12" sm="8" md="6">
      <v-card
        class="mt-10"
        style="border-radius: 24px; width: 100vh;"
        height="auto"
      >
        <v-card title flat>
          <v-row>
            <v-col class="pa-0 d-flex justify-space-around">
              <img
                src="@/assets/logo.png"
                alt="HRD Logo"
                height="130"
                contain
                @click="drawer = !drawer"
                class="myPointer"
              />
              <!-- <v-toolbar-title
                                    class="justify-center font-weight-thin"
                                    style="font-family: Arial, Helvetica, sans-serif"
                                    >Employee Login</v-toolbar-title
                                > -->
            </v-col>
          </v-row>
          <!-- <v-row>
            <v-col cols="12">
              <v-row justify="center">
                <span class="mt-5 mr-5"> Login As:</span>
                <v-checkbox
                  class="mr-5 ml-5"
                  hide-details
                  v-model="isLocal"
                  :disabled="isJA"
                  @change="getInfo()"
                  dense
                  label="Local"
                ></v-checkbox>
                <v-checkbox
                  class="mr-5 ml-5"
                  v-model="isJA"
                  :disabled="isLocal"
                  hide-details
                  @change="getInfo()"
                  dense
                  label="JA"
                ></v-checkbox>
              </v-row>
            </v-col>
          </v-row> -->
        </v-card>
        <!-- <v-card-subtitle class="py-0">
          <v-row no-gutters dense>
            <v-col class="mt-5 ml-16">
              <h3>Login As:</h3>
            </v-col>
            <v-col class="ma-0">
              <v-checkbox hide-details dense label="Local"></v-checkbox>
            </v-col>
            <v-col class="ma-0 mr-16">
              <v-checkbox hide-details dense label="JA"></v-checkbox>
            </v-col>
          </v-row>
        </v-card-subtitle> -->
        <v-form
          ref="form"
          lazy-validation
          v-model="valid"
          @submit.prevent="handleSubmit"
        >
          <v-card-text justify="center" align="center">
            <v-row>
              <v-col class="pa-0" cols="12">
                <v-row justify="center">
                  <span class="mt-5 mr-5"> Login As:</span>
                  <v-checkbox
                    class="mr-5 ml-5"
                    hide-details
                    v-model="isLocal"
                    :disabled="isJA"
                    required
                    :rules="[v => !!v || 'You must agree to continue!']"
                    dense
                    label="Local"
                  ></v-checkbox>
                  <v-checkbox
                    class="mr-5 ml-5"
                    v-model="isJA"
                    :disabled="isLocal"
                    hide-details
                    :rules="[v => !!v || 'You must agree to continue!']"
                    dense
                    label="JA"
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
            <v-col class="text-xs-center" cols="12" md="8" sm="6">
              <v-text-field
                color="primary"
                outlined
                dense
                autocomplete="username"
                label="Username"
                name="login"
                v-model="username"
                @blur="getInfo(isJA)"
                hide-details
                prepend-icon="mdi-account"
                type="text"
                @keydown.enter.prevent
              />
            </v-col>
            <v-col class="text-xs-center" cols="12" md="8" sm="6">
              <v-text-field
                color="primary"
                outlined
                dense
                hide-details
                id="password"
                autocomplete="current-password"
                @blur="getInfo(isJA)"
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
              />
            </v-col>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-spacer></v-spacer>
            <v-btn
              class="mb-5 ml-14"
              min-width="200px"
              color="primary"
              type="submit"
              >Submit</v-btn
            >
            <v-spacer></v-spacer>
            <a
              class="mr-5"
              href="http://hrdapps48:3001/ftp/webmailer_attachment/WEB_SCHEDULER_USER_MANUAL.pdf"
              target="_blank"
            >
              <v-btn text icon class="mr-0 ml-0">
                <span class="mr-10">User Guide</span>
              </v-btn>
            </a>
          </v-card-actions>
        </v-form>
        <v-overlay :value="$store.state.users.status">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      isLocal: false,
      isJA: false,
      valid: true,
      JA_info: {},
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters['users/isLoggedIn']
    },
  },
  created() {
    // if (this.loggedIn) {
    //     this.$router.push("/original_hiroi/calculation");
    // }
    // if (this.$store.state.users.status == "authenticated") {
    // this.$router.push('/original_hiroi/calculation');
    //   }
    //   console.log(this.$store.state.users.status)
  },
  methods: {
    async getInfo(JA) {
      this.valid = true
      console.log(JA)
      if (JA) {
        this.$store.commit('users/status', this.isJA)

        this.$http.defaults.headers.common['x-api-key'] =
          'JUe7mHXOhR6ziaSDHXUDJ310nTfdsH8s1ph44z2q'
        let url = `https://1ze9v428i9.execute-api.us-east-2.amazonaws.com/prod/getUsers/${this.username}`
        console.log(url)
        let res = await this.$http.get(url)
        console.log(res.data)
        this.JA_info = res.data
        console.log(this.JA_info)
      }
    },
    async handleSubmit(e) {
      e.preventDefault()
      this.$refs.form.validate()

      if (this.username && this.password) {
        if (this.isLocal) {
          this.$store.commit('users/status', this.isJA)
          const payload = {
            user: {
              name: this.username,
              password: this.password,
            },
            axios: this.$http,
          }
          try {
            await this.$store.dispatch('users/login', payload)
            this.$router.push('/calendar')
          } catch (err) {
            throw new TypeError(err)
          }
        } else if (this.isJA) {
          try {
            this.$store.commit('users/status', this.isJA)

            this.$http.defaults.headers.common['x-api-key'] =
              'JUe7mHXOhR6ziaSDHXUDJ310nTfdsH8s1ph44z2q'
            let url = `https://1ze9v428i9.execute-api.us-east-2.amazonaws.com/prod/getUsers/${this.username}`
            let res = await this.$http.get(url)
            this.JA_info = res.data
            const payload = {
              user: {
                name: this.username,
                password: this.password,
                info: this.JA_info,
              },
              axios: this.$http,
            }
            await this.$store.dispatch('users/loginJA', payload)
            this.$router.push('/calendar')
          } catch (err) {
            throw new TypeError(err)
          }
        }

        // .then(() => {
        //   this.$router.push('/calendar')
        // })
        // .catch(err => alert(err))
      }

      // this.masterlist.validateLogin(this.user).then( res => {
      //   this.$store.commit('users/CHANGE_USER_INFO', res)
      //   // this.CHANGE_USER_INFO(this.db.values)
      //   if(res == 'FAILED'){
      //     this.$store.commit('users/CHANGE_STATUS', 'guest')
      //   } else {
      //     this.$store.commit('users/CHANGE_STATUS', 'authenticated')
      //   }
      //   // this.CHANGE_STATUS('authenticated')
      //   this.$router.push('/original_hiroi/calculation')
      // })
    },
  },
}
</script>
