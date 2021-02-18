<template>
<div>
    <div v-if="showFilterDialog">
        <v-row>
            <v-col class="d-flex" cols="12" sm="6">
                <v-select :items="filterModeDic" label="选择模式" item-value="id" item-text="note" v-model="selectMode" solo></v-select>
            </v-col>
        </v-row>
        <v-card>
            <div>
                <v-chip class="ma-2" color="primary" v-if="filterModeMap[selectMode] &&  filterModeMap[selectMode].name == 'lua'">
                    have a test: <a href="https://www.lua.org/cgi-bin/demo" style="color:white;margin-left:10px;">https://www.lua.org/cgi-bin/demo</a>
                </v-chip>
                <v-chip class="ma-2" color="primary" v-if="filterModeMap[selectMode] &&  filterModeMap[selectMode].name == 'mep'">
                    使用方法 <a href="https://github.com/ChenHaoHu/ExpressionParser" style="color:white;margin-left:10px;">https://github.com/ChenHaoHu/ExpressionParser</a>
                </v-chip>
                <v-chip class="ma-2" color="green" text-color="white" v-if="filterId==-1">
                    首次编辑
                </v-chip>
            </div>
            <codemirror v-if="filterModeMap[selectMode] &&  filterModeMap[selectMode].name == 'lua'" v-model="filterCode" :options="{mode: 'lua', extraKeys: {'Ctrl-Space': 'autocomplete'},lineNumbers:true,theme:'monokai'}"></codemirror>

            <v-jsoneditor v-if="filterModeMap[selectMode] && filterModeMap[selectMode].name == 'simple'" v-model="filterCode" :options="options" :plus="true" height="600px" />
            <!-- <codemirror v-if="filterModeMap[selectMode] && filterModeMap[selectMode].name == 'simple'" v-model="filterCode" :options="{mode: 'lua', extraKeys: {'Ctrl-Space': 'autocomplete'},lineNumbers:true,theme:'mdn-like'}"></codemirror> -->

            <div v-if="filterModeMap[selectMode] && filterModeMap[selectMode].name == 'mep'" style="padding-top:100px;padding-bottom:100px;">
                <v-text-field v-model="filterCode" :counter="max" :rules="rules" label="表达式" style="width:80%;margin-left:10%;"></v-text-field>
            </div>

            <v-card-actions>
                <v-btn color="primary" text @click="saveFilter">
                    保存
                </v-btn>
                <v-btn color="primary" text @click="showFilterDialog = false">
                    取消
                </v-btn>
                <v-btn color="primary" text @click="resetTemplate">
                    重置模板
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </div>
    <v-data-table v-else :headers="headers" :items="envlist" class="elevation-1" :options.sync="options" :loading="loading">
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
                                <v-row cols="12" sm="6" md="4">
                                    <v-text-field v-model="editedItem.weight" label="权重" type="number" ></v-text-field>
                                </v-row>
                                <v-row cols="12" sm="6" md="4" v-if="editedIndex == -1">
                                    <v-text-field  v-model="editedItem.key" label="环境密钥(为空会随机生成)"></v-text-field>
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
        <template v-slot:item.name="{ item }">
            <router-link :to="{path:'/app/configs/'+app_id+'/'+item.id}">
                {{ item.name }}
            </router-link>
        </template>
        <template v-slot:item.filter="{ item }">
            <v-btn color="primary" @click="showFilter(item)">
                Filter
            </v-btn>
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
</div>
</template>

<script>

require('codemirror/mode/lua/lua')
require('codemirror/mode/css/css')
require('codemirror/theme/monokai.css')
require('codemirror/theme/mdn-like.css')

import {
    codemirror
} from 'vue-codemirror-lite'

export default {
    components: {
        codemirror
    },
    data: () => ({
        filterTmpHistory: {},
        selectMode: -1,
        selectModeHistory: -1,
        filter: {},
        currentId: -1,
        filterModeDic: [],
        filterModeMap: {},
        filterMode: {},
        filterCode: "",
        showFilterDialog: false,
        filterId: -1,
        app_id: -1,
        total: 0,
        loading: true,
        options: {},
        search: '',
        dialog: false,
        dialogDelete: false,
        headers: [{
                text: '环境名称',
                value: 'name',
                sortable: false,
            },
            {
                text: 'ENV KEY',
                value: 'key',
                sortable: false,
            },
            {
                text: '环境描述',
                value: 'desc',
                sortable: false,
            }, {
                text: '权重',
                value: 'weight',
                sortable: true,
            },
            {
                text: '生效条件',
                value: 'filter',
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
        envlist: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            desc: '',
            key: '',
            weight: 100,
        },
        defaultItem: {
            name: '',
            desc: '',
            key: '',
            weight: 100,
        },
        options: {
            mode: "code"
        },
    }),
    filters: {

    },
    mounted() {
        this.app_id = this.$route.params.app
    },
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
        selectMode: {
            handler() {
                this.filterTmpHistory[this.selectModeHistory] = {
                    "filter": this.filterCode
                }
                this.selectModeHistory = this.selectMode
                if (this.filterTmpHistory.hasOwnProperty(this.selectMode)) {
                    this.filterCode = this.filterTmpHistory[this.selectMode].filter
                } else {
                    this.filterTmpHistory[this.selectMode] = {
                        "filter": this.filterModeMap[this.selectMode].template
                    }
                    this.filterCode = this.filterTmpHistory[this.selectMode].filter
                }
                if (this.selectMode == 2) {
                    this.filterCode = JSON.parse(this.filterCode);
                }
            },
            deep: true,
        }
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
        resetTemplate() {
            this.filterCode = this.filterModeMap[this.selectMode].template
            if (this.selectMode == 2) {
                this.filterCode = JSON.parse(this.filterCode);
            }
        },
        getDataFromApi() {
            this.loading = true
            var _this = this
            this.$http.get('/api/v1/env/list', { // 还可以直接把参数拼接在url后边
                params: {
                    app: _this.app_id,
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
                _this.envlist = res.data.data
            }).catch(function (error) {
                console.log(error);
            });

        },
        detailItem(item) {
            this.$router.push({
                path: '/app/env'
            })
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
            this.$http.delete('/api/v1/env/' + _this.envlist[_this.editedIndex].id, { // 还可以直接把参数拼接在url后边
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
                // Object.assign(this.envlist[this.editedIndex], this.editedItem)
                var _this = this
                this.$http.put('/api/v1/env/base/' + _this.envlist[_this.editedIndex].id, {
                    name: _this.editedItem.name,
                    desc: _this.editedItem.desc,
                    weight: parseInt(_this.editedItem.weight),
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
                this.$http.post('/api/v1/env/', { // 还可以直接把参数拼接在url后边
                    app: parseInt(_this.app_id),
                    name: _this.editedItem.name,
                    desc: _this.editedItem.desc,
                    key: _this.editedItem.key,
                    weight: parseInt(_this.editedItem.weight),
                }).then(function (res) {
                    console.log(res.data.data)
                    _this.getDataFromApi()

                }).catch(function (error) {
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
        showFilter(item) {
            console.log(item)
            this.filterId = item.filter
            this.currentId = item.id
            this.showFilterDialog = true
            this.filterCode = ""
            var _this = this

            this.$http.get('/api/v1/filter/modes', { // 还可以直接把参数拼接在url后边
            }).then(function (res) {
                console.log(res.data.data)
                var modes = res.data.data
                _this.filterModeDic = modes
                var map = {}
                for (let index = 0; index < modes.length; index++) {
                    const element = modes[index];
                    map[element.id] = modes[index];
                }
                _this.filterModeMap = map;
                if (_this.filterId != -1) {
                    _this.$http.get('/api/v1/filter/base/' + _this.filterId, { // 还可以直接把参数拼接在url后边
                    }).then(function (res) {
                        console.log(res.data.data)
                        var filter = res.data.data
                        _this.filterCode = filter.filter
                        if (_this.selectMode == 2) {
                            _this.filterCode = JSON.parse(_this.filterCode);
                        }
                        _this.filter = filter
                        var modes = _this.filterModeDic
                        var flag = false
                        console.log("filter", filter)
                        if (filter != {}) {
                            for (var i = 0; i < modes.length; i++) {
                                console.log(modes[i].id, filter)
                                if (modes[i].id == filter.mode) {
                                    _this.filterMode = modes[i]
                                    _this.selectMode = modes[i].id
                                    _this.selectModeHistory = _this.selectMode
                                    flag = true
                                    break
                                }
                            }
                            if (flag == false) {
                                // alert("filter mode 获取失败")
                                     _this.$message.error("filter mode 获取失败");
                                return
                            }
                        } else {
                            _this.filterMode = modes[0]
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        saveFilter() {
            var code = ""
            code = this.filterCode
            if (this.selectMode == 2) {
                code = JSON.stringify(this.filterCode);
            }
            var _this = this
            if (_this.filterId != -1) {
                this.$http.put('/api/v1/filter', {
                    id: _this.filterId,
                    filter: code,
                    mode: _this.selectMode
                }).then(function (res) {
                    _this.showFilterDialog = false
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                this.$http.post('/api/v1/filter', {
                    filter: code,
                    mode: _this.selectMode
                }).then(function (res) {
                    if (typeof (res.data.data) == "number") {
                        //进行绑定
                        _this.$http.put('/api/v1/env/filter/' + _this.currentId, {
                            filter: res.data.data
                        }).then(function (res) {
                            _this.showFilterDialog = false
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }

    },
}
</script>

<style>
.CodeMirror {
    height: 600px;
}
</style>
