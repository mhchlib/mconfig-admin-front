<template>
  <v-data-table :headers="headers" :items="applist" class="elevation-1" :options.sync="options" :loading="loading">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>应用</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              新建应用
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.name" label="应用名称"></v-text-field>
                </v-row>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.desc" label="应用描述"></v-text-field>
                </v-row>
                <v-row cols="12" sm="6" md="4" v-if="editedIndex == -1">
                  <v-text-field v-model="editedItem.key" label="应用密钥(为空会随机生成)"></v-text-field>
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
            <v-card-title class="headline">确定删除该应用吗?</v-card-title>
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
      <router-link  :to="{path:'/app/env/'+item.id}">
        {{ item.name }}
      </router-link>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon small class="mr-2" @click="editItem(item)" v-bind="attrs" v-on="on">
            mdi-pencil
          </v-icon>
        </template>
        <span>编辑</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon small class="mr-2" @click="deleteItem(item)"  v-bind="attrs" v-on="on">
            mdi-delete
          </v-icon>
        </template>
        <span>删除</span>
      </v-tooltip>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>

export default {
  data: () => ({
    total: 0,
    loading: true,
    options: {},
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: '应用名称', align: 'start', sortable: false, value: 'name', },
      { text: 'APP KEY',   value: 'key', },
      { text: '应用描述', value: 'desc', sortable: false, },
      { text: '创建时间', value: 'create_time' },
      { text: '更新时间', value: 'update_time' },
      { text: '操作', value: 'actions', sortable: false },
    ],
    applist: [],
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
  }),
  filters: {

  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新建应用' : '编辑应用'
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
      this.$http.get('/api/v1/app/list', { // 还可以直接把参数拼接在url后边
        params: {
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
        _this.applist = res.data.data
      }).catch(function(error) {
        console.log(error);
      });

    },
    detailItem(item) {
      this.$router.push({ path: '/app/env' })
    },
    editItem(item) {
      this.editedIndex = this.applist.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.applist.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      // this.applist.splice(this.editedIndex, 1)
      this.closeDelete()
      var _this = this
      this.$http.delete('/api/v1/app/' + _this.applist[_this.editedIndex].id, { // 还可以直接把参数拼接在url后边
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
        // Object.assign(this.applist[this.editedIndex], this.editedItem)
        var _this = this
        this.$http.put('/api/v1/app/' + _this.applist[_this.editedIndex].id, { // 还可以直接把参数拼接在url后边
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
        this.$http.post('/api/v1/app/', { // 还可以直接把参数拼接在url后边
          name: this.editedItem.name,
          desc: this.editedItem.desc,
          key: this.editedItem.key,
        }).then(function(res) {
          console.log(res.data.data)
          _this.getDataFromApi()

        }).catch(function(error) {
          console.log(error);
        });


        // this.applist.push(this.editedItem)
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


  },
}

</script>
