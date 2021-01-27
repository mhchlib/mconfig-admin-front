<template>
  <div class="hello">
    <v-jsoneditor v-model="json" :options="options" :plus="true" height="600px" @error="onError" />
    <div class="options">
      <v-btn depressed color="primary">
        查看schema
      </v-btn>
      <v-btn depressed color="error">
        保存上线
      </v-btn>
      <v-btn depressed color="error">
        立即归档
      </v-btn>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            历史存档
          </v-btn>
        </template>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title> 历史存档</v-toolbar-title>
          </v-toolbar>
          <v-card style="width: 90%;margin-left: 5%;margin-top: 5px;">
            <v-tabs dark background-color="teal primary" show-arrows v-model="tab">
              <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
              <v-tab v-for="(o,i) in achieves" :key="i" :href="'#' + i">
                {{ i }}
              </v-tab>
            </v-tabs>
          </v-card>
          <v-snackbar :timeout="-1" :value="true" left shaped color="primary">
            {{achieves[tab].desc}}
          </v-snackbar>
          <div class="achieve">
            <div>
              <v-jsoneditor v-model="achieves[tab].config" :options="options" :plus="true" height="600px" @error="onError" />
            </div>
            <div>
              <v-jsoneditor v-model="achieves[tab].schema" :options="options" :plus="true" height="600px" @error="onError" />
            </div>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script type="text/javascript">
import VJsoneditor from 'v-jsoneditor'
export default {
  name: 'app',
  components: {
    VJsoneditor
  },
  data() {
    return {
      tab: "current",
      json: {
        "hello": "vue",
        "hello1": "vue"
      },
      options: {
        mode: "code"
      },
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      achieves: {
        "current": { desc: "dsada", config: "{}", schema: "{}" },
        "v1.12": { desc: "dsadadsadadsadadsada", config: "{}", schema: "{}" },
        "v1.08": { desc: "dsadadsada", config: "{}", schema: "{}" },
        "v1.7": { desc: "dsada", config: "{}", schema: "{}" },
        "v1.4": { desc: "dsada", config: "{}", schema: "{}" },
        "v0.7": { desc: "dsada", config: "{}", schema: "{}" },
        "v0.2": { desc: "dsadadsadadsadadsada", config: "{}", schema: "{}" },
      }
    }
  },
  methods: {
    onError() {
      console.log('error')
    }
  }
}

</script>
<style scoped="">
.options {
  margin-top: 40px;
  width: 60%;
  display: flex;
  justify-content: space-around;
}

.achieve {
  width: 90%;
  margin-top: 30px;
  margin-left: 5%;
  display: flex;
  justify-content: space-around;
}

.achieve div {
  width: 40%;
  height: 600px;
  background-color: currentColor;
}


.achieve input {}

</style>
