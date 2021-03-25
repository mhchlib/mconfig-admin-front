<template>
<v-data-table :headers="headers" :items="clusterlist" class="elevation-1" :options.sync="options" :loading="loading">
    <template v-slot:top>
        <v-toolbar flat>
            <v-toolbar-title>集群</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" clusterend-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
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
                                <v-text-field v-model="editedItem.namespace" label="命名空间"></v-text-field>
                            </v-row>
                            <v-row cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.register" label="注册中心"></v-text-field>
                            </v-row>
                            <v-row cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.desc" label="集群描述"></v-text-field>
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
    <template v-slot:item.name="{ item }">
        <router-link :to="{path:'/cluster/env/'+item.id}">
            {{ item.name }}
        </router-link>
    </template>
    <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-icon small class="mr-2" @click="detail(item)" v-bind="attrs" v-on="on">
                    mdi-details
                </v-icon>
            </template>
            <span>详情</span>
        </v-tooltip>
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
                <v-icon small class="mr-2" @click="deleteItem(item)" v-bind="attrs" v-on="on">
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
        headers: [{
                text: '命名空间',
                value: 'namespace',
            },
            {
                text: '描述',
                value: 'desc',
                sortable: false,
            },
            {
                text: '注册中心',
                value: 'register',
                sortable: false,
            },
            {
                text: '创建时间',
                value: 'create_time'
            },
            {
                text: '更新时间',
                value: 'update_time'
            },
            {
                text: '操作',
                value: 'actions',
                sortable: false
            },
        ],
        clusterlist: [],
        editedIndex: -1,
        editedItem: {
            namespace: '',
            desc: '',
            register: '',
        },
        defaultItem: {
            namespace: '',
            desc: '',
            register: '',
        },
    }),
    filters: {

    },
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
            this.$http.get('/api/v1/cluster/list', { // 还可以直接把参数拼接在url后边
                params: {
                    limit: _this.options.itemsPerPage,
                    offset: (_this.options.itemsPerPage) * (_this.options.page - 1),
                    filter: _this.search,
                }
            }).then(function (res) {
                console.log(res.data.data)
                var list = res.data.data
                for (var i = 0; i < list.length; i++) {
                    list[i]['create_time'] = _this.formatDate(list[i]['create_time'] * 1000)
                    list[i]['update_time'] = _this.formatDate(list[i]['update_time'] * 1000)
                }

                _this.total = 10
                _this.loading = false
                _this.clusterlist = res.data.data
            }).catch(function (error) {
                console.log(error);
            });

        },
        detailItem(item) {
            this.$router.push({
                path: '/cluster/env'
            })
        },
        editItem(item) {
            this.editedIndex = this.clusterlist.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.clusterlist.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            // this.clusterlist.splice(this.editedIndex, 1)
            this.closeDelete()
            var _this = this
            this.$http.delete('/api/v1/cluster/' + _this.clusterlist[_this.editedIndex].id, { // 还可以直接把参数拼接在url后边
                params: {

                }
            }).then(function (res) {
                _this.getDataFromApi()
            }).catch(function (error) {
                console.log(error);
                // alert(error.data.msg)
                _this.$message.error(error.data.msg);
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
                // Object.assign(this.clusterlist[this.editedIndex], this.editedItem)
                var _this = this
                this.$http.put('/api/v1/cluster/' + _this.clusterlist[_this.editedIndex].id, { // 还可以直接把参数拼接在url后边
                    namespace: _this.editedItem.namespace,
                    register: _this.editedItem.register,
                    desc: _this.editedItem.desc,
                }).then(function (res) {
                    _this.getDataFromApi()
                }).catch(function (error) {
                    console.log(error);
                    // alert(error.data.msg)
                    _this.$message.error(error.data.msg);
                });

            } else {
                //新建
                var _this = this
                this.$http.post('/api/v1/cluster', { // 还可以直接把参数拼接在url后边
                    namespace: _this.editedItem.namespace,
                    register: _this.editedItem.register,
                    desc: _this.editedItem.desc,
                }).then(function (res) {
                    console.log(res.data.data)
                    _this.getDataFromApi()

                }).catch(function (error) {
                    console.log(error);
                });

                // this.clusterlist.push(this.editedItem)
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

        detail(item) {
            console.log(item)
            this.$router.push("/status/" + item.id)
        }

    },
}
</script>
