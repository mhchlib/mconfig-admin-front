<template>
  <div>
    <div v-if="showConfigDialog">
      <v-card>
        <v-row gutters justify="space-around">
          <v-col cols="12" sm="5">
            <v-alert border="top" color="red lighten-2" dark>配置明细</v-alert>
            <v-jsoneditor v-model="config" :options="options" :plus="true" height="600px" />
          </v-col>
          <v-col cols="12" sm="5">
            <v-alert border="right" color="blue-grey" dark>模式明细</v-alert>
            <v-jsoneditor v-model="schema" :options="options" :plus="true" height="600px" />
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="primary" text @click="saveConfig">
            保存
          </v-btn>
          <v-btn color="primary" text @click="cancelSaveConfig">
            取消
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </div>
    <v-data-table v-else :headers="headers" :items="envlist" class="elevation-1" :options.sync="options" :loading="loading">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>配置</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                新建配置
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="配置名称"></v-text-field>
                  </v-row>
                  <v-row cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.desc" label="配置描述"></v-text-field>
                  </v-row>
                  <v-row cols="12" sm="6" md="4" v-if="editedIndex == -1">
                    <v-text-field v-model="editedItem.key" label="配置密钥(为空会随机生成)"></v-text-field>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  取消
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  确定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">确定删除该配置吗?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">确定</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.name="{ item }">
        {{ item.name }}
      </template>
      <template v-slot:item.config="{ item }">
        <v-btn color="primary" @click="showConfig(item)">
          配置
        </v-btn>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="red" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
  import axios from "axios"

import { codemirror } from 'vue-codemirror-lite'

export default {
  components: {
    codemirror
  },
  data: () => ({
    currentId:-1,
    showConfigDialog: false,
    config: "",
    schema: "",
    app_id: -1,
    env_id: -1,
    total: 0,
    loading: true,
    options: {},
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: '配置名称', value: 'name', sortable: false, },
      { text: 'ENV KEY', value: 'key', sortable: false, },
      { text: '配置描述', value: 'desc', sortable: false, },
      { text: '配置信息', value: 'config', sortable: false, },
      { text: '创建时间', value: 'create_time' },
      { text: '更新时间', value: 'update_time' },
      { text: '操作', value: 'actions', sortable: false },
    ],
    envlist: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      desc: '',
      key: '',
    },
    defaultItem: {
      name: '',
      desc: '',
      key: '',
    },
        options: {
        mode: "code"
      },
  }),
  filters: {

  },
  mounted() {
    this.app_id = this.$route.params.app
    this.env_id = this.$route.params.env
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新建配置' : '编辑配置'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    options: {
      handler() {
        this.getDataFromApi()
      },
      deep: true,
    },
    search: {
      handler() {
        this.getDataFromApi()
      },
      deep: true,
    },
  },

  created() {
    // this.initialize()
  },

  methods: {
    initialize() {
      this.options.itemsPerPage = 10
      this.options.page = 0
      this.getDataFromApi()
    },
    getDataFromApi() {
      this.loading = true
      var _this = this
      axios.get('/api/v1/config/list', { // 还可以直接把参数拼接在url后边
        params: {
          app: _this.app_id,
          env: _this.env_id,
          limit: _this.options.itemsPerPage,
          offset: (_this.options.itemsPerPage) * (_this.options.page - 1),
          filter: _this.search,
        }
      }).then(function(res) {
        console.log(res.data.data)
        var list = res.data.data
        for (var i = 0; i < list.length; i++) {
          list[i]['create_time'] = _this.formatDate(list[i]['create_time'] * 1000)
          list[i]['update_time'] = _this.formatDate(list[i]['update_time'] * 1000)
        }

        _this.total = 10
        _this.loading = false
        _this.envlist = res.data.data
      }).catch(function(error) {
        console.log(error);
      });

    },
    detailItem(item) {
      this.$router.push({ path: '/app/config' })
    },
    editItem(item) {
      this.editedIndex = this.envlist.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.envlist.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      // this.envlist.splice(this.editedIndex, 1)
      this.closeDelete()
      var _this = this
      axios.delete('/api/v1/config/' + _this.envlist[_this.editedIndex].id, { // 还可以直接把参数拼接在url后边
        params: {

        }
      }).then(function(res) {
        _this.getDataFromApi()
      }).catch(function(error) {
        console.log(error);
        alert(error.data.msg)
      });

    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        //编辑
        // Object.assign(this.envlist[this.editedIndex], this.editedItem)
        var _this = this
        axios.put('/api/v1/config/base/' + _this.envlist[_this.editedIndex].id, { 
          name: _this.editedItem.name,
          desc: _this.editedItem.desc,
        }).then(function(res) {
          _this.getDataFromApi()
        }).catch(function(error) {
          console.log(error);
          alert(error.data.msg)
        });

      } else {
        //新建
        var _this = this
        axios.post('/api/v1/config/', { // 还可以直接把参数拼接在url后边
          app:  parseInt( _this.app_id),
          env:  parseInt( _this.env_id),
          name: _this.editedItem.name,
          desc: _this.editedItem.desc,
          key: _this.editedItem.key,
        }).then(function(res) {
          console.log(res.data.data)
          _this.getDataFromApi()

        }).catch(function(error) {
          console.log(error);
        });


        // this.envlist.push(this.editedItem)
      }
      this.close()
    },

    formatDate(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    },
    showConfig(item) {
      console.log(item)
      if (item.config != "") {
      this.config =   JSON.parse(item.config);
      }
            if (item.schema != "") {
      this.schema =   JSON.parse(item.schema);
      }
      this.currentId = item.id
      this.showConfigDialog = true
      
    },
    saveConfig(){
      var _this = this
      axios.put('/api/v1/config/all/'+_this.currentId, { 
        config:   JSON.stringify(_this.config),
        schema: JSON.stringify(_this.schema)
      }).then(function(res) {
        _this.showConfigDialog = false
      }).catch(function(error) {
        console.log(error);
      });
   
    },

    cancelSaveConfig(){
      this.showConfigDialog = false
    },
  },

}

</script>
<style type="text/css">
.CodeMirror {
  height: 600px;
}

</style>
