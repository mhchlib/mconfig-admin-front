<template>
  <v-data-table :headers="headers" :items="applist" sort-by="create_time" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>环境</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              新建环境
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.name" label="环境名称"></v-text-field>
                </v-row>
                <v-row cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.desc" label="环境描述"></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">确定删除该环境吗?</v-card-title>
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
      <v-icon small class="mr-2" color="purple" @click="detailItem(item)">
        mdi-wrench
      </v-icon>
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
      { text: '环境名称', value: 'name', sortable: false, },
      { text: '环境描述', value: 'desc', sortable: false, },
      { text: '创建时间', value: 'create_time' },
      { text: '更新时间', value: 'update_time' },
      { text: '操作', value: 'actions', sortable: false },
    ],
    applist: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      desc: '',
    },
    defaultItem: {
      name: '',
      desc: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新建环境' : '编辑环境'
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
          name: 'Frozen Yogurt',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
        {
          name: 'Ice cream sandwich',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
        {
          name: 'Eclair',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
        {
          name: 'Cupcake',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
        {
          name: 'Gingerbread',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
        {
          name: 'Jelly bean',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
        {
          name: 'Lollipop',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
        {
          name: 'Honeycomb',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
        {
          name: 'Donut',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
        {
          name: 'KitKat',
          desc: "我是一个描述信息",
          create_time: "2021-01-01 12:12",
          update_time: "2021-02-04 1:19",

        },
      ]
    },
    detailItem(item) {
      this.$router.push({ path: '/app/configs' })
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
