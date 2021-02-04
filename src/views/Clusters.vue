<template>
  <v-data-table :headers="headers" :items="applist" sort-by="update_time" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>集群</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              新建集群
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.name" label="集群名称"></v-text-field>
                </v-row>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.desc" label="集群描述"></v-text-field>
                </v-row>
                 <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.namespace" label="命名空间"></v-text-field>
                </v-row>

                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.register" label="注册中心"></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                取消
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                保存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">确定删除该集群吗?</v-card-title>
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
    <template v-slot:item.actions="{ item }">
      </v-btn>
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
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: '集群名称', align: 'start', sortable: false, value: 'name', },
      { text: '集群描述', value: 'desc', sortable: false, },
      { text: '命名空间', value: 'namespace', sortable: false, },
      { text: '注册中心', value: 'registers', sortable: false, },
      { text: '创建时间', value: 'create_time',sortable: true, },
      { text: '更新时间', value: 'update_time',sortable: true, },
      { text: '操作', value: 'actions', sortable: false },
    ],
    applist: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      desc: '',
      registers: '',
    },
    defaultItem: {
      name: '',
      desc: '',
      registers: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新建集群' : '编辑集群'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.applist = [{
          name: '测试集群的dev',
          desc: "",
          namespace:"com.github.mhchlib.",
          create_time: "2021-01-01 12:12",
          update_time: "2021-01-13 1:19",
          registers: 'etcd://127.0.0.1:2379/mconfig'
        },
        {
          name: '正式环境pro',
          desc: "",
           namespace:"com.github.mhchlib.",
          create_time: "2021-01-13 12:12",
          update_time: "2021-01-20 1:19",
          registers: 'etcd://10.20.110.25:2379/mconfig'
        }
      ]
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
      this.applist.splice(this.editedIndex, 1)
      this.closeDelete()
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
        Object.assign(this.applist[this.editedIndex], this.editedItem)
      } else {
        this.applist.push(this.editedItem)
      }
      this.close()
    },
  },
}

</script>
